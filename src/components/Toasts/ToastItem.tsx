import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

export const ToastItem = ({ toast }: { toast: any }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    // Giriş
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withSpring(0, {
      damping: 22,
      stiffness: 200,
      mass: 0.6,
    });
    scale.value = withSpring(1, { damping: 22, stiffness: 200, mass: 0.6 });

    const exitDelay = setTimeout(() => {
      translateY.value = withTiming(-100, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 3000,
        easing: Easing.out(Easing.ease),
      });
    }, 2600);

    return () => clearTimeout(exitDelay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const isVisible = opacity.value > 0.05;

    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      shadowOpacity: 0.08 * opacity.value,
      elevation: isVisible ? 1 * opacity.value : 0,
    };
  });

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View style={styles.toastItem}>
        <Ionicons
          name={getIconName(toast.type)}
          size={20}
          color={getThemeColor(toast.type)}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.type || "Done"}</Text>
          {toast.message && <Text style={styles.message}>{toast.message}</Text>}
        </View>
      </View>
    </Animated.View>
  );
};

const getThemeColor = (type?: string) => {
  switch (type) {
    case "Başarılı":
      return "#03045e";
    case "Hata":
      return "#FF3B30";
    case "Uyarı":
      return "#FFCC00";
    case "Bilgi":
      return "#5856D6";
    default:
      return "#8E8E93";
  }
};

const getIconName = (type?: string) => {
  switch (type) {
    case "Başarılı":
      return "checkmark-circle";
    case "Hata":
      return "close-circle";
    case "Uyarı":
      return "warning";
    case "Bilgi":
      return "information-circle";
    default:
      return "checkmark-circle";
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  wrapper: {
    marginBottom: 8,
  },
  toastItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  icon: { marginRight: 8 },
  textContainer: { justifyContent: "center" },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
  },
  message: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8E8E93",
    marginTop: 2,
  },
});
