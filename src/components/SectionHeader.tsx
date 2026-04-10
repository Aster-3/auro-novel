import { Text } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

export const SectionHeader = ({ headerName }: { headerName: string }) => {
  const { theme } = useAppTheme();

  return (
    <Text
      style={{
        fontSize: 16,
        fontFamily: "Mont-600",
        color: theme.textPrimary, // Sadece renk değişti
      }}
    >
      {headerName}
    </Text>
  );
};
