import { IViewField } from "./IWebPartMappers";

export interface ISPFieldsContextProviderProps {
  selectedListId: string;
  selectedListTitle: string;
  selectedListInternalName: string;
  selectedViewId: string;
  selectedSortByFields: IViewField[];
  selectedGroupByFields: string[];
  selectedViewFields: string[];
}
