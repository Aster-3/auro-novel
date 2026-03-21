import { Text, TouchableOpacity, View } from "react-native";
import { BackArrowIcon } from "../../components/icons/BackArrowIcon";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export const ReplyHeader = ({ replyCount }: { replyCount: number }) => {
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <BackArrowIcon />
      </TouchableOpacity>
      <Text
        style={{
          fontFamily: "Mont-600",
          fontSize: 16,
          color: "#03061E",
          letterSpacing: -0.2,
        }}
      >
        Yanıtlar ({replyCount})
      </Text>
      <View style={{ width: 24 }} />
    </View>
  );
};
