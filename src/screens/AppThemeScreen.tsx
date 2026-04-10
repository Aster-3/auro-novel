import React from "react";
import { Text, StyleSheet, ScrollView, View, Pressable } from "react-native";
import { Screen } from "../components/layout/Screen";
import { Header } from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useTheme";
import { useReaderStore } from "@/store/useReaderStore";

const AppThemeScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const toggleDarkMode = useReaderStore((state) => state.toggleDarkMode);

  const themeOptions = [
    { id: "light", label: "Açık Tema", icon: "sunny-outline", value: false },
    { id: "dark", label: "Koyu Tema", icon: "moon-outline", value: true },
  ];

  return (
    <Screen backgroundColor={theme.background} style={styles.screen}>
      <Header title="Uygulama Teması" isAdjacent={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {themeOptions.map((option) => {
            const isActive = isDarkMode === option.value;

            return (
              <Pressable
                key={option.id}
                onPress={() => {
                  if (isDarkMode !== option.value) {
                    toggleDarkMode();
                  }
                }}
                style={({ pressed }) => [
                  styles.subcontainer,
                  {
                    backgroundColor: pressed
                      ? isDarkMode
                        ? "rgba(255,255,255,0.05)"
                        : "#f0f0f0"
                      : "transparent",
                  },
                ]}
              >
                <View style={styles.leftContent}>
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={isActive ? theme.accent : theme.textPrimary}
                  />
                  <Text style={[styles.text, { color: theme.textPrimary }]}>
                    {option.label}
                  </Text>
                </View>

                {isActive && (
                  <Ionicons name="checkmark" size={20} color={theme.accent} />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.footerNote, { color: theme.textSecondary }]}>
          Kullanım alışkanlıklarınıza göre temanızı değiştirebilirsiniz.
        </Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20 },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 4,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  text: {
    fontFamily: "Mont-500",
    fontSize: 14,
  },
  footerNote: {
    fontFamily: "Mont-400",
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 30,
    opacity: 0.7,
  },
});

export default AppThemeScreen;
