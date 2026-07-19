import React, { useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useBanners } from "@/hooks/useBanners";
import { useAppTheme } from "@/hooks/useTheme";
import { HomeBanner } from "@/types/banner";

export const HomeCarousel = () => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const { data: banners, isLoading } = useBanners();

  const carouselWidth = width - 24;
  const carouselHeight = Math.min(156, Math.max(116, carouselWidth / 3));

  const handleBannerPress = (banner: HomeBanner) => {
    if (banner.targetType === "NOVEL" && banner.targetId) {
      navigation.navigate("Novel", { id: banner.targetId });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            styles.placeholder,
            {
              width: carouselWidth,
              height: carouselHeight,
              backgroundColor: isDarkMode ? "#111827" : "#F1F5F9",
            },
          ]}
        />
      </View>
    );
  }

  if (!banners?.length) return null;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={carouselWidth}
        height={carouselHeight}
        autoPlay
        data={banners}
        autoPlayInterval={3000}
        scrollAnimationDuration={800}
        onProgressChange={(_, absoluteProgress) => {
          const roundIndex = Math.round(absoluteProgress);
          if (activeIndex !== roundIndex) {
            setActiveIndex(roundIndex % banners.length);
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
          <Pressable
            disabled={item.targetType !== "NOVEL" || !item.targetId}
            onPress={() => handleBannerPress(item)}
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? "#000" : "#F1F5F9" },
            ]}
          >
            <Image
              source={item.imageUrl}
              style={styles.image}
              contentFit="cover"
            />
          </Pressable>
        )}
      />

      <View style={styles.pagination}>
        {banners.map((banner, index) => (
          <View
            key={banner.id}
            style={[
              styles.dot,
              activeIndex === index
                ? [styles.activeDot, { backgroundColor: theme.accent }]
                : [
                    styles.inactiveDot,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.1)",
                    },
                  ],
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  card: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    width: "100%",
  },
  placeholder: {
    flex: 0,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    borderRadius: 99,
    height: 3.5,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    width: 12,
  },
});
