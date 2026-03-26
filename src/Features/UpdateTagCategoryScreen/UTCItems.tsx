import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";

// Ortak özellikleri içeren bir tip tanımlayalım
interface BaseItem {
  id: number;
  name?: string; // Tag'ler için
  trName?: string; // Kategoriler için
}

interface UTCItemsProps {
  items: BaseItem[];
  onSelect: (item: any) => void;
}

export const UTCItems = ({ items, onSelect }: UTCItemsProps) => {
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Herhangi bir öğe bulunamadı.</Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderItem = ({ item }: { item: BaseItem }) => {
    const displayName = item.trName || item.name || "İsimsiz";

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onSelect(item)}
        activeOpacity={0.6}
      >
        <Text style={styles.itemText}>{displayName}</Text>
        <RightChevronIcon size={14} color="#D1D1D6" />
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
        contentContainerStyle={
          items.length === 0 ? styles.emptyListContent : styles.listWrapper
        }
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5E7",
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 15,
    fontFamily: "Mont-500",
    color: "#1C1C1E",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5E7",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Mont-400",
    color: "#8E8E93",
  },
});
