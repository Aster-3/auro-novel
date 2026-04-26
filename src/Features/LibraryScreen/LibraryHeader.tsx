import React, { memo, useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

export const LibraryHeader = memo(
  ({
    activeTab,
    setActiveTab,
  }: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }) => {
    const { theme } = useAppTheme();

    const animValue = useRef(
      new Animated.Value(activeTab === "library" ? 0 : 1),
    ).current;

    useEffect(() => {
      Animated.timing(animValue, {
        toValue: activeTab === "library" ? 0 : 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }, [activeTab]);

    const renderTab = (name: string, label: string, targetValue: number) => {
      const color = animValue.interpolate({
        inputRange: [0, 1],
        outputRange:
          targetValue === 0
            ? [theme.textPrimary, theme.textSecondary]
            : [theme.textSecondary, theme.textPrimary],
      });

      const opacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: targetValue === 0 ? [1, 0.4] : [0.4, 1],
      });

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setActiveTab(name)}
          style={s.tab}
        >
          <Animated.Text
            style={[
              s.text,
              {
                color,
                opacity,
                fontFamily: activeTab === name ? "Mont-700" : "Mont-600",
              },
            ]}
          >
            {label}
          </Animated.Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={s.tabsWrapper}>
        {renderTab("library", "Kütüphane", 0)}
        {/* {renderTab("readlist", "Okuma Listeleri", 1)} */}
      </View>
    );
  },
);

const s = StyleSheet.create({
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  tab: { paddingVertical: 6 },
  text: { fontSize: 17, letterSpacing: -0.4 },
});
