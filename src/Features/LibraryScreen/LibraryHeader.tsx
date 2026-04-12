import React, { memo } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

export const LibraryHeader = memo(
  ({
    activeTab,
    setActiveTab,
  }: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }) => {
    const { theme } = useAppTheme();

    return (
      <View style={s.container}>
        <View style={s.tabsWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("library")}
            style={s.tab}
          >
            <Text
              style={[
                s.text,
                {
                  color:
                    activeTab === "library"
                      ? theme.textPrimary
                      : theme.textSecondary,
                  fontFamily: activeTab === "library" ? "Mont-700" : "Mont-600", // Seçilince kalınlaşır
                  opacity: activeTab === "library" ? 1 : 0.5,
                },
              ]}
            >
              Kütüphane
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab("read_lists")}
            style={s.tab}
          >
            <Text
              style={[
                s.text,
                {
                  color:
                    activeTab === "read_lists"
                      ? theme.textPrimary
                      : theme.textSecondary,
                  fontFamily:
                    activeTab === "read_lists" ? "Mont-700" : "Mont-600",
                  opacity: activeTab === "read_lists" ? 1 : 0.5,
                },
              ]}
            >
              Okuma Listeleri
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const s = StyleSheet.create({
  container: {},
  tabsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20, // Tablar arası ferah boşluk (Örnekteki gibi)
  },
  tab: {
    paddingVertical: 4,
    // Arka plan yok, kenarlık yok
  },
  text: {
    fontSize: 16, // Örneğe göre biraz daha belirgin boyut
    letterSpacing: -0.3,
  },
});
