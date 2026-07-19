import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { CommentLikeIcon } from "@/components/icons/CommentLikeIcon";
import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useCommentLikeMutation } from "@/hooks/useCommentLikeMutation";
import { useDeleteCommentMutation } from "@/hooks/useDeleteCommentMutation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useModalStore } from "@/store/useModalStore";
import { useAppTheme } from "@/hooks/useTheme";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { getProfileImageSource } from "@/utils/profileImage";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const MyComment = ({
  comment,
  novelId,
}: {
  comment: Comment;
  novelId: string;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const { requireAuth } = useRequireAuthAction();

  const { mutate: toggleLikeMutate } = useCommentLikeMutation(novelId);
  const { mutate: deleteComment } = useDeleteCommentMutation(
    comment.id,
    novelId,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    useModalStore.getState().showConfirm({
      title: "Yorumu Sil",
      message: "Bu işlemi geri alamazsınız.",
      onConfirm: () => deleteComment(comment.id),
    });
  };

  const badgeBg = isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9";

  return (
    <View
      style={[
        s.container,
        {
          borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#E2E8F0",
        },
      ]}
    >
      {/* HEADER: Her zaman sabit olan kısım */}
      <TouchableOpacity
        style={s.header}
        onPress={toggleOpen}
        activeOpacity={0.8}
      >
        <Image
          source={getProfileImageSource(comment.user.profileImageUrl)}
          style={s.avatar}
          contentFit="cover"
        />

        <View style={s.meta}>
          <View style={s.nameRow}>
            <Text
              style={[s.userName, { color: theme.commentCard.textPrimary }]}
              numberOfLines={1}
            >
              {comment.user.nickname}
            </Text>
            <View style={[s.myBadge, { backgroundColor: theme.accent + "15" }]}>
              <Text style={[s.myBadgeText, { color: theme.accent }]}>SİZ</Text>
            </View>
          </View>
          <Text
            style={[s.dateText, { color: theme.commentCard.textSecondary }]}
          >
            {formatSmartDate(comment.createdAt)}
          </Text>
        </View>

        {/* Recommend State */}
        <View
          style={[
            s.recommendIndicator,
            {
              backgroundColor: comment.isRecommend
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(225, 29, 72, 0.1)",
            },
          ]}
        >
          <RecommendIcon
            color={comment.isRecommend ? "#10b981" : "#ef4444"}
            size={11}
          />
        </View>

        {/* Chevron */}
        <View
          style={[
            s.chevron,
            isOpen && s.chevronOpen,
            { backgroundColor: badgeBg },
          ]}
        >
          <DownChevronIcon color={theme.commentCard.textSecondary} size={10} />
        </View>
      </TouchableOpacity>

      {/* EXPANDABLE CONTENT: Tıklandığında açılan kısım */}
      {isOpen && (
        <View style={s.content}>
          <Pressable onPress={() => isTruncated && toggleExpanded()}>
            <Text
              style={[s.commentText, { color: theme.commentCard.textPrimary }]}
              numberOfLines={measured && !expanded ? 5 : undefined}
              onTextLayout={(e) => {
                if (!measured) {
                  if (e.nativeEvent.lines.length > 5) setIsTruncated(true);
                  setMeasured(true);
                }
              }}
            >
              {comment.content}
            </Text>
          </Pressable>

          {isTruncated && (
            <TouchableOpacity onPress={toggleExpanded} style={s.moreButton}>
              <Text style={[s.toggleText, { color: theme.accent }]}>
                {expanded ? "KÜÇÜLT" : "DEVAMINI OKU"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={s.footer}>
            <View style={s.actionRow}>
              <TouchableOpacity
                style={[s.action, { backgroundColor: badgeBg }]}
                onPress={() =>
                  requireAuth(
                    () => toggleLikeMutate(comment.id),
                    "Beğenmek için giriş yapmalısın.",
                  )
                }
              >
                <CommentLikeIcon
                  isLiked={comment.viewerHasLiked}
                  color={
                    comment.viewerHasLiked
                      ? "#10b981"
                      : theme.commentCard.textSecondary
                  }
                  size={14}
                />
                <Text
                  style={[
                    s.actionText,
                    {
                      color: comment.viewerHasLiked
                        ? "#10b981"
                        : theme.commentCard.textSecondary,
                    },
                  ]}
                >
                  {comment.likeCount || "BEĞEN"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.action, { backgroundColor: badgeBg }]}
                onPress={() =>
                  requireAuth(
                    () =>
                      navigation.navigate("Reply", {
                        commentId: comment.id,
                        novelId,
                      }),
                    "Yanıt yazmak için giriş yapmalısın.",
                  )
                }
              >
                <ReplyIcon color={theme.commentCard.textSecondary} size={14} />
                <Text
                  style={[
                    s.actionText,
                    { color: theme.commentCard.textSecondary },
                  ]}
                >
                  {comment.replyCount || "YANITLA"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                s.deleteAction,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(239,68,68,0.08)"
                    : "#FEF2F2",
                },
              ]}
              onPress={handleDelete}
            >
              <TrashIcon color="#ef4444" size={13} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 14,
    marginRight: 10,
  },
  meta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 13,
    fontFamily: "Mont-700",
  },
  myBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  myBadgeText: {
    fontSize: 7,
    fontFamily: "Mont-800",
  },
  dateText: {
    fontSize: 9,
    fontFamily: "Mont-500",
    opacity: 0.5,
    marginTop: 1,
  },
  recommendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  chevron: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronOpen: { transform: [{ rotate: "180deg" }] },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  commentText: {
    fontFamily: "Mont-500",
    fontSize: 12.5,
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  moreButton: { marginTop: 6 },
  toggleText: {
    fontSize: 8.5,
    fontFamily: "Mont-800",
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionText: {
    fontSize: 8.5,
    fontFamily: "Mont-800",
  },
  deleteAction: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
