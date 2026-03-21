import { Text, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/SectionHeader";

const PurchaseHistoryScreen = () => {
  return (
    <Screen>
      <SectionHeader headerName="Satın Alımlar ve Geçmiş" />
      <View style={{ padding: 16 }}>
        <Text>Satın Alımlar ve Geçmiş Sayfası</Text>
      </View>
    </Screen>
  );
};
export default PurchaseHistoryScreen;
