import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  InteractionManager,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { useEffect, useRef, useCallback, useState } from "react";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useFocusEffect } from "@react-navigation/native";
import { AuthorNovelListItem } from "@/types/novel";
import { useAppTheme } from "@/hooks/useTheme";
import { useMyAuthorNovelsQuery } from "@/hooks/useAuthorMeQuery";

export const NovelParallax = ({
  isResolvingAuthor = false,
  onNovelSelect,
}: {
  isResolvingAuthor?: boolean;
  onNovelSelect: (index: string | null) => void;
}) => {
  const { data, isLoading } = useMyAuthorNovelsQuery({
    enabled: !isResolvingAuthor,
  });
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const carouselRef = useRef<any>(null);

  const savedIndex = useRef(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const GAP = 16;

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setRefreshKey((prev) => prev + 1);
      });
      return () => task.cancel();
    }, []),
  );

  useEffect(() => {
    if (!isLoading && data?.items && data.items.length > 0) {
      onNovelSelect(data.items[0].id);
      return;
    }

    if (!isLoading) {
      onNovelSelect(null);
    }
  }, [isLoading, data, onNovelSelect]);

  if (isResolvingAuthor || isLoading) {
    return (
      <View style={styles.itemContainer}>
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Yükleniyor...
        </Text>
      </View>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <View style={styles.itemContainer}>
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Henüz roman bulunmuyor.
        </Text>
      </View>
    );
  }

  const items = data.items;
  const hasMultipleItems = items.length > 1;
  const defaultIndex = Math.min(savedIndex.current, items.length - 1);

  const handleSnap = () => {
    const currentIndex = carouselRef.current?.getCurrentIndex();
    if (currentIndex === undefined) return;

    const realIndex = Math.max(0, Math.min(currentIndex, items.length - 1));
    const selectedNovel = items[realIndex];
    if (!selectedNovel) return;

    savedIndex.current = realIndex;
    onNovelSelect(selectedNovel.id);
  };

  const renderNovelItem = ({ item }: { item: AuthorNovelListItem }) => {
    return (
      <Pressable
        style={[styles.itemContainer, { marginHorizontal: GAP / 2 }]}
        onPress={() => globalNavigate("NovelPanel", { id: item.id })}
      >
        {item.coverImage ? (
          <Image
            source={{ uri: item.coverImage }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        pagingEnabled
        style={{ width: width, justifyContent: "center" }}
        data={items}
        key={`carousel-refresh-${refreshKey}`}
        defaultIndex={defaultIndex}
        width={width * 0.45}
        loop={hasMultipleItems}
        height={240}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.85,
          parallaxScrollingOffset: 30,
        }}
        onSnapToItem={handleSnap}
        renderItem={({ item }) => renderNovelItem({ item })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  itemContainer: {
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  stateText: {
    fontFamily: "Mont-500",
    fontSize: 13,
  },
});
