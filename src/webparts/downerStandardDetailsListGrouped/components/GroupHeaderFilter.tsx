import * as React from "react";
import {
  Callout,
  IGroupHeaderProps,
  DirectionalHint,
  ActionButton,
  IIconProps,
  Dropdown,
  IDropdownOption,
  getTheme,
  mergeStyleSets,
  FontWeights,
  TextField,
  Stack,
  PrimaryButton,
  Icon
} from "office-ui-fabric-react";
import { SPFieldsContext } from "../contexts/SPFieldsContext";
import { SPItemsContext } from "../contexts/SPItemsContext";
import { AppSettingsContext } from "../contexts/AppSettingsContext";
import scssStyles from "../styles/DetailsList.module.scss";
import { getPageUrl } from "../utils/getPageUrl";
import { ISelectedViewFildsQueryValues } from "../interfaces/ISelectedViewFildsQueryValues";
const addAddLinkIcon: IIconProps = { iconName: "AddLink" };

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

export const GroupHeaderFilter = (props: IGroupHeaderProps) => {
  const groupFilterRef = React.useRef(null);
  const textAreaRef = React.useRef(null);
  const [copySuccess, setCopySuccess] = React.useState("");
  const [isGroupFilter, setIsGroupFilter] = React.useState(false);
  const [selectedViewFildsQuery, setSelectedViewFildsQuery] = React.useState(
    []
  );
  const [
    selectedViewFildsQueryValues,
    setSelectedViewFildsQueryValues
  ] = React.useState<ISelectedViewFildsQueryValues[]>([]);

  const { viewFields, groupByFields } = React.useContext(SPFieldsContext);
  const { listItems } = React.useContext(SPItemsContext);
  const { userHasFullControl } = React.useContext(AppSettingsContext);

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

  const copyToClipboard = e => {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopySuccess("Copied!");
  };

  const getCurrentGroupByField = (level: number): string => {
    const currentGroup = groupByFields.find(g => g.level === level);

    if (currentGroup) return currentGroup.internalName;
  };

  const [groupLevelLink, setGroupLevelLink] = React.useState(
    `${getPageUrl()}?${getCurrentGroupByField(props.groupLevel)}=${
      props.group.key
    }`
  );

  const [viewFildsLink, setViewFildsLink] = React.useState("");

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

  const onViewFieldsChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    const newSelectedItems = [...selectedViewFildsQuery];
    if (item.selected) {
      newSelectedItems.push(item.key as string);
    } else {
      const currIndex = newSelectedItems.indexOf(item.key as string);
      if (currIndex > -1) {
        newSelectedItems.splice(currIndex, 1);
      }
    }

    setSelectedViewFildsQuery(newSelectedItems);
  };

  const onViewFieldsValuesChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    const newSelectedViewFildsQueryValues = [...selectedViewFildsQueryValues];
    const currentFieldName = event.target["id"];

    const inIt = newSelectedViewFildsQueryValues.some(
      f => f.viewFieldInternalName === currentFieldName
    );

    if (!inIt) {
      newSelectedViewFildsQueryValues.push({
        viewFieldInternalName: currentFieldName,
        viewFieldValue: item.key as string
      });
      setSelectedViewFildsQueryValues(newSelectedViewFildsQueryValues);

      return;
    }

    if (inIt) {
      const currentSelectedViewFildsQueryValues = newSelectedViewFildsQueryValues.map(
        f => {
          if (f.viewFieldInternalName === currentFieldName)
            f.viewFieldValue = item.key as string;

          return f;
        }
      );

      setSelectedViewFildsQueryValues(currentSelectedViewFildsQueryValues);

      return;
    }
  };

  const getValue = (fieldName: string) => {
    const selectedViewFildsQueryValue = selectedViewFildsQueryValues.find(
      v => v.viewFieldInternalName === fieldName
    );

    if (selectedViewFildsQueryValue) {
      return selectedViewFildsQueryValue.viewFieldValue;
    }
  };

  React.useEffect(() => {
    let stringFilter = "";
    selectedViewFildsQueryValues.map((v, i) => {
      stringFilter +=
        i === selectedViewFildsQueryValues.length - 1
          ? `${v.viewFieldInternalName}=${v.viewFieldValue}`
          : `${v.viewFieldInternalName}=${v.viewFieldValue}&`;
    });
    if (stringFilter) setViewFildsLink("&" + stringFilter);
  }, [selectedViewFildsQueryValues]);

  return (
    <div ref={groupFilterRef} className={scssStyles.groupHeader}>
      <span className={scssStyles.groupHeaderTitle}>{props.group.name}</span>
      <span className={scssStyles.headerCount}>{`(${props.group.count})`}</span>
      {userHasFullControl && (
        <ActionButton
          onClick={() => setIsGroupFilter(true)}
          iconProps={addAddLinkIcon}
          styles={{ root: { height: 30, verticalAlign: "sub" } }}
        >
          Get link
        </ActionButton>
      )}
      {isGroupFilter && (
        <Callout
          className={styles.callout}
          ariaLabelledBy="33"
          ariaDescribedBy="34"
          role="alertdialog"
          gapSpace={0}
          coverTarget
          isBeakVisible={false}
          target={groupFilterRef.current}
          directionalHint={DirectionalHint.bottomRightEdge}
          onDismiss={() => {
            setCopySuccess("");
            setViewFildsLink("");
            setSelectedViewFildsQuery([]);
            setSelectedViewFildsQueryValues([]);
            setIsGroupFilter(false);
          }}
          setInitialFocus={true}
        >
          <div className={styles.header}>
            <Stack verticalAlign="center">
              {copySuccess && (
                <div className="copyIconContainer" style={{ marginBottom: 5 }}>
                  <div className={scssStyles.copyIcon}>
                    <Icon
                      iconName="CheckMark"
                      styles={{
                        root: { backgroundColor: "#599b00", fontSize: 50 }
                      }}
                    />
                  </div>
                  <span style={{ marginLeft: 85 }}>Link copied</span>
                </div>
              )}
              <Stack horizontal>
                <Stack.Item grow={5}>
                  <TextField
                    componentRef={textAreaRef}
                    value={groupLevelLink + viewFildsLink}
                  />
                </Stack.Item>
                <Stack.Item grow={1}>
                  <PrimaryButton text="Copy" onClick={copyToClipboard} />
                </Stack.Item>
              </Stack>
              <div className="dropFilters">
                <Dropdown
                  label="View fields"
                  selectedKeys={selectedViewFildsQuery}
                  multiSelect
                  onChange={onViewFieldsChange}
                  placeholder="Select an option"
                  options={getViewFieldsOptions()}
                />

                {selectedViewFildsQuery.map(s => {
                  return (
                    <Dropdown
                      label={`Select values for ${s}`}
                      id={s}
                      selectedKey={getValue(s)}
                      onChange={onViewFieldsValuesChange}
                      placeholder="Select an option"
                      options={getUninueValueOptions(listItems, s)}
                    />
                  );
                })}
              </div>
            </Stack>
          </div>
        </Callout>
      )}
    </div>
  );
};
