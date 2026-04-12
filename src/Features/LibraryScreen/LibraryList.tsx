import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useNovels } from "@/hooks/useNovels";
import { useAppTheme } from "@/hooks/useTheme";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { LibrarySheetData } from "./CustomLibrarySheet";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const NUM_COLUMNS = 3;
const CONTAINER_PADDING = 20;
const GAP = 12;
const CARD_WIDTH =
  (SCREEN_WIDTH - CONTAINER_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

export const LibraryList = ({
  openLibrarySheet,
}: {
  openLibrarySheet: (data: LibrarySheetData) => void;
}) => {
  const { data: novels, isLoading, error } = useNovels();
  const { theme } = useAppTheme();

  if (isLoading) {
    return (
      <View style={s.center}>
        <Text style={{ color: theme.textSecondary }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#E11D48" }}>{error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={novels?.items || []}
      keyExtractor={(item) => item.id.toString()}
      numColumns={NUM_COLUMNS}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.listContent}
      columnWrapperStyle={s.columnWrapper}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[s.card, { width: CARD_WIDTH }]}
          onPress={() =>
            openLibrarySheet({
              id: item.id,
              title: item.name,
              coverImageUrl: item.coverImage,
            })
          }
        >
          <View style={[s.imageWrapper, { backgroundColor: theme.surface }]}>
            <Image
              source={{ uri: item.coverImage }}
              style={s.image}
              contentFit="cover"
              transition={300}
            />
          </View>
          <Text
            numberOfLines={2}
            style={[s.nameText, { color: theme.textPrimary }]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    /> // FlatList burada doğru şekilde kapatıldı
  );
}; // Fonksiyon bloğu burada doğru şekilde kapatıldı

const s = StyleSheet.create({
  listContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    gap: GAP,
  },
  card: {
    marginBottom: 20,
    gap: 8,
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    fontFamily: "Mont-600",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: -0.4,
    paddingHorizontal: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
