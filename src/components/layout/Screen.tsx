import { useAppTheme } from "@/hooks/useTheme";
import { useDynamicBottom } from "@/utils/useDynamicBottom";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const Screen = ({
  children,
  style,
  backgroundColor = useAppTheme().theme.background,
}: ScreenProps) => {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor }, style]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
