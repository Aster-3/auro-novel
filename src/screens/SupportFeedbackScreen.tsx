import { Text, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/SectionHeader";

const SupportFeedbackScreen = () => {
  return (
    <Screen>
      <SectionHeader headerName="Destek ve Geri Bildirim" />
      <View style={{ padding: 16 }}>
        <Text>Destek ve Geri Bildirim Sayfası</Text>
      </View>
    </Screen>
  );
};
export default SupportFeedbackScreen;
