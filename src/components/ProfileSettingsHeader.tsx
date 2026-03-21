import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { BackArrowIcon } from "./icons/BackArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export const ProfileSettingsHeader = ({ title }: { title: string }) => {
  const navigation = useAppNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.5 },
          ]}
          hitSlop={15}
        >
          <BackArrowIcon color="#111827" size={26} />
        </Pressable>

        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    paddingVertical: 4,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "Mont-600",
    color: "#1C274C",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rightSection: {
    width: 20,
  },
});
