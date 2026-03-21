import { Text, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/SectionHeader";

const PrivacySecurityScreen = () => {
  return (
    <Screen>
      <SectionHeader headerName="Gizlilik ve Güvenlik" />
      <View style={{ padding: 16 }}>
        <Text>Gizlilik ve Güvenlik Sayfası</Text>
      </View>
    </Screen>
  );
};
export default PrivacySecurityScreen;
