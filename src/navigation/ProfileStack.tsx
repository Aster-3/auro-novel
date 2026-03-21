import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import PrivacySecurityScreen from "../screens/PrivacySecurityScreen";
import PurchaseHistoryScreen from "../screens/PurchaseHistoryScreen";
import DownloadedChaptersScreen from "../screens/DownloadedChaptersScreen";
import AppThemeScreen from "../screens/AppThemeScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import SupportFeedbackScreen from "../screens/SupportFeedbackScreen";
import AuthorPanelScreen from "../screens/AuthorPanelScreen";

const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
      <Stack.Screen
        name="DownloadedChapters"
        component={DownloadedChaptersScreen}
      />
      <Stack.Screen name="AppTheme" component={AppThemeScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
      <Stack.Screen name="AuthorPanelScreen" component={AuthorPanelScreen} />
      <Stack.Screen name="SupportFeedback" component={SupportFeedbackScreen} />
    </Stack.Navigator>
  );
};
