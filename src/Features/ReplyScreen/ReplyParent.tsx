import React, { useState, useCallback, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { NotRecommendIcon } from "@/components/icons/NotRecommendIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { Reply } from "@/types/reply";
import { useReaderStore } from "@/store/useReaderStore";

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
        surface: isDarkMode ? "#1B2838" : "#FFFFFF",
        pageBg: isDarkMode ? "#0F1724" : "#F8FAFC", // Deliklerin iç rengi
        border: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#E9EEF4",
        title: isDarkMode ? "#F0F5FF" : "#1B2838",
        text: isDarkMode ? "#CBD5E1" : "#475569",
        subText: isDarkMode
          ? "rgba(148, 163, 184, 0.5)"
          : "rgba(100, 116, 139, 0.5)",
        badge: {
          pos: {
            bg: isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#DCFCE7",
            text: "#10B981",
          },
          neg: {
            bg: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
            text: "#EF4444",
          },
        },
      }),
      [isDarkMode],
    );

    const ticketCode = `#${String(comment.id).slice(-6).toUpperCase()}`;

    return (
      <View style={s.wrapper}>
        <View style={[s.container, { backgroundColor: theme.surface }]}>
          {/* HEADER & BODY */}
          <View style={s.mainSection}>
            <View style={s.header}>
              <Image
                source={{ uri: comment.user.profileImageUrl }}
                style={s.avatar}
              />
              <View style={s.meta}>
                <Text style={[s.userName, { color: theme.title }]}>
                  {comment.user.nickname}
                </Text>
                <Text style={[s.date, { color: theme.subText }]}>
                  {formatSmartDate(comment.createdAt)}
                </Text>
              </View>
              <View
                style={[
                  s.badge,
                  {
                    backgroundColor: comment.isRecommend
                      ? theme.badge.pos.bg
                      : theme.badge.neg.bg,
                  },
                ]}
              >
                {comment.isRecommend ? (
                  <RecommendIcon color={theme.badge.pos.text} size={13} />
                ) : (
                  <NotRecommendIcon color={theme.badge.neg.text} size={13} />
                )}
              </View>
            </View>

            <View style={[s.divider, { backgroundColor: theme.border }]} />

            <Pressable onPress={() => isTruncated && setExpanded(!expanded)}>
              <Text
                style={[s.contentText, { color: theme.text }]}
                numberOfLines={!expanded ? 4 : undefined}
                onTextLayout={(e) =>
                  !measured &&
                  e.nativeEvent.lines.length > 4 &&
                  setIsTruncated(true)
                }
              >
                {comment.content}
              </Text>
            </Pressable>

            {isTruncated && (
              <Text style={[s.moreText, { color: theme.badge.pos.text }]}>
                {expanded ? "DAHA AZ GÖSTER" : "OKUMAYA DEVAM ET"}
              </Text>
            )}
          </View>

          {/* PERFORATION (BILET DELIKLERI) */}
          <View style={s.perforation}>
            <View
              style={[
                s.notch,
                s.leftNotch,
                { backgroundColor: theme.pageBg, borderColor: theme.border },
              ]}
            />
            <View style={s.dashRow}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[s.dash, { backgroundColor: theme.border }]}
                />
              ))}
            </View>
            <View
              style={[
                s.notch,
                s.rightNotch,
                { backgroundColor: theme.pageBg, borderColor: theme.border },
              ]}
            />
          </View>

          {/* FOOTER (STUB) */}
          <View style={s.stub}>
            <View style={s.stat}>
              <Text style={[s.statNum, { color: theme.title }]}>
                {comment.likeCount}
              </Text>
              <Text style={[s.statLabel, { color: theme.subText }]}>
                BEĞENİ
              </Text>
            </View>
            <View style={[s.dot, { backgroundColor: theme.subText }]} />
            <View style={s.stat}>
              <Text style={[s.statNum, { color: theme.title }]}>
                {comment.replyCount}
              </Text>
              <Text style={[s.statLabel, { color: theme.subText }]}>YANIT</Text>
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[
                s.replyBtn,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                },
              ]}
              onPress={() => openReplySheet(null)}
            >
              <ReplyIcon color={theme.subText} size={10} />
              <Text style={[s.replyBtnText, { color: theme.subText }]}>
                YANITLA
              </Text>
            </TouchableOpacity>

            <View style={[s.stubDivider, { backgroundColor: theme.border }]} />
            <Text style={[s.ticketCode, { color: theme.subText }]}>
              {ticketCode}
            </Text>
          </View>
        </View>
      </View>
    );
  },
);

const NOTCH_SIZE = 14;
const s = StyleSheet.create({
  wrapper: { marginHorizontal: 4, marginVertical: 8 },
  container: { borderRadius: 16, overflow: "hidden" },
  mainSection: { padding: 14, gap: 10 },
  header: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 34, height: 34, borderRadius: 10, marginRight: 10 },
  meta: { flex: 1 },
  userName: { fontSize: 13, fontFamily: "Mont-700" },
  date: {
    fontSize: 9,
    fontFamily: "Mont-600",
    textTransform: "uppercase",
    marginTop: 1,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, opacity: 0.6 },
  contentText: { fontSize: 12, lineHeight: 19, fontFamily: "Mont-500" },
  moreText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  perforation: {
    flexDirection: "row",
    alignItems: "center",
    height: NOTCH_SIZE,
  },
  notch: {
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    borderWidth: 1,
    position: "absolute",
  },
  leftNotch: { left: -(NOTCH_SIZE / 2) },
  rightNotch: { right: -(NOTCH_SIZE / 2) },
  dashRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  dash: { width: 3, height: 1, borderRadius: 1 },
  stub: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  stat: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  statNum: { fontSize: 11, fontFamily: "Mont-700" },
  statLabel: { fontSize: 8, fontFamily: "Mont-600" },
  dot: { width: 2, height: 2, borderRadius: 1, opacity: 0.4 },
  replyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  replyBtnText: { fontSize: 9, fontFamily: "Mont-700" },
  stubDivider: { width: 1, height: 10, marginHorizontal: 4 },
  ticketCode: { fontSize: 8, fontFamily: "Mont-800", letterSpacing: 0.5 },
});
