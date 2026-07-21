import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useAppTheme } from "@/hooks/useTheme";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

interface BaseItem {
  id: number;
  name?: string;
  title?: string;
}

interface UTCItemsProps {
  items: BaseItem[];
  onSelect: (item: any) => void;
}

export const UTCItems = ({ items, onSelect }: UTCItemsProps) => {
  const { theme, isDarkMode } = useAppTheme();
  const separatorColor = isDarkMode
    ? "rgba(255,255,255,0.035)"
    : "rgba(15,23,42,0.045)";

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Herhangi bir öğe bulunamadı.
      </Text>
    </View>
  );

  const renderSeparator = () => (
    <View style={[styles.separator, { backgroundColor: separatorColor }]} />
  );

  const renderItem = ({ item }: { item: BaseItem }) => {
    const displayName = item.title || item.name || "İsimsiz";

    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          pressed && {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.045)"
              : "rgba(15,23,42,0.035)",
          },
        ]}
        onPress={() => onSelect(item)}
      >
        <Text
          numberOfLines={1}
          style={[styles.itemText, { color: theme.textPrimary }]}
        >
          {displayName}
        </Text>
        <RightChevronIcon size={12} color={theme.textSecondary} />
      </Pressable>
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
          styles.listContent,
          items.length === 0 && styles.emptyListContent,
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
  listContent: {
    paddingTop: 6,
    paddingBottom: 32,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  item: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: "Mont-500",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 4,
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
