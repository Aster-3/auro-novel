import React, { useRef, useState } from "react";
import { Text, StyleSheet, useWindowDimensions, View } from "react-native";
import { Screen } from "@/components/layout/Screen";
import { useGetOneChapter } from "@/hooks/useGetOneChapter";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import { BottomMenu } from "@/Features/ChapterReadScreen/BottomMenu";
import BottomSheet from "@gorhom/bottom-sheet";
import { ChapterBottomSheet } from "@/Features/ChapterReadScreen/ChapterBottomSheet";
import RenderHtml from "react-native-render-html";
import { useReaderStore } from "@/store/useReaderStore";

export type SheetType = "SETTINGS" | "TOC" | "MORE" | null;

const ChapterReadScreen = ({ route }: any) => {
  const { id } = route.params;
  const { data: chapterData } = useGetOneChapter(id, true);
  const { width } = useWindowDimensions();

  const {
    fontSize,
    fontFamily,
    lineHeight,
    paddingHorizontal,
    textAlign,
    isDarkMode,
  } = useReaderStore();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const colors = {
    background: isDarkMode ? "#090910" : "rgb(255, 255, 255)",
    text: isDarkMode ? "#E7E9EA" : "#333333",
    title: isDarkMode ? "#F7F9F9" : "#000000",
  };

  const actualPadding =
    paddingHorizontal === 3 ? 28 : paddingHorizontal === 2 ? 18 : 14;
  const actualLineHeight =
    fontSize * (lineHeight === 3 ? 1.8 : lineHeight === 2 ? 1.5 : 1.2);

  const handleOpenSheet = (type: SheetType) => {
    // setIsMenuVisible(false);
    setActiveSheet(type);
    bottomSheetRef.current?.expand();
  };

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      setIsMenuVisible(!isMenuVisible);
    })
    .runOnJS(true);

  const tagsStyles = {
    p: {
      fontSize: fontSize,
      fontFamily: `${fontFamily}`, // Fontun çalışması için projedeki isimle eşleşmeli
      lineHeight: actualLineHeight,
      textAlign: textAlign as any,
      marginBottom: 30,
      color: colors.text,
      fontWeight: "600" as const,
    },
    strong: { fontWeight: "bold" as const, color: colors.text },
    em: { fontStyle: "italic" as const, color: colors.text },
  };

  return (
    <Screen
      style={[styles.container, { backgroundColor: colors.background }] as any}
    >
      <GestureDetector gesture={tapGesture}>
        <ScrollView
          style={styles.scrollView}
          // Padding'i buraya contentContainerStyle olarak verdik ki scroll her yeri kapsasın
          contentContainerStyle={{
            paddingHorizontal: actualPadding,
            paddingTop: 40,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              styles.title,
              { color: colors.title, fontFamily: `${fontFamily}-Bold` },
            ]}
          >
            {chapterData?.title}
          </Text>

          <RenderHtml
            contentWidth={width - actualPadding}
            source={{ html: chapterData?.content || "" }}
            tagsStyles={tagsStyles}
            systemFonts={[
              `${fontFamily}`,
              `${fontFamily}-Medium`,
              `${fontFamily}-Bold`,
              "Merriweather",
              "Merriweather-Medium",
              "Merriweather-Bold",
            ]} // Özel fontları buraya kaydetmelisin
          />
        </ScrollView>
      </GestureDetector>

      <BottomMenu
        isMenuVisible={isMenuVisible}
        handleOpenSheet={handleOpenSheet}
      />
      <ChapterBottomSheet activeSheet={activeSheet} ref={bottomSheetRef} />
    </Screen>
  );
};

export default ChapterReadScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
