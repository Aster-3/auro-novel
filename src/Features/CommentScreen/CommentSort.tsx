import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

const { width: screenWidth } = Dimensions.get("window");
const CONTAINER_PADDING = 24;
const CARD_WIDTH = screenWidth - CONTAINER_PADDING * 2;
const BUTTON_PADDING = 3;
const TAB_WIDTH = (CARD_WIDTH - BUTTON_PADDING * 2) / 3;

type SortType = "newest" | "popular" | "oldest";

export const CommentSort = () => {
  const [selected, setSelected] = useState<SortType>("newest");
  const { theme, isDarkMode } = useAppTheme();

  const translateX = useRef(new Animated.Value(0)).current;

  // constants.ts ile tam senkronize renkler
  const activeTheme = useMemo(
    () => ({
      background: isDarkMode ? "rgba(255,255,255,0.04)" : "#F1F5F9",
      indicator: isDarkMode ? theme.surface : "#FFFFFF",
      activeText: theme.textPrimary,
      inactiveText: theme.textSecondary,
    }),
    [isDarkMode, theme],
  );

  const handlePress = (type: SortType, index: number) => {
    setSelected(type);
    Animated.spring(translateX, {
      toValue: index,
      useNativeDriver: true,
      damping: 25, // Daha tok bir yaylanma
      stiffness: 250,
      mass: 1,
    }).start();
  };

  const movingValue = translateX.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, TAB_WIDTH, TAB_WIDTH * 2],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: activeTheme.background }]}>
        <Animated.View
          style={[
            styles.animatedIndicator,
            {
              backgroundColor: activeTheme.indicator,
              transform: [{ translateX: movingValue }],
              // Karanlık modda indicator'ın hafif belli olması için ince border
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "transparent",
              borderWidth: isDarkMode ? 1 : 0,
            },
          ]}
        />

        <SortButton
          label="EN YENİ"
          isActive={selected === "newest"}
          onPress={() => handlePress("newest", 0)}
          theme={activeTheme}
        />
        <SortButton
          label="POPÜLER"
          isActive={selected === "popular"}
          onPress={() => handlePress("popular", 1)}
          theme={activeTheme}
        />
        <SortButton
          label="EN ESKİ"
          isActive={selected === "oldest"}
          onPress={() => handlePress("oldest", 2)}
          theme={activeTheme}
        />
      </View>
    </View>
  );
};

const SortButton = ({ label, isActive, onPress, theme }: any) => (
  <Pressable
    onPress={onPress}
    style={styles.button}
    hitSlop={{ top: 10, bottom: 10 }}
  >
    <Text
      style={[
        styles.text,
        { color: isActive ? theme.activeText : theme.inactiveText },
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: CONTAINER_PADDING,
    paddingVertical: 12,
  },
  card: {
    flexDirection: "row",
    borderRadius: 14, // Biraz daha yumuşattık
    padding: BUTTON_PADDING,
    height: 40, // 38'den 40'a - daha pro bir duruş
    alignItems: "center",
    width: CARD_WIDTH,
    position: "relative",
  },
  animatedIndicator: {
    position: "absolute",
    height: 34,
    width: TAB_WIDTH,
    left: BUTTON_PADDING,
    top: BUTTON_PADDING,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  text: {
    fontSize: 10, // Mikro-tipografi kuralı
    fontFamily: "Mont-700", // Biraz daha güçlü bir ağırlık
    letterSpacing: 0.6, // Geniş harf aralığı
  },
});
