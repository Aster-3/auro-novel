import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LikeIcon } from "./icons/LikeIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { PreviewComment } from "@/types/comment";
import { formatSmartDate } from "@/utils/formatSmartDate";

export const CommentCardShort = ({
  comment,
  novelId,
}: {
  comment: PreviewComment;
  novelId: string;
}) => {
  const navigation = useAppNavigation();
  return (
    <View key={comment.id} style={styles.commentItem}>
      <Image
        source={{ uri: comment.user.profileImageUrl }}
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.commentHeader}>
            <Text style={styles.userName}>{comment.user.nickname}</Text>
            <Text style={styles.dateText}>
              {formatSmartDate(comment.createdAt)}
            </Text>
          </View>

          {comment.isRecommend ? (
            <View style={[styles.badge, styles.badgePos]}>
              <LikeIcon color="#059358df" size={13} />
            </View>
          ) : (
            <View
              style={[
                styles.badge,
                styles.badgeNeg,
                { transform: [{ rotate: "180deg" }] },
              ]}
            >
              <LikeIcon color="#ff0000df" size={13} />
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Comment", { id: novelId });
          }}
        >
          <Text numberOfLines={3} style={styles.commentText}>
            {comment.content}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    flexDirection: "row",
    gap: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15, // tam oval
    backgroundColor: "#F1F5F9",
  },
  commentContent: {
    flex: 1,
    gap: 4,
  },
  commentHeader: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userName: {
    fontFamily: "Mont-600",
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  dateText: {
    fontFamily: "Mont-400",
    fontSize: 10,
    color: "#94A3B8",
  },
  commentText: {
    fontFamily: "Mont-500",
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgePos: { backgroundColor: "#00ce7831" },
  badgeNeg: { backgroundColor: "#ff000018" },
});
