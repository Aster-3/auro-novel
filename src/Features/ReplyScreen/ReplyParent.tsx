import React, { useState, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { Reply } from "@/types/reply";
import { useReaderStore } from "@/store/useReaderStore";
import { getProfileImageSource } from "@/utils/profileImage";

interface ReplyParentProps {
  comment: Comment;
  novelId: string;
  openReplySheet: (replyData: Reply | null) => void;
}

export const ReplyParent = React.memo(
  ({ comment, openReplySheet }: ReplyParentProps) => {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [measured, setMeasured] = useState(false);
    const isDarkMode = useReaderStore((state) => state.isDarkMode);

    const theme = useMemo(
      () => ({
        textPrimary: isDarkMode ? "#F1F5F9" : "#0F172A",
        textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
        border: isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9",
        recommend: {
          posAccent: "#10B981",
          posBg: isDarkMode
            ? "rgba(16, 185, 129, 0.1)"
            : "rgba(16, 185, 129, 0.08)",
          negAccent: "#F43F5E",
          negBg: isDarkMode
            ? "rgba(244, 63, 94, 0.1)"
            : "rgba(244, 63, 94, 0.07)",
        },
      }),
      [isDarkMode],
    );

    return (
      <View style={s.wrapper}>
        <View style={[s.container, { borderColor: theme.border }]}>
          {/* Karakter Çizgisi */}
          <View
            style={[
              s.sideLine,
              {
                backgroundColor: comment.isRecommend
                  ? theme.recommend.posAccent
                  : theme.recommend.negAccent,
              },
            ]}
          />

          <View style={s.main}>
            {/* Üst Kısım: Kullanıcı ve Rozet */}
            <View style={s.header}>
              <Image
                source={getProfileImageSource(comment.user.profileImageUrl)}
                style={s.avatar}
                contentFit="cover"
              />
              <View style={s.meta}>
                <Text style={[s.userName, { color: theme.textPrimary }]}>
                  {comment.user.nickname}
                </Text>
                <Text style={[s.date, { color: theme.textSecondary }]}>
                  {formatSmartDate(comment.createdAt).toUpperCase()}
                </Text>
              </View>

              {/* CommentCardFull Stili Rozet */}
              <View
                style={[
                  s.miniBadge,
                  {
                    backgroundColor: comment.isRecommend
                      ? theme.recommend.posBg
                      : theme.recommend.negBg,
                    transform: [
                      { rotate: comment.isRecommend ? "0deg" : "180deg" },
                    ],
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
            </View>

            {/* Orta Kısım: Küçük Fontlu İçerik */}
            <Pressable
              onPress={() => isTruncated && setExpanded(!expanded)}
              style={s.content}
            >
              <Text
                style={[s.contentText, { color: theme.textPrimary }]}
                numberOfLines={!expanded ? 6 : undefined}
                onTextLayout={(e) => {
                  if (!measured) {
                    if (e.nativeEvent.lines.length > 6) setIsTruncated(true);
                    setMeasured(true);
                  }
                }}
              >
                {comment.content}
              </Text>
              {isTruncated && (
                <Text style={[s.moreText, { color: theme.textSecondary }]}>
                  {expanded ? "KÜÇÜLT" : "DEVAMINI OKU"}
                </Text>
              )}
            </Pressable>

            {/* Alt Kısım: Yan Yana İstatistikler ve Buton */}
            <View style={[s.footer, { borderTopColor: theme.border }]}>
              <View style={s.stats}>
                <View style={s.statRow}>
                  <Text style={[s.statNum, { color: theme.textPrimary }]}>
                    {comment.likeCount}
                  </Text>
                  <Text style={[s.statLabel, { color: theme.textSecondary }]}>
                    BEĞENİ
                  </Text>
                </View>
                <View style={s.statRow}>
                  <Text style={[s.statNum, { color: theme.textPrimary }]}>
                    {comment.replyCount}
                  </Text>
                  <Text style={[s.statLabel, { color: theme.textSecondary }]}>
                    YANIT
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  s.replyBtn,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "#F8FAFC",
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => openReplySheet(null)}
              >
                <ReplyIcon
                  color={isDarkMode ? "#F1F5F9" : "#64748B"}
                  size={11}
                />
                <Text
                  style={[
                    s.replyBtnText,
                    { color: isDarkMode ? "#F1F5F9" : "#64748B" },
                  ]}
                >
                  YANITLA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const s = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  sideLine: {
    width: 3.5,
    height: "100%",
    opacity: 0.8,
  },
  main: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 14,
  },
  meta: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 13,
    fontFamily: "Mont-700",
    letterSpacing: -0.2,
  },
  date: {
    fontSize: 8.5,
    fontFamily: "Mont-800",
    marginTop: 1,
    opacity: 0.5,
  },
  miniBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    marginBottom: 16,
  },
  contentText: {
    fontSize: 12, // Daha küçük font
    lineHeight: 18,
    fontFamily: "Mont-500",
  },
  moreText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    marginTop: 6,
    textTransform: "uppercase",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    borderTopWidth: 1,
  },
  stats: {
    flexDirection: "row",
    gap: 12,
  },
  statRow: {
    flexDirection: "row", // Sayı ve yazı yan yana
    alignItems: "center",
    gap: 4,
  },
  statNum: {
    fontSize: 11,
    fontFamily: "Mont-700",
  },
  statLabel: {
    fontSize: 8,
    fontFamily: "Mont-800",
    opacity: 0.6,
  },
  replyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  replyBtnText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    letterSpacing: 0.5,
  },
});
