import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { BookReadIcon } from "@/components/icons/BookReadIcon";
import { Text, TouchableOpacity, View, Platform } from "react-native";

export const NovelNavCard = () => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 6,

        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          },
          android: {
            elevation: 5,
          },
        }),
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#040c46",
          borderRadius: 16,
          paddingVertical: 14,
          gap: 8,
        }}
      >
        <BookReadIcon size={18} color="white" />
        <Text style={{ fontFamily: "Mont-600", fontSize: 14, color: "white" }}>
          Hemen Oku
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          gap: 4,
        }}
      >
        <BookmarkIcon size={20} color="#040c46" />
        <Text
          style={{
            fontFamily: "Mont-500",
            fontSize: 11,
            color: "#494444",
            textAlign: "center",
          }}
        >
          Kaydet
        </Text>
      </TouchableOpacity>
    </View>
  );
};
