import { CommentCardShort } from "@/components/CommentCardShort";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { EmptyCommentState } from "./EmptyCommentState";
import { useCommentPreviews } from "@/hooks/getCommentPreview";
import { GoComment } from "./GoComment";
import { useAppTheme } from "@/hooks/useTheme";

export const NovelComments = ({ novelId }: { novelId: string }) => {
  const navigation = useAppNavigation();
  const { data, error } = useCommentPreviews(novelId);

  const { theme } = useAppTheme();

  const onPressWrite = () => {
    navigation.navigate("Comment", { id: novelId, isCommentTextOpen: true });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: theme.textPrimary }]}>
          Yorumlar yüklenirken bir hata oluştu.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate("Comment", { id: novelId })}
        style={({ pressed }) => [styles.header, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Yorumlar
        </Text>
        <View style={styles.rightContent}>
          <Text style={[styles.commentCount, { color: theme.textSecondary }]}>
            {data ? `${data.total} Yorum` : "0 Yorum"}
          </Text>
          <RightChevronIcon color={theme.textSecondary} size={16} />
        </View>
      </Pressable>

      {data && data.items.length > 0 ? (
        <View style={styles.commentList}>
          {data.items.slice(0, 3).map((comment) => (
            <CommentCardShort key={comment.id} comment={comment} />
          ))}
        </View>
      ) : (
        <EmptyCommentState />
      )}

      <GoComment
        isEmptyState={!data || data.items.length === 0}
        onPressWrite={onPressWrite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12, // Section içi daha derli toplu
    paddingVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontFamily: "Mont-700", // Kallavi başlık kuralı
    fontSize: 16, // Diğer sectionlarla senkron
    letterSpacing: -0.5,
  },
  commentCount: {
    fontFamily: "Mont-500",
    fontSize: 13, // Sağ taraf her zaman daha kibar
  },
  commentList: {
    marginTop: 4,
    gap: 24,
  },
  errorText: {
    textAlign: "center",
    fontFamily: "Mont-500",
    fontSize: 12,
    marginTop: 20,
  },
});
