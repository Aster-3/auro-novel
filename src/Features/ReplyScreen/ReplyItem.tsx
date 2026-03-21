import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import { Reply } from "@/types/reply";
import { LikeIcon } from "@/components/icons/LikeIcon";
import { LikeİconFill } from "@/components/icons/LikeİconFill";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
// import { TrashIcon } from "@/components/icons/TrashIcon"; // Varsa kendi ikonunu kullanabilirsin
import { formatSmartDate } from "@/utils/formatSmartDate";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { useToastStore } from "@/store/useToastStore";
import { useModalStore } from "@/store/useModalStore";
import { useReplyLikeMutation } from "@/hooks/useReplyLikeMutation";
import { useAuthStore } from "@/store/useAuthStore";

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
  const user = useAuthStore((state) => state.user);
  const { mutate } = useReplyLikeMutation(rootCommentId);

  const toggleLike = () => {
    if (!reply) return;
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
      title: "Yanıt Silinecek",
      message: "Bu yanıtı silmek istediğinize emin misiniz?",
      onConfirm: () => {
        if (onDelete) {
          onDelete(reply.id);
        } else {
          useToastStore.getState().showToast({
            type: "Hata",
            message: "Bu yanıt silinemiyor.",
          });
        }
      },
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
            <Text style={s.nickname} numberOfLines={1}>
              {reply.user.nickname}
            </Text>
            <View style={s.dot} />
            <Text style={s.date}>{formatSmartDate(reply.createdAt)}</Text>
          </View>

          {reply.parentReply && (
            <View
              style={[s.quote, reply.parentReply.isDeleted && s.quoteDeleted]}
            >
              <Image
                source={{
                  uri: reply.parentReply.isDeleted
                    ? "https://ui-avatars.com/api/?name=Deleted&background=E2E8F0" // Silinenler için sabit gri avatar
                    : (reply.parentReply.user.profileImageUrl ??
                      "https://via.placeholder.com/40"),
                }}
                style={[
                  s.quoteAvatar,
                  reply.parentReply.isDeleted && { opacity: 0.5 },
                ]}
                contentFit="cover"
              />

              <View style={s.quoteBody}>
                <Text
                  style={[
                    s.quoteNick,
                    reply.parentReply.isDeleted && s.deletedText,
                  ]}
                >
                  @
                  {reply.parentReply.isDeleted
                    ? "silinmiş"
                    : reply.parentReply.user.nickname}
                </Text>

                <Text
                  style={[
                    s.quoteText,
                    reply.parentReply.isDeleted && s.italicText,
                  ]}
                  numberOfLines={2}
                >
                  {reply.parentReply.isDeleted
                    ? "Bu yorum silinmiştir."
                    : reply.parentReply.content}
                </Text>
              </View>
            </View>
          )}

          <Text style={s.replyText}>{reply.content}</Text>

          <View style={s.footer}>
            {/* Beğen Butonu */}
            <TouchableOpacity
              style={[s.action, reply.viewerHasLiked && s.actionLiked]}
              activeOpacity={0.6}
              onPress={toggleLike}
            >
              {reply.viewerHasLiked ? (
                <LikeİconFill
                  color="#2fcd8bbc"
                  borderColor="#029c5c"
                  size={13}
                />
              ) : (
                <LikeIcon color="#94A3B8" size={13} />
              )}
              <Text
                style={[
                  s.actionText,
                  reply.viewerHasLiked && s.actionTextLiked,
                ]}
              >
                {reply.likeCount === 0 ? "Beğen" : reply.likeCount}
              </Text>
            </TouchableOpacity>

            {/* Yanıtla Butonu */}
            <TouchableOpacity
              style={s.action}
              activeOpacity={0.6}
              onPress={() => openReplySheet(reply)}
            >
              <ReplyIcon color="#94A3B8" size={13} />
              <Text style={s.actionText}>Yanıtla</Text>
            </TouchableOpacity>

            {/* Silme Butonu - Sadece kullanıcı kendi yorumuysa gösterilecek mantığı eklenebilir */}
            {onDelete && (
              <TouchableOpacity
                style={[s.action, s.deleteAction]}
                activeOpacity={0.6}
                onPress={handleDelete}
              >
                {/* TrashIcon yoksa Text de yeterli olur */}
                <TrashIcon color="#EF4444" size={13} />
                <Text style={[s.actionText, s.deleteText]}>Sil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={s.separator} />
    </View>
  );
};

const s = StyleSheet.create({
  // ... (Mevcut stilleriniz)
  card: { paddingHorizontal: 14, paddingTop: 14 },
  row: { flexDirection: "row", gap: 12 },
  leftCol: { alignItems: "center" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
  },
  content: { flex: 1, gap: 6, paddingBottom: 14 },
  header: { flexDirection: "row", alignItems: "center", gap: 5 },
  nickname: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  dot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  date: { fontSize: 10, color: "#94A3B8" },
  quote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 8,
  },
  quoteAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
  },
  quoteBody: { flex: 1, gap: 2 },
  quoteNick: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  quoteText: { fontSize: 11, lineHeight: 16, color: "#94A3B8" },
  replyText: { fontSize: 13, lineHeight: 20, color: "#475569" },
  footer: { flexDirection: "row", gap: 6, marginTop: 4 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  actionLiked: { backgroundColor: "#ECFDF5" },
  actionText: { fontSize: 11, fontWeight: "500", color: "#94A3B8" },
  actionTextLiked: { color: "#059669" },
  separator: {
    height: 1,
    marginLeft: 34 + 12 + 14,
    backgroundColor: "#F1F5F9",
    opacity: 0.8,
  },

  // ── Yeni Stiller ─────────────────────────────────────
  deleteAction: {
    backgroundColor: "#FEF2F2", // Hafif kırmızı arka plan
  },
  deleteText: {
    color: "#EF4444", // Kırmızı yazı
  },

  quoteDeleted: {
    backgroundColor: "#F8FAFC", // Daha soluk bir arka plan
    borderLeftColor: "#E2E8F0", // Daha soluk bir kenarlık
  },
  deletedText: {
    color: "#94A3B8", // Silinmiş kullanıcı adı rengi
    fontWeight: "400",
  },
  italicText: {
    fontStyle: "italic",
    color: "#64748B",
  },
});
