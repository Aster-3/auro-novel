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
import { LikeIcon } from "@/components/icons/LikeIcon";
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
  const navigation = useAppNavigation();
  const { mutate: deleteComment } = useDeleteCommentMutation(
    comment.id,
    novelId,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);
  const { mutate } = useCommentLikeMutation(novelId);
  const user = useAuthStore((state) => state.user);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const toggleLike = () => {
    if (!user) return;
    mutate(comment.id);
  };

  const handleDeleteComment = () => {
    useModalStore.getState().showConfirm({
      title: "Yorum Silinecek",
      message: "Bu yorumu silmek istediğinize emin misiniz?",
      onConfirm: () => {
        deleteComment(comment.id);
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        isOpen && {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          zIndex: 10,
          elevation: 5, // Container elevation'ı content ile dengeli olmalı
        },
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: comment.user.profileImageUrl }}
          style={styles.avatar}
        />

        <View style={styles.meta}>
          <View style={styles.nameRow}>
            <Text style={styles.userName} numberOfLines={1}>
              {comment.user.nickname}
            </Text>
            <View style={styles.myBadge}>
              <Text style={styles.myBadgeText}>Yorumum</Text>
            </View>
          </View>
          <Text style={styles.dateText}>
            {formatSmartDate(comment.createdAt)}
          </Text>
        </View>

        {comment.isRecommend ? (
          <View style={[styles.recommendBadge, styles.recommendGreen]}>
            <LikeIcon color="#059358df" size={13} />
          </View>
        ) : (
          <View
            style={[
              styles.recommendBadge,
              styles.recommendRed,
              { transform: [{ rotate: "180deg" }] },
            ]}
          >
            <LikeIcon color="#ff0000df" size={13} />
          </View>
        )}

        <View style={[styles.chevron, isOpen && styles.chevronOpen]}>
          <DownChevronIcon color="#64748B" size={12} />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <Text
            style={styles.commentText}
            numberOfLines={measured && !expanded ? 5 : undefined}
            onTextLayout={(e) => {
              if (!measured) {
                if (e.nativeEvent.lines.length > 5) setIsTruncated(true);
                setMeasured(true);
              }
            }}
            onPress={() => isTruncated && toggleExpanded()}
          >
            {comment.content}
          </Text>

          {isTruncated && (
            <TouchableOpacity
              onPress={toggleExpanded}
              hitSlop={{ top: 8, bottom: 8 }}
            >
              <Text style={styles.toggleText}>
                {expanded ? "Daha az" : "Devamını oku"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.action,
                comment.viewerHasLiked && styles.actionLiked,
              ]}
              activeOpacity={0.6}
              onPress={toggleLike}
            >
              {comment.viewerHasLiked ? (
                <LikeİconFill color="#4aeeaa" borderColor="#00b067" size={13} />
              ) : (
                <LikeIcon color="#94A3B8" size={13} />
              )}
              <Text
                style={[
                  styles.actionText,
                  comment.viewerHasLiked && styles.actionTextLiked,
                ]}
              >
                {comment.likeCount === 0 ? "Beğen" : comment.likeCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.action}
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate("Reply", { commentId: comment.id, novelId })
              }
            >
              <ReplyIcon color="#94A3B8" size={11} />
              <Text style={styles.actionText}>
                {comment.replyCount === 0 ? "Yanıtla" : comment.replyCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.action, styles.deleteAction]}
              activeOpacity={0.6}
              onPress={handleDeleteComment}
            >
              <TrashIcon color="#EF4444" size={13} />
              <Text style={[styles.actionText, styles.deleteText]}>Sil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E8F0",
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    zIndex: 1000,
  },
  content: {
    position: "absolute",
    top: 60,
    left: -StyleSheet.hairlineWidth,
    right: -StyleSheet.hairlineWidth,
    zIndex: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderColor: "#E2E8F0",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 16, // Top 60 olduğu için padding'i biraz artırarak metni aşağı çektik
    paddingBottom: 14,
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // Container ile aynı veya hafif yüksek olabilir
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  myBadge: {
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  myBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: -0.1,
  },
  dateText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "400",
  },
  recommendBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendGreen: {
    backgroundColor: "#00ce7831",
  },
  recommendRed: {
    backgroundColor: "#ff000018",
  },
  chevron: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  commentText: {
    fontFamily: "Poppins-400",
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
    letterSpacing: -0.1,
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4F46E5",
    marginTop: -6,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  actionLiked: {
    backgroundColor: "#ECFDF5",
  },
  actionText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },
  actionTextLiked: {
    color: "#059669",
  },
  deleteAction: {
    backgroundColor: "#FEF2F2",
  },
  deleteText: {
    color: "#EF4444",
  },
});
