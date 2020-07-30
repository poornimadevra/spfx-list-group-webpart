import * as React from "react";
import {
  PrimaryButton,
  TextField,
  Stack,
  IStackTokens,
  Panel,
  PanelType,
  Label,
  Separator,
  Image,
  Dropdown,
  IDropdownOption
} from "office-ui-fabric-react";
import SharePointService from "../services/SharePointService";
import { IFeedbackFormProps } from "../interfaces/IFeedbackFormProps";
import {
  FilePicker,
  IFilePickerResult
} from "@pnp/spfx-controls-react/lib/FilePicker";

const formImage: string = require("../images/FormResource.png");

const itemAlignmentsStackTokens: IStackTokens = {
  childrenGap: 2
};

interface IFeedbackFormState {
  feedbackCategoryOptions: IDropdownOption[];
  feedbackTypeSelectionKeys: string[];
  data: {
    DocId: string;
    Title: string;
    Email: string;
    Department: string;
    FeedbackType: string;
    FeedbackCategory: string;
  };
}

const DropdownControlledMultiExampleOptions = [
  { key: "apple", text: "Apple" },
  { key: "banana", text: "Banana" },
  { key: "orange", text: "Orange", disabled: true },
  { key: "grape", text: "Grape" },
  { key: "broccoli", text: "Broccoli" },
  { key: "carrot", text: "Carrot" },
  { key: "lettuce", text: "Lettuce" }
];

export class FeedbackForm extends React.Component<
  IFeedbackFormProps,
  IFeedbackFormState
> {
  constructor(props: IFeedbackFormProps) {
    super(props);

    this.state = {
      feedbackCategoryOptions: [],
      feedbackTypeSelectionKeys: [],
      data: {
        DocId: "",
        Title: "",
        Email: "",
        Department: "",
        FeedbackType: "",
        FeedbackCategory: ""
      }
    };
  }

  public async componentDidMount() {
    if (this.props.docId) {
      const loginName =
        "i:0#.f|membership|" +
        SharePointService.context.pageContext.user.loginName;

      const dep = await SharePointService.pnp_getUserProfileProperty(
        loginName,
        "Department"
      );

      const options = await this.getFeedbackTypes().then(r => {
        return r.map(item => ({
          key: item.Id + item.Title,
          text: item.Title
        }));
      });

      this.setState({
        feedbackCategoryOptions: options,
        data: {
          DocId: this.props.docId,
          Title: SharePointService.context.pageContext.user.displayName,
          Email: SharePointService.context.pageContext.user.email,
          Department: dep,
          FeedbackType: "",
          FeedbackCategory: ""
        }
      });
    }
  }

  private getFeedbackTypes = async (): Promise<any> => {
    try {
      return await SharePointService.pnp_getListItems("LOOKUPFeedbackType");
    } catch (error) {
      throw error;
    }
  };

  // const getFeedbackCategories = async (): Promise<void> => {
  //   try {
  //     const results = await SharePointService.pnp_getListItems(
  //       "LOOKUPFeedbackCategory"
  //     );
  //     results.map(item =>
  //       _feedbackCategoryOptions.push({
  //         key: item.Id,
  //         text: item.Title
  //       })
  //     );
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // const _onSaveIntoSharePoint = async (filePickerResult: IFilePickerResult) => {
  //   if (filePickerResult.fileAbsoluteUrl == null) {
  //     filePickerResult.downloadFileContent().then(async res => {
  //       console.log("res", res);
  //     });
  //   }
  // };

  private _onChange = (
    e: React.FormEvent<HTMLInputElement>,
    inputValue: IDropdownOption,
    index: any
  ) => {
    //let tempArray = [...feedbackFormValues.feedbackTypeArray];
    const currentId = e.target["id"] as string;

    // inputValue.selected
    //   ? tempArray.push(inputValue.text)
    //   : (tempArray = tempArray.filter(t => t !== inputValue.text));

    //const optionValues = tempArray.join(";");

    //feedbackFormValues[currentId] = tempArray;

    //feedbackFormValues["FeedbackType"] = optionValues;
    console.log("inputValue", inputValue);

    // if (inputValue) {
    //   setFeedbackTypeSelectionKeys(
    //     inputValue.selected
    //       ? [...feedbackTypeSelectionKeys, inputValue.key as string]
    //       : feedbackTypeSelectionKeys.filter(key => key !== inputValue.key)
    //   );
    // }
    let { feedbackTypeSelectionKeys } = this.state;
    // let t = [];
    if (currentId && inputValue) {
      if (inputValue.selected) {
        feedbackTypeSelectionKeys.push(inputValue.key as string);
      } else {
        feedbackTypeSelectionKeys = feedbackTypeSelectionKeys.filter(
          t => t !== (inputValue.key as string)
        );
      }
      this.setState({
        feedbackTypeSelectionKeys
      });
    }
  };

  // const _submitForm = async (e: any): Promise<void> => {
  //   e.preventDefault();
  //   //let data = {
  //   //[feedbackFormSettings.feedbackListFieldDocIdName]: docId,
  //   //[feedbackFormSettings.feedbackListFieldName]: feedback
  //   //};
  //   const submitObj = feedbackFormValues;
  //   delete submitObj.feedbackTypeSelectionKeys;
  //   try {
  //     await SharePointService.pnp_addItem(
  //       feedbackFormSettings.feedbackListName,
  //       submitObj
  //     ).then(r => {
  //       console.log("r-submitform", r);
  //     });
  //     onCloseForm();
  //   } catch (error) {
  //     onCloseForm();
  //     throw error;
  //   }
  // };

  // const _onRenderDisplayFormFields = (): JSX.Element[] =>
  //   feedbackFormSettings.feedbackFields.map(row => {
  //     if (row.valueMarker === "displayName") {
  //       return (
  //         <TextField
  //           label={row.title}
  //           readOnly
  //           defaultValue={
  //             SharePointService.context.pageContext.user.displayName
  //           }
  //         />
  //       );
  //     } else if (row.valueMarker === "email") {
  //       return (
  //         <TextField
  //           label={row.title}
  //           readOnly
  //           defaultValue={SharePointService.context.pageContext.user.email}
  //         />
  //       );
  //     } else if (row.valueMarker === "department") {
  //       return (
  //         <TextField
  //           label={row.title}
  //           readOnly
  //           defaultValue={
  //             feedbackFormValues.Department ? feedbackFormValues.Department : ""
  //           }
  //         />
  //       );
  //     } else if (row.valueMarker === "feedbackType") {
  //       return (
  //         <Dropdown
  //           multiSelect
  //           placeholder="Select an option"
  //           label="Type of Feedback"
  //           id="feedbackTypeSelectionKeys"
  //           options={feedbackCategoryOptions}
  //           onChange={_onChange}
  //           selectedKeys={feedbackFormValues.feedbackTypeSelectionKeys}
  //         />
  //       );
  //     } else if (row.valueMarker === "feedbackCategory") {
  //       return (
  //         <div></div>
  //         // <Dropdown
  //         //   placeholder="Select an option"
  //         //   multiSelect
  //         //   label="Feedback Category"
  //         //   id="feedbackCategory"
  //         //   options={_feedbackCategoryOptions}
  //         //   onChange={_onChange}
  //         //   selectedKeys={feedbackFormValues.feedbackTypeSelectionKeys}
  //         // />
  //       );
  //     }
  //   });

  private _onRenderFooterContent = () => {
    return (
      <Stack horizontal horizontalAlign="end">
        <PrimaryButton onClick={null} text="Save" disabled={false} />
      </Stack>
    );
  };

  private _onRenderHeader = (): JSX.Element => {
    return (
      <Stack verticalAlign="center">
        <Image
          src={formImage}
          width={300}
          height={110}
          styles={{ root: { margin: "0 auto" } }}
        />
        <Label style={{ fontSize: 13, textAlign: "center", margin: 10 }}>
          Hi {SharePointService.context.pageContext.user.displayName}, when you
          submit this form, the owner will be able to see your name and email
          address.
        </Label>
        <Separator />
      </Stack>
    );
  };

  // getFeedbackTypes();
  // getFeedbackCategories();

  public render() {
    const { isOpen, onCloseForm } = this.props;
    const { feedbackCategoryOptions, feedbackTypeSelectionKeys } = this.state;
    return (
      <Panel
        styles={{ headerText: { fontFamily: "Arial, Helvetica, sans-serif" } }}
        isOpen={isOpen}
        type={PanelType.custom}
        customWidth="520px"
        onDismiss={onCloseForm}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this._onRenderFooterContent}
        onRenderHeader={this._onRenderHeader}
      >
        <form onSubmit={null}>
          <Stack tokens={itemAlignmentsStackTokens}>
            <Label>
              <p>
                Thank you for taking the time to submit feedback. Your name,
                email address and feedback will be sent to the relevant owner
                for consideration.
              </p>
              <p>
                Note: For all IT related issues, Australian users contact 1300
                333 000, New Zealand Users contact 0800 156 666 and Spotless
                Users Contact - AU - 1300 333 000, NZ - 0800 487 768
              </p>
            </Label>

            {/* {_onRenderDisplayFormFields()} */}
            <Dropdown
              multiSelect
              placeholder="Select an option"
              label="Type of Feedback"
              id="feedbackTypeSelectionKeys"
              options={DropdownControlledMultiExampleOptions}
              onChange={this._onChange}
              selectedKeys={feedbackTypeSelectionKeys}
            />
            <TextField
              multiline
              label="Please provide more information"
              rows={6}
              onChange={null}
              value={"ggg"}
              placeholder="Your comment"
            />

            <FilePicker
              bingAPIKey="<BING API KEY>"
              accepts={[
                ".gif",
                ".jpg",
                ".jpeg",
                ".bmp",
                ".dib",
                ".tif",
                ".tiff",
                ".ico",
                ".png",
                ".jxr",
                ".svg"
              ]}
              buttonIcon="FileImage"
              buttonLabel="Upload a File"
              onSave={null}
              // onChanged={(file?: IFilePickerResult) => {
              //   setFileAttachment(file.fileAbsoluteUrl);
              //   console.log(fileAttachment);
              // }}
              context={SharePointService.context}
            />
          </Stack>
        </form>
      </Panel>
    );
  }
}
