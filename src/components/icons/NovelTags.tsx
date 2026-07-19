import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Tag } from "@/types/tag";
import { useAppTheme } from "@/hooks/useTheme";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export const NovelTags = memo(
  ({
    tags = [],
    isAdultContent = false,
  }: {
    tags: Tag[];
    isAdultContent?: boolean;
  }) => {
    const { theme } = useAppTheme();
    const navigation = useAppNavigation();

    if (!isAdultContent && !tags.length) return null;

    return (
      <View style={s.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          decelerationRate="fast"
        >
          {isAdultContent && (
            <View style={s.chip}>
              <Text style={[s.text, { color: theme.textPrimary }]}># +18</Text>
            </View>
          )}
          {tags.map((tag) => (
            <Pressable
              key={tag.id}
              onPress={() =>
                navigation.navigate("TagNovels", {
                  id: String(tag.id),
                  name: tag.name,
                })
              }
              style={({ pressed }) => [s.chip, pressed && s.chipPressed]}
            >
              <Text style={[s.text, { color: theme.textPrimary }]}>
                # {tag.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  },
);

const s = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingBottom: 12,
  },
  scroll: {
    gap: 16,
    paddingLeft: 2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  chipPressed: {
    opacity: 0.5,
  },
  text: {
    fontFamily: "Mont-500-Italic",
    fontSize: 13,
    letterSpacing: -0.3,
    textAlignVertical: "center",
  },
});
