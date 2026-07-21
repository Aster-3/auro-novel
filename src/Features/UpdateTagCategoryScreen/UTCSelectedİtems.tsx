import { ChevronBottomIcon } from "@/components/icons/ChevronBottomIcon";
import { XIcon } from "@/components/icons/XIcon";
import { useAppTheme } from "@/hooks/useTheme";
import { Category } from "@/types/category";
import { Tag } from "@/types/tag";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

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
  const { theme, isDarkMode } = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);
  const label = mode === "tag" ? "Seçilen etiketler" : "Seçilen kategoriler";

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((current) => !current);
  };

  return (
    <View
      style={[
        styles.container,
        isOpen && [
          styles.openContainer,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.025)"
              : "rgba(15,23,42,0.022)",
          },
        ],
      ]}
    >
      <TouchableOpacity
        style={[
          styles.header,
          {
            borderBottomColor: isDarkMode
              ? "rgba(255,255,255,0.035)"
              : "rgba(15,23,42,0.045)",
          },
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.65}
      >
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
          <Text style={[styles.count, { color: theme.textPrimary }]}>
            {" "}
            ({selectedItems.length})
          </Text>
        </Text>
        <View style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}>
          <ChevronBottomIcon size={12} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>

      {isOpen ? (
        <View style={styles.content}>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => {
              const displayName =
                mode === "tag" ? (item as Tag).name : (item as Category).title;

              return (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <Text
                      numberOfLines={1}
                      style={[styles.itemText, { color: theme.textPrimary }]}
                    >
                      {displayName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onRemove(item.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.removeButton}
                    >
                      <XIcon
                        size={10}
                        color={isDarkMode ? "#FCA5A5" : "#DC2626"}
                      />
                    </TouchableOpacity>
                  </View>
                  {index !== selectedItems.length - 1 ? (
                    <View
                      style={[
                        styles.itemSeparator,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(15,23,42,0.04)",
                        },
                      ]}
                    />
                  ) : null}
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Henüz bir seçim yapmadınız.
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  openContainer: {
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  header: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: "Mont-500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  count: {
    fontFamily: "Mont-500",
  },
  content: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  itemRow: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    gap: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Mont-500",
  },
  removeButton: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: "Mont-500",
    paddingVertical: 14,
    textAlign: "center",
  },
});
