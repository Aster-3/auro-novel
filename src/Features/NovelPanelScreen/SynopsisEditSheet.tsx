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
  TextInput,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";
import {
  synopsisValidationSchema,
  titleValidationSchema,
} from "@/schemas/novel";

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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const currentIndex = useRef<number>(-1);

  // Uncontrolled yaklaşım: değeri ref'te tutuyoruz, state'e almıyoruz.
  // Bu sayede her render'da input'un value'su resetlenmiyor ve imleç yerinde kalıyor.
  const synopsisValue = useRef(initialSynopsis);

  const { mutate: updateNovel, isPending } = useNovelMutation(id);

  const animationConfigs = useMemo(
    () => ({
      duration: 280,
    }),
    [],
  );

  useEffect(() => {
    // Sheet kapalıyken dışarıdan gelen prop değişikliklerini yakala
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
        bottomSheetModalRef.current?.expand();
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      if (currentIndex.current !== -1) {
        bottomSheetModalRef.current?.snapToIndex(0);
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleDismiss = useCallback(() => {
    synopsisValue.current = initialSynopsis;
    setIsDirty(false);
    setError(null);
    currentIndex.current = -1;
    Keyboard.dismiss();
    if (onClose) onClose();
  }, [initialSynopsis, onClose]);

  useImperativeHandle(ref, () => ({
    present: () => {
      // Sheet açılırken değeri sıfırla
      synopsisValue.current = initialSynopsis;
      setIsDirty(false);
      setError(null);
      bottomSheetModalRef.current?.present();
    },
    close: () => bottomSheetModalRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (p: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...p}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
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
            message: "Özet başarıyla güncellendi!",
          });
          bottomSheetModalRef.current?.dismiss();
        },
        onError: (err: any) => {
          setError(err?.message || "Bir hata oluştu.");
        },
      },
    );
  };

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={false}
      enablePanDownToClose={false}
      enableHandlePanningGesture={false}
      backgroundStyle={styles.sheetBackground}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={styles.indicator}
      enableDynamicSizing={false}
      onDismiss={handleDismiss}
      onAnimate={(_from, to) => {
        currentIndex.current = to;
      }}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>Özet</Text>

        <BottomSheetTextInput
          style={[styles.input, error ? styles.inputError : null]}
          defaultValue={initialSynopsis}
          onChangeText={(text) => {
            synopsisValue.current = text;
            const dirty = text !== initialSynopsis;
            setIsDirty(dirty);
            if (error) setError(null);
          }}
          multiline
          placeholder="Roman özetini girin..."
          textAlignVertical="top"
          placeholderTextColor="#94A3B8"
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

        <TouchableOpacity
          style={[
            styles.saveButton,
            (isPending || !isDirty) && {
              opacity: 0.6,
            },
          ]}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isPending || !isDirty}
        >
          {isPending ? (
            <LoadingDots />
          ) : (
            <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.dismiss()}
          style={styles.cancelButton}
          disabled={isPending}
        >
          <Text style={styles.cancelButtonText}>İptal</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
  },
  indicator: {
    backgroundColor: "#E0E0E0",
    width: 40,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    paddingTop: 16,
    height: 200,
    fontSize: 16,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  saveButton: {
    backgroundColor: "#121c33",
    height: 52,
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  cancelButton: {
    marginTop: 12,
    padding: 8,
  },
  cancelButtonText: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 14,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
});
