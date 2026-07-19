import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { CategorySelect } from "@/components/CategorySelecy";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useRandomTagQuery } from "@/hooks/useRandomTagQuery";
import { useGetNovelsByTag } from "@/hooks/useGetNovelsByTag";
import { SeriesCardVerticalSkeleton } from "@/components/SeriesCardVerticalSkeleton";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";

export const BestofCategory = () => {
  const { data: tags, isLoading: tagsLoading } = useRandomTagQuery(20);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data: novelsByTag, isLoading: novelsLoading } = useGetNovelsByTag(
    selectedCategory?.id || "",
  );

  useEffect(() => {
    if (tags && tags.length > 0 && !selectedCategory) {
      setSelectedCategory(tags[0]);
    }
  }, [tags]);

  const skeletonCount = [1, 2, 3, 4, 5];

  if (tagsLoading) return null;

  return (
    <View style={styles.container}>
      <SectionHeader headerName="Rastgele Etiketler" />

      <CategorySelect
        categories={tags || []}
        selectedCategory={selectedCategory || (tags ? tags[0] : null)}
        setSelectedCategory={setSelectedCategory}
      />

      <View style={styles.listFrame}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0.9}
          overScrollMode="never"
          contentContainerStyle={styles.scrollContent}
        >
          {novelsLoading || !novelsByTag
            ? skeletonCount.map((i) => (
                <Animated.View
                  key={`skeleton-${i}`}
                  entering={FadeIn.duration(400)}
                >
                  <SeriesCardVerticalSkeleton />
                </Animated.View>
              ))
            : novelsByTag.map((novel: any, index: number) => (
                <Animated.View
                  key={`${selectedCategory?.id}-${novel.id}`}
                  entering={FadeInRight.delay(index * 50)
                    .duration(400)
                    .damping(5)}
                >
                  <SeriesCardVertical
                    id={novel.id}
                    cover={novel.coverImage}
                    name={novel.name}
                  />
                </Animated.View>
              ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  listFrame: {
    minHeight: 178,
  },
  scrollContent: {
    columnGap: 14,
    paddingRight: 4,
  },
});
