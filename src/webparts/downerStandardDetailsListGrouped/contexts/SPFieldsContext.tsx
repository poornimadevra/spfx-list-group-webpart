import * as React from "react";
import { createContext, useState, useEffect } from "react";
import { IDetailsListAppProps } from "../interfaces/IDetailsListAppProps";
import { ISPFieldsContext } from "../interfaces/ISPFieldsContext";
import {
  ISortByField,
  IViewField,
  IGroupByField
} from "../interfaces/IWebPartMappers";
import { IRootFolder } from "../interfaces/IRootFolder";
import SharePointService from "../services/SharePointService";

export const SPFieldsContext = createContext<ISPFieldsContext>(
  {} as ISPFieldsContext
);

export interface ISPFieldsContextProviderProps {
  selectedListId: string;
  selectedListTitle: string;
  selectedListInternalName: string;
  selectedViewId: string;
  selectedSortByFields: IViewField[];
  selectedGroupByFields: string[];
  selectedViewFields: string[];
}

export const SPFieldsContextProvider: React.FC<IDetailsListAppProps> = props => {
  const [viewId, setViewId] = useState<string>("");
  const [viewFields, setViewFields] = useState<IViewField[] | any[]>([]);
  const [sortByFields, setSortByFields] = useState<ISortByField[] | any[]>([]);
  const [groupByFields, setGroupByFields] = useState<IGroupByField[] | any[]>(
    []
  );

  const [selectedListInternalName, setSelectedListInternalName] = useState("");

  const {
    selectedViewFields,
    selectedGroupByFields,
    selectedSortByFields,
    selectedListId,
    selectedViewId,
    selectedListTitle
  } = props;
  // console.log("selectedListInternalName props", selectedListInternalName);
  // console.log("selectedListTitle props", selectedListTitle);

  const getLibraryRootFolderName = async (listTitle: string): Promise<void> => {
    const result: IRootFolder = await SharePointService.pnp_getLibraryRootFolder(
      listTitle
    );
    setSelectedListInternalName(result.Name);
  };

  useEffect(() => {
    if (selectedListTitle) getLibraryRootFolderName(selectedListTitle);
  }, [selectedListTitle]);

  useEffect(() => {
    setViewFields(selectedViewFields);
    //console.log("selectedViewFields", selectedViewFields);
  }, [selectedViewFields]);

  useEffect(() => {
    setGroupByFields(selectedGroupByFields);
  }, [selectedGroupByFields]);

  useEffect(() => {
    setSortByFields(selectedSortByFields);
  }, [selectedSortByFields]);

  useEffect(() => {
    setViewId(selectedViewId);
  }, [selectedViewId]);

  return (
    <SPFieldsContext.Provider
      value={{
        viewId,
        viewFields,
        groupByFields,
        sortByFields,
        selectedListInternalName,
        selectedListId
      }}
    >
      {viewFields && viewFields.length > 0 && props.children}
    </SPFieldsContext.Provider>
  );
};
