import React, { useRef, useState } from "react";
import { Text, StyleSheet } from "react-native";
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

export type SheetType = "SETTINGS" | "TOC" | "MORE" | null;

const ChapterReadScreen = ({ route }: any) => {
  const { id } = route.params;
  const { data: chapterData } = useGetOneChapter(id, true);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const [activeSheet, setActiveSheet] = useState<SheetType>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenSheet = (type: SheetType) => {
    setIsMenuVisible(false);
    setActiveSheet(type);
    bottomSheetRef.current?.expand();
  };

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      setIsMenuVisible(!isMenuVisible);
    })
    .runOnJS(true);

  return (
    <Screen style={styles.container}>
      <GestureDetector gesture={tapGesture}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{chapterData?.title}</Text>
          <Text style={styles.content}>{chapterData?.content}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "Mont-500",
    paddingBottom: 100, // Alt menü geldiğinde metnin kapanmaması için
  },
});
