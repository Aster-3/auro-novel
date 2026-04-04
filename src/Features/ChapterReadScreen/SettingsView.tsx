import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ProgressSlider } from "./ProgressSlider";
import { FontSettingsControl } from "./FontSettings";
import { LayoutSettings } from "./LaytoutSettings";
import { TextAlignSettings } from "./TextAlignSettings";
import { ScrollAndThemeSettings } from "./ScrollAndThemeSettings";

import { useReaderStore } from "@/store/useReaderStore";

export const SettingsView = () => {
  const fontSize = useReaderStore((state) => state.fontSize);
  const setFontSize = useReaderStore((state) => state.setFontSize);

  const fontFamily = useReaderStore((state) => state.fontFamily);
  const setFontFamily = useReaderStore((state) => state.setFontFamily);

  const lineHeight = useReaderStore((state) => state.lineHeight);
  const setLineHeight = useReaderStore((state) => state.setLineHeight);

  const paddingHorizontal = useReaderStore((state) => state.paddingHorizontal);
  const setPaddingHorizontal = useReaderStore(
    (state) => state.setPaddingHorizontal,
  );

  const textAlign = useReaderStore((state) => state.textAlign);
  const setTextAlign = useReaderStore((state) => state.setTextAlign);

  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const toggleDarkMode = useReaderStore((state) => state.toggleDarkMode);

  const scrollMode = useReaderStore((state) => state.scrollMode);
  const setScrollMode = useReaderStore((state) => state.setScrollMode);

  const [progressText, setProgressText] = useState("09,8");

  const handleProgressChange = (val: number) => {
    setProgressText((val * 100).toFixed(1).replace(".", ","));
  };

  return (
    <View style={styles.container}>
      {/* İlerleme Bölümü */}
      <View style={styles.progressWrapper}>
        <Text style={styles.progressText}>{progressText}%</Text>
        <ProgressSlider
          initialProgress={0.098}
          onProgressChange={handleProgressChange}
          onNext={() => console.log("Sonraki Bölüm")}
          onPrev={() => console.log("Önceki Bölüm")}
        />
      </View>

      {/* Font Ayarları (Store'dan geliyor) */}
      <FontSettingsControl
        fontSize={fontSize}
        setFontSize={setFontSize}
        setCurrentFont={setFontFamily}
      />

      {/* Layout Ayarları (Store'dan geliyor) */}
      <LayoutSettings
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        paddingHorizontal={paddingHorizontal}
        setPaddingHorizontal={setPaddingHorizontal}
      />

      {/* Hizalama Ayarları (Store'dan geliyor) */}
      <TextAlignSettings textAlign={textAlign} setTextAlign={setTextAlign} />

      {/* Tema ve Kaydırma (isDarkMode store'dan) */}
      <ScrollAndThemeSettings
        scrollMode={scrollMode} // Şimdilik statik veya store'a eklenebilir
        setScrollMode={setScrollMode}
        themeMode={isDarkMode ? "night" : "day"}
        setThemeMode={toggleDarkMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
    backgroundColor: "#F8F9FA",
  },
  progressWrapper: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
});
