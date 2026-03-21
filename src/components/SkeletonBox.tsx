import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

export const SkeletonBox = ({ width, height, style }: any) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, opacity, backgroundColor: "#8a8a8a", borderRadius: 8 },
        style,
      ]}
    />
  );
};
