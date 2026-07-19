import { CommentCardFull } from "@/components/CommentCardFull";
import { Header } from "@/components/Header";
import { RootStackParamList } from "@/constants/navigation";
import { CommentSort } from "@/Features/CommentScreen/CommentSort";
import { EmptyComments } from "@/Features/CommentScreen/EmptyComments";
import { MyComment } from "@/Features/CommentScreen/MyComment";
import { WriteCommentButton } from "@/Features/CommentScreen/WriteCommentButton";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useInfiniteComments } from "@/hooks/useInfiniteComments";
import useMyCommentQuery from "@/hooks/useMyCommentQuery";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { useAuthStore } from "@/store/useAuthStore";
import { CommentSortType } from "@/types/comment";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CommentScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Comment">>();
  const { id, isCommentTextOpen } = route.params;
  const navigation = useAppNavigation();
  const { requireAuth } = useRequireAuthAction();
  const [sort, setSort] = useState<CommentSortType>("newest");

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteComments({ novelId: id, limit: 10, sort });

  const { data: myComment, isLoading: isMyCommentLoading } =
    useMyCommentQuery(id);
  const isAuthenticated = useAuthStore((state) => state.user) !== null;

  const openWriteReview = useCallback(() => {
    requireAuth(
      () => navigation.navigate("WriteReview", { novelId: id }),
      "Yorum yazmak için giriş yapmalısın.",
    );
  }, [id, navigation, requireAuth]);

  useEffect(() => {
    if (isCommentTextOpen) {
      openWriteReview();
    }
  }, [isCommentTextOpen, openWriteReview]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <CommentCardFull novelId={id} comment={item} />
    ),
    [id],
  );

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  if (isLoading && isMyCommentLoading) {
    return (
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Yorumlar yükleniyor...
      </Text>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      <Header title={`Yorumlar (${data?.total || 0})`} isAdjacent={false} />
      <CommentSort selected={sort} onChange={setSort} />
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
        getItemLayout={(_data, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
      />

      {isAuthenticated && !myComment && (
        <WriteCommentButton onPress={openWriteReview} />
      )}
      {data?.items.length === 0 && <EmptyComments hasMyComment={!!myComment} />}
    </SafeAreaView>
  );
};

export default CommentScreen;
