import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

import { LikeIcon } from "@/components/icons/LikeIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { Comment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { Reply } from "@/types/reply";

const PAGE_BG = "#F8FAFC";

interface ReplyParentProps {
  comment: Comment;
  novelId: string;
  openReplySheet: (replyData: Reply | null) => void;
}

const RecommendBadge = ({ isRecommend }: { isRecommend: boolean }) => {
  const config = useMemo(
    () => ({
      color: isRecommend ? "#059358" : "#EF4444",
      bgColor: isRecommend ? "#DCFCE7" : "#FEE2E2",
      rotate: isRecommend ? "0deg" : "180deg",
    }),
    [isRecommend],
  );

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          transform: [{ rotate: config.rotate }],
        },
      ]}
    >
      <LikeIcon color={config.color} size={13} />
    </View>
  );
};

export const ReplyParent = React.memo(
  ({ comment, openReplySheet }: ReplyParentProps) => {
    const [expanded, setExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [measured, setMeasured] = useState(false);

    const toggleExpanded = useCallback(() => {
      setExpanded((prev) => !prev);
    }, []);

    const ticketCode = `#${String(comment.id).padStart(6, "0")}`;

    console.log("Rendering ReplyParent:", comment.id, {
      expanded,
      isTruncated,
    });

    return (
      // Dış wrapper: overflow visible — notch'lar dışa taşabilsin
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {/* ── ÜST GÖVDE ── */}
          <View style={styles.body}>
            <View style={styles.header}>
              <Image
                cachePolicy={"disk"}
                source={{ uri: comment.user.profileImageUrl }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.meta}>
                <Text style={styles.userName} numberOfLines={1}>
                  {comment.user.nickname}
                </Text>
                <Text style={styles.dateText}>
                  {formatSmartDate(comment.createdAt)}
                </Text>
              </View>
              <RecommendBadge isRecommend={comment.isRecommend} />
            </View>

            <View style={styles.divider} />

            <Text
              style={styles.commentText}
              onPress={toggleExpanded}
              numberOfLines={measured && !expanded ? 4 : undefined}
              onTextLayout={(e) => {
                if (!measured) {
                  if (e.nativeEvent.lines.length > 4) setIsTruncated(true);
                  setMeasured(true);
                }
              }}
            >
              {comment.content}
            </Text>

            {isTruncated && (
              <TouchableOpacity
                onPress={toggleExpanded}
                activeOpacity={0.7}
                style={styles.moreButton}
              >
                <Text style={styles.toggleText}>
                  {expanded ? "Daha az göster" : "Devamını oku..."}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── PERFORASYON ──
              Notch'lar container dışına (wrapper içine) taşıyor,
              böylece border ve shadow kesilmiyor. */}
          <View style={styles.perforation}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedRow}>
              {Array.from({ length: 24 }).map((_, i) => (
                <View key={i} style={styles.dash} />
              ))}
            </View>
            <View style={styles.notchRight} />
          </View>

          {/* ── ALT STUB ── */}
          <View style={styles.stub}>
            <View style={styles.stubStat}>
              <Text style={styles.stubNum}>{comment.likeCount}</Text>
              <Text style={styles.stubLabel}>beğeni</Text>
            </View>

            <View style={styles.stubDot} />

            <View style={styles.stubStat}>
              <Text style={styles.stubNum}>{comment.replyCount}</Text>
              <Text style={styles.stubLabel}>yanıt</Text>
            </View>

            <View style={styles.stubSpacer} />

            {/* Yanıtla butonu */}
            <TouchableOpacity
              style={styles.replyBtn}
              activeOpacity={0.6}
              onPress={() => {
                openReplySheet(null);
              }}
            >
              <ReplyIcon color="#64748B" size={11} />
              <Text style={styles.replyBtnText}>Yanıtla</Text>
            </TouchableOpacity>

            <View style={styles.stubDivider} />

            <Text style={styles.ticketCode}>{ticketCode}</Text>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.comment.replyCount === nextProps.comment.replyCount;
  },
);

const NOTCH_SIZE = 16;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 8,
  },

  container: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E9EEF4",
    borderRadius: 16,
    overflow: "hidden", // Sadece köşe kesmek için — notch'lar wrapper'da
  },

  // ── Üst gövde ──────────────────────────────────────
  body: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: "#F1F5F9",
  },
  meta: { flex: 1 },
  userName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    lineHeight: 17,
  },
  dateText: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  commentText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  moreButton: {
    marginTop: 0,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a8a8a8",
  },

  // ── Perforasyon ────────────────────────────────────
  perforation: {
    flexDirection: "row",
    alignItems: "center",
    height: NOTCH_SIZE,
  },
  notchLeft: {
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    backgroundColor: PAGE_BG,
    // Wrapper'a taşmak için negatif margin
    marginLeft: -(NOTCH_SIZE / 2),
    // Border'ı taklit et
    borderWidth: 1,
    borderColor: "#E9EEF4",
  },
  notchRight: {
    width: NOTCH_SIZE,
    height: NOTCH_SIZE,
    borderRadius: NOTCH_SIZE / 2,
    backgroundColor: PAGE_BG,
    marginRight: -(NOTCH_SIZE / 2),
    borderWidth: 1,
    borderColor: "#E9EEF4",
  },
  dashedRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  dash: {
    width: 3,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: "#DDE3EB",
  },

  // ── Alt stub ───────────────────────────────────────
  stub: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  stubStat: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  stubNum: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  stubLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  stubDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  stubSpacer: { flex: 1 },
  ticketCode: {
    fontSize: 9,
    fontWeight: "600",
    color: "#C8D2DC",
    letterSpacing: 1.2,
    fontVariant: ["tabular-nums"],
  },
  replyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
  },
  replyBtnText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },
  stubDivider: {
    width: 1,
    height: 10,
    backgroundColor: "#E2E8F0",
  },
});
