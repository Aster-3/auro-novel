import { Text, TouchableOpacity, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { FakeSearchBar } from "../components/fakeSearchBar";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const ChatScreen = () => {
  const navigation = useAppNavigation();
  return (
    <Screen>
      <FakeSearchBar />
      <Text>Placeholder for ChatScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Settings");
        }}
      >
        <Text>Tıkla Bana</Text>
      </TouchableOpacity>
    </Screen>
  );
};
export default ChatScreen;
