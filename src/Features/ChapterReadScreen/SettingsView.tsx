import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, InteractionManager } from "react-native";
import { ProgressSlider } from "./ProgressSlider";
import { FontSettingsControl } from "./FontSettings";
import { LayoutSettings } from "./LaytoutSettings";
import { TextAlignSettings } from "./TextAlignSettings";
import { ScrollAndThemeSettings } from "./ScrollAndThemeSettings";
import { useReaderStore } from "@/store/useReaderStore";

export const SettingsView = React.memo(() => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const [progressText, setProgressText] = useState("09,8");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsMounted(true);
    });
  }, []);

  const handleProgressUpdate = useCallback((val: number) => {
    setProgressText((val * 100).toFixed(1).replace(".", ","));
  }, []);

  const handleProgressFinal = useCallback((val: number) => {
    console.log("Final Değer Kaydediliyor:", val);
  }, []);

  return (
    <View style={[styles.container, { opacity: isMounted ? 1 : 0 }]}>
      <View style={styles.progressWrapper}>
        {/* <Text
          style={[
            styles.progressText,
            { color: isDarkMode ? "#fcf3e6" : "#1A1A1A" },
          ]}
        >
          {progressText}%
        </Text>
        <ProgressSlider
          initialProgress={0.098}
          onProgressChange={handleProgressUpdate}
          onSlidingComplete={handleProgressFinal}
          onNext={() => console.log("Sonraki Bölüm")}
          onPrev={() => console.log("Önceki Bölüm")}
        /> */}
      </View>

      <FontSettingsControl />

      <LayoutSettings />

      <TextAlignSettings />

      <ScrollAndThemeSettings />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, gap: 16 },
  progressWrapper: { alignItems: "center" },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    marginVertical: 8,
    paddingBottom: 4,
  },
});
