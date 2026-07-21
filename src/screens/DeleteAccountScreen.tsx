import { Header } from "@/components/Header";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { Screen } from "@/components/layout/Screen";
import { deleteDownloadedDataForUser } from "@/db/offlineChaptersDb";
import { useDeleteMyAccountMutation } from "@/hooks/useDeleteMyAccountMutation";
import { unregisterStoredPushToken } from "@/hooks/usePushNotifications";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { TokenStorage } from "@/utils/tokenStorage";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CONFIRMATION_TEXT = "ONAYLIYORUM";

const DeleteAccountScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { mutate: deleteAccount, isPending } = useDeleteMyAccountMutation();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const isReady = useMemo(
    () =>
      password.trim().length > 0 &&
      confirmation.trim() === CONFIRMATION_TEXT &&
      !isPending,
    [confirmation, isPending, password],
  );

  const clearLocalSession = async () => {
    if (user?.id) {
      await deleteDownloadedDataForUser(user.id);
    }
    await unregisterStoredPushToken();
    await TokenStorage.clearTokens();
    useAuthStore.getState().logout();
    queryClient.clear();
  };

  const handleDeleteAccount = () => {
    if (!isReady) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "Devam etmek için şifreni girip ONAYLIYORUM yazmalısın.",
      });
      return;
    }

    useModalStore.getState().showConfirm({
      title: "Hesabı Sil",
      message:
        "Bu işlem hesabını devre dışı bırakır ve geri alınamaz. Hesabını silmek istediğine emin misin?",
      confirmText: "Evet, Sil",
      cancelText: "Vazgeç",
      onConfirm: () => {
        deleteAccount(
          {
            password,
            confirmation: CONFIRMATION_TEXT,
          },
          {
            onSuccess: async (response: any) => {
              await clearLocalSession();
              useToastStore.getState().showToast({
                type: "Başarılı",
                message: response?.message || "Hesabınız başarıyla silindi.",
              });
              navigation.navigate("Main");
            },
            onError: (error: any) => {
              useToastStore.getState().showToast({
                type: "Hata",
                message:
                  error?.errors?.password?.[0] ||
                  error?.errors?.confirmation?.[0] ||
                  error?.message ||
                  "Hesap silinirken bir hata oluştu.",
              });
            },
          },
        );
      },
    });
  };

  return (
    <Screen backgroundColor={theme.background} style={styles.screen}>
      <Header title="Hesabı Sil" isAdjacent={true} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View
            style={[
              styles.warningBlock,
              {
                backgroundColor: isDarkMode
                  ? "rgba(248,113,113,0.08)"
                  : "rgba(220,38,38,0.055)",
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(248,113,113,0.12)"
                    : "rgba(220,38,38,0.08)",
                },
              ]}
            >
              <TrashIcon color={isDarkMode ? "#FCA5A5" : "#DC2626"} size={18} />
            </View>
            <View style={styles.warningTextWrap}>
              <Text
                style={[
                  styles.warningTitle,
                  { color: isDarkMode ? "#FCA5A5" : "#B91C1C" },
                ]}
              >
                Bu işlem geri alınamaz
              </Text>
              <Text
                style={[styles.warningText, { color: theme.textSecondary }]}
              >
                Hesabın soft delete ile kapatılır, mevcut oturumların sonlandırılır
                ve cihazındaki oturum verileri temizlenir.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Şifre
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.035)"
                      : "rgba(15,23,42,0.025)",
                  },
                ]}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Hesap şifren"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.textPrimary }]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Onay metni
              </Text>
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.035)"
                      : "rgba(15,23,42,0.025)",
                  },
                ]}
              >
                <TextInput
                  value={confirmation}
                  onChangeText={setConfirmation}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholder={CONFIRMATION_TEXT}
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.textPrimary }]}
                />
              </View>
              <Text style={[styles.helper, { color: theme.textSecondary }]}>
                Devam etmek için {CONFIRMATION_TEXT} yaz.
              </Text>
            </View>
          </View>

          <Pressable
            disabled={!isReady}
            onPress={handleDeleteAccount}
            style={({ pressed }) => [
              styles.deleteButton,
              {
                backgroundColor: isReady
                  ? isDarkMode
                    ? "#FCA5A5"
                    : "#DC2626"
                  : isDarkMode
                    ? "rgba(255,255,255,0.055)"
                    : "rgba(15,23,42,0.055)",
                opacity: pressed ? 0.78 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.deleteButtonText,
                {
                  color: isReady
                    ? isDarkMode
                      ? "#1A0B0B"
                      : "#FFFFFF"
                    : theme.textSecondary,
                },
              ]}
            >
              {isPending ? "Hesap siliniyor..." : "Hesabı Sil"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 22,
  },
  warningBlock: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 14,
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  warningTextWrap: {
    flex: 1,
    gap: 5,
  },
  warningTitle: {
    fontFamily: "Mont-600",
    fontSize: 13,
  },
  warningText: {
    fontFamily: "Mont-500",
    fontSize: 11,
    lineHeight: 17,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontFamily: "Mont-600",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  inputWrap: {
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  input: {
    fontFamily: "Mont-500",
    fontSize: 13,
    paddingVertical: 0,
  },
  helper: {
    fontFamily: "Mont-500",
    fontSize: 10.5,
    marginLeft: 4,
  },
  deleteButton: {
    minHeight: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  deleteButtonText: {
    fontFamily: "Mont-600",
    fontSize: 13,
  },
});
