import { Image, Text, TouchableOpacity, View } from "react-native";
import { AuthorIcon } from "./icons/AuthorIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { LittleRecommendIcon } from "./icons/LittleRecommendIcon";
import { TableOfContentsIcon } from "./icons/TableOfContentsIcon";
import { GetLastUpdatedNovel } from "@/types/novel";

export const SeriesCardHorizontal = ({
  novel,
}: {
  novel: GetLastUpdatedNovel;
}) => {
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Novel", { id: novel.id });
      }}
      style={{
        flexDirection: "row",
        alignContent: "flex-start",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 80,
          aspectRatio: 2 / 3,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: novel.coverImage }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View style={{ display: "flex", gap: 4, maxWidth: 120 }}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontFamily: "Mont-600",
            color: theme.textPrimary,
            fontSize: 13,
            textAlign: "left",
          }}
        >
          {novel.name}
        </Text>

        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <AuthorIcon size={14} color={theme.textSecondary} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: "Mont-500",
              color: theme.textSecondary,
              fontSize: 10,
              textAlign: "left",
            }}
          >
            {novel.authorName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <TableOfContentsIcon size={12} color={theme.textSecondary} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: "Mont-500",
              color: theme.textSecondary,
              fontSize: 10,
              textAlign: "left",
            }}
          >
            Son Bölüm: {novel.chapterCount}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <LittleRecommendIcon color="#03a964" size={14} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: "Mont-500",
              color: theme.textSecondary,
              fontSize: 10,
              textAlign: "left",
            }}
          >
            %{novel.recommendRate ? novel.recommendRate.toFixed(1) : "---"}{" "}
            Tavsiye Edilme
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
