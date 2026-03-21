import React, { useRef, useCallback } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigation";

import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";

import { NovelHeader } from "@/Features/NovelScreen/Header";
import { NovelMetaData } from "@/Features/NovelScreen/NovelMetadata";
import { NovelSummary } from "@/Features/NovelScreen/NovelSummary";
import { NovelChapters } from "@/Features/NovelScreen/Chapters";
import { NovelComments } from "@/Features/NovelScreen/NovelComments";
import { SimilarNovels } from "@/Features/NovelScreen/SimilarNovels";
import { NovelNavCard } from "@/Features/NovelScreen/NovelNavCard";
import { ChapterSheet } from "@/Features/NovelScreen/ChapterSheet";

import { DUMMY_COMMENTS } from "@/constants/seed";
import { useNovelDetail } from "@/hooks/useNovelDetail";
import { NovelSkeleton } from "@/Features/NovelScreen/NovelSkeleton";
import { LinearGradient } from "expo-linear-gradient";

const SECTIONS = [
  { key: "summary" },
  { key: "chapters" },
  { key: "comments" },
  { key: "similar" },
];

const NovelScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Novel">>();
  const { id } = route.params;

  const { data, isLoading, error } = useNovelDetail(id);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openChapterSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: { key: string } }) => {
      if (!data) return null;

      switch (item.key) {
        case "summary":
          return <NovelSummary tags={data.tags} summary={data.synopsis} />;
        case "chapters":
          return <NovelChapters id={id} openChapterSheet={openChapterSheet} />;
        case "comments":
          return <NovelComments novelId={id} />;
        case "similar":
          return <SimilarNovels />;
        default:
          return null;
      }
    },
    [data, id, openChapterSheet],
  );

  if (isLoading || error || !data) return <NovelSkeleton />;
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Image
          source={data.coverImage}
          style={StyleSheet.absoluteFillObject}
          blurRadius={10}
          contentFit="cover"
          transition={500}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.4)" },
          ]}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <SafeAreaView edges={["top"]} style={styles.headerContainer}>
          <NovelHeader />

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

      <SafeAreaView edges={["bottom"]} style={styles.contentContainer}>
        <FlatList
          data={SECTIONS}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={true}
        />
      </SafeAreaView>

      <NovelNavCard />

      <ChapterSheet id={id} ref={bottomSheetRef} />
    </View>
  );
};

export default NovelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 50,
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
    marginTop: -32,
    backgroundColor: "white",
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingHorizontal: 20,
    overflow: "hidden",
  },

  scrollContent: {
    gap: 20,
    paddingBottom: 80,
    paddingTop: 16,
  },
});
