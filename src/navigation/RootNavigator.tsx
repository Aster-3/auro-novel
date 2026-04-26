import React, { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
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
import AuthorWalletScreen from "@/screens/AuthorWalletScreen";
import AuthorTransactionScreen from "@/screens/AuthorTransactionScreen";
import CreateNovelScreen from "@/screens/CreateNovelScreen";
import NovelPanelScreen from "@/screens/NovelPanelScreen";
import UpdateTagCategoryScreen from "@/screens/UpdateTagCategoryScreen";
import ChapterEditScreen from "@/screens/ChapterEditScreen";
import ChapterReadScreen from "@/screens/ChapterReadScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";

import { useMeQuery } from "@/hooks/useMeQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";
import { enableScreens } from "react-native-screens";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { data: meData, isLoading } = useMeQuery([]);
  const { theme } = useAppTheme();

  useEffect(() => {
    if (meData) {
      useAuthStore.setState({ user: meData });
    }
  }, [meData]);

  enableScreens();

  const globalScreenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: "slide_from_right" as const,
      freezeOnBlur: true,
      contentStyle: { backgroundColor: theme.background },
    }),
    [theme.background],
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.textPrimary || "#000"} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      <Stack.Screen name="Main" component={TabNavigator} />

      <Stack.Group>
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
        <Stack.Screen name="AuthorWallet" component={AuthorWalletScreen} />
        <Stack.Screen
          name="AuthorTransaction"
          component={AuthorTransactionScreen}
        />
        <Stack.Screen
          name="SupportFeedback"
          component={SupportFeedbackScreen}
        />
        <Stack.Screen name="CreateNovel" component={CreateNovelScreen} />
        <Stack.Screen name="NovelPanel" component={NovelPanelScreen} />
        <Stack.Screen
          name="UpdateTagCategory"
          component={UpdateTagCategoryScreen}
        />
        <Stack.Screen name="ChapterEdit" component={ChapterEditScreen} />
        <Stack.Screen
          name="ChapterRead"
          options={{
            animation: "fade", // Okuma ekranı geçişi daha yumuşak olur
          }}
          component={ChapterReadScreen}
        />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
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
