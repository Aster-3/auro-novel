import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useReaderStore } from "@/store/useReaderStore";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { PreviewComment } from "@/types/comment";
import { RecommendIcon } from "./icons/RecommendIcon";

export const CommentCardShort = ({ comment }: { comment: PreviewComment }) => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  const theme = useMemo(
    () => ({
      title: isDarkMode ? "#F0F5FF" : "#1B2838",
      text: isDarkMode ? "#CBD5E1" : "#475569",
      date: isDarkMode ? "rgba(148, 163, 184, 0.6)" : "rgba(8, 27, 52, 0.5)",

      recommend: {
        posAccent: "#0ab17c",
        posBg: isDarkMode
          ? "rgba(29, 255, 180, 0.08)"
          : "rgba(16, 185, 129, 0.06)",
        negAccent: "#BE123C",
        negBg: isDarkMode
          ? "rgba(225, 29, 72, 0.08)"
          : "rgba(225, 29, 71, 0.05)",
      },
    }),
    [isDarkMode],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: comment.user.profileImageUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.meta}>
            <Text
              style={[styles.username, { color: theme.title }]}
              numberOfLines={1}
            >
              {comment.user.nickname}
            </Text>
            <Text style={[styles.date, { color: theme.date }]}>
              {formatRelativeTime(comment.createdAt).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Mini Squircle Badge */}
        <View
          style={[
            styles.badge,
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
            size={11}
          />
        </View>
      </View>

      {/* Content: Avatar hizalı temiz yapı */}
      <Text numberOfLines={2} style={[styles.content, { color: theme.text }]}>
        {comment.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32, // Biraz daha belirgin yaptık (Full kartta 38'di)
    height: 32,
    borderRadius: 12, // Squircle estetiği devam
  },
  meta: {
    gap: 0,
  },
  username: {
    fontFamily: "Mont-700",
    fontSize: 13, // Mikro hiyerarşi
    letterSpacing: -0.2,
  },
  date: {
    fontFamily: "Mont-800", // Küçük fontta kalınlık okunaklılık sağlar
    fontSize: 8, // İnanılmaz küçük Apple fontu
    letterSpacing: 0.4,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.1,
    paddingLeft: 42,
    opacity: 0.9,
  },
});
