import { CommentCardFull } from "@/components/CommentCardFull";
import { RootStackParamList } from "@/constants/navigation";
import { CommentHeader } from "@/Features/CommentScreen/CommentHeader";
import { CommentSort } from "@/Features/CommentScreen/CommentSort";
import { EmptyComments } from "@/Features/CommentScreen/EmptyComments";
import { MyComment } from "@/Features/CommentScreen/MyComment";
import { ReviewSheet } from "@/Features/CommentScreen/ReviewSheet";
import { WriteCommentButton } from "@/Features/CommentScreen/WriteCommentButton";
import { useInfiniteComments } from "@/hooks/useInfiniteComments";
import useMyCommentQuery from "@/hooks/useMyCommentQuery";
import BottomSheet from "@gorhom/bottom-sheet";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CommentScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Comment">>();
  const { id, isCommentTextOpen } = route.params;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteComments({ novelId: id, limit: 10 });

  const { data: myComment, isLoading: isMyCommentLoading } =
    useMyCommentQuery(id);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openChapterSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <CommentCardFull novelId={id} comment={item} />
    ),
    [id],
  );

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  if (isLoading && isMyCommentLoading) {
    return (
      <Text style={{ flex: 1, textAlign: "center", marginTop: 20 }}>
        Yorumlar yükleniyor...
      </Text>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}
    >
      <CommentHeader commentCount={data?.total || 0} />
      <CommentSort />
      {myComment && <MyComment novelId={id} comment={myComment} />}

      <FlatList
        data={data?.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 20, marginTop: 12 }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={7}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={false}
        getItemLayout={(data, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
      />

      {!myComment && <WriteCommentButton onPress={openChapterSheet} />}
      <ReviewSheet ref={bottomSheetRef} novelId={id} />
      {data?.items.length === 0 && <EmptyComments hasMyComment={!!myComment} />}
    </SafeAreaView>
  );
};

export default CommentScreen;
