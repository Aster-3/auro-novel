import React, { useState, useCallback, useMemo } from "react";
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
import { FlagIcon } from "@/components/icons/FlagIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useToastStore } from "@/store/useToastStore";
import { useModalStore } from "@/store/useModalStore";
import { useReplyLikeMutation } from "@/hooks/useReplyLikeMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";
import { getProfileImageSource } from "@/utils/profileImage";
import { useAppNavigation } from "@/hooks/useAppNavigation";

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
  const navigation = useAppNavigation();
  const { mutate } = useReplyLikeMutation(rootCommentId);
  const isMine = reply.user.id === user?.id;

  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);
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
    if (!user) {
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

  // CommentCardFull ile senkronize tema değerleri
  const handleReportPress = useCallback(() => {
    navigation.push("SupportFeedback", {
      initialType: "report",
      initialSubject: `Yanıt Şikayeti | ${reply.user.nickname}: (Reply ID: ${reply.id}, Comment ID: ${rootCommentId})`,
      isSubjectDisable: true,
      isTypeDisable: true,
    });
  }, [navigation, reply.id, reply.user.nickname, rootCommentId]);

  const cardTheme = useMemo(
    () => ({
      actions: isDarkMode ? "#94A3B8" : "#64748B",
      likeColor: isDarkMode ? "#0064f1" : "#080441db",
      buttonBg: isDarkMode ? "rgba(255,255,255,0.03)" : "#F8FAFC",
      deleteBg: isDarkMode
        ? "rgba(225, 29, 72, 0.08)"
        : "rgba(225, 29, 72, 0.05)",
      deleteText: "#BE123C",
    }),
    [isDarkMode],
  );

  return (
    <View style={s.card}>
      <View style={s.row}>
        <Pressable
          style={s.leftCol}
          onPress={() =>
            navigation.push("UserProfile", { userId: reply.user.id })
          }
          hitSlop={8}
        >
          <Image
            source={getProfileImageSource(reply.user.profileImageUrl)}
            style={s.avatar}
            contentFit="cover"
            transition={200}
          />
        </Pressable>

        <View style={s.content}>
          <View style={s.header}>
            <Pressable
              onPress={() =>
                navigation.push("UserProfile", { userId: reply.user.id })
              }
              hitSlop={6}
            >
              <Text
                style={[s.nickname, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {reply.user.nickname}
              </Text>
            </Pressable>
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
                  {reply.parentReply.isDeleted
                    ? "silinmiş"
                    : reply.parentReply.user.nickname}
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
              <Text style={[s.moreBtnText, { color: cardTheme.actions }]}>
                {expanded ? "KÜÇÜLT" : "OKUMAYA DEVAM ET"}
              </Text>
            </TouchableOpacity>
          )}

          <View style={s.footer}>
            {/* BEĞEN BUTONU */}
            <TouchableOpacity
              style={[s.action, { backgroundColor: cardTheme.buttonBg }]}
              activeOpacity={0.7}
              onPress={toggleLike}
            >
              <CommentLikeIcon
                isLiked={reply.viewerHasLiked}
                color={
                  reply.viewerHasLiked ? cardTheme.likeColor : cardTheme.actions
                }
                size={15}
              />
              <Text
                style={[
                  s.actionText,
                  {
                    color: reply.viewerHasLiked
                      ? cardTheme.likeColor
                      : cardTheme.actions,
                  },
                ]}
              >
                {reply.likeCount > 0 ? reply.likeCount : "BEĞEN"}
              </Text>
            </TouchableOpacity>

            {/* YANITLA BUTONU */}
            <TouchableOpacity
              style={[s.action, { backgroundColor: cardTheme.buttonBg }]}
              activeOpacity={0.7}
              onPress={() => openReplySheet(reply)}
            >
              <ReplyIcon color={cardTheme.actions} size={15} />
              <Text style={[s.actionText, { color: cardTheme.actions }]}>
                YANITLA
              </Text>
            </TouchableOpacity>

            {/* SİL BUTONU */}
            {!isMine && (
              <TouchableOpacity
                style={[s.iconAction, { backgroundColor: cardTheme.buttonBg }]}
                activeOpacity={0.7}
                onPress={handleReportPress}
              >
                <FlagIcon color={cardTheme.actions} size={15} />
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={[s.action, { backgroundColor: cardTheme.deleteBg }]}
                activeOpacity={0.7}
                onPress={handleDelete}
              >
                <TrashIcon color={cardTheme.deleteText} size={14} />
                <Text style={[s.actionText, { color: cardTheme.deleteText }]}>
                  SİL
                </Text>
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
  avatar: { width: 32, height: 32, borderRadius: 14 },
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
    fontFamily: "Mont-700",
    letterSpacing: 0.2,
    textTransform: "uppercase",
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
  iconAction: {
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 32,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 9,
    fontFamily: "Mont-800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  separator: { height: 1, marginLeft: 44, marginTop: 4 },
});
