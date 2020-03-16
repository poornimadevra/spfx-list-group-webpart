import * as React from "react";
import { IGroup, IColumn, findIndex } from "office-ui-fabric-react";
import { orderBy, groupBy, sortBy } from "lodash";
import { IListItem } from "../interfaces/ISharePoint";
import { IViewField, IGroupByField } from "../interfaces/IWebPartMappers";
import { IDefaultColumnsWidth } from "../interfaces/IDefaultColumnsWidth";

const extractOrderAndTitle = (value: string) => {
  const splitTitle = value.split(" ");
  const title = splitTitle[0] ? splitTitle.slice(1).join(" ") : splitTitle[0];
  const orderIndex = splitTitle[1] ? splitTitle[0] : splitTitle[0];
  return {
    title,
    orderIndex: Number(orderIndex)
  };
};

export const columnSizemapper = (
  columnName: string,
  defaultColumnsWidth: IDefaultColumnsWidth
): number => {
  switch (columnName) {
    case "Type":
      return defaultColumnsWidth.docIconColumnsSize;

    case "Name":
      return defaultColumnsWidth.nameColumnsSize;

    case "Document Type":
      return defaultColumnsWidth.documentTypeColumnsSize;

    case "Modified":
      return defaultColumnsWidth.modifiedColumnsSize;

    default:
      return 85;
  }
};

export const columnsMapper = (
  fields: IViewField[],
  defaultColumnsWidth: IDefaultColumnsWidth
): IColumn[] => {
  const columns: IColumn[] = fields.map(field => {
    const obj = {
      key:
        field.internalName === "LinkFilenameNoMenu" ||
        field.internalName === "LinkFilename"
          ? "Name"
          : field.internalName,
      name: field.title,
      fieldName:
        field.internalName === "LinkFilenameNoMenu" ||
        field.internalName === "LinkFilename"
          ? "Name"
          : field.internalName,
      minWidth: 50,
      maxWidth: columnSizemapper(field.title, defaultColumnsWidth),
      isResizable: true,
      iconName: field.title === "Type" ? "Page" : "",
      isIconOnly: field.title === "Type",
      fieldType: field.fieldType
    } as IColumn;

    return obj;
  });
  return columns;
};

export const getValueByField = (
  item: any,
  field: string
): string | number | undefined =>
  item[field] ? item[field] : item["OData_" + field];

export const checkODataField = (items: any[], field: string): string => {
  const isOdata = items.some(i => i["OData_" + field]);

  return isOdata ? "OData_" + field : field;
};

export const orderItemsByGroups = (
  items: any[],
  currentGroupByFields: IGroupByField[]
) => {
  return orderBy(
    items,
    [
      ...currentGroupByFields.map(g => {
        return checkODataField(items, g.internalName);
      })
    ],
    ["asc"]
  );
};

export const sortedItemsByGroups = (items: any[], sortByFields: any[]) => {
  const sortedItems = sortBy(
    items,
    sortByFields.map(s => s.internalName)
  );

  return sortedItems;
};

export const groupsMapper = (
  groupByFields: IGroupByField[],
  listItems: IListItem[] | any[],
  currentDepth: number,
  isCollapsed: boolean,
  rawItems?: any[]
): IGroup[] => {
  const groups: IGroup[] = [];
  const groupByField = groupByFields.find(g => g.level === currentDepth);

  const prevGroupByField = groupByFields.find(
    prevG => prevG.level === currentDepth - 1
  );
  const groupedItems = orderItemsByGroups(
    rawItems ? rawItems : listItems,
    groupByFields
  );

  const uniqueValues = groupBy(listItems, item =>
    getValueByField(item, groupByField.internalName)
  );

  for (const uniqueValue in uniqueValues) {
    const { title, orderIndex } = extractOrderAndTitle(uniqueValue);

    groups.push({
      name: `${title ? title : "no value"}`,
      count: uniqueValues[uniqueValue].length,
      key: uniqueValue,
      level: groupByField.level,

      startIndex: findIndex(groupedItems, (i: any) => {
        if (groupByField.level === 0) {
          return getValueByField(i, groupByField.internalName) === uniqueValue;
        } else
          return (
            getValueByField(i, groupByField.internalName) === uniqueValue &&
            getValueByField(
              uniqueValues[uniqueValue][0],
              prevGroupByField.internalName
            ) === getValueByField(i, prevGroupByField.internalName)
          );
      }),
      children:
        currentDepth < groupByFields.length - 1
          ? groupsMapper(
              groupByFields,
              uniqueValues[uniqueValue],
              currentDepth + 1,
              isCollapsed,
              groupedItems
            )
          : [],
      isCollapsed: isCollapsed,
      order: orderIndex ? orderIndex : 0
    } as IGroup);
  }
  return orderBy(groups, ["order"]);
};
