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
import Animated, { Easing, FadeInUp, FadeOutUp } from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";
import { titleValidationSchema } from "@/schemas/novel";

export interface NameEditSheetRef {
  present: () => void;
  close: () => void;
}

interface NameEditSheetProps {
  id: string;
  initialName: string;
  onClose?: () => void;
}

export const NameEditSheet = forwardRef<NameEditSheetRef, NameEditSheetProps>(
  ({ id, initialName, onClose }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const currentIndex = useRef<number>(-1);

    // Uncontrolled yaklaşım: değeri ref'te tutuyoruz, state'e almıyoruz.
    const nameValue = useRef(initialName);

    const { mutate: updateNovel, isPending } = useNovelMutation(id);

    const animationConfigs = useMemo(
      () => ({
        duration: 280,
      }),
      [],
    );

    useEffect(() => {
      if (currentIndex.current === -1) {
        nameValue.current = initialName;
        setIsDirty(false);
      }
    }, [initialName]);

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
      nameValue.current = initialName;
      setIsDirty(false);
      setError(null);
      currentIndex.current = -1;
      Keyboard.dismiss();
      if (onClose) onClose();
    }, [initialName, onClose]);

    useImperativeHandle(ref, () => ({
      present: () => {
        nameValue.current = initialName;
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
      const current = nameValue.current;
      const result = titleValidationSchema.safeParse(current);

      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }

      updateNovel(
        { name: current.trim() },
        {
          onSuccess: () => {
            useToastStore.getState().showToast({
              type: "Başarılı",
              message: "Başlık başarıyla güncellendi!",
            });
            bottomSheetModalRef.current?.dismiss();
          },
          onError: (err: any) => {
            setError(err?.message || "Bir hata oluştu.");
          },
        },
      );
    };

    const snapPoints = useMemo(() => ["35%", "70%"], []);

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
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
          <Text style={styles.title}>Başlık Düzenle</Text>

          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            defaultValue={initialName}
            onChangeText={(text) => {
              nameValue.current = text;
              const dirty = text.trim() !== "" && text !== initialName;
              setIsDirty(dirty);
              if (error) setError(null);
            }}
            placeholder="Roman ismini girin..."
            placeholderTextColor="#94A3B8"
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
  },
);

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
