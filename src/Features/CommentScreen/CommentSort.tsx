import React, { useState, useRef, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";
import { CommentSortType } from "@/types/comment";

const BUTTON_PADDING = 3;

type Props = {
  selected: CommentSortType;
  onChange: (sort: CommentSortType) => void;
};

export const CommentSort = ({ selected, onChange }: Props) => {
  const { theme, isDarkMode } = useAppTheme();

  // Genişliği dinamik olarak takip edeceğiz
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const activeTheme = useMemo(
    () => ({
      background: isDarkMode ? "rgba(255,255,255,0.04)" : "#F1F5F9",
      indicator: isDarkMode ? theme.surface : "#FFFFFF",
      activeText: theme.textPrimary,
      inactiveText: theme.textSecondary,
    }),
    [isDarkMode, theme],
  );

  const handlePress = (type: CommentSortType, index: number) => {
    onChange(type);
    Animated.spring(translateX, {
      toValue: index,
      useNativeDriver: true, // Artık piksellerle çalıştığımız için sorunsuz kayar
      damping: 25,
      stiffness: 250,
      mass: 1,
    }).start();
  };

  // Dinamik pixel hesaplama
  // (Toplam Genişlik - İç Boşluklar) / 3
  const tabWidth = containerWidth
    ? (containerWidth - BUTTON_PADDING * 2) / 3
    : 0;

  const movingValue = translateX.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, tabWidth, tabWidth * 2], // Native driver'ın sevdiği sayısal değerler
  });

  return (
    <View style={styles.container}>
      <View
        style={[styles.card, { backgroundColor: activeTheme.background }]}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} // Burası parent neyse o genişliği yakalar
      >
        {/* Genişlik henüz ölçülmediyse indicator'ı çizmiyoruz ki zıplama yapmasın */}
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.animatedIndicator,
              {
                width: tabWidth,
                backgroundColor: activeTheme.indicator,
                transform: [{ translateX: movingValue }],
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
                borderWidth: isDarkMode ? 1 : 0,
              },
            ]}
          />
        )}

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
    width: "100%", // Dış dünyadan ne gelirse onu kapla
    paddingVertical: 12,
  },
  card: {
    flexDirection: "row",
    borderRadius: 14,
    padding: BUTTON_PADDING,
    height: 40,
    alignItems: "center",
    position: "relative",
    width: "100%", // Parent genişliğine zorla
  },
  animatedIndicator: {
    position: "absolute",
    height: 34,
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
    flex: 1, // Butonlar her zaman eşit pay alır
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  text: {
    fontSize: 10,
    fontFamily: "Mont-700",
    letterSpacing: 0.6,
  },
});
