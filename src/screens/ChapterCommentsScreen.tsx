import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { RouteProp, useRoute } from "@react-navigation/native";

import { Header } from "@/components/Header";
import { CommentLikeIcon } from "@/components/icons/CommentLikeIcon";
import { FlagIcon } from "@/components/icons/FlagIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import {
  useChapterCommentLikeMutation,
  useCreateChapterCommentMutation,
  useCreateChapterReplyMutation,
  useDeleteChapterCommentMutation,
  useInfiniteChapterCommentReplies,
  useInfiniteChapterComments,
} from "@/hooks/useChapterComments";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { useAppTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { ChapterComment } from "@/types/chapterComment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { getProfileImageSource } from "@/utils/profileImage";

type ReplyTarget = {
  rootCommentId: number;
  parentCommentId?: number;
  nickname: string;
  preview?: string | null;
};

const DELETED_TEXT = "Silinmis yorum";
const HORIZONTAL_PADDING = 14;
const KEYBOARD_GAP = 12;

const getDisplayContent = (comment: ChapterComment) => {
  if (comment.isDeleted || !comment.content) return DELETED_TEXT;
  return comment.content;
};

const Avatar = ({ uri }: { uri?: string | null }) => (
  <Image
    source={getProfileImageSource(uri)}
    style={styles.avatar}
    contentFit="cover"
    transition={150}
  />
);

const UserPressTarget = ({
  user,
  createdAt,
}: {
  user: ChapterComment["user"];
  createdAt: string;
}) => {
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();

  return (
    <Pressable
      style={styles.commentHeader}
      onPress={() => navigation.navigate("UserProfile", { userId: user.id })}
      hitSlop={6}
    >
      <Avatar uri={user.profileImageUrl} />
      <View style={styles.headerText}>
        <Text
          style={[styles.nickname, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {user.nickname}
        </Text>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {formatSmartDate(createdAt).toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
};

const ReplyList = memo(
  ({
    rootCommentId,
    openReply,
    onLike,
    onDelete,
    actionsColor,
    buttonBg,
    likeColor,
    deleteBg,
    deleteColor,
  }: {
    rootCommentId: number;
    openReply: (target: ReplyTarget) => void;
    onLike: (commentId: number) => void;
    onDelete: (comment: ChapterComment) => void;
    actionsColor: string;
    buttonBg: string;
    likeColor: string;
    deleteBg: string;
    deleteColor: string;
  }) => {
    const user = useAuthStore((state) => state.user);
    const { theme, isDarkMode } = useAppTheme();
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
      useInfiniteChapterCommentReplies(rootCommentId, true);

    if (isLoading) {
      return (
        <View style={styles.repliesLoading}>
          <ActivityIndicator size="small" color={theme.textSecondary} />
        </View>
      );
    }

    return (
      <View style={styles.replies}>
        {data?.items.map((reply) => {
          const isMine = reply.user.id === user?.id;
          const parentName = reply.parentComment?.isDeleted
            ? "silinmis"
            : reply.parentComment?.user.nickname;

          return (
            <View key={reply.id} style={styles.replyRow}>
              <View
                style={[
                  styles.replyLine,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "#E2E8F0",
                  },
                ]}
              />
              <View style={styles.replyBody}>
                <UserPressTarget
                  user={reply.user}
                  createdAt={reply.createdAt}
                />

                {parentName && (
                  <Text
                    style={[styles.replyingTo, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {parentName} kullanicisina yanit
                  </Text>
                )}

                <Text
                  style={[
                    styles.commentText,
                    reply.isDeleted && styles.deletedText,
                    { color: theme.textPrimary },
                  ]}
                >
                  {getDisplayContent(reply)}
                </Text>

                {!reply.isDeleted && (
                  <ActionRow
                    comment={reply}
                    onLike={onLike}
                    onReply={() =>
                      openReply({
                        rootCommentId,
                        parentCommentId: reply.id,
                        nickname: reply.user.nickname,
                        preview: reply.content,
                      })
                    }
                    onDelete={isMine ? () => onDelete(reply) : undefined}
                    canReport={!isMine}
                    actionsColor={actionsColor}
                    buttonBg={buttonBg}
                    likeColor={likeColor}
                    deleteBg={deleteBg}
                    deleteColor={deleteColor}
                  />
                )}
              </View>
            </View>
          );
        })}

        {hasNextPage && (
          <TouchableOpacity
            style={styles.moreRepliesButton}
            disabled={isFetchingNextPage}
            onPress={() => fetchNextPage()}
          >
            <Text style={[styles.moreRepliesText, { color: actionsColor }]}>
              {isFetchingNextPage ? "Yukleniyor..." : "Daha fazla yanit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const ActionRow = memo(
  ({
    comment,
    onLike,
    onReply,
    onDelete,
    canReport,
    actionsColor,
    buttonBg,
    likeColor,
    deleteBg,
    deleteColor,
  }: {
    comment: ChapterComment;
    onLike: (commentId: number) => void;
    onReply: () => void;
    onDelete?: () => void;
    canReport: boolean;
    actionsColor: string;
    buttonBg: string;
    likeColor: string;
    deleteBg: string;
    deleteColor: string;
  }) => {
    const navigation = useAppNavigation();

    const handleReportPress = () => {
      navigation.push("SupportFeedback", {
        initialType: "report",
        initialSubject: `Bölüm Yorumu Şikayeti | ${comment.user.nickname}: (Chapter Comment ID: ${comment.id}, Chapter ID: ${comment.chapterId})`,
        isSubjectDisable: true,
        isTypeDisable: true,
      });
    };

    return (
      <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.action, { backgroundColor: buttonBg }]}
        activeOpacity={0.7}
        onPress={() => onLike(comment.id)}
      >
        <CommentLikeIcon
          isLiked={comment.viewerHasLiked}
          color={comment.viewerHasLiked ? likeColor : actionsColor}
          size={15}
        />
        <Text
          style={[
            styles.actionText,
            { color: comment.viewerHasLiked ? likeColor : actionsColor },
          ]}
        >
          {comment.likeCount > 0 ? comment.likeCount : "BEGEN"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.action, { backgroundColor: buttonBg }]}
        activeOpacity={0.7}
        onPress={onReply}
      >
        <ReplyIcon color={actionsColor} size={15} />
        <Text style={[styles.actionText, { color: actionsColor }]}>
          YANITLA
        </Text>
      </TouchableOpacity>

      {canReport && (
        <TouchableOpacity
          style={[styles.iconAction, { backgroundColor: buttonBg }]}
          activeOpacity={0.7}
          onPress={handleReportPress}
        >
          <FlagIcon color={actionsColor} size={15} />
        </TouchableOpacity>
      )}

      {onDelete && (
        <TouchableOpacity
          style={[styles.action, { backgroundColor: deleteBg }]}
          activeOpacity={0.7}
          onPress={onDelete}
        >
          <TrashIcon color={deleteColor} size={14} />
          <Text style={[styles.actionText, { color: deleteColor }]}>SIL</Text>
        </TouchableOpacity>
      )}
    </View>
    );
  },
);

const CommentItem = memo(
  ({
    comment,
    isRepliesOpen,
    toggleReplies,
    openReply,
    onLike,
    onDelete,
  }: {
    comment: ChapterComment;
    isRepliesOpen: boolean;
    toggleReplies: (commentId: number) => void;
    openReply: (target: ReplyTarget) => void;
    onLike: (commentId: number) => void;
    onDelete: (comment: ChapterComment) => void;
  }) => {
    const user = useAuthStore((state) => state.user);
    const { theme, isDarkMode } = useAppTheme();
    const isMine = comment.user.id === user?.id;

    const cardColors = useMemo(
      () => ({
        border: isDarkMode ? "rgba(255,255,255,0.07)" : "#EDF2F7",
        actions: isDarkMode ? "#94A3B8" : "#64748B",
        buttonBg: isDarkMode ? "rgba(255,255,255,0.03)" : "#F8FAFC",
        like: isDarkMode ? "#7AA7FF" : "#0f3f92",
        deleteBg: isDarkMode
          ? "rgba(225, 29, 72, 0.08)"
          : "rgba(225, 29, 72, 0.05)",
        delete: "#BE123C",
      }),
      [isDarkMode],
    );

    return (
      <View style={[styles.card, { borderBottomColor: cardColors.border }]}>
        {comment.isDeleted ? (
          <View style={styles.commentHeader}>
            <Avatar uri={comment.user.profileImageUrl} />
            <View style={styles.headerText}>
              <Text
                style={[styles.nickname, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                silinmis
              </Text>
              <Text style={[styles.date, { color: theme.textSecondary }]}>
                {formatSmartDate(comment.createdAt).toUpperCase()}
              </Text>
            </View>
          </View>
        ) : (
          <UserPressTarget user={comment.user} createdAt={comment.createdAt} />
        )}

        <Text
          style={[
            styles.commentText,
            comment.isDeleted && styles.deletedText,
            { color: theme.textPrimary },
          ]}
        >
          {getDisplayContent(comment)}
        </Text>

        {!comment.isDeleted && (
          <ActionRow
            comment={comment}
            onLike={onLike}
            onReply={() =>
              openReply({
                rootCommentId: comment.id,
                nickname: comment.user.nickname,
                preview: comment.content,
              })
            }
            onDelete={isMine ? () => onDelete(comment) : undefined}
            canReport={!isMine}
            actionsColor={cardColors.actions}
            buttonBg={cardColors.buttonBg}
            likeColor={cardColors.like}
            deleteBg={cardColors.deleteBg}
            deleteColor={cardColors.delete}
          />
        )}

        {comment.replyCount > 0 && (
          <TouchableOpacity
            style={styles.showRepliesButton}
            activeOpacity={0.75}
            onPress={() => toggleReplies(comment.id)}
          >
            <Text
              style={[styles.showRepliesText, { color: theme.textSecondary }]}
            >
              {isRepliesOpen
                ? "Yanıtları gizle"
                : `${comment.replyCount} yanıtı göster`}
            </Text>
          </TouchableOpacity>
        )}

        {isRepliesOpen && (
          <ReplyList
            rootCommentId={comment.id}
            openReply={openReply}
            onLike={onLike}
            onDelete={onDelete}
            actionsColor={cardColors.actions}
            buttonBg={cardColors.buttonBg}
            likeColor={cardColors.like}
            deleteBg={cardColors.deleteBg}
            deleteColor={cardColors.delete}
          />
        )}
      </View>
    );
  },
);

const Composer = ({
  value,
  setValue,
  replyTarget,
  clearReplyTarget,
  onSubmit,
  isPending,
}: {
  value: string;
  setValue: (value: string) => void;
  replyTarget: ReplyTarget | null;
  clearReplyTarget: () => void;
  onSubmit: () => void;
  isPending: boolean;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const disabled = value.trim().length < 2 || isPending;

  return (
    <View
      style={[
        styles.composer,
        {
          backgroundColor: theme.background,
          borderTopColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0",
        },
      ]}
    >
      {replyTarget && (
        <View
          style={[
            styles.replyChip,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "#F1F5F9",
            },
          ]}
        >
          <View style={styles.replyChipText}>
            <Text
              style={[styles.replyChipTitle, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {replyTarget.nickname} kullanicisina yanit
            </Text>
            {!!replyTarget.preview && (
              <Text
                style={[
                  styles.replyChipPreview,
                  { color: theme.textSecondary },
                ]}
                numberOfLines={1}
              >
                {replyTarget.preview}
              </Text>
            )}
          </View>
          <Pressable onPress={clearReplyTarget} hitSlop={10}>
            <Text style={[styles.clearReply, { color: theme.textSecondary }]}>
              Kapat
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={(text) => text.length <= 750 && setValue(text)}
          placeholder={replyTarget ? "Yanitini yaz..." : "Yorumunu yaz..."}
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "#F8FAFC",
            },
          ]}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: theme.textPrimary },
            disabled && { opacity: 0.35 },
          ]}
          disabled={disabled}
          onPress={onSubmit}
          activeOpacity={0.8}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={theme.background} />
          ) : (
            <SendIcon color={theme.background} size={18} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChapterCommentsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ChapterComments">>();
  const { chapterId } = route.params;
  const { theme } = useAppTheme();
  const { requireAuth } = useRequireAuthAction();
  const [openReplies, setOpenReplies] = useState<Record<number, boolean>>({});
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [text, setText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteChapterComments(chapterId);
  const createComment = useCreateChapterCommentMutation(chapterId);
  const createReply = useCreateChapterReplyMutation(chapterId);
  const likeMutation = useChapterCommentLikeMutation(chapterId);
  const deleteMutation = useDeleteChapterCommentMutation(chapterId);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const toggleReplies = useCallback((commentId: number) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  }, []);

  const openReply = useCallback(
    (target: ReplyTarget) => {
      requireAuth(
        () => setReplyTarget(target),
        "Yanit yazmak icin giris yapmalisin.",
      );
    },
    [requireAuth],
  );

  const handleLike = useCallback(
    (commentId: number) => {
      requireAuth(
        () => likeMutation.mutate(commentId),
        "Begenmek icin giris yapmalisin.",
      );
    },
    [likeMutation, requireAuth],
  );

  const handleDelete = useCallback(
    (comment: ChapterComment) => {
      useModalStore.getState().showConfirm({
        title: "Yorumu sil",
        message: "Bu islem geri alinamaz.",
        onConfirm: () => deleteMutation.mutate(comment.id),
      });
    },
    [deleteMutation],
  );

  const handleSubmit = useCallback(() => {
    const content = text.trim();
    if (!content) return;

    requireAuth(() => {
      if (replyTarget) {
        createReply.mutate(
          {
            rootCommentId: replyTarget.rootCommentId,
            parentCommentId: replyTarget.parentCommentId,
            content,
          },
          {
            onSuccess: () => {
              setText("");
              setReplyTarget(null);
              setOpenReplies((prev) => ({
                ...prev,
                [replyTarget.rootCommentId]: true,
              }));
            },
          },
        );
      } else {
        createComment.mutate(content, {
          onSuccess: () => setText(""),
        });
      }
    }, "Yorum yazmak icin giris yapmalisin.");
  }, [createComment, createReply, replyTarget, requireAuth, text]);

  const isPending = createComment.isPending || createReply.isPending;

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerWrap}>
        <Header
          title={`Bolum yorumlari (${data?.total || 0})`}
          isAdjacent={false}
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.textPrimary} />
          <Text style={[styles.centerText, { color: theme.textSecondary }]}>
            Yorumlar yukleniyor...
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.items ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              isRepliesOpen={!!openReplies[item.id]}
              toggleReplies={toggleReplies}
              openReply={openReply}
              onLike={handleLike}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                Ilk yorumu sen birak
              </Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Bu bolum hakkinda dusunceler henuz sessiz.
              </Text>
            </View>
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                style={styles.footerLoader}
                color={theme.textSecondary}
              />
            ) : null
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
        style={
          Platform.OS === "android"
            ? {
                marginBottom:
                  keyboardHeight > 0 ? keyboardHeight + KEYBOARD_GAP : 0,
              }
            : undefined
        }
      >
        <Composer
          value={text}
          setValue={setText}
          replyTarget={replyTarget}
          clearReplyTarget={() => setReplyTarget(null)}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ChapterCommentsScreen;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  headerWrap: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  centerText: {
    fontFamily: "Mont-500",
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 2,
    paddingBottom: 14,
  },
  card: {
    paddingVertical: 13,
    borderBottomWidth: 0.6,
    gap: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 31,
    height: 31,
    borderRadius: 13,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  nickname: {
    fontFamily: "Mont-700",
    fontSize: 12.5,
  },
  date: {
    fontFamily: "Mont-800",
    fontSize: 8,
    letterSpacing: 0.5,
    opacity: 0.55,
  },
  commentText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18.5,
  },
  deletedText: {
    opacity: 0.5,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 0,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 28,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },
  iconAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 28,
    borderRadius: 10,
  },
  actionText: {
    fontFamily: "Mont-800",
    fontSize: 9,
    letterSpacing: 0.3,
  },
  showRepliesButton: {
    alignSelf: "flex-start",
    paddingVertical: 2,
  },
  showRepliesText: {
    fontFamily: "Mont-700",
    fontSize: 10,
  },
  replies: {
    gap: 8,
    paddingTop: 1,
  },
  repliesLoading: {
    paddingVertical: 14,
    alignItems: "center",
  },
  replyRow: {
    flexDirection: "row",
    gap: 10,
  },
  replyLine: {
    width: 1.5,
    borderRadius: 2,
    marginLeft: 14,
    marginVertical: 3,
  },
  replyBody: {
    flex: 1,
    gap: 6,
    paddingBottom: 2,
  },
  replyingTo: {
    fontFamily: "Mont-600",
    fontSize: 10,
    opacity: 0.72,
  },
  moreRepliesButton: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    marginLeft: 26,
  },
  moreRepliesText: {
    fontFamily: "Mont-800",
    fontSize: 10,
  },
  empty: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: "Mont-800",
    fontSize: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  footerLoader: {
    paddingVertical: 18,
  },
  composer: {
    borderTopWidth: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 22 : 16,
    gap: 8,
  },
  replyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  replyChipText: {
    flex: 1,
    gap: 2,
  },
  replyChipTitle: {
    fontFamily: "Mont-800",
    fontSize: 10,
  },
  replyChipPreview: {
    fontFamily: "Mont-500",
    fontSize: 10,
  },
  clearReply: {
    fontFamily: "Mont-800",
    fontSize: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 18,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
