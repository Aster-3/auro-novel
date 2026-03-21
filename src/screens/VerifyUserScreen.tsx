import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/constants/navigation";
import { Screen } from "@/components/layout/Screen";
import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useVerifyToken } from "@/hooks/useVerifyToken";
import { globalNavigate } from "@/navigation/globalNavigate";

const VerifyUserScreen = () => {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "VerifyUser">>();

  const { mutate, isPending, error } = useVerifyToken();
  const { email } = route.params;

  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const handleVerify = () => {
    console.log("Doğrulanıyor:", email, "Kod:", code);
    mutate(
      { email, code },
      {
        onSuccess: (data) => {
          console.log("Doğrulama Başarılı:", data);
          Alert.alert("Başarılı", "Doğrulama başarılı! Giriş yapabilirsiniz.");
          globalNavigate("Main", { screen: "Profile" });
          // Doğrulama başarılı olduğunda yapılacak işlemler (örneğin, kullanıcıyı giriş yapmış gibi göstermek)
        },
        onError: (err) => {
          console.log("Doğrulama Hatası:", err);
          // Hata durumunda kullanıcıya bilgi vermek veya tekrar deneme imkanı sunmak
        },
      },
    );

    // API request here
  };

  useEffect(() => {
    // Sayfa açıldığında otomatik klavye açılabilir veya inputa odaklanılabilir
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < 6; i++) {
      const digit = code[i] || "";
      const isFocused = i === code.length;
      cells.push(
        <Pressable
          key={i}
          style={[
            styles.cell,
            isFocused && styles.cellFocused,
            digit && styles.cellFilled,
          ]}
          onPress={() => inputRef.current?.focus()}
        >
          <Text style={styles.cellText}>{digit}</Text>
        </Pressable>,
      );
    }
    return cells;
  };

  return (
    <Screen>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backButtonInner}>
            <BackArrowIcon color="#111827" size={28} />
          </View>
        </TouchableOpacity>

        <View style={styles.textWrapper}>
          <Text style={styles.title}>Doğrulama Kodu</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            Lütfen <Text style={styles.emailText}>{email}</Text> adresine
            gönderilen 6 haneli doğrulama kodunu giriniz.
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
              // Sadece rakam girilmesine izin ver
              const numericText = text.replace(/[^0-9]/g, "");
              if (numericText.length <= 6) {
                setCode(numericText);
                if (numericText.length === 6) {
                  // Otomatik doğrulama tetiklenebilir veya klavye kapatılabilir
                  // Keyboard.dismiss();
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

        <TouchableOpacity
          style={[styles.button, code.length !== 6 && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={code.length !== 6}
        >
          <Text style={styles.buttonText}>Doğrula</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>Kodu Tekrar Gönder</Text>
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
    color: "#111827",
    letterSpacing: -1,
  },
  divider: {
    width: 30,
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Mont-500",
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 24,
    fontWeight: "400",
  },
  emailText: {
    fontWeight: "700",
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
  },
  codeWrapper: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
    height: 60, // Hücre yüksekliği ile uyumlu olmalı
    justifyContent: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0, // Tamamen gizle ama tıklanabilir tut
    zIndex: 10, // En üstte olmalı
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  cell: {
    flex: 1, // Her bir hücre eşit genişlikte olsun
    maxWidth: 50, // Çok geniş olmalarını engellemek için
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  cellFocused: {
    borderColor: "#000",
    borderWidth: 1.5,
    backgroundColor: "#FFF",
  },
  cellFilled: {
    backgroundColor: "#FFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  cellText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  button: {
    height: 54,
    backgroundColor: "#000",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    padding: 10,
  },
  resendText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});
