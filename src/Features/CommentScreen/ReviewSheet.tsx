import { CloseIcon } from "@/components/icons/CloseIcon";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useModalStore } from "@/store/useModalStore";
import { useToastStore } from "@/store/useToastStore";
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
import { Text, Pressable, View, StyleSheet, Keyboard } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/hooks/useTheme";
import { Portal } from "@gorhom/portal";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

// Animasyonlu renk geçişi yapabilmek için BottomSheetTextInput'u sarmalıyoruz
const AnimatedTextInput =
  Animated.createAnimatedComponent(BottomSheetTextInput);

export const ReviewSheet = forwardRef((props: { novelId: string }, ref) => {
  const { novelId } = props;
  const { theme, isDarkMode } = useAppTheme();
  const queryClient = useQueryClient();
  const [recommend, setRecommend] = useState<boolean>(true);
  const MAX_LENGTH = 750;
  const [commentText, setCommentText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { mutate, isPending } = useCommentMutation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isFocused = useIsFocused();

  const isOpen = useRef(false);

  // --- ANİMASYON STATE'İ ---
  const errorProgress = useSharedValue(0);

  // Hata mesajı değiştiğinde animasyon değerini tetikliyoruz (0 -> 1 veya 1 -> 0)
  useEffect(() => {
    errorProgress.value = withTiming(errorMsg ? 1 : 0, { duration: 300 });
  }, [errorMsg, errorProgress]);

  // Input'un border rengini errorProgress değerine göre pürüzsüzce hesaplıyoruz
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

  useEffect(() => {
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      if (isFocused && isOpen.current) {
        bottomSheetRef.current?.snapToIndex(0);
      }
    });

    return () => hide.remove();
  }, [isFocused]);

  const snapPoints = useMemo(() => ["60%", "70%"], []);

  const springConfigs = useBottomSheetSpringConfigs({
    damping: 60,
    overshootClamping: true,
    stiffness: 500,
  });

  const resetState = useCallback(() => {
    setRecommend(true);
    setCommentText("");
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
    if (commentText.length > 0) {
      useModalStore.getState().showConfirm({
        title: "Yorumunuz Kaybolacak",
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
  }, [commentText]);

  const renderBackdrop = useCallback(
    (p: any) => (
      <BottomSheetBackdrop
        {...p}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="none"
      />
    ),
    [],
  );

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    if (commentText.length > MAX_LENGTH) {
      setErrorMsg(`Yorumunuz ${MAX_LENGTH} karakteri aşamaz.`);
      return;
    }
    if (commentText.length < 20) {
      setErrorMsg(`Yorumunuz en az 20 karakter olmalıdır.`);
      return;
    }

    mutate(
      { novelId, content: commentText.trim(), isRecommend: recommend },
      {
        onSuccess: () => {
          resetState();
          bottomSheetRef.current?.close();
          useToastStore.getState().showToast({
            message: "Yorumunuz başarıyla gönderildi.",
            type: "Başarılı",
          });
          queryClient.invalidateQueries({
            queryKey: ["commentPreviews", novelId],
          });
          queryClient.invalidateQueries({ queryKey: ["myComment", novelId] });
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
        backgroundStyle={[
          styles.sheetBackground,
          { backgroundColor: theme.surface },
        ]}
        handleIndicatorStyle={[
          styles.handle,
          { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0" },
        ]}
        onClose={resetState}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.heading, { color: theme.textPrimary }]}>
                İNCELEME YAZ
              </Text>
              <Text style={[styles.subheading, { color: theme.textSecondary }]}>
                Bu seri hakkındaki görüşlerinizi paylaşın
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={[
                styles.closeBtn,
                { backgroundColor: isDarkMode ? "#E11D48" : "#f75376" },
              ]}
            >
              <CloseIcon color="#FFFFFF" size={18} />
            </Pressable>
          </View>

          <View style={styles.recommendRow}>
            <Pressable
              onPress={() => setRecommend(true)}
              style={[
                styles.recommendBtn,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "#FAFBFC",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#E2E8F0",
                },
                recommend === true && {
                  backgroundColor: "#16A34A",
                  borderColor: "#15803D",
                },
              ]}
            >
              <RecommendIcon
                color={recommend === true ? "#FFFFFF" : "#94A3B8"}
                size={16}
              />
              <Text
                style={[
                  styles.recommendLabel,
                  { color: recommend === true ? "#FFFFFF" : "#94A3B8" },
                ]}
              >
                ÖNERİYORUM
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setRecommend(false)}
              style={[
                styles.recommendBtn,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "#FAFBFC",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#E2E8F0",
                },
                recommend === false && {
                  backgroundColor: "#E11D48",
                  borderColor: "#BE123C",
                },
              ]}
            >
              <View style={{ transform: [{ rotate: "180deg" }] }}>
                <RecommendIcon
                  color={recommend === false ? "#FFFFFF" : "#94A3B8"}
                  size={16}
                />
              </View>
              <Text
                style={[
                  styles.recommendLabel,
                  { color: recommend === false ? "#FFFFFF" : "#94A3B8" },
                ]}
              >
                ÖNERMİYORUM
              </Text>
            </Pressable>
          </View>

          <AnimatedTextInput
            placeholder="Objektif veya değil, düşünceleriniz..."
            placeholderTextColor={theme.textSecondary}
            multiline
            value={commentText}
            onChangeText={(text) => {
              if (errorMsg) setErrorMsg(null);
              if (text.length <= MAX_LENGTH) setCommentText(text);
            }}
            style={[
              styles.textInput,
              {
                color: theme.textPrimary,
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.02)"
                  : "#FAFBFC",
              },
              animatedInputStyle, // Animasyonlu border rengini buraya ekledik
            ]}
          />

          <View style={styles.submitSection}>
            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                {errorMsg && (
                  <Animated.Text
                    entering={FadeInDown.duration(300)} // Hata mesajı yumuşakça aşağıdan gelir
                    exiting={FadeOutUp.duration(200)} // Giderken de yukarı doğru yumuşakça kaybolur
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
                      commentText.length >= MAX_LENGTH
                        ? "#E11D48"
                        : theme.textSecondary,
                  },
                ]}
              >
                {commentText.length} / {MAX_LENGTH}
              </Text>
            </View>

            <Pressable
              style={[
                styles.submitBtn,
                { backgroundColor: theme.textPrimary },
                (commentText.length < 20 || isPending) && { opacity: 0.3 },
              ]}
              onPress={handleSubmit}
              disabled={commentText.length < 20 || isPending}
            >
              {isPending ? (
                <LoadingDots />
              ) : (
                <>
                  <Text
                    style={[styles.submitLabel, { color: theme.background }]}
                  >
                    İNCELEMEYİ YAYINLA
                  </Text>
                  <SendIcon color={theme.background} size={18} />
                </>
              )}
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

const styles = StyleSheet.create({
  sheetBackground: { borderRadius: 32 },
  handle: { width: 32, height: 4 },
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
    fontSize: 13,
    marginTop: 4,
    opacity: 0.6,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  recommendBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
  },
  recommendLabel: { fontFamily: "Mont-700", fontSize: 10, letterSpacing: 0.5 },
  textInput: {
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 21,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    minHeight: 180,
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
  errorText: {
    fontFamily: "Mont-600",
    fontSize: 11,
    color: "#E11D48",
  },
  counterText: {
    fontFamily: "Mont-600",
    fontSize: 10,
    textAlign: "right",
  },
  submitBtn: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    borderRadius: 16,
    height: 54,
    alignItems: "center",
  },
  submitLabel: { fontFamily: "Mont-700", fontSize: 12, letterSpacing: 0.5 },
});
