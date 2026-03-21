import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Text, TouchableOpacity, View } from "react-native";

export const NovelHeader = () => {
  const navigation = useAppNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <BackArrowIcon color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
      >
        <ShareIcon />
        <Text style={{ color: "white", fontFamily: "Mont-600" }}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};
