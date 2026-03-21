import React, { useState } from "react";
import { Text, StyleSheet, ScrollView, View, Pressable } from "react-native";
import { Screen } from "../components/layout/Screen";
import { ProfileSettingsHeader } from "@/components/ProfileSettingsHeader";
import { ThemeIcon } from "@/components/icons/ThemeIcon";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#1C274C",
  text: "#2D3142",
  textMuted: "#6C7285",
  white: "#FFFFFF",
  border: "#E6E9F2",
};

const AppThemeScreen = () => {
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const themeOptions = [
    { id: "light", label: "Açık Tema", icon: "sunny-outline" },
    { id: "dark", label: "Koyu Tema", icon: "moon-outline" },
    { id: "system", label: "Sistem Varsayılanı", icon: "settings-outline" },
  ];

  return (
    <Screen style={styles.screen}>
      <ProfileSettingsHeader title="Uygulama Teması" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.listContainer}>
          {themeOptions.map((option) => {
            const isActive = selectedTheme === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() => setSelectedTheme(option.id)}
                android_ripple={{ color: "rgba(28,39,76,0.05)" }}
                style={({ pressed }) => [
                  styles.card,
                  !isActive && styles.nonActiveOpacity,
                  pressed && styles.pressedCard,
                ]}
              >
                <View style={styles.leftSection}>
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color={isActive ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text
                    style={[styles.optionText, isActive && styles.activeText]}
                  >
                    {option.label}
                  </Text>
                </View>

                {isActive && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 16, backgroundColor: "#f5f5f5", gap: 16 },
  scrollContent: {},
  listContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  nonActiveOpacity: {
    opacity: 0.5,
  },
  pressedCard: {
    backgroundColor: "rgba(28,39,76,0.05)",
  },
  leftSection: { flexDirection: "row", alignItems: "center", gap: 14 },
  optionText: { fontSize: 16, color: COLORS.text, fontWeight: "500" },
  activeText: { color: COLORS.primary, fontWeight: "600" },
});

export default AppThemeScreen;
