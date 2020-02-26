import { IViewField, IGroupByField, ISortByField } from "./IWebPartMappers";

export interface ISPFieldsContext {
  selectedListId: string;
  viewId: string;
  selectedListInternalName: string;
  viewFields: IViewField[];
  groupByFields: IGroupByField[];
  sortByFields: ISortByField[];
}
