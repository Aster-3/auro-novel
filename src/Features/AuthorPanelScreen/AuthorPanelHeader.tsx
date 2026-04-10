import { Text } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

export const AuthorPanelHeader = ({ title }: { title: string }) => {
  const { theme } = useAppTheme();

  return (
    <Text
      style={{
        fontFamily: "Mont-700",
        fontSize: 16,
        color: theme.textPrimary,
        paddingHorizontal: 16,
        marginBottom: -20,
      }}
    >
      {title}
    </Text>
  );
};
