import { CloseIcon } from "@/components/icons/CloseIcon";
import { SendIcon } from "@/components/icons/SendIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useModalStore } from "@/store/useModalStore";
import { Reply } from "@/types/reply";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetTimingConfigs,
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
  BackHandler,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useCreateReplyMutation } from "@/hooks/useCreateReplyMutation";
import { useAuthStore } from "@/store/useAuthStore";

const HEADER_H = 56;
const QUOTE_H = 62;
const INPUT_COLLAPSED = 80;
const INPUT_EXPANDED = 180;
const SUBMIT_ROW_H = 48;
const SAFE_BOTTOM = Platform.OS === "ios" ? 40 : 24;
const SHEET_HANDLE = 28;
const GAP = 12;

const KBD_DURATION = Platform.OS === "ios" ? 250 : 200;

function calcSnapPoints(
  screenHeight: number,
  hasQuote: boolean,
  keyboardHeight: number,
): [string, string] {
  const quoteH = hasQuote ? QUOTE_H + GAP : 0;
  const collapsed =
    SHEET_HANDLE +
    HEADER_H +
    GAP +
    quoteH +
    INPUT_COLLAPSED +
    GAP +
    SUBMIT_ROW_H +
    SAFE_BOTTOM;
  const expanded =
    SHEET_HANDLE +
    HEADER_H +
    GAP +
    quoteH +
    INPUT_EXPANDED +
    GAP +
    SUBMIT_ROW_H +
    SAFE_BOTTOM +
    keyboardHeight;
  return [
    `${Math.round((collapsed / screenHeight) * 100)}%`,
    `${Math.min(Math.round((expanded / screenHeight) * 100), 92)}%`,
  ];
}

export const WriteReply = forwardRef(
  (
    props: { commentId: number; selectedReply: Reply | null; novelId: string },
    ref,
  ) => {
    const { commentId, selectedReply, novelId } = props;
    const user = useAuthStore((state) => state.user);
    const { mutate, isPending } = useCreateReplyMutation(commentId, novelId);
    const MAX_LENGTH = 750;
    const [replyText, setReplyText] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const isOpen = useRef(false);
    const currentIndex = useRef(0);
    const { height: screenHeight } = useWindowDimensions();
    const [isLoading, setIsLoading] = useState(false);

    const inputHeight = useSharedValue(INPUT_COLLAPSED);

    const animatedInputStyle = useAnimatedStyle(() => ({
      height: inputHeight.value,
    }));

    const snapPoints = useMemo(
      () => calcSnapPoints(screenHeight, !!selectedReply, keyboardHeight),
      [screenHeight, selectedReply, keyboardHeight],
    );

    const springConfigs = useBottomSheetTimingConfigs({
      duration: KBD_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    const resetState = useCallback(() => {
      setReplyText("");
      inputHeight.value = INPUT_COLLAPSED;
    }, []);

    useImperativeHandle(ref, () => ({
      expand: () => {
        isOpen.current = true;
        currentIndex.current = 0;
        bottomSheetRef.current?.snapToIndex(0);
      },
      close: () => {
        isOpen.current = false;
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
      },
    }));

    const handleClose = useCallback(() => {
      if (replyText.length > 0) {
        useModalStore.getState().showConfirm({
          title: "Yorumunuz kaybolacak",
          message: "Yorumunuzu kaydetmeden çıkmak istediğinize emin misiniz?",
          confirmText: "Evet, çık",
          cancelText: "Hayır, kal",
          onConfirm: () => {
            isOpen.current = false;
            Keyboard.dismiss();
            bottomSheetRef.current?.close();
          },
        });
      } else {
        isOpen.current = false;
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
      }
    }, [replyText]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
          pressBehavior="collapse"
        />
      ),
      [],
    );

    useEffect(() => {
      const showEvent =
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      const easing = Easing.out(Easing.cubic);

      const show = Keyboard.addListener(showEvent, (e) => {
        if (!isOpen.current) return;
        setKeyboardHeight(e.endCoordinates.height);
        inputHeight.value = withTiming(INPUT_EXPANDED, {
          duration: KBD_DURATION,
          easing,
        });
        currentIndex.current = 1;
        bottomSheetRef.current?.snapToIndex(1);
      });

      const hide = Keyboard.addListener(hideEvent, () => {
        if (!isOpen.current) return;
        inputHeight.value = withTiming(INPUT_COLLAPSED, {
          duration: KBD_DURATION,
          easing,
        });
        currentIndex.current = 0;
        bottomSheetRef.current?.snapToIndex(0);
      });

      return () => {
        show.remove();
        hide.remove();
      };
    }, []);

    useEffect(() => {
      const backAction = () => {
        if (!isOpen.current) return false;
        handleClose();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      return () => backHandler.remove();
    }, [handleClose]);

    const canSubmit = replyText.length > 0 && !isPending;
    const isNearLimit = replyText.length >= MAX_LENGTH * 0.9;
    const isAtLimit = replyText.length >= MAX_LENGTH;

    const handleSubmit = () => {
      setIsLoading(true);
      setTimeout(() => {
        if (replyText.length > 0) {
          if (!canSubmit) return;
          if (!user) {
            useModalStore.getState().showConfirm({
              title: "Giriş yapmalısınız",
              message: "Yorum yapmak için giriş yapmalısınız.",
              confirmText: "Giriş Yap",
              onConfirm: () => {
                useModalStore.getState().hideModal();
              },
            });
            return;
          }
          mutate(
            {
              content: replyText,
              rootCommentId: commentId,
              parentReplyId: selectedReply?.id ? selectedReply.id : null,
            },
            {
              onSuccess: () => {
                resetState();
                isOpen.current = false;
                Keyboard.dismiss();
                bottomSheetRef.current?.close();
              },
              onSettled: () => {
                setIsLoading(false);
              },
            },
          );
        }
      }, 1000);
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        backgroundStyle={s.sheetBg}
        handleIndicatorStyle={s.handle}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        animationConfigs={springConfigs}
        onAnimate={(_, toIndex) => {
          currentIndex.current = toIndex;
        }}
        onClose={resetState}
      >
        <BottomSheetView style={s.container}>
          {/* ── Header ── */}
          <View style={s.header}>
            <View>
              <Text style={s.heading}>Yanıt yaz</Text>
              <Text style={s.subheading}>
                Objektif (veya değil) görüşleriniz
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [s.closeBtn, pressed && { opacity: 0.7 }]}
              onPress={handleClose}
            >
              <CloseIcon color="#64748B" size={13} />
            </Pressable>
          </View>

          {/* ── Alıntı kartı ── */}
          {selectedReply && (
            <View style={s.quote}>
              <Image
                source={{
                  uri: selectedReply.user.profileImageUrl || undefined,
                }}
                style={s.quoteAvatar}
                contentFit="cover"
              />
              <View style={s.quoteBody}>
                <Text style={s.quoteNick}>@{selectedReply.user.nickname}</Text>
                <Text style={s.quoteText} numberOfLines={2}>
                  {selectedReply.content}
                </Text>
              </View>
            </View>
          )}

          {/* ── Input — Reanimated.View ile sarılı ── */}
          <Animated.View style={animatedInputStyle}>
            <BottomSheetTextInput
              placeholder="Düşüncelerinizi yazın..."
              placeholderTextColor="#C4CDD9"
              multiline
              value={replyText}
              onChangeText={(text) => {
                if (text.length <= MAX_LENGTH) setReplyText(text);
              }}
              maxLength={MAX_LENGTH}
              style={s.textInput}
            />
          </Animated.View>

          {/* ── Alt satır ── */}
          <View style={s.submitRow}>
            <Text
              style={[
                s.counter,
                isNearLimit && s.counterWarn,
                isAtLimit && s.counterLimit,
              ]}
            >
              {replyText.length} / {MAX_LENGTH}
            </Text>
            <Pressable
              style={({ pressed }) => [
                s.submitBtn,
                !canSubmit && s.submitBtnDisabled,
                pressed && canSubmit && { opacity: 0.85 },
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {isLoading ? (
                <LoadingDots />
              ) : (
                <>
                  <Text
                    style={[s.submitLabel, !canSubmit && s.submitLabelDisabled]}
                  >
                    Gönder
                  </Text>
                  <SendIcon
                    color={canSubmit ? "#FFFFFF" : "#94A3B8"}
                    size={14}
                  />
                </>
              )}
            </Pressable>
          </View>

          <View style={{ height: SAFE_BOTTOM }} />
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

const s = StyleSheet.create({
  sheetBg: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  handle: {
    backgroundColor: "#DDE3EB",
    width: 32,
    height: 3,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 6,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  subheading: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "400",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  quote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 10,
  },
  quoteAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    marginTop: 1,
  },
  quoteBody: {
    flex: 1,
    gap: 2,
  },
  quoteNick: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
  },
  quoteText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#94A3B8",
  },
  textInput: {
    flex: 1,
    fontFamily: "Poppins-400",
    fontSize: 13,
    color: "#1E293B",
    letterSpacing: -0.1,
    lineHeight: 21,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
  },
  submitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: {
    fontSize: 10,
    fontWeight: "500",
    color: "#C4CDD9",
    letterSpacing: 0.3,
  },
  counterWarn: { color: "#F59E0B" },
  counterLimit: { color: "#EF4444", fontWeight: "700" },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    width: 100,
    height: 38,
    borderRadius: 12,
  },
  submitBtnDisabled: { backgroundColor: "#F1F5F9" },
  submitLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  submitLabelDisabled: { color: "#94A3B8" },
});
