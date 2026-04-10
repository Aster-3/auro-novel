import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";

import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { ReplyHeader } from "@/Features/ReplyScreen/ReplyHeader";
import { ReplyItem } from "@/Features/ReplyScreen/ReplyItem";
import { ReplyParent } from "@/Features/ReplyScreen/ReplyParent";
import { WriteReply } from "@/Features/ReplyScreen/WriteReply";
import { useDeleteReplyMutation } from "@/hooks/useDeleteReplyMutation copy";
import { useInfiniteReplies } from "@/hooks/useInfiniteReplies";
import { useOneCommentQuery } from "@/hooks/useOneCommentQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { Reply } from "@/types/reply";
import { Header } from "@/components/Header";

const ReplyScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Reply">>();
  const user = useAuthStore((state) => state.user);

  // Parametreleri al (Navigation'dan sadece ID'leri çekmek en sağlıklısıdır)
  const { commentId, novelId } = route.params;

  // 1. Ana Yorum Verisini Çek (Cache'den veya API'den)
  const { data: comment, isLoading: isCommentLoading } =
    useOneCommentQuery(commentId);

  // 2. Yanıtlar Listesini Çek (enabled: !!comment ile comment gelene kadar beklemesini sağlıyoruz)
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: isRepliesLoading,
  } = useInfiniteReplies({
    commentId: commentId,
  });

  const { mutate } = useDeleteReplyMutation(commentId, novelId);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null);

  const openReplySheet = useCallback((replyData: Reply | null) => {
    setSelectedReply(replyData);
    bottomSheetRef.current?.expand();
  }, []);

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
    <Screen style={{ paddingHorizontal: 12, gap: 16 }}>
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
          paddingBottom: 100, // Klavye ve input payı için artırıldı
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

      <WriteReply
        novelId={novelId}
        ref={bottomSheetRef}
        commentId={commentId}
        selectedReply={selectedReply}
      />
    </Screen>
  );
};

export default ReplyScreen;
