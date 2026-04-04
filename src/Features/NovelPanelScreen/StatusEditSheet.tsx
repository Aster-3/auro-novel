import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<SeriesStatus>(initialStatus);
  const { mutate: updateNovel, isPending } = useNovelMutation(id);

  const isDirty = selectedStatus !== initialStatus;

  useImperativeHandle(ref, () => ({
    present: () => {
      setSelectedStatus(initialStatus);
      bottomSheetModalRef.current?.present();
    },
    close: () => bottomSheetModalRef.current?.dismiss(),
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
          bottomSheetModalRef.current?.dismiss();
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

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={styles.sheetBackground}
      enableDynamicSizing={false}
      handleIndicatorStyle={styles.indicator}
      onDismiss={onClose}
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
  cancelButton: {
    marginTop: 12,
    padding: 8,
  },
  cancelButtonText: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 14,
  },
});
