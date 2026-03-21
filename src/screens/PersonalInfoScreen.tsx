import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/layout/Screen";
import { UserRegisterIcon } from "@/components/icons/UserRegisterIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { ProfileSettingsHeader } from "@/components/ProfileSettingsHeader";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useMeQuery } from "@/hooks/useMeQuery";
import * as ImagePicker from "expo-image-picker";
import { loginMapper } from "@/utils/loginMapper";
import { useModalStore } from "@/store/useModalStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfileSchema, UpdateProfileSchemaType } from "@/schemas/auth";
import { useToastStore } from "@/store/useToastStore";

const PersonalInfoScreen = () => {
  const navigate = useAppNavigation();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdateProfileMutation();
  const {
    data: userData,
    isLoading,
    error,
  } = useMeQuery([
    "nickname",
    "profileImageUrl",
    "profileBackgroundImageUrl",
    "description",
  ]);

  interface FormData {
    nickname: string;
    profileImageUrl?: string;
    profileBackgroundImageUrl?: string;
    description?: string;
  }

  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    profileImageUrl: undefined,
    profileBackgroundImageUrl: undefined,
    description: undefined,
  });
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string[] }>(
    {},
  );

  const clearError = (field: keyof UpdateProfileSchemaType) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getIconColor = (error?: string[]) => {
    return error ? "#EF4444" : "#1C274C";
  };

  const handleUpdate = () => {
    const result = updateProfileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    const data: any = loginMapper(formData, userData);

    if (data._parts.length === 0) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "Güncellemek için önce değişiklik yapmalısınız.",
      });
      return;
    }
    mutate(data, {
      onSuccess: (res: any) => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        queryClient.invalidateQueries({ queryKey: ["myComment"] });
        queryClient.invalidateQueries({ queryKey: ["commentPreviews"] });
        navigate.goBack();
        useToastStore.getState().showToast({
          type: "Başarılı",
          message: "Profiliniz başarıyla güncellendi.",
          duration: 3000,
        });
      },
      onError: (err: any) => {
        useToastStore.getState().showToast({
          type: "Hata",
          message:
            err?.response?.data?.message ||
            "Profil güncellenirken bir hata oluştu.",
        });
      },
    });
  };

  const handleImagePick = async (
    field: "profileImageUrl" | "profileBackgroundImageUrl",
  ) => {
    const pickedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: field === "profileImageUrl" ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (pickedImage.canceled) return;

    const fileSize = pickedImage.assets?.[0]?.fileSize;

    if (fileSize && fileSize > 5 * 1024 * 1024) {
      useToastStore.getState().showToast({
        type: "Hata",
        message: "Seçilen resim 5MB'dan büyük olamaz.",
      });
      return;
    }
    const formattedImage = {
      uri: pickedImage.assets[0].uri,
      name: pickedImage.assets[0].fileName || "upload.jpg",
      type: pickedImage.assets[0].mimeType || "image/jpeg",
    };
    setFormData((prev) => ({ ...prev, [field]: formattedImage }));
    clearError(field);
  };

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  if (isLoading || error) {
    return <Text>{error?.message || "Yükleniyor..."}</Text>;
  }

  const isFormReady = () => {
    if (!userData) return false;
    return (
      (formData.nickname.trim() !== "" &&
        formData.nickname !== userData.nickname) ||
      formData.description !== userData.description ||
      formData.profileImageUrl !== userData.profileImageUrl ||
      formData.profileBackgroundImageUrl !== userData.profileBackgroundImageUrl
    );
  };

  return (
    <Screen>
      <ProfileSettingsHeader title="Kişisel Bilgiler" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── 1. ARKA PLAN RESMİ (COVER) ── */}
          <View style={styles.coverSection}>
            <TouchableOpacity
              onPress={() => handleImagePick("profileBackgroundImageUrl")}
              style={[
                styles.coverPicker,
                errors.profileBackgroundImageUrl && styles.inputError,
              ]}
              activeOpacity={0.8}
            >
              {formData.profileBackgroundImageUrl ? (
                <Image
                  source={
                    typeof formData.profileBackgroundImageUrl === "string"
                      ? { uri: formData.profileBackgroundImageUrl }
                      : formData.profileBackgroundImageUrl
                  }
                  style={styles.fullImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Feather name="image" size={28} color="#A0AEC0" />
                  <Text style={styles.placeholderText}>Arkaplan seç</Text>
                </View>
              )}

              {/* Cover için belirgin koyu overlay */}
              <View style={styles.coverOverlay}>
                <Feather
                  name="camera"
                  size={24}
                  color="rgba(255,255,255,0.95)"
                />
                <Text style={styles.coverOverlayText}>Düzenle</Text>
              </View>
            </TouchableOpacity>
            {errors.profileBackgroundImageUrl && (
              <Animated.Text
                entering={FadeInUp}
                exiting={FadeOutUp}
                style={[styles.errorText, { marginTop: 4, marginLeft: 14 }]}
              >
                {errors.profileBackgroundImageUrl[0]}
              </Animated.Text>
            )}
          </View>

          {/* ── 2. AVATAR (Profil Resmi, Cover'ın üstüne biner) ── */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={() => handleImagePick("profileImageUrl")}
              style={[
                styles.avatarCircle,
                errors.profileImageUrl && styles.inputError,
              ]}
              activeOpacity={0.8}
            >
              {formData.profileImageUrl ? (
                <>
                  <Image
                    source={
                      typeof formData.profileImageUrl === "string"
                        ? { uri: formData.profileImageUrl }
                        : formData.profileImageUrl
                    }
                    style={styles.fullImage}
                    contentFit="cover"
                  />
                  {/* Şeffaf Overlay */}
                  <View style={styles.avatarOverlay}>
                    <Feather
                      name="camera"
                      size={24}
                      color="rgba(255,255,255,0.9)"
                    />
                  </View>
                </>
              ) : (
                <>
                  <UserRegisterIcon color="#9A9A9A" size={36} />
                  <View style={styles.emptyAddIconBadge}>
                    <Feather name="plus" size={16} color="white" />
                  </View>
                </>
              )}
            </TouchableOpacity>
            {errors.profileImageUrl && (
              <Animated.Text
                entering={FadeInUp}
                exiting={FadeOutUp}
                style={[styles.errorText, { marginTop: 6 }]}
              >
                {errors.profileImageUrl[0]}
              </Animated.Text>
            )}
          </View>

          <View style={styles.inputsContainer}>
            {/* ── Takma Ad ── */}
            <View style={styles.separateFieldContainer}>
              <Text style={styles.fieldLabelAbove}>Takma Ad</Text>
              <View
                style={[
                  styles.separateInputWrapper,
                  errors.nickname && styles.inputError,
                ]}
              >
                <UserRegisterIcon
                  color={getIconColor(errors.nickname)}
                  size={18}
                />
                <TextInput
                  style={styles.separateInput}
                  placeholder="Takma Ad"
                  placeholderTextColor="#9A9A9A"
                  value={formData.nickname}
                  onChangeText={(val) => {
                    setFormData({
                      ...formData,
                      nickname: val.trimStart().replace(/  +/g, " "),
                    });
                    clearError("nickname");
                  }}
                />
              </View>
              {errors.nickname && (
                <Animated.Text
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  style={styles.errorText}
                >
                  {errors.nickname[0]}
                </Animated.Text>
              )}
            </View>

            <View style={styles.separateFieldContainer}>
              <Text style={styles.fieldLabelAbove}>Hakkımda</Text>
              <View
                style={[
                  styles.separateInputWrapper,
                  styles.textAreaWrapper,
                  errors.description && styles.inputError,
                ]}
              >
                <TextInput
                  style={[styles.separateInput, styles.textArea]}
                  placeholder="Kendinden bahset..."
                  placeholderTextColor="#9A9A9A"
                  value={formData.description}
                  multiline
                  onChangeText={(val) => {
                    setFormData({ ...formData, description: val });
                    clearError("description");
                  }}
                />
              </View>
              {errors.description && (
                <Animated.Text
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  style={styles.errorText}
                >
                  {errors.description[0]}
                </Animated.Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (isPending || !isFormReady()) && { opacity: 0.7 },
            ]}
            onPress={handleUpdate}
            disabled={isPending || !isFormReady()}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <Text style={styles.buttonText}>Güncelle</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 48,
  },

  coverSection: {
    marginTop: 10,
    marginHorizontal: 14,
  },
  coverPicker: {
    width: "100%",
    height: 160,
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDF2F7",
    overflow: "hidden",
    position: "relative",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.59)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  coverOverlayText: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    fontWeight: "600",
  },

  avatarSection: {
    alignItems: "center",
    marginTop: -48,
    marginBottom: 24,
    zIndex: 10,
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#FFFFFF", // Etrafındaki border ile uyumlu olması için arka planı beyaz yaptım
    borderWidth: 4, // Arka plandan ayrışması için kalın beyaz çerçeve
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android için de hafif gölge
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  // ── 3. Form Stilleri (Ayrılmış Inputs) ──
  inputsContainer: {
    gap: 24,
    marginHorizontal: 14,
  },
  separateFieldContainer: {
    gap: 8,
  },
  fieldLabelAbove: {
    fontSize: 13,
    color: "#4A5568",
    fontWeight: "600",
    marginLeft: 4,
  },
  separateInputWrapper: {
    height: 48,
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  separateInput: {
    flex: 1,
    fontSize: 15,
    color: "#2D3748",
    textAlign: "left",
  },
  textAreaWrapper: {
    height: 150,
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  textArea: {
    textAlign: "left",
    textAlignVertical: "top",
    lineHeight: 22,
  },

  // ── Buton ──
  button: {
    backgroundColor: "#1A202C",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 36,
  },
  buttonDisabled: {
    backgroundColor: "#27303c",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  // ── Ortak Stiller ──
  fullImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F7FAFC",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontSize: 13,
    fontWeight: "500",
  },
  emptyAddIconBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#4A5568",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  inputError: {
    borderColor: "#FC8181",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default PersonalInfoScreen;
