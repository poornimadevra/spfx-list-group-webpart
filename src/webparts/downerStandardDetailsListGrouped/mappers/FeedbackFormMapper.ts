import { IFeedbackField } from "../interfaces/IFeedbackField";

export const fieldColumnMapper = (fields: IFeedbackField[]) => {
  let tempObj = {};
  fields.map(field => {
    tempObj[field.internalColumnName] = "";
  });
  tempObj["PageURL"] = "";
  tempObj["AssignedTo"] = "";
  tempObj["Status"] = "";
  tempObj["feedbackTypeSelectionKeys"] = [];
  tempObj["feedbackCategorySelectionKeys"] = [];
  return tempObj;
};
