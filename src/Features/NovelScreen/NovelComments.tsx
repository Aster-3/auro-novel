import { CommentCardShort } from "@/components/CommentCardShort";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { EmptyCommentState } from "./EmptyCommentState";
import { useCommentPreviews } from "@/hooks/getCommentPreview";
import { GoComment } from "./GoComment";

export const NovelComments = ({ novelId }: { novelId: string }) => {
  const navigation = useAppNavigation();

  const { data, error } = useCommentPreviews(novelId);

  console.log("NovelComments id:", novelId);

  const onPressWrite = () => {
    console.log("Write comment pressed");
    navigation.navigate("Comment", { id: novelId, isCommentTextOpen: true });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Yorumlar yüklenirken bir hata oluştu.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Comment", { id: novelId });
        }}
        style={styles.header}
      >
        <Text style={styles.title}>Yorumlar</Text>
        <View style={styles.rightContent}>
          <Text style={styles.commentCount}>
            {data ? `${data.total} Yorum` : "Yorumlar yükleniyor..."}
          </Text>
          <RightChevronIcon size={24} />
        </View>
      </TouchableOpacity>

      {data && data.items.length > 0 ? (
        <View style={styles.commentList}>
          {data.items.map((comment) => (
            <CommentCardShort
              novelId={novelId}
              key={comment.id}
              comment={comment}
            />
          ))}
        </View>
      ) : (
        <EmptyCommentState />
      )}
      <GoComment
        isEmptyState={!data || data.items.length === 0 ? true : false}
        onPressWrite={onPressWrite}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rightContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontFamily: "Mont-700",
    fontSize: 15,
    color: "#03061ed3",
    letterSpacing: -0.2,
  },
  commentCount: {
    fontFamily: "Mont-600",
    fontSize: 14,
    color: "#03061ed3",
  },
  commentList: {
    marginTop: 8,
    gap: 40,
  },
});
