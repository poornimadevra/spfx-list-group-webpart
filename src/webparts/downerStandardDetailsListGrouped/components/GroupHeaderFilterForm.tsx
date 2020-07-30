import * as React from "react";
import {
  Dropdown,
  IDropdownOption,
  getTheme,
  mergeStyleSets,
  FontWeights,
  TextField,
  Stack,
  PrimaryButton,
  Icon,
  Toggle
} from "office-ui-fabric-react";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import scssStyles from "../styles/DetailsList.module.scss";
import { ISelectedViewFildsQueryValues } from "../interfaces/ISelectedViewFildsQueryValues";
import { getPageUrl } from "../utils/getPageUrl";
import { ILayoutQuerySettings } from "../interfaces/ILayoutQuerySettings";
import { checkMarkStyle } from "../styles/styleObjects";

const theme = getTheme();
const styles = mergeStyleSets({
  buttonArea: {
    verticalAlign: "top",
    display: "inline-block",
    textAlign: "center",
    margin: "0 100px",
    minWidth: 130,
    height: 32
  },
  callout: {
    maxWidth: 700
  },
  header: {
    padding: "18px 24px 12px"
  },
  title: [
    theme.fonts.xLarge,
    {
      margin: 0,
      fontWeight: FontWeights.semilight
    }
  ],
  inner: {
    height: "100%",
    padding: "0 24px 20px"
  },
  actions: {
    position: "relative",
    marginTop: 20,
    width: "100%",
    whiteSpace: "nowrap"
  },
  subtext: [
    theme.fonts.small,
    {
      margin: 0,
      fontWeight: FontWeights.semilight
    }
  ],
  link: [
    theme.fonts.medium,
    {
      color: theme.palette.neutralPrimary
    }
  ]
});

export const GroupHeaderFilterForm = ({ listItems, groupLevel, groupKey }) => {
  const textAreaRef = React.useRef(null);
  const { viewFields, groupByFields } = React.useContext(SPFieldsContext);
  const [copySuccess, setCopySuccess] = React.useState("");
  const [groupLevelLink, setGroupLevelLink] = React.useState("");
  const [viewFildsLink, setViewFildsLink] = React.useState("");
  const [layoutQuerySettings, setLayoutQuerySettings] = React.useState<
    ILayoutQuerySettings
  >({ groupExpended: false });
  const [
    selectedViewFildsQueryValues,
    setSelectedViewFildsQueryValues
  ] = React.useState<ISelectedViewFildsQueryValues[]>([]);
  const [selectedViewFildsQuery, setSelectedViewFildsQuery] = React.useState(
    []
  );

  const copyToClipboard = (e: any) => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopySuccess("Copied!");
  };

  const onCollapseChange = (
    _ev: React.MouseEvent<HTMLElement>,
    _checked: boolean
  ) => {
    setLayoutQuerySettings(prevState => {
      let newState = prevState;
      newState.groupExpended = !prevState.groupExpended;
      return { ...newState };
    });
  };

  const onViewFieldsChange = (
    _event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    let newSelectedViewFildsQueryValues = [];
    if (item.selected) {
      selectedViewFildsQuery.push(item.key as string);
    } else {
      const currIndex = selectedViewFildsQuery.indexOf(item.key as string);
      if (currIndex > -1) {
        selectedViewFildsQuery.splice(currIndex, 1);
        newSelectedViewFildsQueryValues = selectedViewFildsQueryValues.filter(
          q => q.viewFieldInternalName !== item.key
        );
        setSelectedViewFildsQueryValues([...newSelectedViewFildsQueryValues]);
      }
    }
    setSelectedViewFildsQuery([...selectedViewFildsQuery]);
  };

  const onViewFieldsValuesChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    const currentFieldName = event.target["id"];
    const inIt = selectedViewFildsQueryValues.some(
      f => f.viewFieldInternalName === currentFieldName
    );

    if (!inIt) {
      selectedViewFildsQueryValues.push({
        viewFieldInternalName: currentFieldName,
        viewFieldValue: item.key as string
      });
      setSelectedViewFildsQueryValues([...selectedViewFildsQueryValues]);

      return;
    }

    if (inIt) {
      const currentSelectedViewFildsQueryValues = selectedViewFildsQueryValues.map(
        f => {
          if (f.viewFieldInternalName === currentFieldName)
            f.viewFieldValue = item.key as string;

          return f;
        }
      );

      setSelectedViewFildsQueryValues([...currentSelectedViewFildsQueryValues]);

      return;
    }
  };

  const getViewFieldsOptions = (): IDropdownOption[] => {
    return viewFields
      .filter(
        v =>
          !v.title.includes("Type") &&
          !v.title.includes("Name") &&
          !v.title.includes("Document_x0020_Type") &&
          !v.title.includes("Modified") &&
          !v.title.includes("Flowchart")
      )
      .map(f => ({
        key: f.internalName,
        text: f.title
      }));
  };

  const getCurrentGroupByField = (level: number): string => {
    const currentGroup = groupByFields.find(g => g.level === level);

    if (currentGroup) return currentGroup.internalName;
  };

  const getValue = (fieldName: string) => {
    const selectedViewFildsQueryValue = selectedViewFildsQueryValues.find(
      v => v.viewFieldInternalName === fieldName
    );

    if (selectedViewFildsQueryValue) {
      return selectedViewFildsQueryValue.viewFieldValue;
    }
  };

  const getUninueValueOptions = (items: any[], field: string) => {
    const uniqueValues = Array.from(new Set(items.map(i => i[field])));

    const mappedUniqueValues = uniqueValues.map(u => ({
      key: u === null ? "Empty" : u,
      text: u === null ? "Empty" : u
    })) as IDropdownOption[];
    mappedUniqueValues.push(
      { key: "NotEmpty", text: "NotEmpty" },
      { key: "All", text: "All" }
    );

    return mappedUniqueValues;
  };

  React.useEffect(() => {
    setGroupLevelLink(
      `${getPageUrl()}?${getCurrentGroupByField(groupLevel)}=${groupKey}`
    );
  }, []);

  React.useEffect(() => {
    let stringFilter = "";

    selectedViewFildsQueryValues.map((v, i) => {
      stringFilter += `&${v.viewFieldInternalName}=${v.viewFieldValue}`;
    });

    stringFilter += `&groupExpended=${layoutQuerySettings.groupExpended}`;

    if (stringFilter) setViewFildsLink(stringFilter);
  }, [selectedViewFildsQueryValues, layoutQuerySettings]);

  return (
    <div className={styles.header}>
      <Stack verticalAlign="center" tokens={{ childrenGap: 10 }}>
        {copySuccess && (
          <div className={scssStyles.copyIconContainer}>
            <div className={scssStyles.copyIcon}>
              <Icon iconName="CheckMark" styles={checkMarkStyle()} />
            </div>
            <span className={scssStyles.copiedTitle}>Link copied</span>
          </div>
        )}
        <Stack horizontal>
          <Stack.Item grow={4}>
            <TextField
              componentRef={textAreaRef}
              value={groupLevelLink + viewFildsLink}
            />
          </Stack.Item>
          <Stack.Item grow={1}>
            <PrimaryButton text="Copy" onClick={copyToClipboard} />
          </Stack.Item>
        </Stack>
        <div className={scssStyles.collapseContol}>
          <Toggle
            onText="Expanded"
            offText="Collasped"
            checked={layoutQuerySettings.groupExpended}
            onChange={onCollapseChange}
          />
        </div>

        <div className="dropFilters">
          <Dropdown
            label="View fields"
            selectedKeys={selectedViewFildsQuery}
            multiSelect
            onChange={onViewFieldsChange}
            placeholder="Select an option"
            options={getViewFieldsOptions()}
          />

          {selectedViewFildsQuery.map(s => (
            <Dropdown
              label={`Select values for ${s}`}
              id={s}
              selectedKey={getValue(s)}
              onChange={onViewFieldsValuesChange}
              placeholder="Select an option"
              options={getUninueValueOptions(listItems, s)}
            />
          ))}
        </div>
      </Stack>
    </div>
  );
};
