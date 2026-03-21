import { Image, Text, TouchableOpacity, View } from "react-native";
import { ChapterIcon } from "./icons/ChapterIcon";
import { AuthorIcon } from "./icons/AuthorIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { StatusIcon } from "./icons/StatusIcon";
import { LikeIcon } from "./icons/LikeIcon";

export const SeriesCardHorizontal = ({ props }: { props: any }) => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Novel", props);
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
        <Image source={props.cover} style={{ width: "100%", height: "100%" }} />
      </View>
      <View style={{ display: "flex", gap: 4, maxWidth: 120 }}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontFamily: "Mont-600",
            color: "#343434",
            fontSize: 14,
            textAlign: "left",
          }}
        >
          {props.name}
        </Text>

        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <AuthorIcon />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: "Mont-500",
              color: "#7b7a7a",
              fontSize: 10,
              textAlign: "left",
            }}
          >
            {props.author}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <ChapterIcon />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: "Mont-500",
              color: "#7b7a7a",
              fontSize: 10,
              textAlign: "left",
            }}
          >
            Latest Chapter: {props.lastChapter}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <LikeIcon color="#03a964" />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: "Mont-500",
              color: "#7b7a7a",
              fontSize: 10,
              textAlign: "left",
            }}
          >
            %{props.recommendRate} Recommend
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
