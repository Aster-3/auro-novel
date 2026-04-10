import { CloseIcon } from "@/components/icons/CloseIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useModalStore } from "@/store/useModalStore";
import { Reply } from "@/types/reply";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useCreateReplyMutation } from "@/hooks/useCreateReplyMutation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";
import { Portal } from "@gorhom/portal";
import { useIsFocused } from "@react-navigation/native";

// Animasyonlu input için sarmalıyoruz
const AnimatedTextInput =
  Animated.createAnimatedComponent(BottomSheetTextInput);

export const WriteReply = forwardRef(
  (
    props: { commentId: number; selectedReply: Reply | null; novelId: string },
    ref,
  ) => {
    const { commentId, selectedReply, novelId } = props;
    const { theme, isDarkMode } = useAppTheme();
    const user = useAuthStore((state) => state.user);
    const { mutate, isPending } = useCreateReplyMutation(commentId, novelId);
    const isFocused = useIsFocused();

    const MAX_LENGTH = 750;
    const [replyText, setReplyText] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const isOpen = useRef(false);

    // --- ANİMASYON STATE'İ ---
    const errorProgress = useSharedValue(0);

    useEffect(() => {
      errorProgress.value = withTiming(errorMsg ? 1 : 0, { duration: 300 });
    }, [errorMsg]);

    const animatedInputStyle = useAnimatedStyle(() => {
      const defaultBorderColor = isDarkMode
        ? "rgba(255,255,255,0.05)"
        : "#E2E8F0";
      const errorBorderColor = "#E11D48";
      return {
        borderColor: interpolateColor(
          errorProgress.value,
          [0, 1],
          [defaultBorderColor, errorBorderColor],
        ),
      };
    });

    // --- KLAVYE EVENTLERİ (ReviewSheet ile Aynı) ---
    useEffect(() => {
      const hide = Keyboard.addListener("keyboardDidHide", () => {
        if (isFocused && isOpen.current) {
          bottomSheetRef.current?.snapToIndex(0);
        }
      });
      return () => hide.remove();
    }, [isFocused]);

    const snapPoints = useMemo(() => ["65%", "75%"], []);

    const springConfigs = useBottomSheetSpringConfigs({
      damping: 60,
      overshootClamping: true,
      stiffness: 500,
    });

    const resetState = useCallback(() => {
      setReplyText("");
      setErrorMsg(null);
      isOpen.current = false;
    }, []);

    useImperativeHandle(ref, () => ({
      expand: () => {
        isOpen.current = true;
        bottomSheetRef.current?.snapToIndex(0);
      },
      close: () => {
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
      },
    }));

    const handleClose = useCallback(() => {
      if (replyText.length > 0) {
        useModalStore.getState().showConfirm({
          title: "Yanıtınız Kaybolacak",
          message: "Yazınızı tamamlamadan çıkmak istediğinize emin misiniz?",
          onConfirm: () => {
            Keyboard.dismiss();
            bottomSheetRef.current?.close();
          },
        });
      } else {
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
      }
    }, [replyText]);

    const renderBackdrop = useCallback(
      (p: any) => (
        <BottomSheetBackdrop
          {...p}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
          pressBehavior="none"
        />
      ),
      [],
    );

    const handleSubmit = () => {
      if (!replyText.trim()) return;
      if (replyText.length < 5) {
        setErrorMsg("Yanıtınız çok kısa.");
        return;
      }

      mutate(
        {
          content: replyText.trim(),
          rootCommentId: commentId,
          parentReplyId: selectedReply?.id ?? null,
        },
        {
          onSuccess: () => {
            resetState();
            bottomSheetRef.current?.close();
          },
        },
      );
    };

    return (
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          animationConfigs={springConfigs}
          enableOverDrag={false}
          keyboardBehavior="interactive"
          backgroundStyle={{ backgroundColor: theme.surface, borderRadius: 32 }}
          handleIndicatorStyle={{
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0",
            width: 32,
          }}
          onClose={resetState}
        >
          <BottomSheetView style={s.container}>
            <View style={s.header}>
              <View>
                <Text style={[s.heading, { color: theme.textPrimary }]}>
                  YANIT YAZ
                </Text>
                <Text style={[s.subheading, { color: theme.textSecondary }]}>
                  @{selectedReply?.user.nickname.toLowerCase() ?? "yazar"}{" "}
                  kullanıcısına yanıt ver
                </Text>
              </View>
              <Pressable
                onPress={handleClose}
                style={[
                  s.closeBtn,
                  { backgroundColor: isDarkMode ? "#E11D48" : "#f75376" },
                ]}
              >
                <CloseIcon color="#FFFFFF" size={16} />
              </Pressable>
            </View>

            {/* Alıntı (Daha Minimal) */}
            {selectedReply && !errorMsg && (
              <Animated.View
                entering={FadeInDown}
                exiting={FadeOutUp}
                style={[
                  s.quote,
                  {
                    borderLeftColor: isDarkMode
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(15, 63, 146, 0.2)",
                  },
                ]}
              >
                <Text
                  style={[s.quoteText, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  "{selectedReply.content}"
                </Text>
              </Animated.View>
            )}

            <AnimatedTextInput
              placeholder="Yanıtınızı buraya bırakın..."
              placeholderTextColor={theme.textSecondary}
              multiline
              scrollEnabled={true} // <-- EKLENDİ: İçerik taştığında kaydırmayı açar
              value={replyText}
              onChangeText={(text) => {
                if (errorMsg) setErrorMsg(null);
                if (text.length <= MAX_LENGTH) setReplyText(text);
              }}
              style={[
                s.textInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.02)"
                    : "#FAFBFC",
                },
                animatedInputStyle,
              ]}
            />

            <View style={s.submitSection}>
              <View style={s.infoRow}>
                <View style={{ flex: 1 }}>
                  {errorMsg && (
                    <Animated.Text
                      entering={FadeInDown}
                      exiting={FadeOutUp}
                      style={s.errorText}
                    >
                      {errorMsg}
                    </Animated.Text>
                  )}
                </View>
                <Text
                  style={[
                    s.counter,
                    {
                      color:
                        replyText.length >= MAX_LENGTH
                          ? "#E11D48"
                          : theme.textSecondary,
                    },
                  ]}
                >
                  {replyText.length} / {MAX_LENGTH}
                </Text>
              </View>

              <Pressable
                style={[
                  s.submitBtn,
                  { backgroundColor: theme.textPrimary },
                  (replyText.length < 2 || isPending) && { opacity: 0.3 },
                ]}
                onPress={handleSubmit}
                disabled={replyText.length < 2 || isPending}
              >
                {isPending ? (
                  <LoadingDots />
                ) : (
                  <>
                    <Text style={[s.submitLabel, { color: theme.background }]}>
                      YANITI GÖNDER
                    </Text>
                    <SendIcon color={theme.background} size={16} />
                  </>
                )}
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

const s = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  heading: { fontFamily: "Mont-800", fontSize: 11, letterSpacing: 1.5 },
  subheading: {
    fontFamily: "Mont-500",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quote: {
    borderLeftWidth: 2.5,
    paddingLeft: 12,
    marginBottom: 16,
    opacity: 0.7,
  },
  quoteText: { fontSize: 11, fontFamily: "Mont-500", fontStyle: "italic" },
  textInput: {
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 21,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    height: 220,
    textAlignVertical: "top",
  },
  submitSection: { marginTop: 8 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    minHeight: 16,
  },
  errorText: { fontFamily: "Mont-600", fontSize: 11, color: "#E11D48" },
  counter: { fontFamily: "Mont-600", fontSize: 10 },
  submitBtn: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
  },
  submitLabel: { fontFamily: "Mont-700", fontSize: 11, letterSpacing: 1 },
});
