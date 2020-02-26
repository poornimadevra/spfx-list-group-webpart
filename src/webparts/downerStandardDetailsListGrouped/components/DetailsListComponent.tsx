import * as React from "react";
import {
  DetailsList,
  IDetailsHeaderProps,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
  ScrollablePane,
  ScrollbarVisibility,
  Sticky,
  StickyPositionType,
  ConstrainMode,
  IRenderFunction,
  ITooltipHostProps,
  TooltipHost,
  IGroup,
  IGroupHeaderProps
} from "office-ui-fabric-react";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import { SPItemsContext, ISelectedItem } from "../contexts/SPItemsContext";
import { AppSettingsContext } from "../contexts/AppSettingsContext";
import { UrlQueryFilterContext } from "../contexts/UrlQueryFilterContext";
import {
  columnsMapper,
  groupsMapper,
  orderItemsByGroups,
  getValueByField
} from "../mappers/DetailsListComponentMapper";
import {
  onRenderRow,
  onRenderItemColumn,
  onItemInvoked,
  onGroupHeaderRender
} from "./DetailsListComponentRenders";
import { copyAndSort } from "../utils/copyAndSort";
import { getFileExtension } from "../utils/getFileExtension";
import { IQColumns } from "../interfaces/IQColumns";

export const DetailsListComponent: React.FC = (): JSX.Element => {
  const {
    listItems,
    selectedItems,
    setSelectedItems,
    clearSelection,
    setClearSelection
  } = React.useContext(SPItemsContext);
  const { viewFields, groupByFields } = React.useContext(SPFieldsContext);
  const [collapseAll, setCollapseAll] = React.useState<boolean>(true);
  const [items, setItems] = React.useState<any[]>([]);
  const [groups, setGroups] = React.useState<IGroup[]>();
  const [columns, setColumns] = React.useState<IColumn[]>(
    columnsMapper(viewFields)
  );
  const { detailsListSize } = React.useContext(AppSettingsContext);
  const { urlParams, urlQueryActive } = React.useContext(UrlQueryFilterContext);
  const [selection] = React.useState<Selection>(
    new Selection({
      onSelectionChanged: () => {
        const currentSelectedItems = selection.getSelection() as any[];
        const updatedSelectedItems: ISelectedItem[] = [];
        const mappedCurrentSelectedItems = currentSelectedItems.map(
          currentSelectedItem =>
            ({
              selectedItemId: currentSelectedItem.Id,
              selectedItemUniqueId: currentSelectedItem.UniqueId,
              selectedItemName: currentSelectedItem.Name,
              selectedItemDocId: currentSelectedItem.OData__dlc_DocId,
              selectedItemUrlOpenInBrowser: currentSelectedItem.LinkingUrl,
              selectedItemUrlDownload: currentSelectedItem.LinkingUrl
                ? currentSelectedItem.LinkingUrl.split("?")[0]
                : currentSelectedItem.ServerRelativeUrl,
              selectedItemExt: getFileExtension(currentSelectedItem.Name)
            } as ISelectedItem)
        );
        mappedCurrentSelectedItems.map(mappedCurrentSelectedItem => {
          const ifIsIn = selectedItems.some(
            selectedItem =>
              selectedItem.selectedItemId ===
              mappedCurrentSelectedItem.selectedItemDocId
          );

          if (!ifIsIn) updatedSelectedItems.push(mappedCurrentSelectedItem);
        });

        setSelectedItems(updatedSelectedItems);
      }
    })
  );

  const onColumnHeaderClick = (
    _event: React.MouseEvent<HTMLElement>,
    column: IColumn
  ): void => {
    let isSortedDescending = column.isSortedDescending;

    // If we've sorted this column, flip it.
    if (column.isSorted) {
      isSortedDescending = !isSortedDescending;
    }

    // Sort the items.
    const sortedItems = copyAndSort(
      items,
      column.fieldName!,
      isSortedDescending
    );

    // Reset the items and columns to match the state.
    setColumns(
      columns.map(col => {
        col.isSorted = col.key === column.key;

        if (col.isSorted) {
          col.isSortedDescending = isSortedDescending;
        }
        return col;
      })
    );
    setItems(orderItemsByGroups(sortedItems, groupByFields));
  };

  const onRenderDetailsHeader = (
    props: IDetailsHeaderProps,
    defaultRender?: IRenderFunction<IDetailsHeaderProps>
  ): JSX.Element => {
    props.isAllCollapsed = collapseAll;
    props.onToggleCollapseAll = () =>
      setCollapseAll(prevCollapseAll => !prevCollapseAll);
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
        {defaultRender!({
          ...props,
          onRenderColumnHeaderTooltip: (
            tooltipHostProps: ITooltipHostProps
          ) => <TooltipHost {...tooltipHostProps} />
        })}
      </Sticky>
    );
  };

  const filterColumns = (): void => {
    const qColumnsValues: IQColumns[] = [];
    if (!urlQueryActive) {
      setColumns(columnsMapper(viewFields));
      setItems(orderItemsByGroups(listItems, groupByFields));
      //setQueryUrlFilterGroupByField("");
      return;
    }

    const initialColumnsPlusGroupBy = [
      ...columnsMapper(viewFields),
      ...groupByFields.map(
        gByField =>
          ({
            fieldName: gByField.internalName,
            name: gByField.title,
            key: "groupBy"
          } as IColumn)
      )
    ];

    const fileredColumns: IColumn[] = [];

    const fileredItems = [];

    initialColumnsPlusGroupBy.map(mappedColumn => {
      if (
        mappedColumn.fieldName === "Name" ||
        mappedColumn.fieldName === "DocIcon" ||
        mappedColumn.fieldName === "Modified" ||
        mappedColumn.fieldName === "Document_x0020_Type" ||
        mappedColumn.fieldName === "Flowchart"
      ) {
        fileredColumns.push(mappedColumn);
      } else {
        const currentValue = urlParams.getValue(mappedColumn.fieldName);

        if (currentValue && mappedColumn.key !== "groupBy") {
          fileredColumns.push(mappedColumn);

          qColumnsValues.push({
            columnName: mappedColumn.fieldName,
            value: currentValue,
            groupBy: false
          });
        } else if (currentValue && mappedColumn.key === "groupBy") {
          //setQueryUrlFilterGroupByField(mappedColumn.name);
          qColumnsValues.push({
            columnName: mappedColumn.fieldName,
            value: currentValue,
            groupBy: true
          });
        }
      }
    });
    if (
      qColumnsValues.some(q => q.groupBy === true) &&
      !qColumnsValues.some(q => q.groupBy === false)
    ) {
      fileredColumns.push(
        ...initialColumnsPlusGroupBy.filter(
          i =>
            i.fieldName !== "Name" &&
            i.fieldName !== "DocIcon" &&
            i.fieldName !== "Modified" &&
            i.fieldName !== "Document_x0020_Type" &&
            i.fieldName !== "Flowchart" &&
            i.key !== "groupBy"
        )
      );
    }

    if (qColumnsValues.length > 0) {
      let tempArray = [];

      qColumnsValues.map((filteredColumn, i: number) => {
        const cleadValue = filteredColumn.groupBy
          ? filteredColumn.value.replace(/%20/g, " ")
          : filteredColumn.value;
        if (i === 0) {
          if (cleadValue === "NotEmpty") {
            tempArray = listItems.filter(item =>
              getValueByField(item, filteredColumn.columnName)
            );
          } else if (cleadValue === "Empty") {
            tempArray = listItems.filter(
              item => !getValueByField(item, filteredColumn.columnName)
            );
          } else if (cleadValue === "All") {
            tempArray = listItems;
          } else {
            tempArray = listItems.filter(
              item =>
                getValueByField(item, filteredColumn.columnName) === cleadValue
            );
          }
        } else {
          if (cleadValue === "NotEmpty") {
            tempArray = [
              ...tempArray.filter(item => item[filteredColumn.columnName])
            ];
          } else if (cleadValue === "Empty") {
            tempArray = tempArray.filter(
              item => !getValueByField(item, filteredColumn.columnName)
            );
          } else if (cleadValue === "All") {
            tempArray = tempArray;
          } else {
            tempArray = [
              ...tempArray.filter(
                item =>
                  getValueByField(item, filteredColumn.columnName) ===
                  cleadValue
              )
            ];
          }
        }
      });
      selection.setItems(orderItemsByGroups(fileredItems, groupByFields));
      fileredItems.push(...tempArray);
      setColumns(fileredColumns);
      setItems(orderItemsByGroups(fileredItems, groupByFields));
    } else {
      selection.setItems(orderItemsByGroups(listItems, groupByFields));
      setColumns(columnsMapper(viewFields));
      setItems(orderItemsByGroups(listItems, groupByFields));
    }
  };

  React.useEffect(() => {
    if (clearSelection) selection.setItems(items, true);
    setClearSelection(false);
  }, [clearSelection]);

  React.useEffect(() => {
    // setItems(listItems);
    // setColumns(columnsMapper(viewFields));
    // selection.setItems(orderItemsByGroups(items, groupByFields));
    filterColumns();
  }, [listItems, viewFields]);

  // React.useEffect(() => {
  //   if (urlQueryActive) filterColumns();
  // }, [urlQueryActive]);

  React.useEffect(() => {
    setGroups(
      groupByFields.length > 0
        ? groupsMapper(groupByFields, items, 0, collapseAll)
        : []
    );
  }, [groupByFields, collapseAll]);

  // React.useEffect(() => {
  //   const sortedItems = sortBy(
  //     listItems,
  //     sortByFields.map(s => s.internalName)
  //   );

  //   const groupedItems = orderItemsByGroups(sortedItems, groupByFields);

  //   setItems(groupedItems);
  // }, [sortByFields]);

  React.useEffect(() => {
    selection.setItems(orderItemsByGroups(items, groupByFields)); //
    setGroups(
      groupByFields.length > 0
        ? groupsMapper(groupByFields, items, 0, collapseAll)
        : []
    );
  }, [items]);

  // React.useEffect(() => {
  //   if (selection) selection.setItems(orderItemsByGroups(items, groupByFields));
  // }, [selection]);

  return (
    <div style={{ height: detailsListSize, position: "relative" }}>
      <ScrollablePane scrollbarVisibility={ScrollbarVisibility.always}>
        <DetailsList
          setKey="categoriesSet"
          items={orderItemsByGroups(items, groupByFields)}
          columns={columns}
          groups={groups}
          selectionMode={SelectionMode.multiple}
          onColumnHeaderClick={onColumnHeaderClick}
          onRenderItemColumn={onRenderItemColumn}
          onRenderRow={onRenderRow}
          constrainMode={ConstrainMode.unconstrained}
          onRenderDetailsHeader={onRenderDetailsHeader}
          selection={selection}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          onItemInvoked={onItemInvoked}
          groupProps={{
            headerProps: {
              onRenderTitle: (props: IGroupHeaderProps) =>
                onGroupHeaderRender(props)
            }

            // onRenderHeader: (props?: IDetailsGroupDividerProps, ) => {
            //   return (
            //     <div onClick={() => console.log("dddd")}>
            //       {props.group.name}
            //     </div>
            //   );
            // }
          }}
        />
      </ScrollablePane>
    </div>
  );
};
