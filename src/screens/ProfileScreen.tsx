import { Screen } from "../components/layout/Screen";
import { ProfileHeader } from "@/Features/ProfileScreen/ProfileHeader";
import { ProfileBodyTop } from "@/Features/ProfileScreen/ProfileBodyTop";
import { ProfileBodyMiddle } from "@/Features/ProfileScreen/ProfileBodyMiddle";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileBodyBottom } from "@/Features/ProfileScreen/ProfileBodyBottom";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { LoginSheet } from "@/Features/ProfileScreen/LoginSheet";
import { useDynamicBottom } from "@/utils/useDynamicBottom";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik
import { StatusBar } from "react-native";

const ProfileScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dynamicBottom = useDynamicBottom();
  const { theme } = useAppTheme();

  const openLoginSheet = () => {
    bottomSheetRef.current?.expand();
  };

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
        contentContainerStyle={{ gap: 16, paddingBottom: dynamicBottom + 80 }}
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
