import { EyeClosedIcon } from "@/components/icons/EyeClosedIcon";
import { EyeOpenIcon } from "@/components/icons/EyeOpenIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { UserRegisterIcon } from "@/components/icons/UserRegisterIcon";
import { registerSchema, RegisterSchemaType } from "@/schemas/auth";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
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
import { useRegisterMutation } from "@/hooks/useRegisterMutation";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useEffect } from "react";

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

export const RegisterForm = () => {
  const { mutate, isPending, error } = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isFakeLoading, setIsFakeLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterSchemaType, string[]>>
  >({});

  const handleRegister = () => {
    if (isPending || isFakeLoading) return;
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      console.log("Validation Failed From Zod:", formattedErrors);
      setErrors(formattedErrors);
    } else {
      setIsFakeLoading(true);
      setTimeout(() => {
        setIsFakeLoading(false);
        mutate(result.data, {
          onSuccess: () => {
            Alert.alert("Başarılı", "Giriş yapabilirsiniz.");
            globalNavigate("VerifyUser", { email: result.data.email });
          },
          onError: (err: any) => {
            setErrors(err.errors || {});
          },
        });
      }, 1000);

      console.log("Kayıt verileri geçerli:", result.data);
    }
  };

  const clearError = (field: keyof RegisterSchemaType) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getBorderColor = (error?: string[]) => {
    return error ? "#EF4444" : "transparent";
  };

  const getIconColor = (error?: string[]) => {
    return error ? "#EF4444" : "#1C274C";
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <View>
          <View
            style={[styles.inputWrapper, errors.username && styles.inputError]}
          >
            <UserRegisterIcon color={getIconColor(errors.username)} />
            <TextInput
              placeholder="Kullanıcı adı"
              placeholderTextColor="#9A9A9A"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(val) => {
                setFormData({ ...formData, username: val });
                clearError("username");
              }}
            />
          </View>
          {errors.username && (
            <Animated.Text
              entering={FadeInUp}
              exiting={FadeOutUp}
              style={styles.errorText}
            >
              {errors.username[0]}
            </Animated.Text>
          )}
        </View>

        <View>
          <View
            style={[styles.inputWrapper, errors.nickname && styles.inputError]}
          >
            <UserRegisterIcon color={getIconColor(errors.nickname)} />
            <TextInput
              placeholder="Takma İsim"
              placeholderTextColor="#9A9A9A"
              style={styles.input}
              onChangeText={(val) => {
                setFormData({ ...formData, nickname: val });
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
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            (isPending || isFakeLoading) && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={isPending || isFakeLoading}
        >
          {isPending || isFakeLoading ? (
            <LoadingDots />
          ) : (
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten bir hesabın var mı?</Text>
          <TouchableOpacity
            onPress={() =>
              globalNavigate("VerifyUser", { email: formData.email })
            }
          >
            <Text style={styles.signUp}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 47,
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
  actions: {
    marginTop: 32,
    gap: 16,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
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
  buttonDisabled: {
    opacity: 0.7,
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
});
