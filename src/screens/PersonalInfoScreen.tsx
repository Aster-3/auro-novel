import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { Screen } from "@/components/layout/Screen";
import { UserRegisterIcon } from "@/components/icons/UserRegisterIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useUpdateProfileMutation } from "@/hooks/useUpdateProfileMutation";
import { useMeQuery } from "@/hooks/useMeQuery";
import * as ImagePicker from "expo-image-picker";
import { loginMapper } from "@/utils/loginMapper";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfileSchema, UpdateProfileSchemaType } from "@/schemas/auth";
import { useToastStore } from "@/store/useToastStore";
import { useAppTheme } from "@/hooks/useTheme";
import { Header } from "@/components/Header";
import { getProfileImageSource } from "@/utils/profileImage";
import {
  PROFILE_COVER_PICKER_ASPECT,
  PROFILE_HEADER,
} from "@/constants/profileLayout";

type GenderOption = "male" | "female" | "null";

const GENDER_OPTIONS: { value: GenderOption; label: string }[] = [
  { value: "null", label: "Belirtilmedi" },
  { value: "female", label: "Kadın" },
  { value: "male", label: "Erkek" },
];

const PersonalInfoScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const navigate = useAppNavigation();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
  } = useMeQuery([
    "nickname",
    "profileImageUrl",
    "profileBackgroundImageUrl",
    "description",
    "gender",
  ]);

  const { mutate, isPending } = useUpdateProfileMutation(userData?.id || "");

  type UploadImage = {
    uri: string;
    name: string;
    type: string;
  };

  interface PersonalInfoFormData {
    nickname: string;
    profileImageUrl?: string | UploadImage;
    profileBackgroundImageUrl?: string | UploadImage;
    description?: string;
    gender?: GenderOption;
  }

  const [formData, setFormData] = useState<PersonalInfoFormData>({
    nickname: "",
    profileImageUrl: undefined,
    profileBackgroundImageUrl: undefined,
    description: undefined,
    gender: "null",
  });

  const [errors, setErrors] = useState<{
    [key in keyof PersonalInfoFormData]?: string[];
  }>({});

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
    if (error) return "#EF4444";
    return theme.textSecondary;
  };

  const handleUpdate = () => {
    const result = updateProfileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    const data: any = loginMapper(result.data, userData);

    if (data._parts.length === 0) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "Güncellemek için önce değişiklik yapmalısınız.",
      });
      return;
    }
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        navigate.goBack();
        useToastStore.getState().showToast({
          type: "Başarılı",
          message: "Profiliniz başarıyla güncellendi.",
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
      aspect:
        field === "profileImageUrl" ? [1, 1] : PROFILE_COVER_PICKER_ASPECT,
      quality: 0.8,
    });

    if (pickedImage.canceled) return;

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
      setFormData({
        nickname: userData.nickname ?? "",
        profileImageUrl: userData.profileImageUrl,
        profileBackgroundImageUrl: userData.profileBackgroundImageUrl,
        description: userData.description ?? "",
        gender: userData.gender ?? "null",
      });
    }
  }, [userData]);

  const isFormReady = () => {
    if (!userData) return false;
    const currentDescription = userData.description ?? "";
    const currentGender = userData.gender ?? "null";

    return (
      (formData.nickname.trim() !== "" &&
        formData.nickname !== userData.nickname) ||
      (formData.description ?? "") !== currentDescription ||
      (formData.gender ?? "null") !== currentGender ||
      formData.profileImageUrl !== userData.profileImageUrl ||
      formData.profileBackgroundImageUrl !== userData.profileBackgroundImageUrl
    );
  };

  if (isLoading || error)
    return (
      <Screen backgroundColor={theme.background}>
        <LoadingDots />
      </Screen>
    );

  return (
    <Screen backgroundColor={theme.background}>
      <Header title="Profilini Düzenle" isAdjacent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. COVER SECTION */}
          <View style={styles.coverSection}>
            <TouchableOpacity
              onPress={() => handleImagePick("profileBackgroundImageUrl")}
              style={[
                styles.coverPicker,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#E2E8F0",
                },
                errors.profileBackgroundImageUrl && styles.inputError,
              ]}
              activeOpacity={0.9}
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
                  <Feather name="image" size={24} color={theme.textSecondary} />
                  <Text
                    style={[
                      styles.placeholderText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Kapak Fotoğrafı Ekle
                  </Text>
                </View>
              )}
              <View style={styles.coverOverlay}>
                <Feather name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* 2. AVATAR SECTION */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={() => handleImagePick("profileImageUrl")}
              style={[
                styles.avatarCircle,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderColor: theme.background,
                },
                errors.profileImageUrl && styles.inputError,
              ]}
              activeOpacity={0.9}
            >
              <Image
                source={
                  typeof formData.profileImageUrl === "string"
                    ? getProfileImageSource(formData.profileImageUrl)
                    : formData.profileImageUrl || getProfileImageSource()
                }
                style={styles.fullImage}
                contentFit="cover"
              />
              <View style={styles.avatarOverlay}>
                <Feather name="camera" size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputsContainer}>
            {/* Takma Ad */}
            <View style={styles.separateFieldContainer}>
              <Text
                style={[styles.fieldLabelAbove, { color: theme.textSecondary }]}
              >
                Görünen İsim (Takma Ad)
              </Text>
              <View
                style={[
                  styles.separateInputWrapper,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                  },
                  errors.nickname && styles.inputError,
                ]}
              >
                <UserRegisterIcon
                  color={getIconColor(errors.nickname)}
                  size={16}
                />
                <TextInput
                  style={[styles.separateInput, { color: theme.textPrimary }]}
                  placeholder="Kullanıcı adın..."
                  placeholderTextColor={theme.textSecondary + "80"}
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
                <Animated.Text entering={FadeInUp} style={styles.errorText}>
                  {errors.nickname[0]}
                </Animated.Text>
              )}
            </View>

            {/* Hakkımda */}
            <View style={styles.separateFieldContainer}>
              <Text
                style={[styles.fieldLabelAbove, { color: theme.textSecondary }]}
              >
                Hakkımda
              </Text>
              <View
                style={[
                  styles.separateInputWrapper,
                  styles.textAreaWrapper,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                  },
                  errors.description && styles.inputError,
                ]}
              >
                <TextInput
                  style={[
                    styles.separateInput,
                    styles.textArea,
                    { color: theme.textPrimary },
                  ]}
                  placeholder="Kendinden kısaca bahset..."
                  placeholderTextColor={theme.textSecondary + "80"}
                  value={formData.description}
                  multiline
                  maxLength={100}
                  onChangeText={(val) => {
                    setFormData({ ...formData, description: val });
                    clearError("description");
                  }}
                />
                <Text
                  style={[styles.charCount, { color: theme.textSecondary }]}
                >
                  {formData.description?.length || 0}/100
                </Text>
              </View>
            </View>

            <View style={styles.separateFieldContainer}>
              <Text
                style={[styles.fieldLabelAbove, { color: theme.textSecondary }]}
              >
                Cinsiyet
              </Text>
              <View
                style={[
                  styles.genderGroup,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                  },
                  errors.gender && styles.inputError,
                ]}
              >
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = formData.gender === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      activeOpacity={0.85}
                      onPress={() => {
                        setFormData({ ...formData, gender: option.value });
                        clearError("gender");
                      }}
                      style={[
                        styles.genderOption,
                        isSelected && {
                          backgroundColor: theme.textPrimary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderOptionText,
                          {
                            color: isSelected
                              ? isDarkMode
                                ? "#000"
                                : "#FFF"
                              : theme.textSecondary,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.gender && (
                <Animated.Text entering={FadeInUp} style={styles.errorText}>
                  {errors.gender[0]}
                </Animated.Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.textPrimary },
              (isPending || !isFormReady()) && { opacity: 0.4 },
            ]}
            onPress={handleUpdate}
            disabled={isPending || !isFormReady()}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  { color: isDarkMode ? "#000" : "#FFF" },
                ]}
              >
                Değişiklikleri Kaydet
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
  coverSection: {},
  coverPicker: {
    width: "100%",
    aspectRatio: PROFILE_HEADER.coverAspectRatio,
    borderRadius: PROFILE_HEADER.coverRadius,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  coverOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginTop: -PROFILE_HEADER.avatarOverlap,
    marginBottom: PROFILE_HEADER.containerBottomGap,
    zIndex: 10,
  },
  avatarCircle: {
    width: PROFILE_HEADER.avatarSize,
    height: PROFILE_HEADER.avatarSize,
    borderRadius: PROFILE_HEADER.avatarRadius,
    borderWidth: PROFILE_HEADER.avatarBorderWidth,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: { gap: 18 },
  separateFieldContainer: { gap: 10 },
  fieldLabelAbove: {
    fontSize: 9,
    fontFamily: "Mont-800",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    opacity: 0.6,
  },
  separateInputWrapper: {
    height: 50,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
  },
  separateInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Mont-500",
    height: "100%",
  },
  textAreaWrapper: {
    height: 104,
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  textArea: {
    textAlignVertical: "top",
    lineHeight: 20,
  },
  charCount: {
    position: "absolute",
    bottom: 8,
    right: 14,
    fontSize: 9,
    fontFamily: "Mont-700",
    opacity: 0.4,
  },
  genderGroup: {
    minHeight: 50,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    gap: 4,
    borderWidth: 1,
  },
  genderOption: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  genderOptionText: {
    fontSize: 11,
    fontFamily: "Mont-700",
  },
  button: {
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Mont-600",
    letterSpacing: 0.2,
  },
  fullImage: { width: "100%", height: "100%" },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  placeholderText: { fontSize: 11, fontFamily: "Mont-700", opacity: 0.6 },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.03)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 10,
    fontFamily: "Mont-700",
    marginLeft: 8,
    marginTop: 2,
  },
});

export default PersonalInfoScreen;
