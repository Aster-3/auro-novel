import { Text } from "react-native";

export const SectionHeader = ({ headerName }: { headerName: string }) => {
  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: "Mont-600",
        color: "rgb(7, 15, 74)",
      }}
    >
      {headerName}
    </Text>
  );
};
