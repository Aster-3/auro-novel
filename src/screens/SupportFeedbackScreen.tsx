import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/Header";
import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { SupportIcon } from "@/components/icons/SupportIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useFeedbackMutation } from "@/hooks/useFeedbackMutation";
import { useAppTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { FeedbackType } from "@/services/FeedbackService";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigation";

const feedbackTypes: { value: FeedbackType; label: string }[] = [
  { value: "support", label: "Destek" },
  { value: "feedback", label: "Geri Bildirim" },
  { value: "suggestion", label: "Öneri" },
  { value: "report", label: "Şikayet / Rapor" },
  { value: "other", label: "Diğer" },
];

type FormErrors = Partial<Record<"subject" | "message" | "email", string>>;

const getRuntimeMetadata = () => {
  const runtime = globalThis as typeof globalThis & {
    location?: { href?: string };
    navigator?: { userAgent?: string; language?: string };
  };

  return {
    pageUrl: runtime.location?.href ?? "app://support-feedback",
    userAgent: runtime.navigator?.userAgent ?? Platform.OS,
    locale: runtime.navigator?.language ?? "tr-TR",
    appVersion:
      Constants.expoConfig?.version ??
      Constants.manifest2?.extra?.expoClient?.version ??
      "unknown",
  };
};

const SupportFeedbackScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const route = useRoute<RouteProp<RootStackParamList, "SupportFeedback">>();
  const prefill = route.params;
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;
  const { mutate, isPending } = useFeedbackMutation();
  const [type, setType] = useState<FeedbackType>(
    prefill?.initialType ?? "support",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subject, setSubject] = useState(prefill?.initialSubject ?? "");
  const [message, setMessage] = useState(prefill?.initialMessage ?? "");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#E2E8F0";
  const mutedBorder = isDarkMode ? "rgba(255,255,255,0.06)" : "#F1F5F9";
  const selectedType = feedbackTypes.find((item) => item.value === type);

  const isFormReady = useMemo(() => {
    return (
      subject.trim().length > 0 &&
      message.trim().length > 0 &&
      (isLoggedIn || email.trim().length > 0)
    );
  }, [email, isLoggedIn, message, subject]);

  const clearError = (field: keyof FormErrors) => {
    if (!errors[field]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!subject.trim()) {
      nextErrors.subject = "Başlık alanı zorunludur.";
    }

    if (!message.trim()) {
      nextErrors.message = "Mesaj alanı zorunludur.";
    }

    if (!isLoggedIn) {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        nextErrors.email = "Email alanı zorunludur.";
      } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
        nextErrors.email = "Geçerli bir email adresi girin.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isPending || !validate()) return;

    mutate(
      {
        type,
        subject: subject.trim(),
        message: message.trim(),
        ...(isLoggedIn ? {} : { email: email.trim() }),
        metadata: getRuntimeMetadata(),
      },
      {
        onSuccess: () => {
          setType("support");
          setSubject("");
          setMessage("");
          setEmail("");
          setErrors({});
          useToastStore.getState().showToast({
            type: "Başarılı",
            message:
              "Mesajını aldık. Gerektiğinde email üzerinden sana dönüş yapabiliriz.",
            duration: 5000,
          });
        },
        onError: (error: any) => {
          useToastStore.getState().showToast({
            type: "Hata",
            message:
              error?.message || "Mesaj gönderilirken bir hata oluştu.",
          });
        },
      },
    );
  };

  return (
    <Screen backgroundColor={theme.background}>
      <Header title="Destek ve Geri Bildirim" isAdjacent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.intro,
              {
                borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.introIcon,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "#F8FAFC",
                },
              ]}
            >
              <SupportIcon color={theme.textSecondary} size={18} />
            </View>
            <View style={styles.introText}>
              <Text style={[styles.introTitle, { color: theme.textPrimary }]}>
                Sana nasıl yardımcı olabiliriz?
              </Text>
              <Text
                style={[styles.introDescription, { color: theme.textSecondary }]}
              >
                Bir sorun, fikir ya da iyileştirme önerisi paylaşabilirsin.
              </Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Kategori
            </Text>
            <View style={styles.dropdownWrap}>
              <Pressable
                onPress={() => setIsDropdownOpen((current) => !current)}
                style={({ pressed }) => [
                  styles.dropdownButton,
                  {
                    backgroundColor: theme.surface,
                    borderColor: mutedBorder,
                    opacity: pressed ? 0.78 : 1,
                  },
                ]}
              >
                <Text
                  style={[styles.dropdownText, { color: theme.textPrimary }]}
                >
                  {selectedType?.label}
                </Text>
                <View
                  style={[
                    styles.chevron,
                    isDropdownOpen && styles.chevronOpen,
                  ]}
                >
                  <DownChevronIcon color={theme.textSecondary} size={18} />
                </View>
              </Pressable>

              {isDropdownOpen && (
                <View
                  style={[
                    styles.dropdownMenu,
                    {
                      backgroundColor: theme.surface,
                      borderColor: mutedBorder,
                    },
                  ]}
                >
                  {feedbackTypes.map((item, index) => {
                    const isSelected = item.value === type;
                    return (
                      <Pressable
                        key={item.value}
                        onPress={() => {
                          setType(item.value);
                          setIsDropdownOpen(false);
                        }}
                        style={({ pressed }) => [
                          styles.dropdownItem,
                          index > 0 && {
                            borderTopColor: mutedBorder,
                            borderTopWidth: 1,
                          },
                          pressed && {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.04)"
                              : "#F8FAFC",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            {
                              color: isSelected
                                ? theme.textPrimary
                                : theme.textSecondary,
                            },
                            isSelected && styles.dropdownItemSelected,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Başlık
            </Text>
            <View
              style={[
                styles.inputWrapper,
                {
                  backgroundColor: theme.surface,
                  borderColor: errors.subject ? "#EF4444" : mutedBorder,
                },
              ]}
            >
              <TextInput
                value={subject}
                onChangeText={(value) => {
                  setSubject(value);
                  clearError("subject");
                }}
                placeholder="Kısa başlık"
                placeholderTextColor={theme.textSecondary + "80"}
                style={[styles.input, { color: theme.textPrimary }]}
                maxLength={90}
              />
            </View>
            {errors.subject && (
              <Text style={styles.errorText}>{errors.subject}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Mesaj
            </Text>
            <View
              style={[
                styles.inputWrapper,
                styles.messageWrapper,
                {
                  backgroundColor: theme.surface,
                  borderColor: errors.message ? "#EF4444" : mutedBorder,
                },
              ]}
            >
              <TextInput
                value={message}
                onChangeText={(value) => {
                  setMessage(value);
                  clearError("message");
                }}
                placeholder="Mesaj içeriği"
                placeholderTextColor={theme.textSecondary + "80"}
                style={[
                  styles.input,
                  styles.messageInput,
                  { color: theme.textPrimary },
                ]}
                multiline
                textAlignVertical="top"
                maxLength={1200}
              />
              <Text style={[styles.charCount, { color: theme.textSecondary }]}>
                {message.length}/1200
              </Text>
            </View>
            {errors.message && (
              <Text style={styles.errorText}>{errors.message}</Text>
            )}
          </View>

          {!isLoggedIn && (
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.surface,
                    borderColor: errors.email ? "#EF4444" : mutedBorder,
                  },
                ]}
              >
                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value.trim());
                    clearError("email");
                  }}
                  placeholder="guest@example.com"
                  placeholderTextColor={theme.textSecondary + "80"}
                  style={[styles.input, { color: theme.textPrimary }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.button,
              { backgroundColor: theme.textPrimary },
              (isPending || !isFormReady) && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isPending || !isFormReady}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <>
                <SendIcon
                  color={isDarkMode ? "#000000" : "#FFFFFF"}
                  size={18}
                />
                <Text
                  style={[
                    styles.buttonText,
                    { color: isDarkMode ? "#000000" : "#FFFFFF" },
                  ]}
                >
                  Gönder
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default SupportFeedbackScreen;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 18,
    paddingTop: 8,
    paddingBottom: 48,
  },
  intro: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  introIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  introText: {
    flex: 1,
    gap: 5,
  },
  introTitle: {
    fontSize: 13,
    fontFamily: "Mont-600",
  },
  introDescription: {
    fontSize: 11,
    fontFamily: "Mont-500",
    lineHeight: 17,
  },
  fieldGroup: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 9,
    fontFamily: "Mont-800",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    opacity: 0.6,
  },
  dropdownWrap: {
    position: "relative",
    zIndex: 10,
  },
  dropdownButton: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 12,
    fontFamily: "Mont-500",
  },
  chevron: {
    transform: [{ rotate: "0deg" }],
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  dropdownItem: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 12,
    fontFamily: "Mont-500",
  },
  dropdownItemSelected: {
    fontFamily: "Mont-700",
  },
  inputWrapper: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 12,
    fontFamily: "Mont-500",
  },
  messageWrapper: {
    height: 164,
    alignItems: "flex-start",
    paddingTop: 12,
    paddingBottom: 28,
  },
  messageInput: {
    lineHeight: 20,
  },
  charCount: {
    position: "absolute",
    right: 14,
    bottom: 10,
    fontSize: 9,
    fontFamily: "Mont-700",
    opacity: 0.45,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 10,
    fontFamily: "Mont-700",
    marginLeft: 8,
    marginTop: -4,
  },
  button: {
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Mont-700",
  },
  buttonDisabled: {
    opacity: 0.45,
  },
});


