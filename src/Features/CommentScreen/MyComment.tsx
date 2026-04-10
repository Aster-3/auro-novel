import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { LikeİconFill } from "@/components/icons/LikeİconFill";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useCommentLikeMutation } from "@/hooks/useCommentLikeMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { useDeleteCommentMutation } from "@/hooks/useDeleteCommentMutation";
import { useModalStore } from "@/store/useModalStore";
import { useAppTheme } from "@/hooks/useTheme";
import { CommentLikeIcon } from "@/components/icons/CommentLikeIcon";

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
  const { mutate: deleteComment } = useDeleteCommentMutation(
    comment.id,
    novelId,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);

  const { mutate: toggleLikeMutate } = useCommentLikeMutation(novelId);
  const user = useAuthStore((state) => state.user);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleDeleteComment = () => {
    useModalStore.getState().showConfirm({
      title: "Yorumu Sil",
      message: "Bu işlem geri alamazsınız.",
      onConfirm: () => deleteComment(comment.id),
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.commentCard.background,
          borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#E2E8F0",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={toggleOpen}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: comment.user.profileImageUrl }}
          style={styles.avatar}
        />

        <View style={styles.meta}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.userName,
                { color: theme.commentCard.textPrimary },
              ]}
              numberOfLines={1}
            >
              {comment.user.nickname}
            </Text>
            <View
              style={[
                styles.myBadge,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "#F1F5F9",
                },
              ]}
            >
              <Text
                style={[
                  styles.myBadgeText,
                  { color: theme.commentCard.textSecondary },
                ]}
              >
                SİZ
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.dateText,
              { color: theme.commentCard.textSecondary },
            ]}
          >
            {formatSmartDate(comment.createdAt)}
          </Text>
        </View>

        <View
          style={[
            styles.recommendBadge,
            comment.isRecommend ? styles.recommendGreen : styles.recommendRed,
            !comment.isRecommend && { transform: [{ rotate: "180deg" }] },
          ]}
        >
          <RecommendIcon
            color={comment.isRecommend ? "#10b981" : "#ef4444"}
            size={11}
          />
        </View>

        <View
          style={[
            styles.chevron,
            isOpen && styles.chevronOpen,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "#F1F5F9",
            },
          ]}
        >
          <DownChevronIcon color={theme.commentCard.textSecondary} size={10} />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <Text
            style={[
              styles.commentText,
              { color: theme.commentCard.textPrimary },
            ]}
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

          {isTruncated && (
            <TouchableOpacity
              onPress={toggleExpanded}
              style={styles.moreButton}
            >
              <Text style={[styles.toggleText, { color: theme.accent }]}>
                {expanded ? "DAHA AZ" : "DEVAMINI OKU"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.action,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                },
                comment.viewerHasLiked && {
                  backgroundColor: isDarkMode
                    ? "rgba(16,185,129,0.15)"
                    : "#ECFDF5",
                },
              ]}
              onPress={() => user && toggleLikeMutate(comment.id)}
            >
              {comment.viewerHasLiked ? (
                <LikeİconFill color="#10b981" size={12} />
              ) : (
                <CommentLikeIcon
                  color={theme.commentCard.textSecondary}
                  size={12}
                />
              )}
              <Text
                style={[
                  styles.actionText,
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
              style={[
                styles.action,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                },
              ]}
              onPress={() =>
                navigation.navigate("Reply", { commentId: comment.id, novelId })
              }
            >
              <ReplyIcon color={theme.commentCard.textSecondary} size={11} />
              <Text
                style={[
                  styles.actionText,
                  { color: theme.commentCard.textSecondary },
                ]}
              >
                {comment.replyCount || "YANITLA"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.action,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(239,68,68,0.1)"
                    : "#FEF2F2",
                },
              ]}
              onPress={handleDeleteComment}
            >
              <TrashIcon color="#ef4444" size={12} />
              <Text style={[styles.actionText, { color: "#ef4444" }]}>SİL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    gap: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 12,
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
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  myBadgeText: {
    fontSize: 8,
    fontFamily: "Mont-800",
  },
  dateText: {
    fontSize: 10,
    fontFamily: "Mont-500",
    marginTop: 1,
  },
  recommendBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendGreen: { backgroundColor: "rgba(16,185,129,0.15)" },
  recommendRed: { backgroundColor: "rgba(239,68,68,0.15)" },
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
    fontSize: 12,
    fontFamily: "Mont-500",
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  moreButton: { marginTop: 4 },
  toggleText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 9,
    fontFamily: "Mont-700",
    letterSpacing: 0.3,
  },
});
