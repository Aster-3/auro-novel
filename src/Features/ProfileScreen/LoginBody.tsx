import { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

import { useLoginMutation } from "@/hooks/useLoginMutation";

import { MailIcon } from "@/components/icons/MailIcon";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { EyeOpenIcon } from "@/components/icons/EyeOpenIcon";
import { EyeClosedIcon } from "@/components/icons/EyeClosedIcon";
import { loginSchema, LoginSchemaType } from "@/schemas/auth";
import Animated, {
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useModalStore } from "@/store/useModalStore";

const Dot = ({ delay }: { delay: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 400 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const LoadingDots = () => {
  return (
    <View style={styles.loadingContainer}>
      <Dot delay={0} />
      <Dot delay={150} />
      <Dot delay={300} />
    </View>
  );
};

export const LoginBody = ({
  navigateToRegister,
  navigateToVerify,
  onLoginSuccess,
}: {
  navigateToRegister: () => void;
  navigateToVerify: (email: string) => void;
  onLoginSuccess: (
    data: any,
    accessToken: string,
    refreshToken: string,
  ) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFakeLoading, setIsFakeLoading] = useState(false);
  const showConfirm = useModalStore((state) => state.showConfirm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginSchemaType, string[]>>
  >({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending, error } = useLoginMutation();

  const handleLogin = () => {
    if (isPending || isFakeLoading) return;

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors(formattedErrors);
      console.log("Validation Failed From Zod:", formattedErrors);
    } else {
      setIsFakeLoading(true);

      setTimeout(() => {
        setIsFakeLoading(false);
        mutate(result.data, {
          onSuccess: (data) => {
            onLoginSuccess(data, data.accessToken, data.refreshToken);
          },
          onError: (err: any) => {
            if (err.statusCode === 403) {
              showConfirm({
                title: "Hesap Doğrulaması Gerekli",
                message:
                  "E posta adresiniz doğrulanmamış. Doğrulama sayfasına gitmek ister misiniz?",
                confirmText: "Evet, Git",
                onConfirm: () => {
                  navigateToVerify(formData.email);
                },
              });
              return;
            }
            if (err.errors) {
              setErrors(err.errors);
            } else {
              setErrors({
                password: ["E-posta adresi veya şifre hatalı."],
              });
            }
          },
        });
      }, 1000);
    }
  };

  const getIconColor = (error?: string[]) => {
    return error ? "#EF4444" : "#1C274C";
  };

  const clearError = (field: keyof LoginSchemaType) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tekrar Hoşgeldiniz</Text>
        <Text style={styles.subtitle}>
          Devam etmek için lütfen giriş yapın.
        </Text>
      </View>

      <View style={styles.inputs}>
        <View>
          <View
            style={[styles.inputWrapper, errors.email && styles.inputError]}
          >
            <MailIcon color={getIconColor(errors.email)} />

            <TextInput
              placeholder="E-posta adresi"
              placeholderTextColor="#9A9A9A"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(val) => {
                setFormData({ ...formData, email: val });
                clearError("email");
              }}
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

        <View>
          <View
            style={[styles.inputWrapper, errors.password && styles.inputError]}
          >
            <PasswordIcon color={getIconColor(errors.password)} />

            <TextInput
              placeholder="Şifre"
              placeholderTextColor="#9A9A9A"
              style={styles.input}
              secureTextEntry={!showPassword}
              onChangeText={(val) => {
                setFormData({ ...formData, password: val });
                clearError("password");
              }}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Animated.Text
              entering={FadeInUp}
              exiting={FadeOutUp}
              style={styles.errorText}
            >
              {errors.password[0]}
            </Animated.Text>
          )}
        </View>

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Şifrenizi mi unuttunuz?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            (isPending || isFakeLoading) && styles.buttonDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleLogin}
          disabled={isPending || isFakeLoading}
        >
          {isPending || isFakeLoading ? (
            <LoadingDots />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabınız yok mu?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.signUp}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 10,
  },

  header: {
    marginTop: 10,
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.6,
  },

  subtitle: {
    fontSize: 15,
    color: "#8E8E93",
    marginTop: 6,
  },

  inputs: {
    gap: 18,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  eyeButton: {
    padding: 8,
  },

  forgot: {
    alignSelf: "flex-end",
  },

  forgotText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },

  actions: {
    marginTop: 36,
    gap: 12,
  },

  button: {
    height: 52,
    backgroundColor: "#000",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },

  footerText: {
    color: "#8E8E93",
    fontSize: 14,
  },

  signUp: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 20,
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFF",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});
