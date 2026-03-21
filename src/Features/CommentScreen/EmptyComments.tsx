import { Image } from "expo-image";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import firstComment from "@assets/state-illustrations/first-comment.png";
import emptyList from "@assets/state-illustrations/empt-list.png";

export const EmptyComments = ({ hasMyComment }: { hasMyComment: boolean }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Image
          source={hasMyComment ? firstComment : emptyList}
          style={styles.image}
          contentFit="contain"
        />

        <Text style={styles.title}>
          {hasMyComment
            ? "Şimdilik sadece sen varsın!"
            : "Burası biraz sessiz..."}
        </Text>

        <Text style={styles.description}>
          {hasMyComment
            ? "Yorumunla bu bölümü başlattın! Diğerleri de katılabilir."
            : "Henüz kimse yazmamış. İlk sen başlatmak ister misin?"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    zIndex: -1,
    elevation: -1,
  },
  card: {
    width: "95%",
    padding: 32,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.9,
  },
  title: {
    fontFamily: "Mont-500",
    fontSize: 19,
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontFamily: "Mont-500",
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
    fontWeight: "400",
  },
});
