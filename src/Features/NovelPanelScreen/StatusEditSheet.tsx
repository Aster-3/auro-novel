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
} from "@gorhom/bottom-sheet";

import { Portal } from "@gorhom/portal";
import { SeriesStatus } from "@/types/novel";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { useToastStore } from "@/store/useToastStore";

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isVisible, setIsVisible] = useState(false); // Portal render kontrolü
  const [selectedStatus, setSelectedStatus] =
    useState<SeriesStatus>(initialStatus);
  const { mutate: updateNovel, isPending } = useNovelMutation(id);

  const isDirty = selectedStatus !== initialStatus;

  const handleClose = useCallback(() => {
    setIsVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  useImperativeHandle(ref, () => ({
    present: () => {
      setSelectedStatus(initialStatus);
      setIsVisible(true);
      // Portal'ın render olması için kısa bir süre tanıyalım
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
            message: "Durum başarıyla güncellendi!",
          });
          bottomSheetRef.current?.close();
        },
        onError: () => {
          useToastStore.getState().showToast({
            type: "Hata",
            message:
              "Durum güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
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
        opacity={0.4}
      />
    ),
    [],
  );

  const snapPoints = useMemo(() => ["55%"], []);

  if (!isVisible) return null;

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={styles.sheetBackground}
        enableDynamicSizing={false}
        handleIndicatorStyle={styles.indicator}
        onClose={handleClose}
      >
        <BottomSheetView style={styles.container}>
          <Text style={styles.title}>Yayın Durumu</Text>

          <View style={styles.optionsContainer}>
            {STATUS_OPTIONS.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => setSelectedStatus(option.value)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (isPending || !isDirty) && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={isPending || !isDirty}
          >
            {isPending ? (
              <LoadingDots />
            ) : (
              <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
            )}
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
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
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  optionLabel: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },
  optionLabelActive: {
    color: "#0F172A",
    fontWeight: "600",
  },
  radioOuter: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#121c33",
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#121c33",
  },
  saveButton: {
    backgroundColor: "#121c33",
    height: 52,
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
