import { Text } from "react-native";

export const ProfileHeaderText = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        fontFamily: "Mont-600",
        fontSize: 10,
        color: "#666",
        textTransform: "uppercase",
        marginLeft: 12,
      }}
    >
      {title}
    </Text>
  );
};
