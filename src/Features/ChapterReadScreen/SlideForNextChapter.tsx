import React, { useEffect, useRef } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { NextChapterIcon } from "@/components/icons/NextChapterIcon";

const { width } = Dimensions.get("window");
const MASK_WIDTH = width * 0.75; // Metin alanı için biraz daha yer açtık
const SHIMMER_WIDTH = width * 0.5;

export const SlideForNextChapter = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  useEffect(() => {
    const runAnimation = () => {
      animatedValue.setValue(0);
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2800, // Biraz daha ağırbaşlı bir akış
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ]).start(() => runAnimation());
    };
    runAnimation();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SHIMMER_WIDTH, MASK_WIDTH],
  });

  const baseTextColor = isDarkMode ? "#636366" : "#8E8E93";
  const highlightColor = isDarkMode ? "#FFFFFF" : "#1C1C1E";
  const lineColor = isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  const shimmerColors = ["transparent", highlightColor, "transparent"] as const;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {/* Sol Çizgi */}
        <View style={[styles.line, { backgroundColor: lineColor }]} />

        <View style={styles.maskContainer}>
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <View style={styles.textWrapper}>
                <Text style={[styles.text, { color: "black" }]}>
                  SONRAKİ BÖLÜM İÇİN KAYDIRIN
                </Text>
                <NextChapterIcon size={16} color={baseTextColor} />
              </View>
            }
          >
            {/* 1. Katman: Ana Metin */}
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: baseTextColor },
              ]}
            />

            {/* 2. Katman: Shimmer */}
            <Animated.View
              style={[
                {
                  width: SHIMMER_WIDTH,
                  height: "100%",
                  transform: [{ translateX }],
                },
              ]}
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

        {/* Sağ Çizgi */}
        <View style={[styles.line, { backgroundColor: lineColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20, // Metinle diğer içerikler arasında biraz daha boşluk
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 35,
  },
  maskContainer: {
    width: MASK_WIDTH,
    height: "100%",
  },
  textWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  text: {
    fontSize: 9.5, // Çok hafif büyütüldü
    fontWeight: "700",
    letterSpacing: 2.8, // Harf arası bir tık daha açıldı
    textTransform: "uppercase",
    marginRight: 8, // İkonla metin arasına biraz daha boşluk
  },
  line: {
    width: 30,
    height: 1,
    borderRadius: 1,
  },
});
