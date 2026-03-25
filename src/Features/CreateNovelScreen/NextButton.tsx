import { Pressable, Text, Animated, StyleSheet, View } from "react-native";
import { useRef } from "react";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { LoadingDots } from "@/components/LoadingDots";

export const NextButton = ({
  isLoading,
  onPress,
  disabled,
}: {
  isLoading: boolean;
  onPress: () => void;
  disabled: boolean;
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateScale = (toValue: number, speed: number, bounciness: number) => {
    Animated.spring(scaleValue, {
      toValue,
      useNativeDriver: true,
      speed,
      bounciness,
    }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleValue }], width: "100%" }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => !disabled && animateScale(0.97, 40, 0)}
        onPressOut={() => !disabled && animateScale(1, 20, 5)}
        disabled={disabled}
        style={[
          styles.button,
          { backgroundColor: disabled ? "#E2E8F0" : "#1C274C" },
          disabled && { opacity: 0.7 },
        ]}
      >
        {isLoading ? (
          <LoadingDots />
        ) : (
          <Text
            style={[styles.text, { color: disabled ? "#94A3B8" : "#FFFFFF" }]}
          >
            Oluştur
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    marginTop: 32,
    width: "80%",
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
});
