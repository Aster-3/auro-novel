import { Screen } from "@/components/layout/Screen";
import { ProfileSettingsHeader } from "@/components/ProfileSettingsHeader";
import { CNStepOne } from "@/Features/CreateNovelScreen/CNStepOne";
import { NextButton } from "@/Features/CreateNovelScreen/NextButton";
import { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const CreateNovelScreen = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <Screen>
      <ProfileSettingsHeader title="Yeni Roman Oluştur" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 24}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <CNStepOne
                setProfileImage={setProfileImage}
                profileImage={profileImage}
              />

              <View style={styles.buttonWrapper}>
                <NextButton
                  onPress={() => console.log("Devam Et tıklandı")}
                  disabled={false}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default CreateNovelScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  buttonWrapper: {
    marginTop: "auto",
    width: "100%",
    alignItems: "center",
  },
});
