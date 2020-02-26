import * as React from "react";
import { Stack, Text } from "office-ui-fabric-react";
import { SPItemsContext } from "../contexts/SPItemsContext";

export const Header = (props): JSX.Element => {
  const { queryUrlFilterGroupByField } = React.useContext(SPItemsContext);

  return (
    <Stack
      horizontal
      horizontalAlign="start"
      style={{ marginLeft: 20, marginBottom: 20 }}
    >
      <Text variant="xLarge">
        {queryUrlFilterGroupByField
          ? queryUrlFilterGroupByField
          : props.selectedViewTitle}
      </Text>
    </Stack>
  );
};
