import { CloseIcon } from "@/components/icons/CloseIcon";
import { LikeIcon } from "@/components/icons/LikeIcon";
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
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  Keyboard,
  Platform,
  BackHandler,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";

export const ReviewSheet = forwardRef((props: { novelId: string }, ref) => {
  const { novelId } = props;
  const queryClient = useQueryClient();
  const [recommend, setRecommend] = useState<boolean>(true);
  const MAX_LENGTH = 750;
  const [commentText, setCommentText] = useState("");
  const { mutate, isPending } = useCommentMutation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const currentIndex = useRef<number>(-1);

  const snapPoints = useMemo(() => ["60%", "99%"], []);

  const springConfigs = useBottomSheetSpringConfigs({
    damping: 50,
    overshootClamping: true,
    stiffness: 500,
  });

  const resetState = useCallback(() => {
    setRecommend(true);
    setCommentText("");
  }, []);

  useImperativeHandle(ref, () => ({
    expand: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => {
      currentIndex.current = -1;
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    },
  }));

  const handleClose = useCallback(() => {
    if (commentText.length > 0) {
      useModalStore.getState().showConfirm({
        title: "Yorumunuz kaybolacak",
        message: "Yorumunuzu kaydetmeden çıkmak istediğinize emin misiniz?",
        confirmText: "Evet, çık",
        cancelText: "Hayır, kal",
        onConfirm: () => {
          currentIndex.current = -1;
          Keyboard.dismiss();
          bottomSheetRef.current?.close();
        },
      });
    } else {
      currentIndex.current = -1;
      Keyboard.dismiss();
      bottomSheetRef.current?.close();
    }
  }, [commentText]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="none"
        zIndex={500000} // Backdrop'ın zIndex'i sheet'in altında kalmalı
      />
    ),
    [],
  );

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    let timeoutId: ReturnType<typeof setTimeout>;

    const showSubscription = Keyboard.addListener(showEvent, () => {
      if (currentIndex.current === -1) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (currentIndex.current === 1) return;
        currentIndex.current = 1;
        bottomSheetRef.current?.snapToIndex(1);
      }, 0);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      if (currentIndex.current === -1) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (currentIndex.current === 1) {
          currentIndex.current = 0;
          bottomSheetRef.current?.snapToIndex(0);
        }
      }, 0);
    });

    return () => {
      clearTimeout(timeoutId);
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (currentIndex.current === -1) return false;
      handleClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [handleClose]);

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    mutate(
      {
        novelId,
        content: commentText.trim(),
        isRecommend: recommend,
      },
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
          queryClient.invalidateQueries({
            queryKey: ["myComment", novelId],
          });
        },
        onError: (error: any) => {
          if (error.statusCode === 422) {
            if (error.errors?.content) {
              useToastStore.getState().showToast({
                message:
                  error.errors.content[0] || "Yorumunuzun içeriği geçersiz.",
                type: "Hata",
              });
              return;
            }
          } else if (error.statusCode === 409) {
            useToastStore.getState().showToast({
              message: error.message || "Bu seriye zaten yorum yapmışsınız.",
              type: "Uyarı",
            });
            return;
          } else {
            useToastStore.getState().showToast({
              message: "Yorum gönderilirken bir hata oluştu.",
              type: "Hata",
            });
          }
        },
      },
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      animationConfigs={springConfigs}
      onAnimate={(fromIndex, toIndex) => {
        currentIndex.current = toIndex;
      }}
      onClose={resetState}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Yorumunuzu bırakın</Text>
            <Text style={styles.subheading}>
              Bu seriyi tavsiye ediyor musunuz?{" "}
            </Text>
          </View>

          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && { opacity: 0.5 },
            ]}
          >
            <CloseIcon color="#ffffff" size={20} />
          </Pressable>
        </View>

        <View style={styles.recommendRow}>
          <Pressable
            onPress={() => setRecommend(true)}
            style={[
              styles.recommendBtn,
              recommend === true && styles.recommendBtnActiveGreen,
            ]}
          >
            <LikeIcon
              color={recommend === true ? "#ffffff" : "#94A3B8"}
              size={18}
            />
            <Text
              style={[
                styles.recommendLabel,
                recommend === true && styles.recommendLabelActive,
              ]}
            >
              Tavsiye Ederim
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRecommend(false)}
            style={[
              styles.recommendBtn,
              recommend === false && styles.recommendBtnActiveRed,
            ]}
          >
            <View style={{ transform: [{ rotate: "180deg" }] }}>
              <LikeIcon
                color={recommend === false ? "#ffffff" : "#94A3B8"}
                size={18}
              />
            </View>
            <Text
              style={[
                styles.recommendLabel,
                recommend === false && styles.recommendLabelActive,
              ]}
            >
              Tavsiye Etmem
            </Text>
          </Pressable>
        </View>

        <BottomSheetTextInput
          placeholder="Objektif (veya değil) görüşleriniz..."
          placeholderTextColor="#919ba7"
          multiline
          value={commentText}
          onChangeText={(text) => {
            if (text.length <= MAX_LENGTH) setCommentText(text);
          }}
          maxLength={MAX_LENGTH}
          style={styles.textInput}
        />

        <View style={styles.submitSection}>
          <Text
            style={[
              styles.counterText,
              commentText.length >= MAX_LENGTH && styles.maxLengthWarning,
            ]}
          >
            {commentText.length} / {MAX_LENGTH}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { opacity: 0.8 },
            ]}
            onPress={handleSubmit}
            disabled={commentText.length === 0 || isPending}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <>
                <Text style={styles.submitLabel}>İncelememi Gönder</Text>
                <SendIcon color="#FFFFFF" size={20} />
              </>
            )}
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
  },
  handle: {
    backgroundColor: "#E2E8F0",
    width: 36,
  },
  submitSection: {
    marginTop: 4,
  },
  counterText: {
    fontFamily: "Mont-500",
    fontSize: 10,
    color: "#94A3B8",
    textAlign: "right",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
    zIndex: 999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  heading: {
    fontFamily: "Mont-700",
    fontSize: 18,
    color: "#0F172A",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subheading: {
    fontFamily: "Mont-500",
    fontSize: 13,
    color: "#B0BCCA",
    letterSpacing: -0.2,
  },
  maxLengthWarning: {
    color: "#E11D48",
    fontFamily: "Mont-700",
  },
  closeBtn: {
    width: 35,
    height: 35,
    borderRadius: 14,
    backgroundColor: "#f75376",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  closeBtnText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  recommendRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  recommendBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E8F0",
    backgroundColor: "#FAFBFC",
  },
  recommendBtnActiveGreen: {
    backgroundColor: "#16a34ad4",
    borderColor: "#16A34A",
  },
  recommendBtnActiveRed: {
    backgroundColor: "#e11d47d4",
    borderColor: "#e11d47e0",
  },
  recommendLabel: {
    fontFamily: "Mont-600",
    fontSize: 13,
    color: "#94A3B8",
    letterSpacing: -0.2,
  },
  recommendLabelActive: {
    color: "#FFFFFF",
  },
  textInput: {
    fontFamily: "Mont-500",
    fontSize: 14,
    color: "#1E293B",
    letterSpacing: -0.1,
    lineHeight: 22,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E8F0",
    backgroundColor: "#FAFBFC",
    padding: 14,
    marginBottom: 14,
    textAlignVertical: "top",
    elevation: 0.2,
    minHeight: 200,
    maxHeight: 200,
  },
  submitBtn: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    backgroundColor: "#121c33",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
  },
  submitLabel: {
    fontFamily: "Mont-600",
    fontSize: 14,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
});
