import { ChapterItem } from "@/components/ChapterItem";
import { ChapterReverseIcon } from "@/components/icons/ChapterReverseIcon";
import { useInfiniteChapters } from "@/hooks/useInfiniteChapters";
import { Chapter } from "@/types/chapter";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

export const ChapterSheet = forwardRef((props: { id: string }, ref) => {
  const { id } = props;
  const {
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteChapters({ id, limit: 10 });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const [isShortTypeNew, setIsShortTypeNew] = useState(true);

  const chapters = useMemo(() => {
    const allChapters = data?.pages.flatMap((page) => page.data) || [];
    return isShortTypeNew ? allChapters : [...allChapters].reverse();
  }, [data, isShortTypeNew]);

  useImperativeHandle(ref, () => ({
    expand: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },
  }));

  const renderItem = ({ item }: { item: Chapter }) => (
    <ChapterItem key={item.id} chapter={item} />
  );

  if (isLoading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
    >
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.title}>{data?.pages[0]?.count || 0} Bölüm</Text>
        <TouchableOpacity
          onPress={() => setIsShortTypeNew(!isShortTypeNew)}
          style={{
            transform: [{ rotate: isShortTypeNew ? "0deg" : "180deg" }],
          }}
        >
          <ChapterReverseIcon />
        </TouchableOpacity>
      </View>

      <BottomSheetFlatList
        data={chapters}
        keyExtractor={(item: Chapter) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: 20 }} color="#03061E" />
          ) : (
            <View style={{ height: 40 }} />
          )
        }
      />
    </BottomSheet>
  );
});

const styles = {
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  } as ViewStyle,
  title: {
    fontFamily: "Mont-600",
    fontSize: 15,
    color: "#03061E",
  } as TextStyle,
};
