import * as React from "react";
import {
  Callout,
  IGroupHeaderProps,
  DirectionalHint,
  ActionButton,
  getTheme,
  mergeStyleSets,
  FontWeights
} from "office-ui-fabric-react";
import { GroupHeaderFilterForm } from "./GroupHeaderFilterForm";
import { SPItemsContext } from "../contexts/SPItemsContext";
import { AppSettingsContext } from "../contexts/AppSettingsContext";
import scssStyles from "../styles/DetailsList.module.scss";
import { addAddLinkIconStyle } from "../styles/styleObjects";

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
  const [isGroupFilter, setIsGroupFilter] = React.useState(false);
  const { showItemsCount } = React.useContext(AppSettingsContext);
  const { listItems } = React.useContext(SPItemsContext);
  const { userHasFullControl } = React.useContext(AppSettingsContext);

  return (
    <div ref={groupFilterRef} className={scssStyles.groupHeader}>
      <span className={scssStyles.groupHeaderTitle}>{props.group.name}</span>
      {!!showItemsCount && (
        <span
          className={scssStyles.headerCount}
        >{`(${props.group.count})`}</span>
      )}
      {userHasFullControl && (
        <ActionButton
          onClick={() => setIsGroupFilter(true)}
          iconProps={{ iconName: "AddLink" }}
          styles={addAddLinkIconStyle()}
        >
          Get link
        </ActionButton>
      )}
      {isGroupFilter && (
        <Callout
          className={styles.callout}
          role="alertdialog"
          gapSpace={0}
          coverTarget
          isBeakVisible={false}
          target={groupFilterRef.current}
          directionalHint={DirectionalHint.bottomRightEdge}
          onDismiss={() => {
            setIsGroupFilter(false);
          }}
          setInitialFocus={true}
        >
          {isGroupFilter && (
            <GroupHeaderFilterForm
              listItems={listItems}
              groupKey={props.group.key}
              groupLevel={props.groupLevel}
            />
          )}
        </Callout>
      )}
    </div>
  );
};
