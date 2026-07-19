import { EyeClosedIcon } from "@/components/icons/EyeClosedIcon";
import { EyeOpenIcon } from "@/components/icons/EyeOpenIcon";
import { MailIcon } from "@/components/icons/MailIcon";
import { PasswordIcon } from "@/components/icons/PasswordIcon";
import { UserRegisterIcon } from "@/components/icons/UserRegisterIcon";
import { registerSchema, RegisterSchemaType } from "@/schemas/auth";
import { useState, useEffect } from "react";
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
import { useAppTheme } from "@/hooks/useTheme"; // Kendi hook'un
import { CommonActions } from "@react-navigation/native";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const Dot = ({ delay }: { delay: number }) => {
  const { theme } = useAppTheme();
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
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { backgroundColor: theme.background }, // Nokta rengi buton metniyle aynı (zıt renk)
        animatedStyle,
      ]}
    />
  );
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
  const { theme } = useAppTheme();
  const navigation = useAppNavigation();
  const { mutate, isPending } = useRegisterMutation();
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

  const getIconColor = (error?: string[]) => {
    return error ? "#EF4444" : theme.textPrimary;
  };

  const navigateToLogin = () => {
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
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inputs}>
        {/* Kullanıcı Adı */}
        <View>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.backgroundSecondary },
              errors.username && styles.inputError,
            ]}
          >
            <UserRegisterIcon color={getIconColor(errors.username)} />
            <TextInput
              placeholder="Kullanıcı adı"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.textPrimary }]}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(val) => {
                setFormData({ ...formData, username: val.toLowerCase() });
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

        {/* Takma İsim */}
        <View>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.backgroundSecondary },
              errors.nickname && styles.inputError,
            ]}
          >
            <UserRegisterIcon color={getIconColor(errors.nickname)} />
            <TextInput
              placeholder="Takma İsim"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.textPrimary }]}
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

        {/* E-posta */}
        <View>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.backgroundSecondary },
              errors.email && styles.inputError,
            ]}
          >
            <MailIcon color={getIconColor(errors.email)} />
            <TextInput
              placeholder="E-posta adresi"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.textPrimary }]}
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

        {/* Şifre */}
        <View>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.backgroundSecondary },
              errors.password && styles.inputError,
            ]}
          >
            <PasswordIcon color={getIconColor(errors.password)} />
            <TextInput
              placeholder="Şifre"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.textPrimary }]}
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
              {showPassword ? (
                <EyeOpenIcon color={theme.textSecondary} />
              ) : (
                <EyeClosedIcon color={theme.textSecondary} />
              )}
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
            { backgroundColor: theme.textPrimary }, // Buton zıt renk
            (isPending || isFakeLoading) && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={isPending || isFakeLoading}
        >
          {isPending || isFakeLoading ? (
            <LoadingDots />
          ) : (
            <Text style={[styles.buttonText, { color: theme.background }]}>
              Kayıt Ol
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Zaten bir hesabın var mı?
          </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={[styles.signUp, { color: theme.textPrimary }]}>
              Giriş Yap
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputs: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 47,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
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
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
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
    fontSize: 14,
  },
  signUp: {
    fontWeight: "600",
    fontSize: 14,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
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
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
