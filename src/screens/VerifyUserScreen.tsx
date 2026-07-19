import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useResendVerificationCodeMutation } from "@/hooks/useResendVerificationCodeMutation";
import { useVerifyToken } from "@/hooks/useVerifyToken";

type ResendStatus = "idle" | "success" | "error";

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyUserScreen = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "VerifyUser">>();
  const { theme, isDarkMode } = useAppTheme();
  const { email } = route.params;

  const { mutate: verifyCode, isPending: isVerifyPending } = useVerifyToken();
  const { mutate: resendCode, isPending: isResendPending } =
    useResendVerificationCodeMutation();

  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    if (code.length !== 6 || isVerifyPending) return;

    setVerifyError("");
    verifyCode(
      { email, code },
      {
        onSuccess: () => {
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
          setVerifyError(
            err?.message || "Kod hatalı veya süresi dolmuş. Lütfen tekrar deneyin.",
          );
        },
      },
    );
  };

  const handleResendCode = () => {
    if (isResendPending || resendCooldown > 0) return;

    setVerifyError("");
    setResendStatus("idle");
    setResendMessage("");

    resendCode(email, {
      onSuccess: (data: any) => {
        setCode("");
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        setResendStatus("success");
        setResendMessage(
          data?.message || "Doğrulama kodu e-posta adresinize gönderildi.",
        );
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      onError: (err: any) => {
        setResendStatus("error");
        setResendMessage(
          err?.message ||
            "Doğrulama kodu gönderilemedi. Lütfen daha sonra tekrar deneyin.",
        );
      },
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const intervalId = setInterval(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [resendCooldown]);

  const getCellStyle = (digit: string, isFocused: boolean) => ({
    backgroundColor: verifyError
      ? isDarkMode
        ? "rgba(239,68,68,0.12)"
        : "#FEF2F2"
      : digit || isFocused
        ? isDarkMode
          ? theme.backgroundSecondary
          : "#FFF"
        : isDarkMode
          ? theme.backgroundSecondary
          : "#F2F2F7",
    borderColor: verifyError
      ? "#EF4444"
      : isFocused
        ? theme.textPrimary
        : digit
          ? isDarkMode
            ? "rgba(255,255,255,0.12)"
            : "#E5E7EB"
          : "transparent",
    borderWidth: isFocused ? 1.5 : 1,
  });

  const renderCells = () => {
    const cells = [];

    for (let i = 0; i < 6; i++) {
      const digit = code[i] || "";
      const isFocused = i === code.length;

      cells.push(
        <Pressable
          key={i}
          style={[styles.cell, getCellStyle(digit, isFocused)]}
          onPress={() => inputRef.current?.focus()}
        >
          <Text style={[styles.cellText, { color: theme.textPrimary }]}>
            {digit}
          </Text>
        </Pressable>,
      );
    }

    return cells;
  };

  return (
    <Screen backgroundColor={theme.background}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backButtonInner}>
            <BackArrowIcon color={theme.textPrimary} size={28} />
          </View>
        </TouchableOpacity>

        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Doğrulama Kodu
          </Text>
          <View
            style={[styles.divider, { backgroundColor: theme.textPrimary }]}
          />
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Lütfen{" "}
            <Text style={[styles.emailText, { color: theme.textPrimary }]}>
              {email}
            </Text>{" "}
            adresine gönderilen 6 haneli doğrulama kodunu giriniz.
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.codeWrapper}>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");

              if (numericText.length <= 6) {
                setCode(numericText);
                if (verifyError) setVerifyError("");
                if (resendStatus !== "idle") {
                  setResendStatus("idle");
                  setResendMessage("");
                }
              }
            }}
            keyboardType="number-pad"
            returnKeyType="done"
            textContentType="oneTimeCode"
            maxLength={6}
            style={styles.hiddenInput}
            caretHidden={true}
            selectionColor="transparent"
            cursorColor="transparent"
          />
          <View
            style={styles.codeContainer}
            onTouchEnd={() => inputRef.current?.focus()}
          >
            {renderCells()}
          </View>
        </View>

        {verifyError && (
          <Animated.Text
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={styles.errorText}
          >
            {verifyError}
          </Animated.Text>
        )}

        {resendMessage && (
          <Animated.Text
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={[
              styles.statusText,
              resendStatus === "error" ? styles.errorText : styles.successText,
            ]}
          >
            {resendMessage}
          </Animated.Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.textPrimary },
            (code.length !== 6 || isVerifyPending) && styles.buttonDisabled,
          ]}
          onPress={handleVerify}
          disabled={code.length !== 6 || isVerifyPending}
        >
          <Text style={[styles.buttonText, { color: theme.background }]}>
            {isVerifyPending ? "Doğrulanıyor..." : "Doğrula"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.resendButton,
            (isResendPending || resendCooldown > 0) &&
              styles.resendButtonDisabled,
          ]}
          onPress={handleResendCode}
          disabled={isResendPending || resendCooldown > 0}
        >
          <Text style={[styles.resendText, { color: theme.textPrimary }]}>
            {isResendPending
              ? "Kod gönderiliyor..."
              : resendCooldown > 0
                ? `Tekrar göndermek için ${resendCooldown} sn`
                : "Kodu Tekrar Gönder"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default VerifyUserScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 5,
    marginBottom: 32,
    paddingHorizontal: 14,
  },
  backButton: {
    marginBottom: 20,
    marginLeft: -8,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backButtonInner: {
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    paddingLeft: 0,
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
  content: {
    flex: 1,
    paddingHorizontal: 14,
  },
  codeWrapper: {
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
    height: 60,
    justifyContent: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    zIndex: 10,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  cell: {
    flex: 1,
    maxWidth: 50,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  statusText: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  successText: {
    color: "#16A34A",
  },
  button: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    padding: 10,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    fontWeight: "600",
    fontSize: 14,
  },
});
