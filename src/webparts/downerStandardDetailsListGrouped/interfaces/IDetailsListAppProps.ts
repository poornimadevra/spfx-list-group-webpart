import { UrlQueryParameterCollection } from "@microsoft/sp-core-library";
import { IFeedbackForm } from "./IFeedbackForm";
import { IViewField, IGroupByField, ISortByField } from "./IWebPartMappers";
import { IDefaultColumnsWidth } from "./IDefaultColumnsWidth";

export interface IDetailsListAppProps {
  selectedListId: string;
  selectedFoldersPaths: string[];
  selectedViewId: string;
  selectedListTitle: string;
  defaultColumnsWidth: IDefaultColumnsWidth;
  selectedViewTitle: string;
  selectedViewCamlQuery: string;
  selectedViewFields: IViewField[];
  showItemsCount: boolean;
  selectedGroupByFields: IGroupByField[];
  selectedSortByFields: ISortByField[];
  urlParams?: UrlQueryParameterCollection;
  urlQueryActive: boolean;
  feedbackForm?: IFeedbackForm | undefined;
  onWebpartConfigure: () => void;
  selectedDetailsListSize: string;
  footer: boolean;
}
