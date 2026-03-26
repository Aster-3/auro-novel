import React, { useState } from "react";
import { ChevronBottomIcon } from "@/components/icons/ChevronBottomIcon";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { XIcon } from "@/components/icons/XIcon";
import { Category } from "@/types/category";
import { Tag } from "@/types/tag";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const UTCSelectedItems = ({
  selectedItems,
  onRemove,
  mode,
}: {
  selectedItems: (Category | Tag)[];
  onRemove: (id: number) => void;
  mode: "tag" | "category";
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleDropdown}
        activeOpacity={0.6}
      >
        <Text style={styles.label}>
          Seçilen {mode === "tag" ? "Etiketler" : "Kategoriler"}{" "}
          <Text style={styles.countText}>({selectedItems.length})</Text>
        </Text>
        <View style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}>
          <ChevronBottomIcon size={14} color="#1C274C" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => {
              const isTag = mode === "tag";
              const displayName = isTag
                ? (item as Tag).name
                : (item as Category).trName;

              return (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemText}>{displayName}</Text>
                    <TouchableOpacity
                      onPress={() => onRemove(item.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <XIcon size={12} color="#f47069" />
                    </TouchableOpacity>
                  </View>
                  {index !== selectedItems.length - 1 && (
                    <View style={styles.itemSeparator} />
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Henüz bir seçim yapmadınız.</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Mont-500",
    color: "#1C274C",
  },
  countText: {
    color: "#8E8E93",
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 13,
    fontFamily: "Mont-500",
    color: "#3A3A3C",
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#F2F2F7",
    marginLeft: 16,
  },
  emptyText: {
    fontSize: 13,
    color: "#8E8E93",
    fontStyle: "italic",
    padding: 16,
    textAlign: "center",
  },
});
