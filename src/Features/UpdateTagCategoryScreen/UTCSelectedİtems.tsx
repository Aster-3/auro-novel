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
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

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

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={toggleDropdown}
        activeOpacity={0.6}
      >
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          SEÇİLEN {mode === "tag" ? "ETİKETLER" : "KATEGORİLER"}{" "}
          <Text style={{ color: theme.textPrimary, fontFamily: "Mont-700" }}>
            ({selectedItems.length})
          </Text>
        </Text>
        <View style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}>
          <ChevronBottomIcon size={12} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            styles.content,
            {
              borderTopColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
            },
          ]}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => {
              const isTag = mode === "tag";
              const displayName = isTag
                ? (item as Tag).name
                : (item as Category).title;

              return (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <Text
                      style={[styles.itemText, { color: theme.textPrimary }]}
                    >
                      {displayName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onRemove(item.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <XIcon
                        size={10}
                        color={isDarkMode ? "#fb7185" : "#f47069"}
                      />
                    </TouchableOpacity>
                  </View>
                  {index !== selectedItems.length - 1 && (
                    <View
                      style={[
                        styles.itemSeparator,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.03)"
                            : "#F1F5F9",
                        },
                      ]}
                    />
                  )}
                </View>
              );
            })
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Henüz bir seçim yapmadınız.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 9, // Mikro-tipografi
    fontFamily: "Mont-700",
    letterSpacing: 1,
  },
  content: {
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 12,
    fontFamily: "Mont-500",
    letterSpacing: -0.2,
  },
  itemSeparator: {
    height: 1,
    marginLeft: 16,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: "Mont-500",
    padding: 16,
    textAlign: "center",
  },
});
