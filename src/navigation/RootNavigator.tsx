import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import NovelScreen from "../screens/NovelScreen";
import SearchScreen from "../screens/SearchScreen";
import { RootStackParamList } from "../constants/navigation";
import CommentScreen from "@/screens/CommentScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import VerifyUserScreen from "@/screens/VerifyUserScreen";
import ReplyScreen from "@/screens/ReplyScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import PrivacySecurityScreen from "../screens/PrivacySecurityScreen";
import PurchaseHistoryScreen from "../screens/PurchaseHistoryScreen";
import DownloadedChaptersScreen from "../screens/DownloadedChaptersScreen";
import AppThemeScreen from "../screens/AppThemeScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import SupportFeedbackScreen from "../screens/SupportFeedbackScreen";
import AuthorPanelScreen from "../screens/AuthorPanelScreen";
import CreateNovelScreen from "@/screens/CreateNovelScreen";
import NovelPanelScreen from "@/screens/NovelPanelScreen";

import { useMeQuery } from "@/hooks/useMeQuery";
import { useAuthStore } from "@/store/useAuthStore";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { data: meData, isLoading } = useMeQuery([]);

  if (isLoading) {
    return null;
  }

  if (meData) {
    useAuthStore.setState({ user: meData });
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        fullScreenGestureEnabled: true,
        contentStyle: { backgroundColor: "white" },
        animation: "slide_from_right",
        orientation: "portrait",
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />

      <Stack.Group screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen name="Novel" component={NovelScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen
          name="PrivacySecurity"
          component={PrivacySecurityScreen}
        />
        <Stack.Screen
          name="PurchaseHistory"
          component={PurchaseHistoryScreen}
        />
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
        <Stack.Screen
          name="SupportFeedback"
          component={SupportFeedbackScreen}
        />
        <Stack.Screen name="CreateNovel" component={CreateNovelScreen} />
        <Stack.Screen name="NovelPanel" component={NovelPanelScreen} />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Comment" component={CommentScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyUser" component={VerifyUserScreen} />
        <Stack.Screen name="Reply" component={ReplyScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
