import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import NovelShareModal from "@/utils/NovelShareModal";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const NovelHeader = ({ novelData }: { novelData: any }) => {
  const navigation = useAppNavigation();
  const [isShareModalVisible, setShareModalVisible] = useState(false);
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
        <BackArrowIcon size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
        onPress={() => setShareModalVisible(true)}
      >
        <ShareIcon size={22} />
        <Text style={{ color: "white", fontFamily: "Mont-600" }}>Paylaş</Text>
      </TouchableOpacity>
      <NovelShareModal
        isVisible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        novelData={novelData}
      />
    </View>
  );
};
