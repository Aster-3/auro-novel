import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetSpringConfigs, // Yaylanma konfigürasyonu için eklendi
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { SeriesStatus } from "@/types/novel";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";
import { useAppTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";

export interface StatusEditSheetRef {
  present: () => void;
  close: () => void;
}

interface StatusEditSheetProps {
  id: string;
  initialStatus: SeriesStatus;
  onClose?: () => void;
}

const STATUS_OPTIONS = [
  { label: "Devam Ediyor", value: SeriesStatus.ONGOING },
  { label: "Tamamlandı", value: SeriesStatus.COMPLETED },
  { label: "Ara Verildi", value: SeriesStatus.HIATUS },
  { label: "Durduruldu", value: SeriesStatus.CANCELLED },
  { label: "Hazırlıkta", value: SeriesStatus.DRAFT },
];

export const StatusEditSheet = forwardRef<
  StatusEditSheetRef,
  StatusEditSheetProps
>(({ id, initialStatus, onClose }, ref) => {
  const { theme, isDarkMode } = useAppTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<SeriesStatus>(initialStatus);
  const { mutate: updateNovel, isPending } = useNovelMutation(id);

  const isDirty = selectedStatus !== initialStatus;

  // Animasyon konfigürasyonu: Esneme ve tokluk ayarı
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 300,
    mass: 1,
    overshootClamping: true,
  });

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  useImperativeHandle(ref, () => ({
    present: () => {
      setSelectedStatus(initialStatus);
      setIsVisible(true);
      setTimeout(() => bottomSheetRef.current?.expand(), 10);
    },
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleSave = () => {
    updateNovel(
      { status: selectedStatus },
      {
        onSuccess: () => {
          useToastStore.getState().showToast({
            type: "Başarılı",
            message: "Durum güncellendi.",
          });
          bottomSheetRef.current?.close();
        },
        onError: () => {
          useToastStore.getState().showToast({
            type: "Hata",
            message: "Hata oluştu.",
          });
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

  const snapPoints = useMemo(() => ["50%"], []);

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
        animationConfigs={animationConfigs} // Yaylanma animasyonu eklendi
        enableContentPanningGesture={true}
        enableOverDrag={false}
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
            YAYIN DURUMU
          </Text>

          <View style={styles.optionsContainer}>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionRow,
                    isSelected && {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.01)",
                    },
                  ]}
                  activeOpacity={0.5}
                  onPress={() => setSelectedStatus(option.value)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected
                          ? theme.textPrimary
                          : theme.textSecondary,
                        opacity: isSelected ? 1 : 0.7,
                      },
                      isSelected && { fontFamily: "Mont-600" },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={14} color={theme.textPrimary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.textPrimary },
              (isPending || !isDirty) && { opacity: 0.3 },
            ]}
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
  optionsContainer: {
    gap: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionLabel: {
    fontSize: 12,
    fontFamily: "Mont-500",
    letterSpacing: 0.2,
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
});
