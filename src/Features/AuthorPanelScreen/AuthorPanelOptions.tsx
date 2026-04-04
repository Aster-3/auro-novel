import React, { useRef } from "react";
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { CreateNovelIcon } from "@/components/icons/CreateNovelIcon";
import { CashIcon } from "@/components/icons/CashIcon";
import { globalNavigate } from "@/navigation/globalNavigate";

const MENU_OPTIONS = [
  {
    id: "create_novel",
    label: "Yeni Roman Oluştur",
    onPresss: () => globalNavigate("CreateNovel"),
    icon: CreateNovelIcon,
  },
  {
    id: "ödemeler",
    label: "Ödemelerim",
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
        style={[styles.optionCard, { transform: [{ scale: scaleValue }] }]}
      >
        <View style={styles.iconContainer}>
          <option.icon size={20} color="#1C274C" />
        </View>
        <Text style={styles.label}>{option.label}</Text>
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
    borderRadius: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
    color: "#03061E",
  },
});
