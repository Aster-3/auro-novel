import React, { useEffect, useRef, memo } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useReaderStore } from "@/store/useReaderStore";
import { NextChapterIcon } from "@/components/icons/NextChapterIcon";
import { SeriesStatus } from "@/types/novel";

const { width } = Dimensions.get("window");
const MASK_WIDTH = width * 0.75;
const SHIMMER_WIDTH = width * 0.5;

export const SlideForNextChapter = memo(
  ({
    novelStatus,
    lastChapterAvailable,
  }: {
    novelStatus?: SeriesStatus;
    lastChapterAvailable: boolean;
  }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Store'dan sadece isDarkMode'u çekiyoruz
    const isDarkMode = useReaderStore((state) => state.isDarkMode);

    useEffect(() => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2800,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.delay(1200),
        ]),
      );

      animation.start();

      return () => animation.stop(); // Cleanup eklendi
    }, [animatedValue]);

    const translateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-SHIMMER_WIDTH, MASK_WIDTH],
    });

    const baseTextColor = isDarkMode ? "#636366" : "#8E8E93";
    const highlightColor = isDarkMode ? "#FFFFFF" : "#1C1C1E";
    const lineColor = isDarkMode
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.08)";
    const shimmerColors = [
      "transparent",
      highlightColor,
      "transparent",
    ] as const;

    // textState'i render içinde basit bir değişkene çevirdik (fonksiyon çağırmaya gerek yok)
    let displayText = "";
    if (lastChapterAvailable) {
      displayText = "SONRAKİ BÖLÜM İÇİN KAYDIRIN";
    } else {
      switch (novelStatus) {
        case SeriesStatus.COMPLETED:
          displayText = "SON";
          break;
        case SeriesStatus.ONGOING:
          displayText = "DEVAM EDECEK...";
          break;
        case SeriesStatus.HIATUS:
          displayText = "YAYIN DURAKLATILDI";
          break;
        case SeriesStatus.CANCELLED:
          displayText = "YAYIN SONLANDI";
          break;
        default:
          displayText = "BİLİNMEYEN DURUM";
      }
    }

    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={[styles.line, { backgroundColor: lineColor }]} />

          <View style={styles.maskContainer}>
            <MaskedView
              style={StyleSheet.absoluteFill}
              maskElement={
                <View style={styles.textWrapper}>
                  <Text style={[styles.text, { color: "black" }]}>
                    {displayText}
                  </Text>
                  {lastChapterAvailable && (
                    <NextChapterIcon size={16} color={baseTextColor} />
                  )}
                </View>
              }
            >
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: baseTextColor },
                ]}
              />
              <Animated.View
                style={{
                  width: SHIMMER_WIDTH,
                  height: "100%",
                  transform: [{ translateX }],
                }}
                renderToHardwareTextureAndroid={true}
              >
                <LinearGradient
                  colors={shimmerColors}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
            </MaskedView>
          </View>

          <View style={[styles.line, { backgroundColor: lineColor }]} />
        </View>
      </View>
    );
  },
);

// Styles aynı kalıyor...
const styles = StyleSheet.create({
  outerContainer: { width: "100%", alignItems: "center", marginVertical: 20 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 35,
  },
  maskContainer: { width: MASK_WIDTH, height: "100%" },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 2.8,
    textTransform: "uppercase",
    marginRight: 8,
  },
  line: { width: 30, height: 1, borderRadius: 1 },
});
