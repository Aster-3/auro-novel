import { Pressable, Text, Animated, StyleSheet } from "react-native";
import { useRef } from "react";

export const NextButton = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) => {
  // Basma efekti için animasyon değeri
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], width: 250 }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          { backgroundColor: disabled ? "#E2E8F0" : "#1C274C" },
          disabled && { opacity: 0.7 }, // Pasifken daha soft görünüm
        ]}
      >
        <Text
          style={[styles.text, { color: disabled ? "#94A3B8" : "#FFFFFF" }]}
        >
          Devam Et
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
    paddingVertical: 16,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    shadowColor: "#1C274C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 15,
    fontFamily: "Mont-500",
    fontWeight: "600",
  },
});
