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
import { useQueryClient } from "@tanstack/react-query";
import { getChapterDetail } from "@/services/ChapterService";
import { LockedContentOverlay } from "@/Features/ChapterReadScreen/LockContentOverlay";

// Route tipini tanımlayalım
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
  const scrollViewRef = useRef<ScrollView>(null);

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
  const queryClient = useQueryClient();

  const colors = {
    background: isDarkMode ? "#090910" : "rgb(255, 255, 255)",
    text: isDarkMode ? "#ffffff" : "#606060",
    title: isDarkMode ? "#ffffff" : "#09244B",
  };

  // --- KRİTİK DÜZELTME: Animasyon ve Mount Mantığı ---
  useEffect(() => {
    // Sayfa her açıldığında scroll'un ve pan'ın sıfırlanmasını garanti et
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    translateX.value = 0;
  }, []);

  useEffect(() => {
    if (!isLoading && chapterData?.content) {
      // Veri cache'den anında gelse bile, gözün o titremeyi görmemesi için
      // 0'dan 1'e yumuşakça (fade-in) çıkartıyoruz.
      contentOpacity.value = withTiming(1, { duration: 350 });
    } else {
      contentOpacity.value = 0;
    }
  }, [isLoading, chapterData?.content]);

  // --- PREFETCH MANTIĞI ---
  useEffect(() => {
    const nextId = chapterData?.nextChapterId;

    if (nextId) {
      queryClient.prefetchQuery({
        queryKey: ["chapterDetail", nextId],
        queryFn: () => getChapterDetail(nextId),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [chapterData?.nextChapterId, queryClient]);

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
        const threshold = width * 0.2;
        const prevId = chapterData?.previousChapterId;
        const nextId = chapterData?.nextChapterId;

        if (event.translationX > threshold && prevId) {
          translateX.value = withTiming(width, { duration: 250 }, () => {
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

      {/* KÜÇÜK TITLE (Artık bu da Fade-in animasyonuna dahil) */}
      <Animated.View
        style={[{ height: 30, justifyContent: "center" }, contentFadeStyle]}
      >
        <Text style={[styles.followingText, { color: colors.text }]}>
          {chapterData
            ? `0${chapterData.chapterOrder}. ${chapterData.title}`
            : " "}
        </Text>
      </Animated.View>

      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            { flex: 1, backgroundColor: colors.background },
            mainAnimatedStyle,
          ]}
        >
          {isLoading || !chapterData?.content ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={colors.text} size="small" />
            </View>
          ) : (
            <Animated.View style={[{ flex: 1 }, contentFadeStyle]}>
              <ScrollView
                ref={scrollViewRef}
                scrollEnabled={chapterData?.isLocked ? false : true}
                style={styles.scrollView}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: actualPadding,
                  paddingTop: 20,
                  paddingBottom: 80,
                  backgroundColor: colors.background,
                }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={StyleSheet.flatten([
                    styles.title,
                    { color: colors.title, fontFamily: `${fontFamily}-Bold` },
                  ])}
                >
                  {chapterData?.title}
                </Text>

                <RenderHtml
                  contentWidth={width - actualPadding * 2}
                  source={{ html: chapterData?.content || "" }}
                  tagsStyles={tagsStyles}
                  systemFonts={[
                    fontFamily,
                    `${fontFamily}-Medium`,
                    `${fontFamily}-Bold`,
                    "Merriweather",
                  ]}
                />
                <SlideForNextChapter
                  novelStatus={chapterData?.novelStatus}
                  lastChapterAvailable={!!chapterData?.nextChapterId}
                />
              </ScrollView>
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
      {chapterData?.isLocked && (
        <LockedContentOverlay
          onUnlock={() => {
            console.log("Bölüm satın alma işlemi tetiklendi");
          }}
          sunPrice={5}
          nightPrice={10}
        />
      )}

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
    flex: 1,
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
    paddingHorizontal: 14,
  },
});
