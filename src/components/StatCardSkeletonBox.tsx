import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

interface SkeletonBoxProps {
  width: number;
  height: number;
  style?: any;
}

export const StatCardSkeletonBox = ({
  width,
  height,
  style,
}: SkeletonBoxProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200, // Çapraz akışta 1.2s çok daha akıcı durur
        useNativeDriver: true,
      }),
    ).start();
  }, [width]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.5, width * 1.5],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
          borderRadius: 8,
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          width: width * 0.5,
          height: height * 2,
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          position: "absolute",
          top: -height / 2,
          transform: [{ translateX }, { rotate: "25deg" }],
        }}
      />
    </View>
  );
};
