import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.9; // 3 seçenek için biraz daha genişletebilirsin
const BUTTON_PADDING = 3;
// Her butonun genişliği toplam genişlik eksi paddingler bölü 3
const TAB_WIDTH = (CARD_WIDTH - BUTTON_PADDING * 2) / 3;

// Tip tanımlamasını güncelledik
type SortType = "newest" | "popular" | "oldest";

export const CommentSort = () => {
  const [selected, setSelected] = useState<SortType>("newest");
  // 0, 1, 2 değerlerini alacak bir animasyon değeri
  const translateX = useRef(new Animated.Value(0)).current;

  const handlePress = (type: SortType) => {
    setSelected(type);

    // Hangi indexe gideceğini belirliyoruz
    let toValue = 0;
    if (type === "popular") toValue = 1;
    if (type === "oldest") toValue = 2;

    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      bounciness: 4,
      speed: 12,
    }).start();
  };

  // 0 -> 1 -> 2 değerlerini buton genişliğine göre piksele çeviriyoruz
  const movingValue = translateX.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.card, { width: CARD_WIDTH }]}>
        {/* Hareket eden beyaz arka plan */}
        <Animated.View
          style={[
            styles.animatedIndicator,
            {
              width: TAB_WIDTH, // Dinamik genişlik
              transform: [{ translateX: movingValue }],
            },
          ]}
        />

        {/* Seçenek 1: En Yeni */}
        <Pressable onPress={() => handlePress("newest")} style={styles.button}>
          <Text
            style={[
              styles.text,
              selected === "newest" ? styles.activeText : styles.inactiveText,
            ]}
          >
            En Yeni
          </Text>
        </Pressable>

        {/* Seçenek 2: En Popüler (Yeni eklenen) */}
        <Pressable onPress={() => handlePress("popular")} style={styles.button}>
          <Text
            style={[
              styles.text,
              selected === "popular" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Popüler
          </Text>
        </Pressable>

        {/* Seçenek 3: En Eski */}
        <Pressable onPress={() => handlePress("oldest")} style={styles.button}>
          <Text
            style={[
              styles.text,
              selected === "oldest" ? styles.activeText : styles.inactiveText,
            ]}
          >
            En Eski
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#EBEBEB",
    borderRadius: 14,
    padding: BUTTON_PADDING,
    position: "relative",
    height: 40, // Metinler sığsın diye biraz yükselttik
    alignItems: "center",
  },
  animatedIndicator: {
    position: "absolute",
    height: 34, // (card height - padding*2) yaklaşık değeri
    top: BUTTON_PADDING,
    left: BUTTON_PADDING,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeText: {
    color: "#000000",
  },
  inactiveText: {
    color: "#757575",
  },
});
