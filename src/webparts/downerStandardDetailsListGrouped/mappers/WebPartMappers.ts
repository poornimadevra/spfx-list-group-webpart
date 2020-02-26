import { IPropertyPaneDropdownOption } from "@microsoft/sp-webpart-base";
import {
  IViewField,
  ISortByField,
  IGroupByField
} from "../interfaces/IWebPartMappers";

export const viewFieldsMapper = (
  selectedFields: string[],
  fieldsOptions: IPropertyPaneDropdownOption[]
): IViewField[] => {
  if (!fieldsOptions) return [];
  return selectedFields.map((selectedField, i) => {
    const currentFieldObject = fieldsOptions.find(
      fieldOption => fieldOption.key === selectedField
    );

    if (currentFieldObject)
      return {
        title: currentFieldObject.text,
        internalName: currentFieldObject.key as string,
        fieldType: currentFieldObject["fieldType"],
        order: i
      };
  });
};

export const groupByFieldsMapper = (
  selectedFields: string[],
  fieldsOptions: IPropertyPaneDropdownOption[]
): IGroupByField[] => {
  if (!fieldsOptions) return [];
  return selectedFields.map((selectedField, i) => {
    const currentFieldObject = fieldsOptions.find(
      fieldOption => fieldOption.key === selectedField
    );

    if (currentFieldObject)
      return {
        title: currentFieldObject.text,
        internalName: currentFieldObject.key as string,
        level: i
      };
  });
};

export const sortByFieldsMapper = (
  selectedFields: string[],
  fieldsOptions: IPropertyPaneDropdownOption[]
): ISortByField[] => {
  if (!fieldsOptions) return [];
  return selectedFields.map((selectedField, i) => {
    const currentFieldObject = fieldsOptions.find(
      fieldOption => fieldOption.key === selectedField
    );

    if (currentFieldObject)
      return {
        title: currentFieldObject.text,
        internalName: currentFieldObject.key as string,
        index: i
      };
  });
};
