import { Text, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { SectionHeader } from "../components/SectionHeader";

const AuthorPanelScreen = () => {
  return (
    <Screen>
      <SectionHeader headerName="Yazar Olmak İster misiniz?" />
      <View style={{ padding: 16 }}>
        <Text>Yazar Olmak İster misiniz? Sayfası</Text>
      </View>
    </Screen>
  );
};
export default AuthorPanelScreen;
