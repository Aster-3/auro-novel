import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Reply } from "@/types/reply";
import { CommentLikeIcon } from "@/components/icons/CommentLikeIcon";
import { LikeİconFill } from "@/components/icons/LikeİconFill";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useToastStore } from "@/store/useToastStore";
import { useModalStore } from "@/store/useModalStore";
import { useReplyLikeMutation } from "@/hooks/useReplyLikeMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";

export const ReplyItem = ({
  reply,
  openReplySheet,
  onDelete,
  rootCommentId,
}: {
  reply: Reply;
  openReplySheet: (reply: Reply | null) => void;
  onDelete?: (replyId: number) => void;
  rootCommentId: number;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const { mutate } = useReplyLikeMutation(rootCommentId);

  // Yanıt metni için genişleme state'leri
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);

  // Alıntı metni için state
  const [quoteExpanded, setQuoteExpanded] = useState(false);

  const toggleQuote = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQuoteExpanded(!quoteExpanded);
  }, [quoteExpanded]);

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }, [expanded]);

  const toggleLike = () => {
    if (!reply || !user) {
      if (!user)
        useToastStore.getState().showToast({
          type: "Bilgi",
          message: "Beğenmek için giriş yapmalısınız.",
        });
      return;
    }
    mutate(reply.id);
  };

  const handleDelete = () => {
    useModalStore.getState().showConfirm({
      title: "YANITI SİL",
      message: "Bu işlem geri alınamaz.",
      onConfirm: () => onDelete?.(reply.id),
    });
  };

  return (
    <View style={s.card}>
      <View style={s.row}>
        <View style={s.leftCol}>
          <Image
            source={{
              uri:
                reply.user.profileImageUrl ?? "https://via.placeholder.com/40",
            }}
            style={s.avatar}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={s.content}>
          <View style={s.header}>
            <Text
              style={[s.nickname, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {reply.user.nickname}
            </Text>
            <View style={[s.dot, { backgroundColor: theme.textSecondary }]} />
            <Text style={[s.date, { color: theme.textSecondary }]}>
              {formatSmartDate(reply.createdAt).toUpperCase()}
            </Text>
          </View>

          {reply.parentReply && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleQuote}
              style={[
                s.quoteContainer,
                {
                  borderLeftColor: isDarkMode
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(15, 63, 146, 0.2)",
                },
              ]}
            >
              <View style={s.quoteContent}>
                <Text style={[s.quoteNick, { color: theme.textSecondary }]}>
                  @
                  {reply.parentReply.isDeleted
                    ? "silinmiş"
                    : reply.parentReply.user.nickname.toLowerCase()}
                </Text>
                <Text
                  style={[s.quoteText, { color: theme.textSecondary }]}
                  numberOfLines={quoteExpanded ? undefined : 1}
                >
                  {reply.parentReply.isDeleted
                    ? "Bu içerik kaldırıldı."
                    : reply.parentReply.content}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* YANIT METNİ - Sınırlama ve Açılma Mantığı */}
          <Pressable onPress={() => isTruncated && toggleExpanded()}>
            <Text
              style={[s.replyText, { color: theme.textPrimary }]}
              numberOfLines={measured && !expanded ? 5 : undefined}
              onTextLayout={(e) => {
                if (!measured) {
                  if (e.nativeEvent.lines.length > 5) setIsTruncated(true);
                  setMeasured(true);
                }
              }}
            >
              {reply.content}
            </Text>
          </Pressable>

          {isTruncated && (
            <TouchableOpacity onPress={toggleExpanded} style={s.moreBtn}>
              <Text style={[s.moreBtnText, { color: theme.accent }]}>
                {expanded ? "DAHA AZ GÖSTER" : "DEVAMINI GÖR"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={s.footer}>
            {/* BEĞEN BUTONU */}
            <TouchableOpacity
              style={[
                s.action,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                },
                reply.viewerHasLiked && {
                  backgroundColor: isDarkMode
                    ? "rgba(16,185,129,0.15)"
                    : "#ECFDF5",
                },
              ]}
              activeOpacity={0.7}
              onPress={toggleLike}
            >
              {reply.viewerHasLiked ? (
                <LikeİconFill color="#10B981" size={12} />
              ) : (
                <CommentLikeIcon color={theme.textSecondary} size={12} />
              )}
              <Text
                style={[
                  s.actionText,
                  {
                    color: reply.viewerHasLiked
                      ? "#10B981"
                      : theme.textSecondary,
                  },
                ]}
              >
                {reply.likeCount === 0 ? "BEĞEN" : reply.likeCount}
              </Text>
            </TouchableOpacity>

            {/* YANITLA BUTONU */}
            <TouchableOpacity
              style={[
                s.action,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                },
              ]}
              activeOpacity={0.7}
              onPress={() => openReplySheet(reply)}
            >
              <ReplyIcon color={theme.textSecondary} size={11} />
              <Text style={[s.actionText, { color: theme.textSecondary }]}>
                YANITLA
              </Text>
            </TouchableOpacity>

            {/* SİL BUTONU (Sadece kendi yanıtıysa) */}
            {onDelete && (
              <TouchableOpacity
                style={[
                  s.action,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(239,68,68,0.1)"
                      : "#FEF2F2",
                  },
                ]}
                activeOpacity={0.7}
                onPress={handleDelete}
              >
                <TrashIcon color="#EF4444" size={12} />
                <Text style={[s.actionText, { color: "#EF4444" }]}>SİL</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View
        style={[
          s.separator,
          {
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
          },
        ]}
      />
    </View>
  );
};

const s = StyleSheet.create({
  card: { paddingHorizontal: 12, paddingTop: 16 },
  row: { flexDirection: "row", gap: 12 },
  leftCol: { alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 10 },
  content: { flex: 1, gap: 8, paddingBottom: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  nickname: { fontSize: 13, fontFamily: "Mont-700" },
  dot: { width: 2, height: 2, borderRadius: 1, opacity: 0.3 },
  date: { fontSize: 8, fontFamily: "Mont-800", letterSpacing: 0.5 },
  quoteContainer: {
    borderLeftWidth: 2.5,
    paddingLeft: 12,
    marginVertical: 4,
    paddingVertical: 2,
  },
  quoteContent: { gap: 1 },
  quoteNick: {
    fontSize: 10,
    fontFamily: "Mont-800",
    opacity: 0.7,
  },
  quoteText: {
    fontSize: 11,
    fontFamily: "Mont-500",
    lineHeight: 15,
    opacity: 0.5,
  },
  replyText: {
    fontSize: 13,
    fontFamily: "Mont-500",
    lineHeight: 20,
  },
  moreBtn: {
    marginTop: 2,
  },
  moreBtnText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  footer: { flexDirection: "row", gap: 8, marginTop: 4 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionText: { fontSize: 9, fontFamily: "Mont-800", letterSpacing: 0.3 },
  separator: { height: 1, marginLeft: 44, marginTop: 4 },
});
