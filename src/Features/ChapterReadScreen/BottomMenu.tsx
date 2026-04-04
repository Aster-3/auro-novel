import React from "react";
import { Pressable, StyleSheet, Platform, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Orijinal İkonlar ve Tipler
import { ChapterCommentIcon } from "@/components/icons/ChapterCommentIcon";
import { ChapterMoreOptions } from "@/components/icons/ChapterMoreOptions";
import { SettingsIcon } from "@/components/icons/SettingsIcon";
import { TableOfContentsIcon } from "@/components/icons/TableOfContentsIcon";
import { SheetType } from "@/screens/ChapterReadScreen";

// Etkileşimli Buton Bileşeni (Dışarıya etkisi yok, sadece iç animasyon)
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
    opacity: withTiming(scale.value === 1 ? 1 : 0.7, { duration: 100 }), // Bastığında hafif solma hissi
  }));

  return (
    <Pressable
      onPressIn={() => {
        // Çok hızlı ve sert bir yay (damping yüksek, stiffness yüksek)
        // Bu "fiziksel buton" hissini verir, yaylanma yapmaz
        scale.value = withSpring(0.92, { damping: 20, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }}
      onPress={onPress}
      style={styles.menuItem}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
};

export const BottomMenu = ({
  isMenuVisible,
  handleOpenSheet,
}: {
  isMenuVisible: boolean;
  handleOpenSheet: (type: SheetType) => void;
}) => {
  const bottomBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(isMenuVisible ? 0 : 100, {
          duration: 300,
        }),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.bottomBar, bottomBarStyle]}>
      <NavButton onPress={() => handleOpenSheet("TOC")}>
        <TableOfContentsIcon size={22} color="#1A1A1A" />
      </NavButton>

      <NavButton onPress={() => handleOpenSheet("SETTINGS")}>
        <SettingsIcon size={22} color="#1A1A1A" />
      </NavButton>

      <NavButton onPress={() => {}}>
        <ChapterCommentIcon size={22} color="#1A1A1A" />
      </NavButton>

      <NavButton onPress={() => handleOpenSheet("MORE")}>
        <ChapterMoreOptions size={22} color="#1A1A1A" />
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
    height: 75,
    backgroundColor: "#FFFFFF", // %100 mat beyaz
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    zIndex: 100,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E5E5",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
