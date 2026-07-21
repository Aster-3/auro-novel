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

// --- REANIMATED IMPORTLARI ---
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getChapterDetail } from "@/services/ChapterService";
import { useMutateReadStats } from "@/hooks/useMutateReadStats";
import { isPremiumActive, useAuthStore } from "@/store/useAuthStore";
import {
  getAdjacentDownloadedChapterIds,
  getDownloadedChapterById,
} from "@/db/offlineChaptersDb";
import {
  ChapterInterstitialAd,
  ChapterInterstitialAdRef,
} from "@/components/ads/ChapterInterstitialAd";
import { NativeAdCard } from "@/components/ads/NativeAdBanner";

interface RouteParams {
  params: {
    id: string;
    chapterProgress?: number;
    isOffline?: boolean;
  };
}

export type SheetType = "SETTINGS" | "TOC" | "MORE" | null;

const ChapterReadScreen = ({ route }: { route: RouteParams }) => {
  const { id, chapterProgress, isOffline } = route.params;
  const [selectedId, setId] = useState(id);
  const user = useAuthStore((state) => state.user);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const canReadOffline = !!user?.id && isPremiumActive(isPremium, premiumUntil);
  const { data: onlineChapterData, isLoading: isOnlineLoading } =
    useGetOneChapter(selectedId, !isOffline);
  const { data: offlineChapterData, isLoading: isOfflineLoading } = useQuery({
    queryKey: ["downloadedChapter", selectedId],
    queryFn: async () => {
      if (!user?.id || !canReadOffline) return null;

      const [chapter, adjacent] = await Promise.all([
        getDownloadedChapterById(user.id, selectedId),
        getAdjacentDownloadedChapterIds(user.id, selectedId),
      ]);

      if (!chapter) return null;

      return {
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        novelId: chapter.novelId,
        volumeOrder: chapter.volumeOrder,
        volumeTitle: chapter.volumeName,
        nextChapterId: adjacent.nextChapterId,
        previousChapterId: adjacent.previousChapterId,
        novelStatus: undefined,
      };
    },
    enabled: !!isOffline && canReadOffline,
  });
  const chapterData = isOffline ? offlineChapterData : onlineChapterData;
  const isLoading = isOffline ? isOfflineLoading : isOnlineLoading;

  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const chapterInterstitialRef = useRef<ChapterInterstitialAdRef>(null);

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
    chapterData?.novelId ?? "",
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

  const handleOpenSheet = useCallback((type: SheetType) => {
    setActiveSheet(type);
    bottomSheetRef.current?.expand();
  }, []);

  const changeChapter = useCallback(
    (chapterId: string) => {
      if (chapterId === selectedId) return;

      const commitChapterChange = () => {
        setId(chapterId);
      };

      if (isOffline) {
        commitChapterChange();
        return;
      }

      if (!chapterInterstitialRef.current) {
        commitChapterChange();
        return;
      }

      chapterInterstitialRef.current.showBeforeContinue(commitChapterChange);
    },
    [isOffline, selectedId],
  );

  const selectChapter = useCallback(
    (chapterId: string) => {
      bottomSheetRef.current?.close();
      changeChapter(chapterId);
    },
    [changeChapter],
  );

  useEffect(() => {
    contentOpacity.value = 0;
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    translateX.value = 0;

    setIsMenuVisible(false);
    bottomSheetRef.current?.close();
    hasScrolledToInitialProgress.current = false;
  }, [selectedId, contentOpacity, translateX]);

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
    paddingHorizontal === 3 ? 16 : paddingHorizontal === 2 ? 12 : 8;
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
            runOnJS(changeChapter)(prevId);
          });
        } else if (event.translationX < -threshold && nextId) {
          translateX.value = withTiming(-width, { duration: 250 }, () => {
            runOnJS(changeChapter)(nextId);
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
    changeChapter,
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

      if (
        !isOffline &&
        elapsedTime > 15 &&
        user &&
        chapterData?.novelId &&
        chapterData?.id
      ) {
        updateReadingStats({
          novelId: chapterData.novelId,
          lastReadChapterId: chapterData.id,
          lastChapterProgress: currentProgress,
          incrementTime: elapsedTime,
        });
      }
    };
  }, [chapterData?.id, chapterData?.novelId, updateReadingStats, user]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    scrollOffset.current = contentOffset.y;
    contentHeight.current = contentSize.height - layoutMeasurement.height;
  };

  const windowHeight = useWindowDimensions().height;

  if (isOffline && !canReadOffline) {
    return (
      <Screen
        style={
          [styles.container, { backgroundColor: colors.background }] as any
        }
      >
        <View style={styles.lockedOfflineContainer}>
          <Text style={[styles.lockedOfflineTitle, { color: colors.title }]}>
            Offline okuma kilitli
          </Text>
          <Text style={[styles.lockedOfflineText, { color: colors.text }]}>
            İndirilen bölümleri okumak için aktif Auro Pass hesabıyla giriş
            yapmalısın.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      style={[styles.container, { backgroundColor: colors.background }] as any}
    >
      {!isOffline && <ChapterInterstitialAd ref={chapterInterstitialRef} />}
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
                scrollEnabled={true}
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
                {!isOffline && (
                  <View style={styles.nativeAdWrapper}>
                    <NativeAdCard placement="chapter-end" />
                  </View>
                )}
                {!isOffline && (
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

      {!isOffline && (
        <>
          <BottomMenu
            isMenuVisible={isMenuVisible}
            handleOpenSheet={handleOpenSheet}
            chapterId={chapterData?.id ?? selectedId}
          />
          <ChapterBottomSheet
            chapterId={chapterData?.id!}
            novelId={chapterData?.novelId!}
            activeSheet={activeSheet}
            ref={bottomSheetRef}
            selectChapter={selectChapter}
          />
        </>
      )}
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
  lockedOfflineContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  lockedOfflineTitle: {
    fontFamily: "Mont-700",
    fontSize: 18,
    textAlign: "center",
  },
  lockedOfflineText: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  nativeAdWrapper: {
    marginTop: 4,
    marginBottom: 18,
  },
});
