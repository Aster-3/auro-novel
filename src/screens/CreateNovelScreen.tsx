import { Screen } from "@/components/layout/Screen";
import { ProfileSettingsHeader } from "@/components/ProfileSettingsHeader";
import { CNStepOne } from "@/Features/CreateNovelScreen/CNStepOne";
import { NextButton } from "@/Features/CreateNovelScreen/NextButton";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCreateNovelMutation } from "@/hooks/useCreateNovelMutation";
import { createNovelSchemaStepOne } from "@/schemas/novel";
import { useToastStore } from "@/store/useToastStore";
import { createNovelMapper } from "@/utils/createNovelMapper";
import { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export interface CreateNovelScreenProps {
  name: string;
  coverImage: {
    uri: string;
    name: string;
    type: string;
  } | null;
  slug: string;
}

export type CreateNovelErrors = Partial<
  Record<keyof CreateNovelScreenProps, string>
>;

const CreateNovelScreen = () => {
  const [formData, setFormData] = useState<CreateNovelScreenProps>({
    name: "",
    coverImage: null,
    slug: "",
  });
  const [errors, setErrors] = useState<CreateNovelErrors>({});
  const { mutate, isPending } = useCreateNovelMutation();
  const navigation = useAppNavigation();

  const handleSubmit = () => {
    const result = createNovelSchemaStepOne.safeParse(formData);
    console.log("Validation result:", result);
    if (!result.success) {
      const fieldErrors: CreateNovelErrors = {};
      result.error.flatten().fieldErrors &&
        Object.entries(result.error.flatten().fieldErrors).forEach(
          ([field, messages]) => {
            if (messages && messages.length > 0) {
              fieldErrors[field as keyof CreateNovelScreenProps] = messages[0];
            }
          },
        );
      setErrors(fieldErrors);
    } else {
      setTimeout(() => {
        const data = createNovelMapper(formData);
        mutate(data, {
          onSuccess: () => {
            console.log("Başarılı!");
            onsuccess();
          },
          onError: (error: any) => {
            if (error.errors?.slug) {
              setErrors({
                slug: "Bu slug zaten kullanılıyor. Lütfen benzersiz bir slug girin.",
              });
            } else {
              useToastStore.getState().showToast({
                type: "Hata",
                message:
                  error.response?.data?.message ||
                  "Kitap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
              });
            }
          },
        });
      }, 500);
    }
  };

  const onsuccess = () => {
    setFormData({
      name: "",
      coverImage: null,
      slug: "",
    });
    useToastStore.getState().showToast({
      type: "Başarılı",
      message: "Kitabınız başarıyla oluşturuldu.",
    });
    navigation.goBack();
  };
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
          <View key="step-one">
            <CNStepOne
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
            />
          </View>

          <NextButton
            isLoading={isPending}
            onPress={handleSubmit}
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
    width: "100%",
  },
});
