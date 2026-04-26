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
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
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
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik
import { Header } from "@/components/Header";

const PersonalInfoScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
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
    if (error) return "#EF4444";
    return theme.textPrimary;
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
      aspect: field === "profileImageUrl" ? [1, 1] : [16, 9],
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
    if (userData) setFormData(userData);
  }, [userData]);

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

  if (isLoading || error)
    return (
      <Screen backgroundColor={theme.background}>
        <LoadingDots />
      </Screen>
    );

  return (
    <Screen backgroundColor={theme.background}>
      <Header title="Kişisel Bilgiler" isAdjacent={false} />
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
                  backgroundColor: theme.surface,
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#EDF2F7",
                },
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
                <View
                  style={[
                    styles.placeholderContainer,
                    { backgroundColor: theme.surface },
                  ]}
                >
                  <Feather name="image" size={28} color={theme.textSecondary} />
                  <Text
                    style={[
                      styles.placeholderText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Arkaplan seç
                  </Text>
                </View>
              )}
              <View style={styles.coverOverlay}>
                <Feather name="camera" size={20} color="white" />
                <Text style={styles.coverOverlayText}>Düzenle</Text>
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
                  backgroundColor: theme.surface,
                  borderColor: theme.background,
                },
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
                  <View style={styles.avatarOverlay}>
                    <Feather name="camera" size={20} color="white" />
                  </View>
                </>
              ) : (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <UserRegisterIcon color={theme.textSecondary} size={36} />
                  <View
                    style={[
                      styles.emptyAddIconBadge,
                      {
                        backgroundColor: theme.accent,
                        borderColor: theme.background,
                      },
                    ]}
                  >
                    <Feather
                      name="plus"
                      size={14}
                      color={isDarkMode ? "#000" : "#FFF"}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputsContainer}>
            {/* Takma Ad */}
            <View style={styles.separateFieldContainer}>
              <Text
                style={[styles.fieldLabelAbove, { color: theme.textSecondary }]}
              >
                Takma Ad
              </Text>
              <View
                style={[
                  styles.separateInputWrapper,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "#EDF2F7",
                  },
                  errors.nickname && styles.inputError,
                ]}
              >
                <UserRegisterIcon
                  color={getIconColor(errors.nickname)}
                  size={18}
                />
                <TextInput
                  style={[styles.separateInput, { color: theme.textPrimary }]}
                  placeholder="Takma Ad"
                  placeholderTextColor={theme.textSecondary}
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
                      ? "rgba(255,255,255,0.05)"
                      : "#EDF2F7",
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
                  placeholder="Kendinden bahset..."
                  placeholderTextColor={theme.textSecondary}
                  value={formData.description}
                  multiline
                  onChangeText={(val) => {
                    setFormData({ ...formData, description: val });
                    clearError("description");
                  }}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.textPrimary },
              (isPending || !isFormReady()) && { opacity: 0.5 },
            ]}
            onPress={handleUpdate}
            disabled={isPending || !isFormReady()}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <Text style={[styles.buttonText, { color: theme.background }]}>
                Güncelle
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
  coverSection: { marginTop: 10, marginHorizontal: 14 },
  coverPicker: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coverOverlayText: { color: "white", fontSize: 12, fontFamily: "Mont-600" },
  avatarSection: {
    alignItems: "center",
    marginTop: -52,
    marginBottom: 24,
    zIndex: 10,
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 44,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: { gap: 24, marginHorizontal: 14 },
  separateFieldContainer: { gap: 8 },
  fieldLabelAbove: {
    fontSize: 12,
    fontFamily: "Mont-600",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  separateInputWrapper: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
  },
  separateInput: { flex: 1, fontSize: 14, fontFamily: "Mont-500" },
  textAreaWrapper: {
    height: 120,
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  textArea: { textAlignVertical: "top", lineHeight: 20 },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 32,
  },
  buttonText: { fontSize: 15, fontFamily: "Mont-700", letterSpacing: 0.5 },
  fullImage: { width: "100%", height: "100%" },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderText: { fontSize: 12, fontFamily: "Mont-500" },
  emptyAddIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    fontFamily: "Mont-500",
    marginLeft: 4,
    marginTop: 4,
  },
});

export default PersonalInfoScreen;
