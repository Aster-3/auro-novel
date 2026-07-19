import { CloseIcon } from "@/components/icons/CloseIcon";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useCommentMutation } from "@/hooks/useCommentMutation";
import { useAppTheme } from "@/hooks/useTheme";
import { useModalStore } from "@/store/useModalStore";
import { useToastStore } from "@/store/useToastStore";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { useIsFocused } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTextInput =
  Animated.createAnimatedComponent(BottomSheetTextInput);

type ReviewSheetHandle = {
  expand: () => void;
  close: () => void;
};

type ReviewSheetProps = {
  novelId: string;
};

const MAX_LENGTH = 750;
const MIN_LENGTH = 20;

export const ReviewSheet = forwardRef<ReviewSheetHandle, ReviewSheetProps>(
  ({ novelId }, ref) => {
    const { theme, isDarkMode } = useAppTheme();
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();
    const { mutate, isPending } = useCommentMutation();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const isFocused = useIsFocused();
    const isOpen = useRef(false);

    const [recommend, setRecommend] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const errorProgress = useSharedValue(0);
    const snapPoints = useMemo(() => ["56%", "72%"], []);

    const springConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      overshootClamping: true,
      stiffness: 800,
    });

    const hasDraft = commentText.trim().length > 0;
    const canSubmit = commentText.trim().length >= MIN_LENGTH && !isPending;

    useEffect(() => {
      errorProgress.value = withTiming(errorMsg ? 1 : 0, { duration: 220 });
    }, [errorMsg, errorProgress]);

    useEffect(() => {
      const hide = Keyboard.addListener("keyboardDidHide", () => {
        if (isFocused && isOpen.current) {
          bottomSheetRef.current?.snapToIndex(0);
        }
      });

      return () => hide.remove();
    }, [isFocused]);

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

    const closeSheet = useCallback(() => {
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    }, []);

    const handleClose = useCallback(() => {
      if (!hasDraft) {
        closeSheet();
        return;
      }

      useModalStore.getState().showConfirm({
        title: "Yorumu kapat",
        message: "Yazdığın metin silinecek. Çıkmak istiyor musun?",
        onConfirm: closeSheet,
      });
    }, [closeSheet, hasDraft]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.72}
          pressBehavior="none"
        />
      ),
      [],
    );

    const handleSubmit = () => {
      const content = commentText.trim();

      if (content.length < MIN_LENGTH) {
        setErrorMsg(`Yorumun en az ${MIN_LENGTH} karakter olmalı.`);
        return;
      }

      if (content.length > MAX_LENGTH) {
        setErrorMsg(`Yorumun ${MAX_LENGTH} karakteri aşamaz.`);
        return;
      }

      mutate(
        { novelId, content, isRecommend: recommend },
        {
          onSuccess: () => {
            resetState();
            closeSheet();
            useToastStore.getState().showToast({
              message: "Yorumun yayınlandı.",
            });
            queryClient.invalidateQueries({
              queryKey: ["comments", "list", novelId],
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
          enablePanDownToClose={false}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backgroundStyle={[
            styles.sheetBackground,
            { backgroundColor: isDarkMode ? "#0A0A0B" : theme.surface },
          ]}
          handleIndicatorStyle={[
            styles.handle,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.12)"
                : "#CBD5E1",
            },
          ]}
          onClose={resetState}
        >
          <BottomSheetView
            style={[
              styles.container,
              {
                paddingBottom: insets.bottom + 18,
                backgroundColor: isDarkMode ? "#0A0A0B" : theme.surface,
              },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={[styles.heading, { color: theme.textPrimary }]}>
                  İnceleme yaz
                </Text>
                <Text
                  style={[styles.subheading, { color: theme.textSecondary }]}
                >
                  Seri hakkındaki düşünceni kısa ve net paylaş.
                </Text>
              </View>

              <Pressable
                onPress={handleClose}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.closeBtn,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "#F1F5F9",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <CloseIcon color={theme.textSecondary} size={14} />
              </Pressable>
            </View>

            <View
              style={[
                styles.recommendRow,
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
              <RecommendOption
                label="Öneriyorum"
                active={recommend}
                activeColor={isDarkMode ? "#FFFFFF" : "#10111A"}
                inactiveIconColor="#10B981"
                isDarkMode={isDarkMode}
                textColor={theme.textSecondary}
                onPress={() => setRecommend(true)}
              />
              <RecommendOption
                label="Önermiyorum"
                active={!recommend}
                activeColor={isDarkMode ? "#FFFFFF" : "#10111A"}
                inactiveIconColor="#E11D48"
                isDarkMode={isDarkMode}
                textColor={theme.textSecondary}
                onPress={() => setRecommend(false)}
                flipped
              />
            </View>

            <AnimatedTextInput
              placeholder="Bu seri sende nasıl bir iz bıraktı?"
              placeholderTextColor={theme.textSecondary}
              multiline
              value={commentText}
              onChangeText={(text) => {
                if (errorMsg) setErrorMsg(null);
                if (text.length <= MAX_LENGTH) setCommentText(text);
              }}
              selectionColor={theme.accent}
              textAlignVertical="top"
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
                      commentText.length >= MAX_LENGTH
                        ? "#E11D48"
                        : theme.textSecondary,
                  },
                ]}
              >
                {commentText.length}/{MAX_LENGTH}
              </Text>
            </View>

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
                      { color: canSubmit ? theme.background : theme.textSecondary },
                    ]}
                  >
                    Yayınla
                  </Text>
                  <SendIcon
                    color={canSubmit ? theme.background : theme.textSecondary}
                    size={16}
                  />
                </>
              )}
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

const RecommendOption = ({
  label,
  active,
  activeColor,
  inactiveIconColor,
  isDarkMode,
  textColor,
  onPress,
  flipped = false,
}: {
  label: string;
  active: boolean;
  activeColor: string;
  inactiveIconColor: string;
  isDarkMode: boolean;
  textColor: string;
  onPress: () => void;
  flipped?: boolean;
}) => {
  const activeTextColor = isDarkMode ? "#10111A" : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.recommendBtn,
        active && { backgroundColor: activeColor },
        pressed && { opacity: 0.75 },
      ]}
    >
      <View style={flipped && styles.flippedIcon}>
        <RecommendIcon
          color={active ? activeTextColor : inactiveIconColor}
          size={14}
        />
      </View>
      <Text
        style={[
          styles.recommendLabel,
          { color: active ? activeTextColor : textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handle: {
    width: 34,
    height: 4,
    borderRadius: 2,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  heading: {
    fontFamily: "Mont-800",
    fontSize: 16,
    letterSpacing: 0,
  },
  subheading: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    opacity: 0.68,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendRow: {
    flexDirection: "row",
    gap: 6,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 4,
    marginBottom: 14,
  },
  recommendBtn: {
    flex: 1,
    height: 36,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  flippedIcon: {
    transform: [{ rotate: "180deg" }],
  },
  recommendLabel: {
    fontFamily: "Mont-700",
    fontSize: 11,
    letterSpacing: 0,
  },
  textInput: {
    minHeight: 168,
    maxHeight: 220,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  infoRow: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  errorSlot: {
    flex: 1,
  },
  errorText: {
    color: "#E11D48",
    fontFamily: "Mont-600",
    fontSize: 11,
    lineHeight: 16,
  },
  counterText: {
    fontFamily: "Mont-600",
    fontSize: 10,
    opacity: 0.78,
  },
  submitBtn: {
    height: 46,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  submitLabel: {
    fontFamily: "Mont-800",
    fontSize: 12,
    letterSpacing: 0,
  },
});
