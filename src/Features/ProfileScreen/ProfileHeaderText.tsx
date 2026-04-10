import { useAppTheme } from "@/hooks/useTheme";
import { Text } from "react-native";

export const ProfileHeaderText = ({ title }: { title: string }) => {
  const { isDarkMode } = useAppTheme();
  return (
    <Text
      style={{
        fontFamily: "Mont-600",
        fontSize: 10,
        color: isDarkMode ? "#a2acbc" : "#7b7a7a",
        textTransform: "uppercase",
        marginLeft: 12,
      }}
    >
      {title}
    </Text>
  );
};
