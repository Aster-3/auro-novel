import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { RootStackParamList } from "@/constants/navigation";
import { useCreateReplyMutation } from "@/hooks/useCreateReplyMutation";
import { useAppTheme } from "@/hooks/useTheme";
import { useModalStore } from "@/store/useModalStore";
import { useToastStore } from "@/store/useToastStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const MAX_LENGTH = 750;
const MIN_LENGTH = 5;

const WriteReplyScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "WriteReply">>();
  const navigation = useNavigation();
  const {
    commentId,
    novelId,
    parentReplyId = null,
    replyToNickname,
    replyPreview,
  } = route.params;
  const { theme, isDarkMode } = useAppTheme();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useCreateReplyMutation(commentId, novelId);

  const [replyText, setReplyText] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [allowLeave, setAllowLeave] = useState(false);
  const allowLeaveRef = useRef(false);

  const errorProgress = useSharedValue(0);
  const hasDraft = replyText.trim().length > 0;
  const canSubmit = replyText.trim().length >= MIN_LENGTH && !isPending;
  const targetName = replyToNickname?.trim() || "incelemeye";
  const hasTargetUser = Boolean(replyToNickname?.trim());

  useEffect(() => {
    errorProgress.value = withTiming(errorMsg ? 1 : 0, { duration: 220 });
  }, [errorMsg, errorProgress]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisibleCount(replyText.length);
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [replyText.length]);

  const animatedInputStyle = useAnimatedStyle(() => {
    const defaultBorderColor = isDarkMode
      ? "rgba(255,255,255,0.07)"
      : "#E5E7EB";

    return {
      borderColor: interpolateColor(
        errorProgress.value,
        [0, 1],
        [defaultBorderColor, "#E11D48"],
      ),
    };
  });

  const requestClose = useCallback(() => {
    if (!hasDraft) {
      allowLeaveRef.current = true;
      setAllowLeave(true);
      Keyboard.dismiss();
      navigation.goBack();
      return;
    }

    useModalStore.getState().showConfirm({
      title: "Yanıtı kapat",
      message: "Yazdığın metin silinecek. Çıkmak istiyor musun?",
      onConfirm: () => {
        allowLeaveRef.current = true;
        setAllowLeave(true);
        Keyboard.dismiss();
        navigation.goBack();
      },
    });
  }, [hasDraft, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (allowLeaveRef.current || allowLeave || !hasDraft) return;

      event.preventDefault();
      useModalStore.getState().showConfirm({
        title: "Yanıtı kapat",
        message: "Yazdığın metin silinecek. Çıkmak istiyor musun?",
        onConfirm: () => {
          allowLeaveRef.current = true;
          setAllowLeave(true);
          navigation.dispatch(event.data.action);
        },
      });
    });

    return unsubscribe;
  }, [allowLeave, hasDraft, navigation]);

  const handleSubmit = async () => {
    const content = replyText.trim();

    if (content.length < MIN_LENGTH) {
      setErrorMsg("Yanıtın çok kısa.");
      return;
    }

    if (content.length > MAX_LENGTH) {
      setErrorMsg(`Yanıtın ${MAX_LENGTH} karakteri aşamaz.`);
      return;
    }

    try {
      await mutateAsync({
        content,
        rootCommentId: commentId,
        parentReplyId,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["replies", "list", commentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments", "list", novelId],
        }),
        queryClient.invalidateQueries({ queryKey: ["comment", commentId] }),
      ]);

      allowLeaveRef.current = true;
      setAllowLeave(true);
      Keyboard.dismiss();
      navigation.goBack();

      setTimeout(() => {
        useToastStore.getState().showToast({
          message: "Yanıtın yayınlandı.",
        });
      }, 250);
    } catch {
      useToastStore.getState().showToast({
        message: "Yanıt yayınlanamadı. Lütfen tekrar dene.",
        type: "Hata",
      });
    }
  };

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#0A0A0B" : theme.surface },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable
            onPress={requestClose}
            hitSlop={10}
            style={({ pressed }) => [
              styles.backBtn,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "#F1F5F9",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <BackArrowIcon color={theme.textPrimary} size={22} />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={[styles.heading, { color: theme.textPrimary }]}>
              Yanıt yaz
            </Text>
            <Text style={[styles.subheading, { color: theme.textSecondary }]}>
              {hasTargetUser
                ? `${targetName} kullanıcısına yanıt ver`
                : "Bu incelemeye yanıt ver"}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View
            style={[
              styles.panel,
              {
                backgroundColor: isDarkMode ? "#0A0A0B" : theme.surface,
                borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#E5E7EB",
              },
            ]}
          >
            {!!replyPreview && (
              <View
                style={[
                  styles.quote,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.035)"
                      : "#F8FAFC",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "#E5E7EB",
                  },
                ]}
              >
                <Text
                  style={[styles.quoteLabel, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {hasTargetUser ? `${targetName}` : "İnceleme"}
                </Text>
                <Text
                  style={[styles.quoteText, { color: theme.textPrimary }]}
                  numberOfLines={2}
                >
                  {replyPreview}
                </Text>
              </View>
            )}

            <AnimatedTextInput
              placeholder="Yanıtını buraya bırak..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={replyText}
              onChangeText={(text) => {
                if (errorMsg) setErrorMsg(null);
                if (text.length <= MAX_LENGTH) setReplyText(text);
              }}
              selectionColor={theme.accent}
              textAlignVertical="top"
              autoFocus
              scrollEnabled
              underlineColorAndroid="transparent"
              style={[
                styles.textInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.035)"
                    : "#FAFBFC",
                },
                animatedInputStyle,
              ]}
            />

            <View style={styles.infoRow}>
              <View style={styles.errorSlot}>
                {errorMsg && (
                  <Animated.Text
                    entering={FadeInDown.duration(180)}
                    exiting={FadeOutUp.duration(140)}
                    style={styles.errorText}
                  >
                    {errorMsg}
                  </Animated.Text>
                )}
              </View>

              <Text
                style={[
                  styles.counterText,
                  {
                    color:
                      visibleCount >= MAX_LENGTH
                        ? "#E11D48"
                        : theme.textSecondary,
                  },
                ]}
              >
                {visibleCount}/{MAX_LENGTH}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.footer,
            {
              backgroundColor: isDarkMode ? "#0A0A0B" : theme.surface,
              borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#E5E7EB",
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              {
                backgroundColor: canSubmit
                  ? theme.textPrimary
                  : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#E5E7EB",
                opacity: pressed && canSubmit ? 0.82 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <>
                <Text
                  style={[
                    styles.submitLabel,
                    {
                      color: canSubmit ? theme.background : theme.textSecondary,
                    },
                  ]}
                >
                  Yayınla
                </Text>
                <SendIcon
                  color={canSubmit ? theme.background : theme.textSecondary}
                  size={17}
                />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WriteReplyScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 18,
    gap: 12,
  },
  headerText: {
    flex: 1,
    paddingTop: 1,
  },
  heading: {
    fontFamily: "Mont-500",
    fontSize: 16,
    letterSpacing: 0,
  },
  subheading: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 19,
    opacity: 0.68,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  panel: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 6,
  },
  quote: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  quoteLabel: {
    fontFamily: "Mont-700",
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.76,
  },
  quoteText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.78,
  },
  textInput: {
    height: 270,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 23,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
  },
  infoRow: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorSlot: {
    flex: 1,
  },
  errorText: {
    color: "#E11D48",
    fontFamily: "Mont-600",
    fontSize: 12,
    lineHeight: 17,
  },
  counterText: {
    fontFamily: "Mont-600",
    fontSize: 11,
    opacity: 0.78,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  submitLabel: {
    fontFamily: "Mont-600",
    fontSize: 16,
  },
});
