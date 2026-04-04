import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  InteractionManager,
} from "react-native";
import { useNovels } from "@/hooks/useNovels";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { useEffect, useRef, useCallback, useState } from "react";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useFocusEffect } from "@react-navigation/native";

export const NovelParallax = ({
  onNovelSelect,
}: {
  onNovelSelect: (index: string | null) => void;
}) => {
  const { data, isLoading } = useNovels();
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

      return () => {
        task.cancel();
      };
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.itemContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <View style={styles.itemContainer}>
        <Text>No novels found.</Text>
      </View>
    );
  }

  useEffect(() => {
    if (data.items.length > 0) {
      onNovelSelect(data.items[0].id);
    }
  }, []);

  const handleSnap = (newIndex: number) => {
    const realIndex = carouselRef.current?.getCurrentIndex();
    savedIndex.current = realIndex;
    onNovelSelect(data.items[realIndex].id);
  };

  const renderNovelItem = ({ item }: { item: any }) => {
    return (
      <Pressable
        style={[styles.itemContainer, { marginHorizontal: GAP / 2 }]}
        onPress={() => globalNavigate("NovelPanel", { id: item.id })}
      >
        <Image
          source={item.coverImage}
          style={{ width: "100%", height: "100%" }}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        pagingEnabled
        style={{ width: width, justifyContent: "center" }}
        data={data.items}
        key={`carousel-refresh-${refreshKey}`}
        defaultIndex={savedIndex.current}
        width={width * 0.45}
        loop={true}
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
});
