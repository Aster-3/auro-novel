import { Screen } from "../components/layout/Screen";
import { ProfileHeader } from "@/Features/ProfileScreen/ProfileHeader";
import { ProfileBodyTop } from "@/Features/ProfileScreen/ProfileBodyTop";
import { ProfileBodyMiddle } from "@/Features/ProfileScreen/ProfileBodyMiddle";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileBodyBottom } from "@/Features/ProfileScreen/ProfileBodyBottom";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { LoginSheet } from "@/Features/ProfileScreen/LoginSheet";

const ProfileScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openLoginSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <Screen backgroundColor="#f5f5f5" style={{ gap: 16, marginTop: 20 }}>
      <ProfileHeader openLoginSheet={openLoginSheet} />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 100 }}
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
