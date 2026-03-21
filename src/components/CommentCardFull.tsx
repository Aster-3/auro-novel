import React, { useState, memo, useCallback } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LikeIcon } from "./icons/LikeIcon";
import { LikeİconFill } from "./icons/LikeİconFill";
import { ReplyIcon } from "./icons/ReplyIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useCommentLikeMutation } from "@/hooks/useCommentLikeMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";

interface Props {
  comment: Comment;
  novelId: string;
}

export const CommentCardFull = memo(
  ({ comment, novelId }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [measured, setMeasured] = useState(false);
    const { mutate } = useCommentLikeMutation(novelId);
    const user = useAuthStore((state) => state.user);
    const navigation = useAppNavigation();

    const toggleExpanded = useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded((prev) => !prev);
    }, []);

    const toggleLike = useCallback(() => {
      if (!user) return;
      mutate(comment.id);
    }, [user, mutate, comment.id]);

    return (
      <View style={s.card}>
        <View style={s.header}>
          <Image
            source={{ uri: comment.user.profileImageUrl }}
            style={s.avatar}
            contentFit="cover"
            transition={150}
            priority="high"
            cachePolicy="disk"
          />
          <View style={s.meta}>
            <Text style={s.userName} numberOfLines={1}>
              {comment.user.nickname}
            </Text>
            <Text style={s.date}>{formatSmartDate(comment.createdAt)}</Text>
          </View>

          <View
            style={[
              s.badge,
              comment.isRecommend ? s.badgePos : s.badgeNeg,
              !comment.isRecommend && { transform: [{ rotate: "180deg" }] },
            ]}
          >
            <LikeIcon
              color={comment.isRecommend ? "#059358df" : "#ff0000df"}
              size={15}
            />
          </View>
        </View>

        <Text
          style={s.commentText}
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
            <Text style={s.toggleText}>
              {expanded ? "Daha az" : "Devamını oku..."}
            </Text>
          </TouchableOpacity>
        )}

        <View style={s.footer}>
          <TouchableOpacity
            style={[s.action, comment.viewerHasLiked && s.actionLiked]}
            activeOpacity={0.6}
            onPress={toggleLike}
          >
            {comment.viewerHasLiked ? (
              <LikeİconFill color="#4aeeaa" borderColor="#00b067" size={16} />
            ) : (
              <LikeIcon color="#94A3B8" size={15} />
            )}
            <Text
              style={[
                s.actionText,
                comment.viewerHasLiked && s.actionTextLiked,
              ]}
            >
              {comment.likeCount === 0 ? "Beğen" : comment.likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.action}
            activeOpacity={0.6}
            onPress={() =>
              navigation.navigate("Reply", { commentId: comment.id, novelId })
            }
          >
            <ReplyIcon color="#94A3B8" size={13} />
            <Text style={s.actionText}>
              {comment.replyCount === 0 ? "Yanıtla" : comment.replyCount}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={s.separator} />
      </View>
    );
  },
  (prev, next) => {
    // Sadece bu değerler değiştiğinde render et
    return (
      prev.comment.id === next.comment.id &&
      prev.comment.likeCount === next.comment.likeCount &&
      prev.comment.replyCount === next.comment.replyCount &&
      prev.comment.viewerHasLiked === next.comment.viewerHasLiked &&
      prev.comment.content === next.comment.content
    );
  },
);

const s = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    gap: 8,
    paddingTop: 16,
  },

  // ── Üst satır ────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
  },
  meta: {
    flex: 1,
    gap: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  date: {
    fontSize: 10,
    color: "#94A3B8",
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePos: { backgroundColor: "#00ce7831" },
  badgeNeg: { backgroundColor: "#ff000018" },

  // ── İçerik — tam genişlik ─────────────────────────────
  commentText: {
    fontFamily: "Poppins-400",
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
    letterSpacing: -0.1,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a8a8a8",
  },

  // ── Footer ───────────────────────────────────────────
  footer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,

    paddingHorizontal: 12,
    paddingVertical: 5,
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

  // ── Ayraç ────────────────────────────────────────────
  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    opacity: 0.8,
    marginTop: 16,
  },
});
