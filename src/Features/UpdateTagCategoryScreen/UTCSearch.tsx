import { SearchIcon2 } from "@/components/icons/SearchIcon2";
import { TextInput, StyleSheet, View } from "react-native";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const UTCSearch = ({
  searchValue,
  setSearchValue,
  mode,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  mode: "tag" | "category";
}) => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchWrapper,
          {
            backgroundColor: theme.surface,
            borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
          },
        ]}
      >
        <SearchIcon2 color={theme.textSecondary} size={14} />
        <TextInput
          style={[styles.textInput, { color: theme.textPrimary }]}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text.trimStart())}
          placeholder={mode === "tag" ? "Etiket ara..." : "Kategori ara..."}
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.accent}
          cursorColor={theme.accent}
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 14, // Daha yumuşak köşeler
  },
  textInput: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontSize: 13, // 14'ten 13'e çekerek daha minimal yaptık
    fontFamily: "Mont-500",
    letterSpacing: -0.2, // Yazıyı daha sıkı ve şık gösterir
    paddingVertical: 0,
  },
});
