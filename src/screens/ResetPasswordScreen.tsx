import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { EyeClosedIcon } from "@/components/icons/EyeClosedIcon";
import { EyeOpenIcon } from "@/components/icons/EyeOpenIcon";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/schemas/auth";
import { useToastStore } from "@/store/useToastStore";

const ResetPasswordScreen = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ResetPassword">>();
  const { theme, isDarkMode } = useAppTheme();
  const showToast = useToastStore((state) => state.showToast);
  const { mutate, isPending } = useResetPasswordMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordSchemaType, string[]>>
  >({});

  const email = route.params.email;

  const clearError = (field: keyof ResetPasswordSchemaType) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = () => {
    if (isPending) return;

    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    mutate(
      {
        email,
        code: result.data.code,
        newPassword: result.data.newPassword,
      },
      {
        onSuccess: () => {
          showToast({
            message: "Şifren değiştirildi, tekrar giriş yapabilirsin",
            duration: 3500,
          });
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "Main",
                  params: {
                    screen: "Profile",
                    params: {
                      screen: "Main",
                      params: { openLogin: true },
                    },
                  },
                },
              ],
            }),
          );
        },
        onError: (err: any) => {
          setErrors({
            code: [err?.message || "Kod veya yeni şifre geçersiz."],
          });
        },
      },
    );
  };

  return (
    <Screen backgroundColor={theme.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BackArrowIcon color={theme.textPrimary} size={28} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Yeni Şifre
            </Text>
            <View
              style={[styles.divider, { backgroundColor: theme.textPrimary }]}
            />
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              <Text style={[styles.emailText, { color: theme.textPrimary }]}>
                {email}
              </Text>{" "}
              adresine gelen 6 haneli kodu ve yeni şifreni gir.
            </Text>
          </View>

          <View style={styles.form}>
            <View>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: errors.code
                      ? isDarkMode
                        ? "rgba(239,68,68,0.12)"
                        : "#FEF2F2"
                      : theme.backgroundSecondary,
                    borderColor: errors.code ? "#EF4444" : "transparent",
                  },
                  errors.code && styles.inputError,
                ]}
              >
                <PasswordIcon
                  color={
                    isDarkMode
                      ? "#FFFFFF"
                      : errors.code
                        ? "#EF4444"
                        : theme.textPrimary
                  }
                />
                <TextInput
                  value={formData.code}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setFormData((prev) => ({ ...prev, code: numericValue }));
                    clearError("code");
                  }}
                  placeholder="6 haneli kod"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.textPrimary }]}
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="next"
                />
              </View>
              {errors.code && (
                <Animated.Text
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  style={styles.errorText}
                >
                  {errors.code[0]}
                </Animated.Text>
              )}
            </View>

            <View>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: errors.newPassword
                      ? isDarkMode
                        ? "rgba(239,68,68,0.12)"
                        : "#FEF2F2"
                      : theme.backgroundSecondary,
                    borderColor: errors.newPassword ? "#EF4444" : "transparent",
                  },
                  errors.newPassword && styles.inputError,
                ]}
              >
                <PasswordIcon
                  color={
                    isDarkMode
                      ? "#FFFFFF"
                      : errors.newPassword
                        ? "#EF4444"
                        : theme.textPrimary
                  }
                />
                <TextInput
                  value={formData.newPassword}
                  onChangeText={(value) => {
                    setFormData((prev) => ({ ...prev, newPassword: value }));
                    clearError("newPassword");
                  }}
                  placeholder="Yeni şifre"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.textPrimary }]}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((value) => !value)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOpenIcon color={theme.textSecondary} />
                  ) : (
                    <EyeClosedIcon color={theme.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Animated.Text
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  style={styles.errorText}
                >
                  {errors.newPassword[0]}
                </Animated.Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.textPrimary },
                isPending && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isPending}
              activeOpacity={0.85}
            >
              <Text style={[styles.buttonText, { color: theme.background }]}>
                {isPending ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 5,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 20,
    marginLeft: -8,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  header: {
    marginBottom: 34,
  },
  title: {
    fontFamily: "Mont-600",
    fontSize: 32,
    fontWeight: "800",
  },
  divider: {
    width: 30,
    height: 3,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: "700",
  },
  form: {
    gap: 18,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  inputError: {
    borderWidth: 1,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
