import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
export const SeriesCardVertical = ({
  id,
  cover,
  name,
}: {
  id: string;
  cover: string;
  name: string;
}) => {
  const navigation = useAppNavigation();
  return (
    <View
      style={{ width: 100, display: "flex", alignContent: "center", gap: 8 }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.push("Novel", { id });
        }}
        style={{
          width: "100%",
          aspectRatio: 2 / 3,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: String(cover) }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={{
          fontFamily: "Mont-600",
          color: "#343434",
          fontSize: 12,
          textAlign: "center",
        }}
      >
        {name}
      </Text>
    </View>
  );
};
