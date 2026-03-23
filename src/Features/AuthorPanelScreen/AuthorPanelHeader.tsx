import { Text } from "react-native";

export const AuthorPanelHeader = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        fontFamily: "Mont-700",
        fontSize: 16,
        color: "#1C274C",
        paddingHorizontal: 16,
        marginBottom: -20,
      }}
    >
      {title}
    </Text>
  );
};
