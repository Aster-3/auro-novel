import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  useWindowDimensions,
  View,
  StatusBar,
  ActivityIndicator,
  TextStyle,
} from "react-native";
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
import RenderHtml, { MixedStyleDeclaration } from "react-native-render-html";
import { useReaderStore } from "@/store/useReaderStore";
import { SlideForNextChapter } from "@/Features/ChapterReadScreen/SlideForNextChapter";
import { useAppNavigation } from "@/hooks/useAppNavigation";

// --- REANIMATED IMPORTLARI ---
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

// Route tipini tanımlayalım (any'den kurtulmak için)
interface RouteParams {
  params: {
    id: string;
  };
}

export type SheetType = "SETTINGS" | "TOC" | "MORE" | null;

const ChapterReadScreen = ({ route }: { route: RouteParams }) => {
  const { id } = route.params;
  const { data: chapterData, isLoading } = useGetOneChapter(id, true);

  const { width } = useWindowDimensions();
  const navigation = useAppNavigation();

  const translateX = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

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

  useEffect(() => {
    translateX.value = 0;
    contentOpacity.value = 0;
    if (!isLoading && chapterData?.content) {
      contentOpacity.value = withTiming(1, { duration: 400 });
    }
  }, [id, isLoading, chapterData?.content, translateX, contentOpacity]);

  const actualPadding =
    paddingHorizontal === 3 ? 28 : paddingHorizontal === 2 ? 18 : 14;
  const actualLineHeight =
    fontSize * (lineHeight === 3 ? 1.8 : lineHeight === 2 ? 1.5 : 1.2);

  const handleOpenSheet = (type: SheetType) => {
    setActiveSheet(type);
    bottomSheetRef.current?.expand();
  };

  // --- ANIMASYON STİLLERİ ---
  const mainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: interpolate(
      Math.abs(translateX.value),
      [0, width * 0.8],
      [1, 0.3],
    ),
  }));

  const contentFadeStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // --- GESTURE TANIMLAMASI ---
  const composedGesture = useMemo(() => {
    const panGesture = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onUpdate((event) => {
        if (event.translationX > 0 && !chapterData?.previousChapterId) {
          translateX.value = event.translationX * 0.2;
        } else if (event.translationX < 0 && !chapterData?.nextChapterId) {
          translateX.value = event.translationX * 0.2;
        } else {
          translateX.value = event.translationX;
        }
      })
      .onEnd((event) => {
        const threshold = width * 0.3;
        const prevId = chapterData?.previousChapterId;
        const nextId = chapterData?.nextChapterId;

        if (event.translationX > threshold && prevId) {
          translateX.value = withTiming(width, { duration: 250 }, () => {
            // "prevId!" kullanarak bunun kesinlikle string olduğunu TS'ye garanti ediyoruz
            runOnJS(navigation.replace)("ChapterRead", { id: prevId! });
          });
        } else if (event.translationX < -threshold && nextId) {
          translateX.value = withTiming(-width, { duration: 250 }, () => {
            runOnJS(navigation.replace)("ChapterRead", { id: nextId! });
          });
        } else {
          translateX.value = withTiming(0, { duration: 200 });
        }
      })
      .runOnJS(true);

    const tapGesture = Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(() => {
        runOnJS(setIsMenuVisible)(!isMenuVisible);
      })
      .runOnJS(true);

    return Gesture.Exclusive(panGesture, tapGesture);
  }, [chapterData, isMenuVisible, width, navigation, translateX]);

  // TagsStyles tipini MixedStyleDeclaration olarak belirterek hataları önledik
  const tagsStyles: Record<string, MixedStyleDeclaration> = {
    p: {
      fontSize: fontSize,
      fontFamily: fontFamily,
      lineHeight: actualLineHeight,
      textAlign: textAlign as any,
      marginBottom: 30,
      color: colors.text,
      fontWeight: "600",
    },
    strong: { fontWeight: "bold", color: colors.text },
    em: { fontStyle: "italic", color: colors.text },
  };

  return (
    <Screen
      style={StyleSheet.flatten([
        styles.container,
        { backgroundColor: colors.background },
      ])}
    >
      <StatusBar hidden={true} animated />

      <View style={{ height: 30, justifyContent: "center" }}>
        <Text style={styles.followingText}>
          {chapterData
            ? `0${chapterData.chapterOrder}. ${chapterData.title}`
            : " "}
        </Text>
      </View>

      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            { flex: 1, backgroundColor: colors.background },
            mainAnimatedStyle,
          ]}
        >
          <Animated.View style={[{ flex: 1 }, contentFadeStyle]}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{
                paddingHorizontal: actualPadding,
                paddingTop: 20,
                paddingBottom: 80,
                backgroundColor: colors.background,
              }}
              showsVerticalScrollIndicator={false}
            >
              {chapterData?.content ? (
                <>
                  <Text
                    style={StyleSheet.flatten([
                      styles.title,
                      { color: colors.title, fontFamily: `${fontFamily}-Bold` },
                    ])}
                  >
                    {chapterData?.title}
                  </Text>

                  <RenderHtml
                    contentWidth={width - actualPadding}
                    source={{ html: chapterData?.content || "" }}
                    tagsStyles={tagsStyles}
                    systemFonts={[
                      fontFamily,
                      `${fontFamily}-Medium`,
                      `${fontFamily}-Bold`,
                      "Merriweather",
                    ]}
                  />
                  <SlideForNextChapter />
                </>
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator color={colors.text} size="small" />
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </Animated.View>
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
  loaderContainer: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  followingText: {
    fontSize: 10,
    paddingBottom: 8,
    fontFamily: "Lato",
    color: "#828282",
    paddingHorizontal: 14,
  },
});
