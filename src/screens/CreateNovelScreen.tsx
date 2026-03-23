import { Screen } from "@/components/layout/Screen";
import { ProfileSettingsHeader } from "@/components/ProfileSettingsHeader";
import { CNStepOne } from "@/Features/CreateNovelScreen/CNStepOne";
import { NextButton } from "@/Features/CreateNovelScreen/NextButton";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
// Kütüphaneden gerekli bileşeni alıyoruz
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const CreateNovelScreen = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <Screen>
      <ProfileSettingsHeader title="Yeni Roman Oluştur" />

      <KeyboardAwareScrollView
        bottomOffset={24}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <CNStepOne
            setProfileImage={setProfileImage}
            profileImage={profileImage}
          />

          <NextButton
            onPress={() => console.log("Devam Et tıklandı")}
            disabled={false}
          />
        </View>
      </KeyboardAwareScrollView>
    </Screen>
  );
};

export default CreateNovelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
  },
});
