import React from "react";
import { Pressable, StyleSheet, Platform, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ChapterCommentIcon } from "@/components/icons/ChapterCommentIcon";
import { ChapterMoreOptions } from "@/components/icons/ChapterMoreOptions";
import { SettingsIcon } from "@/components/icons/SettingsIcon";
import { TableOfContentsIcon } from "@/components/icons/TableOfContentsIcon";
import { SheetType } from "@/screens/ChapterReadScreen";
import { useReaderStore } from "@/store/useReaderStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const NavButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: withTiming(scale.value === 1 ? 1 : 0.8, { duration: 60 }),
  }));

  return (
    <Pressable
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPressIn={() => {
        scale.value = withSpring(0.9, {
          damping: 15,
          stiffness: 400,
          mass: 0.5,
        });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      }}
      onPress={onPress}
      style={styles.menuItem}
    >
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export const BottomMenu = ({
  isMenuVisible,
  handleOpenSheet,
  chapterId,
}: {
  isMenuVisible: boolean;
  handleOpenSheet: (type: SheetType) => void;
  chapterId?: string;
}) => {
  // 1. TEMA DEĞERLERİNİ ALALIM
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const navigation = useAppNavigation();

  // Renk Paleti (Apple Tarzı Sistem Renkleri)
  const theme = {
    background: isDarkMode ? "#1C1C1E" : "#FFFFFF",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#E5E5E5",
    icon: isDarkMode ? "#E5E5EA" : "#1A1A1A",
  };

  const bottomBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isMenuVisible ? 0 : 120, {
          duration: 300,
        }),
      },
    ],
    // Arka plan rengini de yumuşak bir geçişle değiştirebiliriz (isteğe bağlı)
    backgroundColor: withTiming(theme.background, { duration: 300 }),
  }));

  return (
    <Animated.View
      style={[
        styles.bottomBar,
        bottomBarStyle,
        { borderTopColor: theme.border }, // Sınır çizgisi rengi
      ]}
    >
      <NavButton onPress={() => handleOpenSheet("TOC")}>
        <TableOfContentsIcon size={22} color={theme.icon} />
      </NavButton>

      <NavButton
        onPress={() => {
          if (chapterId) navigation.navigate("ChapterComments", { chapterId });
        }}
      >
        <ChapterCommentIcon size={22} color={theme.icon} />
      </NavButton>

      <NavButton onPress={() => handleOpenSheet("SETTINGS")}>
        <SettingsIcon size={22} color={theme.icon} />
      </NavButton>

      <NavButton onPress={() => handleOpenSheet("MORE")}>
        <ChapterMoreOptions size={22} color={theme.icon} />
      </NavButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 85 : 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    zIndex: 1000,
    borderTopWidth: 0.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  menuItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
});
