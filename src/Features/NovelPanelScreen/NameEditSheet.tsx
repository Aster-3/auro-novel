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
  View,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetSpringConfigs, // Animasyon konfigürasyonu için eklendi
} from "@gorhom/bottom-sheet";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";
import { titleValidationSchema } from "@/schemas/novel";
import { Portal } from "@gorhom/portal";
import { useAppTheme } from "@/hooks/useTheme";

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
    const { theme, isDarkMode } = useAppTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const nameValue = useRef(initialName);
    const { mutate: updateNovel, isPending } = useNovelMutation(id);

    // Akıcı animasyon ayarı: Uzayıp kısalırken ve açılırken bu değerleri kullanacak
    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 50,
      stiffness: 300,
      mass: 0.5,
      overshootClamping: true,
    });

    useEffect(() => {
      const showEvent =
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      const showSub = Keyboard.addListener(showEvent, () => {
        if (isVisible) bottomSheetRef.current?.expand();
      });

      const hideSub = Keyboard.addListener(hideEvent, () => {
        if (isVisible) bottomSheetRef.current?.snapToIndex(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, [isVisible]);

    const handleClose = useCallback(() => {
      nameValue.current = initialName;
      setIsDirty(false);
      setError(null);
      setIsVisible(false);
      Keyboard.dismiss();
      if (onClose) onClose();
    }, [initialName, onClose]);

    useImperativeHandle(ref, () => ({
      present: () => {
        nameValue.current = initialName;
        setIsDirty(false);
        setError(null);
        setIsVisible(true);
        setTimeout(() => bottomSheetRef.current?.expand(), 10);
      },
      close: () => bottomSheetRef.current?.close(),
    }));

    const handleSave = () => {
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
              message: "Başlık güncellendi.",
            });
            bottomSheetRef.current?.close();
          },
          onError: (err: any) => {
            setError(err?.message || "Hata oluştu.");
          },
        },
      );
    };

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

    const snapPoints = useMemo(() => ["45%", "60%"], []);

    if (!isVisible) return null;

    return (
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}
          animateOnMount={true}
          animationConfigs={animationConfigs} // Animasyon buraya bağlandı
          enableContentPanningGesture={true}
          backgroundStyle={[
            styles.sheetBackground,
            { backgroundColor: theme.surface },
          ]}
          handleIndicatorStyle={[
            styles.indicator,
            { backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#EEE" },
          ]}
          onClose={handleClose}
        >
          <BottomSheetView style={styles.container}>
            <Text style={[styles.title, { color: theme.textSecondary }]}>
              BAŞLIK
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
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
                defaultValue={initialName}
                onChangeText={(text) => {
                  nameValue.current = text;
                  setIsDirty(text.trim() !== "" && text !== initialName);
                  if (error) setError(null);
                }}
                placeholder="Yeni ismi yazın..."
                placeholderTextColor={theme.textSecondary}
                editable={!isPending}
                autoFocus={false}
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
                style={[
                  styles.cancelButtonText,
                  { color: theme.textSecondary },
                ]}
              >
                Vazgeç
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

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
    fontSize: 12,
    fontFamily: "Mont-500",
    textAlign: "center",
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
