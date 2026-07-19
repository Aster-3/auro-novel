import React, { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabNavigator } from "./TabNavigator";
import NovelScreen from "../screens/NovelScreen";
import SearchScreen from "../screens/SearchScreen";
import { RootStackParamList } from "../constants/navigation";
import CommentScreen from "@/screens/CommentScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import VerifyUserScreen from "@/screens/VerifyUserScreen";
import ForgotPasswordScreen from "@/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "@/screens/ResetPasswordScreen";
import ReplyScreen from "@/screens/ReplyScreen";
import PersonalInfoScreen from "../screens/PersonalInfoScreen";
import PrivacySecurityScreen from "../screens/PrivacySecurityScreen";
import DownloadedChaptersScreen from "../screens/DownloadedChaptersScreen";
import DownloadedNovelDetailScreen from "@/screens/DownloadedNovelDetailScreen";
import AppThemeScreen from "../screens/AppThemeScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import SupportFeedbackScreen from "../screens/SupportFeedbackScreen";
import SubscriptionPlanScreen from "../screens/SubscriptionPlanScreen";
import AuthorPanelScreen from "../screens/AuthorPanelScreen";
import CreateNovelScreen from "../screens/CreateNovelScreen";
import NovelPanelScreen from "@/screens/NovelPanelScreen";
import UpdateTagCategoryScreen from "@/screens/UpdateTagCategoryScreen";
import ChapterEditScreen from "@/screens/ChapterEditScreen";
import ChapterReadScreen from "@/screens/ChapterReadScreen";
import ChapterCommentsScreen from "@/screens/ChapterCommentsScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";
import UserFollowListScreen from "@/screens/UserFollowListScreen";
import TagNovelsScreen from "@/screens/TagNovelsScreen";
import GlobalNotificationDetailScreen from "@/screens/GlobalNotificationDetailScreen";
import WriteReviewScreen from "@/screens/WriteReviewScreen";
import WriteReplyScreen from "@/screens/WriteReplyScreen";

import { useMeQuery } from "@/hooks/useMeQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";
import { enableScreens } from "react-native-screens";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: meData, isLoading } = useMeQuery([], {
    enabled: !!accessToken,
  });
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
        <Stack.Screen name="TagNovels" component={TagNovelsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen
          name="PrivacySecurity"
          component={PrivacySecurityScreen}
        />
        <Stack.Screen
          name="DownloadedChapters"
          component={DownloadedChaptersScreen}
        />
        <Stack.Screen
          name="DownloadedNovelDetail"
          component={DownloadedNovelDetailScreen}
        />
        <Stack.Screen name="AppTheme" component={AppThemeScreen} />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
        />
        <Stack.Screen
          name="GlobalNotificationDetail"
          component={GlobalNotificationDetailScreen}
        />
        <Stack.Screen name="AuthorPanelScreen" component={AuthorPanelScreen} />
        <Stack.Screen
          name="SupportFeedback"
          component={SupportFeedbackScreen}
        />
        <Stack.Screen
          name="SubscriptionPlan"
          component={SubscriptionPlanScreen}
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
        <Stack.Screen
          name="ChapterComments"
          component={ChapterCommentsScreen}
        />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="UserFollows" component={UserFollowListScreen} />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Comment" component={CommentScreen} />
        <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
        <Stack.Screen name="WriteReply" component={WriteReplyScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerifyUser" component={VerifyUserScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Reply" component={ReplyScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
