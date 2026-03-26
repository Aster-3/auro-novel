import { AuthorIcon } from "@/components/icons/AuthorIcon";
import { LikeIcon } from "@/components/icons/LikeIcon";
import { StatusIcon } from "@/components/icons/StatusIcon";
import { ViewIcon } from "@/components/icons/ViewIcon";
import { Author, Category, SeriesStatus } from "@/types/novel";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";

export const NovelMetaData = ({
  cover,
  author,
  name,
  recommendRate,
  genres,
  status,
  viewCount,
}: {
  cover: string;
  author: Author;
  name: string;
  recommendRate: number | null;
  genres: Category[];
  status: SeriesStatus;
  viewCount: number;
}) => {
  const authorName =
    author.nickname || author.user?.nickname || "Bilinmeyen Yazar";

  const imageSource = cover;

  const statusMap = {
    ongoing: {
      text: "Devam Ediyor",
      color: "#03e889",
    },
    completed: {
      text: "Tamamlandı",
      color: "#36e8ff",
    },
    hiatus: {
      text: "Ara Verildi",
      color: "#c2f493",
    },
    cancelled: {
      text: "Durduruldu",
      color: "#FF3D00",
    },
    draft: {
      text: "Hazırlıkta",
      color: "#FFD600",
    },
  };

  const formatViewCount = (count: number) => {
    if (count >= 10000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    return count === 0 ? "Görüntülenme Yok" : count;
  };
  const [isImageOpen, setIsImageOpen] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setIsImageOpen(true)}
        style={styles.posterContainer}
      >
        <Image
          source={cover}
          style={styles.posterImage}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
        />
        <View style={styles.posterOverlay} />
      </TouchableOpacity>

      <Modal
        visible={isImageOpen}
        statusBarTranslucent={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageOpen(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setIsImageOpen(false)}
        >
          <View style={styles.fullImageContainer}>
            <Image
              source={imageSource}
              style={styles.fullImage}
              contentFit="cover" //
              transition={300}
            />
          </View>
        </Pressable>
      </Modal>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.row}>
          <AuthorIcon color="white" />
          <Text style={styles.text}>{authorName}</Text>
        </View>

        <View style={styles.row}>
          <StatusIcon size={12} color={statusMap[status].color || "#ccc"} />
          <Text
            style={[
              styles.text,
              styles.statusText,
              { color: statusMap[status]?.color ?? "#ccc" },
            ]}
          >
            {statusMap[status]?.text ?? "Bilinmeyen Durum"}
          </Text>
        </View>

        <View style={[styles.row, styles.rowSpace]}>
          <View style={styles.row}>
            <ViewIcon color="white" size={14} />
            <Text style={styles.text}>{formatViewCount(15362)}</Text>
          </View>
          <View style={styles.row}>
            <LikeIcon color="white" />
            <Text style={styles.text}>
              {recommendRate
                ? `${recommendRate}% Öneriliyor`
                : "Öneri Oranı Yok"}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          {genres && genres.length > 0 ? (
            genres.map((genre, index) => (
              <View key={genre.id} style={styles.genreWrapper}>
                <Text style={styles.text}>{genre.trName}</Text>
                {index !== genres.length - 1 && (
                  <View style={styles.genreDot} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.genreWrapper}>
              <View style={styles.genreDot} />

              <Text style={styles.text}>Mevcut Kategori Yok</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    zIndex: 99,
    gap: 20,
  },
  posterContainer: {
    width: 120,
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  posterImage: {
    width: "100%",
    height: "100%",
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  infoContainer: {
    flex: 1,
    gap: 8,
    overflow: "hidden",
  },
  title: {
    fontFamily: "Mont-700",
    fontSize: 18,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  rowSpace: {
    justifyContent: "flex-start",
  },
  text: {
    color: "white",
    fontSize: 12,
  },
  statusText: {
    color: "#00CE78",
  },
  genreWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  genreDot: {
    backgroundColor: "#e4e4e4",
    width: 3,
    aspectRatio: "1/1",
    borderRadius: 99,
    marginTop: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImageContainer: {
    width: "80%",
    aspectRatio: 2 / 3,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
