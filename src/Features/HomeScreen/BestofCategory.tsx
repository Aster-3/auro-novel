import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
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
    <View style={{ gap: 8 }}>
      <SectionHeader headerName="Kategorisinin En Çok Önerilenleri" />

      <CategorySelect
        categories={tags || []}
        selectedCategory={selectedCategory || (tags ? tags[0] : null)}
        setSelectedCategory={setSelectedCategory}
      />

      <View style={{ minHeight: 180 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0.9}
          overScrollMode="never"
          contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}
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
