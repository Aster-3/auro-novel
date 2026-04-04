import React from "react";
import { View, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  clamp,
} from "react-native-reanimated";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";

interface ProgressSliderProps {
  initialProgress: number;
  onProgressChange: (value: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ProgressSlider = ({
  initialProgress,
  onProgressChange,
  onNext,
  onPrev,
}: ProgressSliderProps) => {
  const trackWidth = useSharedValue(0);
  const progress = useSharedValue(initialProgress);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newValue = clamp(event.x / trackWidth.value, 0, 1);
      progress.value = newValue;
      if (onProgressChange) {
        runOnJS(onProgressChange)(newValue);
      }
    })
    .activeCursor("grabbing");

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const animatedKnobStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 100}%`,
    transform: [{ translateX: -6 }],
  }));

  return (
    <View style={styles.itemContainer}>
      <View style={styles.arrowBox} onTouchEnd={onPrev}>
        <View style={{ transform: [{ rotate: "180deg" }] }}>
          <RightArrowIcon size={18} strokeWidth={2.2} color="#09244B" />
        </View>
      </View>

      <GestureDetector gesture={panGesture}>
        <View
          style={styles.sliderZone}
          onLayout={(e) => (trackWidth.value = e.nativeEvent.layout.width)}
        >
          <View style={styles.track}>
            <Animated.View style={[styles.fill, animatedFillStyle]} />
          </View>
          <Animated.View style={[styles.knob, animatedKnobStyle]} />
        </View>
      </GestureDetector>

      <View style={styles.arrowBox} onTouchEnd={onNext}>
        <RightArrowIcon size={18} strokeWidth={2.2} color="#09244B" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderRadius: 26,
    gap: 16,
    paddingHorizontal: 12,
  },
  arrowBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  sliderZone: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  track: {
    height: 4,
    backgroundColor: "#D1D1D6",
    borderRadius: 2,
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#09244B",
  },
  knob: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#09244B",
  },
});
