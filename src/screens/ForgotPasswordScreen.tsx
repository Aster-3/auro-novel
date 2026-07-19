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
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { Screen } from "@/components/layout/Screen";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useForgotPasswordMutation } from "@/hooks/useForgotPasswordMutation";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/schemas/auth";

const ForgotPasswordScreen = () => {
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();
  const { mutate, isPending } = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordSchemaType, string[]>>
  >({});

  const handleSubmit = () => {
    if (isPending) return;

    const result = forgotPasswordSchema.safeParse({ email: email.trim() });

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    mutate(result.data, {
      onSuccess: () => {
        navigation.navigate("ResetPassword", { email: result.data.email });
      },
      onError: (err: any) => {
        setErrors({
          email: [
            err?.message ||
              "Şifre sıfırlama kodu gönderilemedi. Tekrar deneyin.",
          ],
        });
      },
    });
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
              Şifremi Unuttum
            </Text>
            <View
              style={[styles.divider, { backgroundColor: theme.textPrimary }]}
            />
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Hesabına bağlı e-posta adresini gir. Sana şifre sıfırlama kodunu
              gönderelim.
            </Text>
          </View>

          <View style={styles.form}>
            <View>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: errors.email
                      ? isDarkMode
                        ? "rgba(239,68,68,0.12)"
                        : "#FEF2F2"
                      : theme.backgroundSecondary,
                    borderColor: errors.email ? "#EF4444" : "transparent",
                  },
                  errors.email && styles.inputError,
                ]}
              >
                <MailIcon
                  color={
                    isDarkMode
                      ? "#FFFFFF"
                      : errors.email
                        ? "#EF4444"
                        : theme.textPrimary
                  }
                />
                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (errors.email) setErrors({});
                  }}
                  placeholder="E-posta adresi"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.textPrimary }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                />
              </View>
              {errors.email && (
                <Animated.Text
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                  style={styles.errorText}
                >
                  {errors.email[0]}
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
                {isPending ? "Gönderiliyor..." : "Kod Gönder"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default ForgotPasswordScreen;

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
  form: {
    gap: 22,
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
