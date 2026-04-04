import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Tag } from "@/types/tag";
import { TagIcon } from "./TagIcon";

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
            <Text style={s.hash}>#</Text>
            {/* <TagIcon size={12} color="#374151" /> */}
            <Text style={s.text}>{tag.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const s = StyleSheet.create({
  scroll: {
    gap: 14,
    paddingLeft: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 6,

    paddingHorizontal: 2,
  },
  chipPressed: { opacity: 0.5 },
  hash: {
    fontSize: 13,
    fontFamily: "Mont-600",
    color: "#282b2e",
  },
  text: {
    fontFamily: "Mont-500-Italic",
    fontSize: 13,
    color: "#374151",
    letterSpacing: -0.5,
    textAlignVertical: "center",
  },
});
