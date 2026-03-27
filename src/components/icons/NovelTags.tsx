import { memo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { TagIcon } from "./TagIcon";
import { Tag } from "@/types/tag";

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
            <TagIcon size={12} color="#6B7280" />
            <Text style={s.text}>{tag.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const s = StyleSheet.create({
  scroll: { gap: 8, paddingVertical: 2 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB", // İnce zarif bir çizgi
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  chipPressed: { backgroundColor: "#F3F4F6" },
  text: {
    fontFamily: "Mont-600",
    fontSize: 11.5,
    color: "#4B5563",
    letterSpacing: 0.3,
    textTransform: "uppercase", // Dergi tarzı için tümü büyük harf
  },
});
