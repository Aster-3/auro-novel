import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  clamp,
} from "react-native-reanimated";
import throttle from "lodash.throttle"; // Kuruluyorsa bu, değilse aşağıya özel fonksiyon ekledim
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { useReaderStore } from "@/store/useReaderStore";

interface ProgressSliderProps {
  initialProgress: number;
  onProgressChange: (value: number) => void; // 300ms'de bir (Sürekli ama kontrollü)
  onSlidingComplete: (value: number) => void; // Parmağı çektiğinde (Final)
  onNext?: () => void;
  onPrev?: () => void;
}

export const ProgressSlider = React.memo(
  ({
    initialProgress,
    onProgressChange,
    onSlidingComplete,
    onNext,
    onPrev,
  }: ProgressSliderProps) => {
    const trackWidth = useSharedValue(0);
    const progress = useSharedValue(initialProgress);
    const isDarkMode = useReaderStore((state) => state.isDarkMode);

    // Renkleri memoize edelim
    const colors = useMemo(
      () => ({
        background: isDarkMode ? "#000000" : "#ffffff",
        primary: isDarkMode ? "#fcf3e6" : "#09244B",
        track: isDarkMode ? "#3A3A3C" : "#D1D1D6",
      }),
      [isDarkMode],
    );

    const throttledUpdate = useMemo(
      () =>
        throttle((val: number) => onProgressChange(val), 200, {
          leading: true,
          trailing: true,
        }),
      [onProgressChange],
    );

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        const newValue = clamp(event.x / trackWidth.value, 0, 1);
        progress.value = newValue;
        runOnJS(throttledUpdate)(newValue);
      })
      .onEnd(() => {
        runOnJS(onSlidingComplete)(progress.value);
      });

    const animatedFillStyle = useAnimatedStyle(() => ({
      width: `${progress.value * 100}%`,
      backgroundColor: colors.primary,
    }));

    const animatedKnobStyle = useAnimatedStyle(() => ({
      left: `${progress.value * 100}%`,
      transform: [{ translateX: -6 }],
      backgroundColor: colors.primary,
    }));

    return (
      <View
        style={[styles.itemContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.arrowBox} onTouchEnd={onPrev}>
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <RightArrowIcon
              size={18}
              strokeWidth={2.2}
              color={colors.primary}
            />
          </View>
        </View>

        <GestureDetector gesture={panGesture}>
          <View
            style={styles.sliderZone}
            onLayout={(e) => (trackWidth.value = e.nativeEvent.layout.width)}
          >
            <View style={[styles.track, { backgroundColor: colors.track }]}>
              <Animated.View style={[styles.fill, animatedFillStyle]} />
            </View>
            <Animated.View style={[styles.knob, animatedKnobStyle]} />
          </View>
        </GestureDetector>

        <View style={styles.arrowBox} onTouchEnd={onNext}>
          <RightArrowIcon size={18} strokeWidth={2.2} color={colors.primary} />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderRadius: 26,
    gap: 16,
    paddingHorizontal: 12,
  },
  arrowBox: { alignItems: "center", justifyContent: "center" },
  sliderZone: { flex: 1, height: "100%", justifyContent: "center" },
  track: { height: 4, borderRadius: 2, width: "100%", overflow: "hidden" },
  fill: { height: "100%" },
  knob: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
});
