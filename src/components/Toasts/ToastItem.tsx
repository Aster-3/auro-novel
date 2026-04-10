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
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const ToastItem = ({ toast }: { toast: any }) => {
  const { theme, isDarkMode } = useAppTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Giriş Animasyonu (Tok ve hızlı)
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 150,
      mass: 0.8,
    });
    scale.value = withSpring(1, { damping: 18, stiffness: 150 });

    const exitDelay = setTimeout(() => {
      // Çıkış Animasyonu (Yukarı süzülerek)
      translateY.value = withTiming(-40, {
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
      });
      opacity.value = withTiming(0, { duration: 400 });
    }, 3000);

    return () => clearTimeout(exitDelay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    shadowOpacity: isDarkMode ? 0 : 0.05 * opacity.value,
  }));

  const themeColor = getThemeColor(toast.type, isDarkMode);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View
        style={[
          styles.toastItem,
          {
            backgroundColor: isDarkMode ? theme.surface : "#FFFFFF",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.02)",
            borderWidth: 1,
          },
        ]}
      >
        <Ionicons
          name={getIconName(toast.type)}
          size={16}
          color={themeColor}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {(toast.type || "Bitti").toUpperCase()}
          </Text>
          {toast.message && (
            <Text style={[styles.message, { color: theme.textSecondary }]}>
              {toast.message}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const getThemeColor = (type: string, isDarkMode: boolean) => {
  switch (type) {
    case "Başarılı":
      return isDarkMode ? "#81c784" : "#2e7d32";
    case "Hata":
      return "#ff453a";
    case "Uyarı":
      return "#ffcc00";
    case "Bilgi":
      return "#0a84ff";
    default:
      return "#8e8e93";
  }
};

const getIconName = (type?: string) => {
  switch (type) {
    case "Başarılı":
      return "checkmark-circle-sharp";
    case "Hata":
      return "alert-circle-sharp";
    case "Uyarı":
      return "warning-sharp";
    case "Bilgi":
      return "information-circle-sharp";
    default:
      return "notifications-sharp";
  }
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 6,
    zIndex: 9999,
  },
  toastItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    maxWidth: "85%",
    alignSelf: "center",
    borderRadius: 30, // Tam kapsül form
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  icon: { marginRight: 8 },
  textContainer: { justifyContent: "center", flexShrink: 1 },
  title: {
    fontSize: 10, // Mikro-tipografi
    fontFamily: "Mont-700",
    letterSpacing: 0.8,
  },
  message: {
    fontSize: 11,
    fontFamily: "Mont-500",
    marginTop: 1,
    letterSpacing: -0.2,
  },
});
