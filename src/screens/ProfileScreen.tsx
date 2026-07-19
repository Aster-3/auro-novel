import { Screen } from "../components/layout/Screen";
import { ProfileHeader } from "@/Features/ProfileScreen/ProfileHeader";
import { ProfileBodyTop } from "@/Features/ProfileScreen/ProfileBodyTop";
import { ProfileBodyMiddle } from "@/Features/ProfileScreen/ProfileBodyMiddle";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileBodyBottom } from "@/Features/ProfileScreen/ProfileBodyBottom";
import { useEffect, useRef } from "react";
import { LoginSheet, LoginSheetRef } from "@/Features/ProfileScreen/LoginSheet";
import { useTabBarBottomPadding } from "@/utils/useTabBarBottomPadding";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik
import { StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfileScreen = () => {
  const bottomSheetRef = useRef<LoginSheetRef>(null);
  const tabBarBottomPadding = useTabBarBottomPadding();
  const { theme } = useAppTheme();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const openLoginSheet = () => {
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    if (!route.params?.openLogin) return;

    const timeoutId = setTimeout(() => {
      bottomSheetRef.current?.expand();
      navigation.setParams({ openLogin: undefined });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [navigation, route.params?.openLogin]);

  return (
    <Screen
      backgroundColor={theme.background}
      style={{
        gap: 16,
        paddingTop: 20,
      }}
    >
      <ProfileHeader openLoginSheet={openLoginSheet} />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: tabBarBottomPadding }}
      >
        <ProfileBodyTop />
        <ProfileBodyMiddle />
        <ProfileBodyBottom />
        <LoginSheet ref={bottomSheetRef} />
      </ScrollView>
    </Screen>
  );
};

export default ProfileScreen;
