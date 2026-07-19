import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

import { Header } from "@/components/Header";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { ReplyItem } from "@/Features/ReplyScreen/ReplyItem";
import { ReplyParent } from "@/Features/ReplyScreen/ReplyParent";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useDeleteReplyMutation } from "@/hooks/useDeleteReplyMutation";
import { useInfiniteReplies } from "@/hooks/useInfiniteReplies";
import { useOneCommentQuery } from "@/hooks/useOneCommentQuery";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { useAuthStore } from "@/store/useAuthStore";
import { Reply } from "@/types/reply";

const ReplyScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Reply">>();
  const navigation = useAppNavigation();
  const user = useAuthStore((state) => state.user);
  const { requireAuth } = useRequireAuthAction();
  const { commentId, novelId } = route.params;

  const { data: comment, isLoading: isCommentLoading } =
    useOneCommentQuery(commentId);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isRepliesLoading,
  } = useInfiniteReplies({
    commentId,
  });

  const { mutate } = useDeleteReplyMutation(commentId, novelId);

  const openReplySheet = useCallback(
    (replyData: Reply | null) => {
      requireAuth(
        () =>
          navigation.navigate("WriteReply", {
            commentId,
            novelId,
            parentReplyId: replyData?.id ?? null,
            replyToNickname:
              replyData?.user.nickname ?? comment?.user.nickname ?? null,
            replyPreview: replyData?.content ?? comment?.content ?? null,
          }),
        "Yanıt yazmak için giriş yapmalısın.",
      );
    },
    [comment?.content, comment?.user.nickname, commentId, navigation, novelId, requireAuth],
  );

  const handleDeleteReply = useCallback(
    (replyId: number) => {
      mutate(replyId);
    },
    [mutate],
  );

  const memoizedHeader = useMemo(() => {
    if (!comment) return null;
    return (
      <View style={{ gap: 12, marginBottom: 10 }}>
        <ReplyParent
          openReplySheet={openReplySheet}
          comment={comment}
          novelId={novelId}
        />
      </View>
    );
  }, [comment, novelId, openReplySheet]);

  if (isCommentLoading || isRepliesLoading) {
    return (
      <Screen style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1c1c53" />
        <Text style={{ marginTop: 10 }}>Yükleniyor...</Text>
      </Screen>
    );
  }

  if (!comment) {
    return (
      <Screen style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>Yorum bulunamadı.</Text>
      </Screen>
    );
  }

  return (
    <Screen style={{ paddingHorizontal: 12 }}>
      <Header title={`Yanıtlar (${data?.total || 0})`} isAdjacent={false} />

      <FlatList
        data={data?.items || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: reply }) => {
          const isMine = reply.user.id === user?.id;
          return (
            <ReplyItem
              onDelete={isMine ? () => handleDeleteReply(reply.id) : undefined}
              openReplySheet={openReplySheet}
              reply={reply}
              rootCommentId={commentId}
            />
          );
        }}
        ListHeaderComponent={memoizedHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          borderRadius: 24,
          gap: 8,
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: "center", color: "#94A3B8" }}>
              Henüz kimse cevap vermemiş...
            </Text>
          </View>
        }
      />
    </Screen>
  );
};

export default ReplyScreen;
