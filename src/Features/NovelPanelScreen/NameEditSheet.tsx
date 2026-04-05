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
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";
import { titleValidationSchema } from "@/schemas/novel";
import { Portal } from "@gorhom/portal";

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
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Portal içinde render kontrolü için
    const currentIndex = useRef<number>(-1);

    const nameValue = useRef(initialName);
    const { mutate: updateNovel, isPending } = useNovelMutation(id);

    const animationConfigs = useMemo(() => ({ duration: 280 }), []);
    const snapPoints = useMemo(() => ["35%", "70%"], []);

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
      nameValue.current = initialName;
      setIsDirty(false);
      setError(null);
      currentIndex.current = -1;
      setIsOpen(false);
      Keyboard.dismiss();
      if (onClose) onClose();
    }, [initialName, onClose]);

    useImperativeHandle(ref, () => ({
      present: () => {
        nameValue.current = initialName;
        setIsDirty(false);
        setError(null);
        setIsOpen(true);
        // Portal render olduktan hemen sonra açılması için
        setTimeout(() => bottomSheetRef.current?.snapToIndex(0), 0);
      },
      close: () => bottomSheetRef.current?.close(),
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
            bottomSheetRef.current?.close();
          },
          onError: (err: any) => {
            setError(err?.message || "Bir hata oluştu.");
          },
        },
      );
    };

    if (!isOpen) return null;

    return (
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enableContentPanningGesture={false}
          backgroundStyle={styles.sheetBackground}
          animationConfigs={animationConfigs}
          handleIndicatorStyle={styles.indicator}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          onClose={handleClose}
          onChange={(index) => {
            currentIndex.current = index;
            if (index === -1) handleClose();
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
                (isPending || !isDirty) && { opacity: 0.6 },
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
              onPress={() => bottomSheetRef.current?.close()}
              style={styles.cancelButton}
              disabled={isPending}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
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
