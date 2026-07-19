import React, { useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  InteractionManager,
} from "react-native";
import { Image } from "expo-image";
import {
  RouteProp,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";

// Bileşenlerin
import { NovelHeader } from "@/Features/NovelScreen/Header";
import { NovelMetaData } from "@/Features/NovelScreen/NovelMetadata";
import { NovelSummary } from "@/Features/NovelScreen/NovelSummary";
import { NovelChapters } from "@/Features/NovelScreen/Chapters";
import { NovelComments } from "@/Features/NovelScreen/NovelComments";
import { SimilarNovels } from "@/Features/NovelScreen/SimilarNovels";
import { NovelNavCard } from "@/Features/NovelScreen/NovelNavCard";
import { ChapterSheet } from "@/Features/NovelScreen/ChapterSheet";
import { NovelSkeleton } from "@/Features/NovelScreen/NovelSkeleton";

// Hooklar
import { useNovelDetail } from "@/hooks/useNovelDetail";
import { useIncrementNovelView } from "@/hooks/useIncrementNovelView";
import { useAppTheme } from "@/hooks/useTheme";
import { useOfflineChapterDownloads } from "@/hooks/useOfflineChapterDownloads";
import { categories } from "@/constants/seed";

const SECTIONS = [
  { key: "summary" },
  { key: "chapters" },
  { key: "comments" },
  { key: "similar" },
];

const NovelScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Novel">>();
  const { id } = route.params;
  const [isReady, setIsReady] = React.useState(false);
  const { data, isLoading, error } = useNovelDetail(id);
  const { mutate: incrementViewCount } = useIncrementNovelView(id);
  const offlineDownloads = useOfflineChapterDownloads(id);

  // Tema Renkleri
  const { theme } = useAppTheme();

  React.useEffect(() => {
    if (id) {
      incrementViewCount();
    }
  }, [id]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openChapterSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: { key: string } }) => {
      if (!data) return null;
      switch (item.key) {
        case "summary":
          return (
            <NovelSummary
              tags={data.tags}
              summary={data.synopsis}
              isAdultContent={data.isAdultContent}
            />
          );
        case "chapters":
          return (
            <NovelChapters
              chapterCount={data.chapterCount}
              lastChapterDate={data.lastChapterDate}
              id={id}
              openChapterSheet={openChapterSheet}
            />
          );
        case "comments":
          return <NovelComments novelId={id} />;
        case "similar":
          return <SimilarNovels novelId={id} />;
        default:
          return null;
      }
    },
    [data, id, openChapterSheet],
  );

  React.useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (isLoading || error || !data || !isReady) return <NovelSkeleton />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Üst Kısım: Kapak ve Blur Efekti */}
      <View style={styles.headerWrapper}>
        <Image
          source={data.coverImage ?? undefined}
          style={StyleSheet.absoluteFillObject}
          blurRadius={12} // Bir tık artırıldı daha yumuşak geçiş için
          contentFit="cover"
          transition={500}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: theme.headerOverlay },
          ]}
        />
        <LinearGradient
          colors={theme.headerGradient as any}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView edges={["top"]} style={styles.headerContainer}>
          <NovelHeader novelData={data} />
          <NovelMetaData
            name={data.name}
            author={data.author}
            cover={data.coverImage}
            status={data.status}
            viewCount={data.viewCount}
            recommendRate={data.recommendationRate}
            genres={data.categories}
          />
        </SafeAreaView>
      </View>

      {/* Alt Kısım: İçerik FlatList */}
      <SafeAreaView
        edges={["bottom"]}
        style={[styles.contentContainer, { backgroundColor: theme.background }]}
      >
        <FlatList
          data={SECTIONS}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          initialNumToRender={4} // Sayfa dolana kadar render etsin
          removeClippedSubviews={true}
        />
      </SafeAreaView>

      {/* Sabit Navigasyon Kartı (Okumaya Başla vb.) */}
      <NovelNavCard
        novelId={id}
        firstPublishedChapterId={data.firstPublishedChapterId}
      />

      {/* Bölüm Listesi Sheet */}
      <ChapterSheet id={id} ref={bottomSheetRef} offlineDownloads={offlineDownloads} />
    </View>
  );
};

export default NovelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    width: "100%",
    paddingBottom: 60,
    paddingTop: 8,
    position: "relative",
  },
  headerContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    marginTop: -36, // Daha derin bir kıvrım
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingHorizontal: 20,
    overflow: "hidden", // Köşelerin FlatList altında kalmasını sağlar
  },
  scrollContent: {
    gap: 24,
    paddingBottom: 100, // NavCard için ekstra boşluk
    paddingTop: 24, // Kıvrımdan sonra metnin nefes alması için
  },
});
