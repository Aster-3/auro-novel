import { FilterIcon } from "@/components/icons/FilterIcon";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { DateRange, TransactionBottomSheet } from "./TransactionBottomSheet";
import { useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { AuthorTransactionType } from "@/types/author";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const TransactionFilterHeader = ({
  since,
  setFilter,
  setSince,
}: {
  since: DateRange;
  setFilter: (filter: AuthorTransactionType | null) => void;
  setSince: (since: DateRange) => void;
}) => {
  const { theme, isDarkMode } = useAppTheme(); // Renkleri aldık
  const ref = useRef<BottomSheet>(null);
  const [selectedSheet, setSelectedSheet] = useState<"filter" | "sort">(
    "filter",
  );

  const openFilterSheet = (selected: "filter" | "sort") => {
    setSelectedSheet(selected);
    ref.current?.expand();
  };

  // Butonlar için ortak arka plan rengi
  const buttonBg = isDarkMode ? theme.surface : "#F1F5F9";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: buttonBg }]}
        onPress={() => openFilterSheet("sort")}
      >
        <Text style={[styles.sortText, { color: theme.textPrimary }]}>
          {since.label}
        </Text>
        <RightChevronIcon size={18} color={theme.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, { backgroundColor: buttonBg }]}
        onPress={() => openFilterSheet("filter")}
      >
        <FilterIcon size={16} color={theme.textPrimary} />
      </TouchableOpacity>

      <TransactionBottomSheet
        ref={ref}
        setFilter={setFilter}
        setSince={setSince}
        selectedSheet={selectedSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortText: {
    fontSize: 12,
    fontFamily: "Mont-600",
  },
  filterButton: {
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
});
