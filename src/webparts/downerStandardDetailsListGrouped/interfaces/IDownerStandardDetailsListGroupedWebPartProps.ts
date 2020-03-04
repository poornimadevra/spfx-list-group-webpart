import { IViewField, IGroupByField, ISortByField } from "./IWebPartMappers";

export interface IDownerStandardDetailsListGroupedWebPartProps {
  urlQueryActive: boolean;
  feedbackFormUrl: string;
  isFullControl: boolean;
  selectedListId: string;
  selectedFolders: string[];
  selectedListTitle: string;
  selectedListInternalName: string;
  selectedView: string;
  selectedViewId: string;
  selectedViewCamlQuery: string;
  selectedViewFields: string[];
  showItemsCount: boolean;
  selectedGroupByFields: string[];
  selectedSortByFields: string[];
  selectedViewFieldsMapped: IViewField[];
  selectedGroupByFieldsMapped: IGroupByField[];
  selectedSortByFieldsMapped: ISortByField[];
  detailsListSizeOptions: {
    small: string;
    medium: string;
    large: string;
    autoSize: string;
  };
  selectedDetailsListSize: string;
  activateFeedbackForm: boolean;
  activateFooter: boolean;
  feedbackListName: string;
  feedbackListFieldName: string;
  feedbackListFieldDocIdName: string;
}
