import { Text, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/SectionHeader";

const DownloadedChaptersScreen = () => {
  return (
    <Screen>
      <SectionHeader headerName="İndirilen Bölümler" />
      <View style={{ padding: 16 }}>
        <Text>İndirilen Bölümler Sayfası</Text>
      </View>
    </Screen>
  );
};
export default DownloadedChaptersScreen;
