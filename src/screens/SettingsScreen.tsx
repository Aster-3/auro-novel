import { WeeklyPopular } from "@/Features/HomeScreen/WeeklySeries";
import { View, Text } from "react-native";

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "red", padding: 20, gap: 20 }}>
      <Text>Placeholder for SettingsScreen</Text>
      <WeeklyPopular />
    </View>
  );
};

export default SettingsScreen;
