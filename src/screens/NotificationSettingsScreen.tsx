import { Text, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/SectionHeader";

const NotificationSettingsScreen = () => {
  return (
    <Screen>
      <SectionHeader headerName="Bildirim Ayarları" />
      <View style={{ padding: 16 }}>
        <Text>Bildirim Ayarları Sayfası</Text>
      </View>
    </Screen>
  );
};
export default NotificationSettingsScreen;
