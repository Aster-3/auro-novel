import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { CategoryIcon } from "./icons/CategoryIcon";
import { useAppTheme } from "@/hooks/useTheme";

export const CategorySelect = memo(
  ({
    categories,
    selectedCategory,
    setSelectedCategory,
  }: {
    categories: { id: string; name: string }[];
    selectedCategory: { id: string; name: string };
    setSelectedCategory: (cat: { id: string; name: string }) => void;
  }) => {
    const { theme } = useAppTheme();

    return (
      <View style={s.outerContainer}>
        {/* Sabit İkon - Listenin başında statik durur */}
        <View style={s.iconArea}>
          <CategoryIcon color={theme.textPrimary} size={14} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          decelerationRate="fast"
        >
          {categories.map((item) => {
            const isSelected = selectedCategory.id === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedCategory(item)}
                style={s.chip}
              >
                <Text
                  style={[
                    s.hash,
                    {
                      color: isSelected
                        ? theme.textPrimary
                        : theme.textSecondary,
                      opacity: isSelected ? 1 : 0.4,
                    },
                  ]}
                >
                  #
                </Text>
                <Text
                  style={[
                    s.text,
                    {
                      color: isSelected
                        ? theme.textPrimary
                        : theme.textSecondary,
                      fontFamily: "Mont-500-Italic",
                      opacity: isSelected ? 1 : 0.7,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

const s = StyleSheet.create({
  outerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingBottom: 12,
  },
  iconArea: {
    paddingRight: 12,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    gap: 14,
    paddingRight: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
  },
  hash: {
    fontSize: 13,
    fontFamily: "Mont-600",
  },
  text: {
    fontSize: 12.5,
    letterSpacing: -0.5,
  },
});
