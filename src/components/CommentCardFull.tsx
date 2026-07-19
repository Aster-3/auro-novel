import React, { useState, memo, useCallback, useMemo } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { CommentLikeIcon } from "./icons/CommentLikeIcon";
import { ReplyIcon } from "./icons/ReplyIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useCommentLikeMutation } from "@/hooks/useCommentLikeMutation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useReaderStore } from "@/store/useReaderStore";
import { RecommendIcon } from "./icons/RecommendIcon";
import { DoubleDateIcon } from "./icons/DoubleDateIcon";
import { TotalReviewsIcon } from "./icons/TotalReviewsIcon";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { getProfileImageSource } from "@/utils/profileImage";

interface Props {
  comment: Comment;
  novelId: string;
}

export const CommentCardFull = memo(({ comment, novelId }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);

  const { mutate } = useCommentLikeMutation(novelId);
  const { requireAuth } = useRequireAuthAction();
  const navigation = useAppNavigation();
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const reviewCount = comment.user.reviewCount ?? 0;

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  const toggleLike = useCallback(() => {
    requireAuth(() => mutate(comment.id), "Beğenmek için giriş yapmalısın.");
  }, [comment.id, mutate, requireAuth]);

  const theme = useMemo(
    () => ({
      title: isDarkMode ? "#F0F5FF" : "#1B2838",
      text: isDarkMode ? "#CBD5E1" : "#475569",
      subText: isDarkMode
        ? "rgba(148, 163, 184, 0.6)"
        : "rgba(8, 27, 52, 0.37)",

      commentLike: {
        liked: isDarkMode ? "#0064f1" : "#080441db", // Deep Emerald
        default: isDarkMode ? "#94A3B8" : "#64748B",
      },
      recommend: {
        posAccent: "#0ab17c", // Deep Emerald
        posBg: isDarkMode
          ? "rgba(29, 255, 180, 0.1)"
          : "rgba(16, 185, 129, 0.08)",
        negAccent: "#BE123C", // Deep Rose/Wine
        negBg: isDarkMode
          ? "rgba(225, 29, 72, 0.1)"
          : "rgba(225, 29, 71, 0.07)",
      },
      actions: isDarkMode ? "#94A3B8" : "#64748B",
    }),
    [isDarkMode],
  );

  return (
    <View style={s.card}>
      {/* HEADER */}
      <Pressable
        style={s.header}
        onPress={() =>
          navigation.navigate("UserProfile", { userId: comment.user.id })
        }
      >
        <Image
          source={getProfileImageSource(comment.user.profileImageUrl)}
          style={s.avatar}
          contentFit="cover"
        />
        <View style={s.meta}>
          <Text style={[s.userName, { color: theme.title }]}>
            {comment.user.nickname}
          </Text>
          <View style={s.subMeta}>
            <View style={s.iconInfo}>
              <DoubleDateIcon color={theme.subText} size={10} />
              <Text style={[s.microDate, { color: theme.subText }]}>
                {formatSmartDate(comment.createdAt)}
              </Text>
            </View>
            <View style={s.iconInfo}>
              <TotalReviewsIcon color={theme.subText} size={10} />
              <Text style={[s.microDate, { color: theme.subText }]}>
                {reviewCount} İnceleme
              </Text>
            </View>
          </View>
        </View>

        {/* Minimalist Badge - Sadece İkon */}
        <View
          style={[
            s.miniBadge,
            {
              backgroundColor: comment.isRecommend
                ? theme.recommend.posBg
                : theme.recommend.negBg,
              transform: [{ rotate: comment.isRecommend ? "0deg" : "180deg" }],
            },
          ]}
        >
          <RecommendIcon
            color={
              comment.isRecommend
                ? theme.recommend.posAccent
                : theme.recommend.negAccent
            }
            size={14}
          />
        </View>
      </Pressable>

      {/* BODY */}
      <Pressable onPress={() => isTruncated && toggleExpanded()} style={s.body}>
        <Text
          style={[s.commentText, { color: theme.text }]}
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
          <Text style={[s.toggleText, { color: theme.actions }]}>
            {expanded ? "KÜÇÜLT" : "OKUMAYA DEVAM ET"}
          </Text>
        )}
      </Pressable>

      {/* FOOTER - Ergonomik & Apple Stil */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[
            s.action,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "#F8FAFC",
            },
          ]}
          onPress={toggleLike}
          activeOpacity={0.7}
        >
          <CommentLikeIcon
            isLiked={comment.viewerHasLiked}
            color={
              comment.viewerHasLiked
                ? theme.commentLike.liked
                : theme.commentLike.default
            }
            size={15}
          />
          <Text
            style={[
              s.actionText,
              {
                color: comment.viewerHasLiked
                  ? theme.commentLike.liked
                  : theme.commentLike.default,
              },
            ]}
          >
            {comment.likeCount > 0 ? comment.likeCount : "BEĞEN"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.action,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "#F8FAFC",
            },
          ]}
          onPress={() =>
            navigation.navigate("Reply", {
              commentId: comment.id,
              novelId,
            })
          }
          activeOpacity={0.7}
        >
          <ReplyIcon color={theme.actions} size={15} />
          <Text style={[s.actionText, { color: theme.actions }]}>
            {comment.replyCount > 0 ? comment.replyCount : "YANITLA"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  card: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 16,
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  subMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  iconInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  userName: {
    fontSize: 14,
    fontFamily: "Mont-700",
    letterSpacing: -0.2,
  },
  microDate: {
    fontSize: 9, // İnanılmaz küçük font
    fontFamily: "Mont-600",
    letterSpacing: 0.1,
  },
  miniBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    marginBottom: 14,
  },
  commentText: {
    fontFamily: "Mont-500",
    fontSize: 12.5,
    lineHeight: 19,
  },
  toggleText: {
    fontSize: 9,
    fontFamily: "Mont-700",
    marginTop: 6,
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 6,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});
