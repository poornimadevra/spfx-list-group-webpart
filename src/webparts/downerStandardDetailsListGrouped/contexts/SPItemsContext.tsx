import * as React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import SharePointService from "../services/SharePointService";
import { IListItem } from "../interfaces/ISharePoint";
import { itemsMapper, itemsReMapper } from "../mappers/SPItemsContextMapper";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import { orderItemsByGroups } from "../mappers/DetailsListComponentMapper";
import { sortBy } from "lodash";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";

export interface ISPItemsContext {
  listItems: IListItem[];
  selectedItems: ISelectedItem[];
  setSelectedItems: (selectedItems: ISelectedItem[]) => void;
  clearSelection: boolean;
  setClearSelection: (value: boolean) => void;
  queryUrlFilterGroupByField: string;
  setQueryUrlFilterGroupByField: (value: string) => void;
}

export interface ISelectedItem {
  selectedItemId: string | number;
  selectedItemName: string;
  selectedItemUrlDownload: string;
  selectedItemUrlOpenInBrowser: string;
  selectedItemDocId: string;
  selectedItemExt: string;
  selectedItemUniqueId: string;
}

export const SPItemsContext = createContext<ISPItemsContext>(
  {} as ISPItemsContext
);

export const SPItemsContextProvider: React.FC<IDetailsListAppProps> = (
  props
): JSX.Element => {
  const {
    selectedListTitle,
    selectedViewCamlQuery,
    selectedFoldersPaths
  } = props;
  const [listItems, setListItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<ISelectedItem[]>([]);
  const [queryUrlFilterGroupByField, setQueryUrlFilterGroupByField] = useState<
    string
  >("");
  const {
    groupByFields,
    sortByFields,
    viewFields,
    selectedListId
  } = useContext(SPFieldsContext);

  const [clearSelection, setClearSelection] = useState(false);

  const getListItemsByCamlQuery = async (): Promise<void> => {
    const itemsResult = await SharePointService.pnp_getListItemsByCamlQuery(
      selectedListId,
      selectedViewCamlQuery,
      ["File"],
      selectedFoldersPaths

      // ["*", "File"]
    );

    const reMappedItems = itemsReMapper(itemsResult);

    const mappedItems = itemsMapper(reMappedItems, viewFields);

    const sortedItems = sortBy(
      mappedItems,
      sortByFields.map(s => s.internalName)
    );

    const groupedItems = orderItemsByGroups(sortedItems, groupByFields);

    setListItems(groupedItems);
  };

  // const getListItems = async (): Promise<void> => {
  //   // const items = await SharePointService.pnp_getListItemsAdvanced(
  //   //   selectedListTitle,
  //   //   ["*", "File"],
  //   //   ["File"]
  //   // );

  //   const items = await SharePointService.pnp_getLibraryFiles(
  //     selectedListInternalName,
  //     ["ListItemAllFields"]
  //   );
  //   console.log("items", items);
  //   const reMappedItems = itemsReMapper(items);
  //   const mappedItems = itemsMapper(reMappedItems, viewFields);
  //   const sortedItems = sortBy(
  //     mappedItems,
  //     sortByFields.map(s => s.internalName)
  //   );
  //   const groupedItems = orderItemsByGroups(sortedItems, groupByFields);
  //   setListItems(groupedItems);
  // };

  useEffect(() => {
    if (selectedListTitle && selectedViewCamlQuery) getListItemsByCamlQuery();
  }, [selectedListTitle, selectedViewCamlQuery, sortByFields]);

  useEffect(() => {
    if (selectedListTitle && selectedViewCamlQuery) getListItemsByCamlQuery();
  }, [selectedListTitle, selectedViewCamlQuery]);

  useEffect(() => {
    const sortedItems = sortBy(
      listItems,
      sortByFields.map(s => s.internalName)
    );
    const groupedItems = orderItemsByGroups(sortedItems, groupByFields);

    setListItems(groupedItems);
  }, [sortByFields]);

  // groupByFields, sortByFields
  return (
    <React.Fragment>
      {listItems.length > 0 && (
        <SPItemsContext.Provider
          value={{
            listItems,
            selectedItems,
            setSelectedItems,
            clearSelection,
            setClearSelection,
            queryUrlFilterGroupByField,
            setQueryUrlFilterGroupByField
          }}
        >
          {props.children}
        </SPItemsContext.Provider>
      )}
    </React.Fragment>
  );
};
