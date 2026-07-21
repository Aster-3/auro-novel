import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { FlagIcon2 } from "@/components/icons/FlagIcon2";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Novel } from "@/types/novel";
import NovelShareModal from "@/utils/NovelShareModal";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const NovelHeader = ({ novelData }: { novelData: Novel }) => {
  const navigation = useAppNavigation();
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const handleReportPress = () => {
    navigation.push("SupportFeedback", {
      initialType: "report",
      initialSubject: `Novel Şikayeti | ${novelData.name}: (Novel ID: ${novelData.id})`,
      isSubjectDisable: true,
      isTypeDisable: true,
    });
  };

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

      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
          onPress={() => setShareModalVisible(true)}
        >
          <ShareIcon size={22} />
          <Text style={{ color: "white", fontFamily: "Mont-600" }}>Paylaş</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
          onPress={handleReportPress}
        >
          <FlagIcon2 size={21} color="white" />
        </TouchableOpacity>
      </View>

      <NovelShareModal
        isVisible={isShareModalVisible}
        onClose={() => setShareModalVisible(false)}
        novel={novelData}
      />
    </View>
  );
};
