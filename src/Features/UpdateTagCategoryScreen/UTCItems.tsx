import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

interface BaseItem {
  id: number;
  name?: string;
  trName?: string;
}

interface UTCItemsProps {
  items: BaseItem[];
  onSelect: (item: any) => void;
}

export const UTCItems = ({ items, onSelect }: UTCItemsProps) => {
  const { theme, isDarkMode } = useAppTheme();

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Herhangi bir öğe bulunamadı.
      </Text>
    </View>
  );

  const renderSeparator = () => (
    <View
      style={[
        styles.separator,
        { backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "#F1F5F9" },
      ]}
    />
  );

  const renderItem = ({ item }: { item: BaseItem }) => {
    const displayName = item.trName || item.name || "İsimsiz";

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onSelect(item)}
        activeOpacity={0.5}
      >
        <Text style={[styles.itemText, { color: theme.textPrimary }]}>
          {displayName}
        </Text>
        <RightChevronIcon size={12} color={theme.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          items.length === 0 ? styles.emptyListContent : styles.listWrapper,
          { backgroundColor: theme.surface },
        ]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 20,
  },
  listWrapper: {
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
    // Kenarlığı tamamen kaldırdık veya çok silik yaptık
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
    borderRadius: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 13, // 15'ten 13'e çekerek minimalizmi sağladık
    fontFamily: "Mont-500",
    letterSpacing: -0.2,
  },
  separator: {
    height: 1,
    marginHorizontal: 16, // Ayraçlar Apple stilindeki gibi içeriden başlar
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: "Mont-500",
  },
});
