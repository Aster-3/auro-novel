import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import React, { useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

export const RegisterHeader = () => {
  const navigation = useAppNavigation();
  const keyboardProgress = useSharedValue(0);

  const { isDarkMode } = useAppTheme();

  // Temaya göre dinamik renkler
  const colors = {
    text: isDarkMode ? "#F9FAFB" : "#111827",
    subtitle: isDarkMode ? "#9CA3AF" : "#6B7280",
    divider: isDarkMode ? "#FFFFFF" : "#000000",
    background: isDarkMode ? "#111827" : "transparent", // Header arka planı gerekirse
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      keyboardProgress.value = withTiming(1, { duration: 300 });
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardProgress.value = withTiming(0, { duration: 300 });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        keyboardProgress.value,
        [0, 1],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      height: interpolate(
        keyboardProgress.value,
        [0, 1],
        [72, 0],
        Extrapolation.CLAMP,
      ),
      marginTop: interpolate(
        keyboardProgress.value,
        [0, 1],
        [0, -10],
        Extrapolation.CLAMP,
      ),
      overflow: "hidden",
    };
  });

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={styles.iconContainer}>
          {/* İkon rengi temaya göre değişiyor */}
          <BackArrowIcon color={colors.text} size={28} />
        </View>
      </TouchableOpacity>

      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: colors.text }]}>Hoş Geldiniz</Text>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Animated.View style={animatedStyle}>
          <Text style={[styles.subtitle, { color: colors.subtitle }]}>
            {`“Bölüm kilitlerini açmak, yazarları desteklemek ve kendi hikâyelerini yayınlamak için bir hesap oluştur.”`}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 5,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 20,
    marginLeft: -8,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    paddingLeft: 0,
  },
  title: {
    fontFamily: "Mont-600",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  divider: {
    width: 30,
    height: 3,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "400",
  },
});
