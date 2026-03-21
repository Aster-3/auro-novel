import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { TagIcon } from "./TagIcon";
import { Tag } from "@/types/novel";

export const NovelTags = memo(({ tags }: { tags: Tag[] }) => {
  if (!tags?.length) return null;

  return (
    <View>
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
            <TagIcon size={13} color="#94A3B8" />
            <Text style={s.text}>{tag.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const s = StyleSheet.create({
  scroll: {
    gap: 6,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9ce",
    backgroundColor: "#f1f5f9ce",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipPressed: {
    opacity: 0.6,
  },
  text: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    letterSpacing: -0.1,
  },
});
