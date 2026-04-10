import { AuthorIcon } from "@/components/icons/AuthorIcon";
import { LikeIcon } from "@/components/icons/CommentLikeIcon";
import { StatusIcon } from "@/components/icons/StatusIcon";
import { ViewIcon } from "@/components/icons/ViewIcon";
import { Image, ImageSourcePropType, Text, View } from "react-native";

export const NovelHeadContent = ({
  cover,
  author,
  name,
  recommendRate,
}: {
  cover: ImageSourcePropType;
  author: string;
  name: string;
  recommendRate: string;
}) => {
  const text = { color: "white", fontSize: 12 };
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        gap: 20,
      }}
    >
      <View
        style={{
          width: 120,
          aspectRatio: 2 / 3,
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        <Image
          source={cover}
          width={120}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View style={{ flex: 1, overflow: "hidden", gap: 8 }}>
        <Text style={{ fontFamily: "Mont-700", fontSize: 18, color: "white" }}>
          {name}
        </Text>

        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <AuthorIcon color="white" />
          <Text style={text}>{author}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
          <StatusIcon size={13} />
          <Text style={{ ...text, color: "#00CE78" }}>Devam Ediyor</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <ViewIcon color="white" size={14} />
            <Text style={text}>15.7K</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <LikeIcon color="white" />
            <Text style={text}>{recommendRate}% Öneriyor</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
