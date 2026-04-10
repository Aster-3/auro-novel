import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Tag } from "@/types/tag";
import { useAppTheme } from "@/hooks/useTheme";

export const NovelTags = memo(({ tags }: { tags: Tag[] }) => {
  const { theme } = useAppTheme();

  if (!tags?.length) return null;

  return (
    <View style={s.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        decelerationRate="fast"
      >
        {tags.map((tag) => (
          <Pressable
            key={tag.id}
            style={({ pressed }) => [s.chip, pressed && s.chipPressed]}
          >
            <Text style={[s.hash, { color: theme.textSecondary }]}>#</Text>
            <Text style={[s.text, { color: theme.textPrimary }]}>
              {tag.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    paddingVertical: 4,
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
  hash: {
    fontSize: 14,
    fontFamily: "Mont-600",
  },
  text: {
    fontFamily: "Mont-500-Italic",
    fontSize: 13,
    letterSpacing: -0.3,
    textAlignVertical: "center",
  },
});
