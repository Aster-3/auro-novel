import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";
import { synopsisValidationSchema } from "@/schemas/novel";
import { useAppTheme } from "@/hooks/useTheme";

export interface SynopsisEditSheetRef {
  present: () => void;
  close: () => void;
}

interface SynopsisEditSheetProps {
  id: string;
  initialSynopsis: string;
  onClose?: () => void;
}

export const SynopsisEditSheet = forwardRef<
  SynopsisEditSheetRef,
  SynopsisEditSheetProps
>(({ id, initialSynopsis, onClose }, ref) => {
  const { theme, isDarkMode } = useAppTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const currentIndex = useRef<number>(-1);

  const synopsisValue = useRef(initialSynopsis);
  const { mutate: updateNovel, isPending } = useNovelMutation(id);

  // İstediğin o akıcı yaylanma animasyonu
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 300,
    mass: 1,
    overshootClamping: true,
  });

  const snapPoints = useMemo(() => ["55%", "94%"], []);

  useEffect(() => {
    if (currentIndex.current === -1) {
      synopsisValue.current = initialSynopsis;
      setIsDirty(false);
    }
  }, [initialSynopsis]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      if (currentIndex.current !== -1) {
        bottomSheetRef.current?.expand();
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      if (currentIndex.current !== -1) {
        bottomSheetRef.current?.snapToIndex(0);
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleClose = useCallback(() => {
    synopsisValue.current = initialSynopsis;
    setIsDirty(false);
    setError(null);
    currentIndex.current = -1;
    setIsVisible(false);
    Keyboard.dismiss();
    if (onClose) onClose();
  }, [initialSynopsis, onClose]);

  useImperativeHandle(ref, () => ({
    present: () => {
      synopsisValue.current = initialSynopsis;
      setIsDirty(false);
      setError(null);
      setIsVisible(true);
      setTimeout(() => bottomSheetRef.current?.expand(), 10);
    },
    close: () => bottomSheetRef.current?.close(),
  }));

  const renderBackdrop = useCallback(
    (p: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...p}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    [],
  );

  const handleSave = async () => {
    const current = synopsisValue.current;
    const result = synopsisValidationSchema.safeParse(current);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    updateNovel(
      { synopsis: current.trim() },
      {
        onSuccess: () => {
          useToastStore.getState().showToast({
            type: "Başarılı",
            message: "Özet güncellendi.",
          });
          bottomSheetRef.current?.close();
        },
        onError: (err: any) => {
          setError(err?.message || "Hata oluştu.");
        },
      },
    );
  };

  if (!isVisible) return null;

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enablePanDownToClose={true}
        animateOnMount={true}
        animationConfigs={animationConfigs}
        backgroundStyle={[
          styles.sheetBackground,
          { backgroundColor: theme.surface },
        ]}
        handleIndicatorStyle={[
          styles.indicator,
          { backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#EEE" },
        ]}
        onClose={handleClose}
        onChange={(index) => {
          currentIndex.current = index;
          if (index === -1) handleClose();
        }}
      >
        <BottomSheetView style={styles.container}>
          <Text style={[styles.title, { color: theme.textSecondary }]}>
            ÖZET
          </Text>

          <View style={styles.inputContainer}>
            <BottomSheetTextInput
              style={[
                styles.input,
                {
                  color: theme.textPrimary,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.01)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#F1F5F9",
                },
                error ? styles.inputError : null,
              ]}
              defaultValue={initialSynopsis}
              onChangeText={(text) => {
                synopsisValue.current = text;
                setIsDirty(text !== initialSynopsis);
                if (error) setError(null);
              }}
              multiline
              placeholder="Roman özetini buraya yazın..."
              textAlignVertical="top"
              placeholderTextColor={theme.textSecondary}
              editable={!isPending}
            />

            {error && (
              <Animated.Text
                entering={FadeInUp}
                exiting={FadeOutUp}
                style={styles.errorText}
              >
                {error}
              </Animated.Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.textPrimary },
              (isPending || !isDirty) && { opacity: 0.3 },
            ]}
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isPending || !isDirty}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <Text
                style={[styles.saveButtonText, { color: theme.background }]}
              >
                KAYDET
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.close()}
            style={styles.cancelButton}
            disabled={isPending}
          >
            <Text
              style={[styles.cancelButtonText, { color: theme.textSecondary }]}
            >
              Vazgeç
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 40,
  },
  indicator: {
    width: 30,
    height: 3,
  },
  container: {
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 9,
    fontFamily: "Mont-700",
    letterSpacing: 2,
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    height: 220,
    fontSize: 13,
    fontFamily: "Mont-500",
    lineHeight: 18,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  saveButton: {
    height: 48,
    justifyContent: "center",
    borderRadius: 16,
    marginTop: 28,
    alignItems: "center",
  },
  saveButtonText: {
    fontFamily: "Mont-700",
    fontSize: 11,
    letterSpacing: 1,
  },
  cancelButton: {
    marginTop: 16,
    padding: 8,
  },
  cancelButtonText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Mont-500",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Mont-500",
  },
});
