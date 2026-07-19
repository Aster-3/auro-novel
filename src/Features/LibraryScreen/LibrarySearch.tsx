import { SearchIcon2 } from "@/components/icons/SearchIcon2";
import { SortIcon } from "@/components/icons/SortIcon";
import { XIcon } from "@/components/icons/XIcon";
import { useAppTheme } from "@/hooks/useTheme";
import { useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { LibraryFilterSheet } from "./LibraryFilterSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { LibrarySortOption } from "@/types/library";

export const LibrarySearch = ({
  searchText,
  setSearchText,
  order,
  setOrder,
}: {
  searchText: string | null;
  setSearchText: (text: string | null) => void;
  order: LibrarySortOption;
  setOrder: (order: LibrarySortOption) => void;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const filterRef = useRef<BottomSheet>(null);

  const value = searchText || "";
  const controlBg = isDarkMode ? theme.surface : "#F8FAFC";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB";

  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: controlBg,
              borderColor,
              color: theme.textPrimary,
              paddingRight: value ? 42 : 16,
            },
          ]}
          placeholder="Kütüphanende ara"
          placeholderTextColor={theme.textSecondary}
          value={value}
          onChangeText={(text) => setSearchText(text)}
          selectionColor={theme.accent}
          keyboardAppearance={isDarkMode ? "dark" : "light"}
        />

        <View style={styles.searchIcon} pointerEvents="none">
          <SearchIcon2 size={16} color={theme.textSecondary} />
        </View>

        {value ? (
          <Pressable
            onPress={() => setSearchText(null)}
            hitSlop={10}
            style={({ pressed }) => [
              styles.clearButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(15,23,42,0.06)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <XIcon size={10} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.sortButton,
          {
            backgroundColor: controlBg,
            borderColor,
            opacity: pressed ? 0.72 : 1,
          },
        ]}
        onPress={() => filterRef.current?.expand()}
      >
        <SortIcon size={17} color={theme.textPrimary} />
      </Pressable>

      <LibraryFilterSheet ref={filterRef} order={order} setOrder={setOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  input: {
    height: 40,
    borderRadius: 12,
    paddingLeft: 40,
    paddingVertical: 0,
    fontFamily: "Mont-500",
    fontSize: 12,
  },
  searchIcon: {
    position: "absolute",
    left: 13,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
