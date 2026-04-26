import { FilterIcon } from "@/components/icons/FilterIcon";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { SearchIcon2 } from "@/components/icons/SearchIcon2";
import { useAppTheme } from "@/hooks/useTheme";
import { useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { LibraryFilterSheet } from "./LibraryFilterSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { LibrarySortOption } from "@/types/library";
import { SortIcon } from "@/components/icons/SortIcon";

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

  const buttonBg = isDarkMode ? theme.surface : "#F1F5F9";

  const filterRef = useRef<BottomSheet>(null);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <TextInput
          style={[
            styles.sortButton,
            {
              backgroundColor: buttonBg,
              color: theme.textPrimary,
              paddingLeft: 40,
            },
          ]}
          placeholder="Kütüphanende Ara"
          placeholderTextColor={theme.textSecondary}
          value={searchText || ""}
          onChangeText={(text) => setSearchText(text)}
        />

        <View
          style={{
            position: "absolute",
            left: 12,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <SearchIcon2 size={16} color={theme.textSecondary} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: buttonBg }]}
        onPress={() => filterRef.current?.expand()}
      >
        <SortIcon size={16} color={theme.textPrimary} />
      </TouchableOpacity>
      <LibraryFilterSheet ref={filterRef} order={order} setOrder={setOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  sortButton: {
    // flexDirection ve justifyContent: space-between artık gerekmiyor çünkü absolute ikon kullanıyoruz
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontFamily: "Mont-500",
    borderRadius: 12,
    fontSize: 13, // Okunabilirlik için eklendi
  },
  sortText: {
    fontSize: 12,
    fontFamily: "Mont-600",
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
