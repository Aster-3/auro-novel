import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image, ImageSource } from "expo-image";

interface CarouselItemType {
  id: string;
  image: ImageSource | string | number;
}

const DATA: CarouselItemType[] = [
  { id: "1", image: require("@assets/banners/Shounen-Jump-2023.png") },
  { id: "2", image: require("@assets/banners/banner1.jpg") },
  { id: "3", image: require("@assets/banners/banner2.webp") },
  { id: "4", image: require("@assets/banners/banner3.jpg") },
  { id: "5", image: require("@assets/banners/banner4.jpg") },
];

export const HomeCarousel = () => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselHeight = width / 3;

  return (
    <View>
      <Carousel
        loop
        width={width - 24}
        height={carouselHeight}
        autoPlay={true}
        data={DATA}
        autoPlayInterval={3000}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => {
          const roundIndex = Math.round(absoluteProgress);
          if (activeIndex !== roundIndex) {
            setActiveIndex(roundIndex % DATA.length);
          }
        }}
        mode="parallax"
        withAnimation={{
          type: "spring",
          config: {
            damping: 20,
            stiffness: 100,
            mass: 1.5,
            overshootClamping: false,
          },
        }}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 45,
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
            />
          </View>
        )}
      />

      <View style={styles.pagination}>
        {DATA.map((_, index) => (
          <View
            key={index.toString()}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },
  dot: {
    height: 3.5,
    borderRadius: 99,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#2d4161", // Slate-800 (Daha yumuşak bir siyah/lacivert)
  },
  inactiveDot: {
    width: 12,
    backgroundColor: "#dcdcdd", // Aktif rengin %20 şeffaf hali
  },
});
