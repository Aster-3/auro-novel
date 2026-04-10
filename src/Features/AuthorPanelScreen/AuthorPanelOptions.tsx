import React, { useRef } from "react";
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { CreateNovelIcon } from "@/components/icons/CreateNovelIcon";
import { CashIcon } from "@/components/icons/CashIcon";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

const MENU_OPTIONS = [
  {
    id: "create_novel",
    label: "Yeni Roman Oluştur",
    onPresss: () => globalNavigate("CreateNovel"),
    icon: CreateNovelIcon,
  },
  {
    id: "author_wallet",
    label: "Yazar Cüzdanı",
    onPresss: () => globalNavigate("AuthorWallet"),
    icon: CashIcon,
  },
];

export const AuthorPanelOptions = () => {
  return (
    <View style={styles.container}>
      {MENU_OPTIONS.map((option) => (
        <AnimatedPressable key={option.id} option={option} />
      ))}
    </View>
  );
};

const AnimatedPressable = ({ option }: { option: any }) => {
  const { theme, isDarkMode } = useAppTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={option.onPresss}
      style={styles.pressableWrapper}
    >
      <Animated.View
        style={[
          styles.optionCard,
          {
            transform: [{ scale: scaleValue }],
            backgroundColor: theme.surface, // Statik #ffffff yerine surface
            borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#e5e7eb", // Dinamik çerçeve
            shadowOpacity: isDarkMode ? 0 : 0.05, // Karanlıkta gölgeyi temizledik
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <option.icon size={20} color={theme.textPrimary} />
        </View>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {option.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    gap: 12,
    marginTop: 20,
  },
  pressableWrapper: {
    borderRadius: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
  },
  iconContainer: {
    padding: 8,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  label: {
    fontFamily: "Mont-500",
    fontSize: 14,
  },
});
