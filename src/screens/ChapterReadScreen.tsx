import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Text,
  StyleSheet,
  useWindowDimensions,
  View,
  StatusBar,
  ActivityIndicator,
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
import { CoinType } from "@/types/wallet";
import { usePurchaseChapter } from "@/hooks/usePurchaseChapter";
import { useMutateReadStats } from "@/hooks/useMutateReadStats";

interface RouteParams {
  params: {
    id: string;
    chapterProgress?: number;
  };
}

export type SheetType = "SETTINGS" | "TOC" | "MORE" | null;

const ChapterReadScreen = ({ route }: { route: RouteParams }) => {
  const { id, chapterProgress } = route.params;
  const [selectedId, setId] = useState(id);
  const { data: chapterData, isLoading } = useGetOneChapter(selectedId, true);
  const { mutate: purchaseChapter } = usePurchaseChapter(selectedId);

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
  const { mutate: updateReadingStats } = useMutateReadStats(
    chapterData?.novelId,
  );

  const colors = useMemo(
    () => ({
      background: isDarkMode ? "#07070e" : "rgb(255, 255, 255)",
      text: isDarkMode ? "#d3d3d3" : "#282727",
      title: isDarkMode ? "#E0E0E0" : "#09244B",
    }),
    [isDarkMode],
  );

  // Handler'ları useCallback ile sarmaladık
  const toggleMenu = useCallback(() => {
    setIsMenuVisible((prev) => !prev);
  }, []);

  const selectChapter = useCallback((chapterId: string) => {
    setId(chapterId);
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenSheet = useCallback((type: SheetType) => {
    setActiveSheet(type);
    bottomSheetRef.current?.expand();
  }, []);

  const handleUnlockChapter = useCallback(
    (coinType: CoinType) => {
      purchaseChapter(coinType);
    },
    [purchaseChapter],
  );

  useEffect(() => {
    contentOpacity.value = 0;
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    translateX.value = 0;

    setIsMenuVisible(false);
    bottomSheetRef.current?.close();
    hasScrolledToInitialProgress.current = false;
  }, [id, contentOpacity, translateX]);

  useEffect(() => {
    if (!isLoading && chapterData?.content) {
      contentOpacity.value = withTiming(1, { duration: 350 });
    } else {
      contentOpacity.value = 0;
    }
  }, [isLoading, chapterData?.content, contentOpacity]);

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
    paddingHorizontal === 3 ? 20 : paddingHorizontal === 2 ? 16 : 12;
  const actualLineHeight =
    fontSize * (lineHeight === 3 ? 1.8 : lineHeight === 2 ? 1.5 : 1.2);

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

  const composedGesture = useMemo(() => {
    const panGesture = Gesture.Pan()
      .activeOffsetX([-20, 20])
      .onUpdate((event) => {
        "worklet"; // İşlemlerin sadece UI thread'de kalmasını garantiler
        if (event.translationX > 0 && !chapterData?.previousChapterId) {
          translateX.value = event.translationX * 0.2;
        } else if (event.translationX < 0 && !chapterData?.nextChapterId) {
          translateX.value = event.translationX * 0.2;
        } else {
          translateX.value = event.translationX;
        }
      })
      .onEnd((event) => {
        "worklet";
        const threshold = width * 0.2;
        const prevId = chapterData?.previousChapterId;
        const nextId = chapterData?.nextChapterId;

        if (event.translationX > threshold && prevId) {
          translateX.value = withTiming(width, { duration: 250 }, () => {
            runOnJS(navigation.replace)("ChapterRead", { id: prevId });
          });
        } else if (event.translationX < -threshold && nextId) {
          translateX.value = withTiming(-width, { duration: 250 }, () => {
            runOnJS(navigation.replace)("ChapterRead", { id: nextId });
          });
        } else {
          translateX.value = withTiming(0, { duration: 200 });
        }
      });

    const tapGesture = Gesture.Tap()
      .numberOfTaps(1)
      .onEnd(() => {
        "worklet";
        runOnJS(toggleMenu)();
      });

    return Gesture.Exclusive(panGesture, tapGesture);
  }, [
    chapterData?.previousChapterId,
    chapterData?.nextChapterId,
    width,
    navigation,
    translateX,
    toggleMenu,
  ]);

  const hasScrolledToInitialProgress = useRef(false);

  const tagsStyles: Record<string, MixedStyleDeclaration> = useMemo(
    () => ({
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
    }),
    [fontSize, fontFamily, actualLineHeight, textAlign, colors.text],
  );

  const systemFonts = useMemo(
    () => [
      fontFamily,
      `${fontFamily}-Medium`,
      `${fontFamily}-Bold`,
      "Merriweather",
    ],
    [fontFamily],
  );

  const littleTitle = chapterData?.volumeTitle
    ? `${chapterData.volumeTitle}: ${chapterData.title}`
    : `Cilt ${chapterData?.volumeOrder}: ${chapterData?.title}`;

  const startTimeRef = useRef<number>(0);
  const scrollOffset = useRef<number>(0);
  const contentHeight = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      const endTime = Date.now();
      const elapsedTime = Math.floor((endTime - startTimeRef.current) / 1000);

      const currentProgress =
        contentHeight.current > 0
          ? Math.min(scrollOffset.current / contentHeight.current, 1)
          : 0;

      console.log("ChapterReadScreen Unmounted - Sync Stats:", {
        id: chapterData?.id,
        title: chapterData?.title,
        elapsedTime,
        progress: parseFloat(currentProgress.toFixed(2)),
      });

      if (elapsedTime > 15) {
        updateReadingStats({
          novelId: chapterData?.novelId!,
          lastReadChapterId: chapterData?.id!,
          lastChapterProgress: currentProgress,
          incrementTime: elapsedTime,
        });
      }
    };
  }, [chapterData?.id]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    scrollOffset.current = contentOffset.y;
    contentHeight.current = contentSize.height - layoutMeasurement.height;
  };

  const windowHeight = useWindowDimensions().height;

  return (
    <Screen
      style={[styles.container, { backgroundColor: colors.background }] as any}
    >
      <StatusBar hidden={true} animated />

      <Animated.View
        style={[
          { height: 30, justifyContent: "center" },
          contentFadeStyle,
          mainAnimatedStyle,
        ]}
      >
        <Text style={[styles.followingText, { color: colors.text }]}>
          {littleTitle}
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
                onContentSizeChange={(w, h) => {
                  if (
                    chapterProgress &&
                    !hasScrolledToInitialProgress.current &&
                    h > 0
                  ) {
                    const scrollableHeight = h - windowHeight;

                    const scrollToY = Math.max(
                      0,
                      scrollableHeight * chapterProgress + 30,
                    );

                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({
                        y: scrollToY,
                        animated: false,
                      });
                      hasScrolledToInitialProgress.current = true;
                    }, 100);
                  }
                  contentHeight.current = h;
                }}
                onScroll={handleScroll}
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
                  style={[
                    styles.title,
                    { color: colors.title, fontFamily: `${fontFamily}-Bold` },
                  ]}
                >
                  {chapterData?.title}
                </Text>

                <RenderHtml
                  contentWidth={width - actualPadding * 2}
                  source={{ html: chapterData?.content || "" }}
                  tagsStyles={tagsStyles}
                  systemFonts={systemFonts}
                />
                {!chapterData?.isLocked && (
                  <SlideForNextChapter
                    novelStatus={chapterData?.novelStatus}
                    lastChapterAvailable={!!chapterData?.nextChapterId}
                  />
                )}
              </ScrollView>
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>

      {chapterData?.isLocked && (
        <LockedContentOverlay
          onUnlock={handleUnlockChapter}
          premiumPrice={chapterData.premiumPrice}
          freemiumPrice={chapterData.freemiumPrice}
          isDiscountActive={chapterData.isDiscountActive}
          discountRate={chapterData.discountRate}
          discountedEndDate={chapterData.discountedEndDate}
          discountedPremiumPrice={chapterData.discountedPremiumPrice}
          translateX={translateX}
        />
      )}

      <BottomMenu
        isMenuVisible={isMenuVisible}
        handleOpenSheet={handleOpenSheet}
      />
      <ChapterBottomSheet
        chapterId={chapterData?.id!}
        novelId={chapterData?.novelId!}
        activeSheet={activeSheet}
        ref={bottomSheetRef}
        selectChapter={selectChapter}
      />
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
