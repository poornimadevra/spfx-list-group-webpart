import { IDefaultColumnsWidth } from "./IDefaultColumnsWidth";

export interface IAppSettingsContext {
  showItemsCount: boolean;
  detailsListSize: string;
  userHasFullControl: boolean;
  defaultColumnsWidth: IDefaultColumnsWidth;
}
