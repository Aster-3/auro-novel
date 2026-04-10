import React, { forwardRef, useCallback } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { AuthorTransactionType } from "@/types/author";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export interface DateRange {
  label: string;
  date: Date;
}

interface Props {
  setFilter: (filter: AuthorTransactionType | null) => void;
  setSince: (since: DateRange) => void;
  selectedSheet: "filter" | "sort";
}

export const TransactionBottomSheet = forwardRef<BottomSheet, Props>(
  ({ setFilter, setSince, selectedSheet }, ref) => {
    const { theme, isDarkMode } = useAppTheme(); // Temayı aldık

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      stiffness: 350,
      mass: 1,
      overshootClamping: true,
    });

    const handleDateSelect = (
      label: string,
      type: "day" | "week" | "month",
      value: number,
    ) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      if (type === "day") date.setDate(date.getDate() - value);
      if (type === "week") date.setDate(date.getDate() - value * 7);
      if (type === "month") date.setMonth(date.getMonth() - value);

      setSince({ label, date });
      // @ts-ignore
      ref?.current?.close();
    };

    const sortOptions = [
      {
        label: "Son 1 Gün",
        action: () => handleDateSelect("Son 1 Gün", "day", 1),
      },
      {
        label: "Son 1 Hafta",
        action: () => handleDateSelect("Son 1 Hafta", "week", 1),
      },
      {
        label: "Son 1 Ay",
        action: () => handleDateSelect("Son 1 Ay", "month", 1),
      },
      {
        label: "Son 3 Ay",
        action: () => handleDateSelect("Son 3 Ay", "month", 3),
      },
      {
        label: "Son 6 Ay",
        action: () => handleDateSelect("Son 6 Ay", "month", 6),
      },
      {
        label: "Son 1 Yıl",
        action: () => handleDateSelect("Son 1 Yıl", "month", 12),
      },
    ];

    const filterOptions = [
      { label: "Tümü", value: null },
      { label: "Bölüm Satışı", value: AuthorTransactionType.EARNING },
      { label: "Para Çekme", value: AuthorTransactionType.WITHDRAWAL },
      { label: "Bonuslar", value: AuthorTransactionType.BONUS },
    ];

    const renderItem = (
      label: string,
      onPress: () => void,
      isLast: boolean,
    ) => (
      <TouchableOpacity
        key={label}
        activeOpacity={0.7}
        style={[
          styles.optionRow,
          {
            borderBottomColor: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "#EEEEEE",
          },
          isLast && { borderBottomWidth: 0 },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.optionText, { color: theme.textPrimary }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.3}
        />
      ),
      [],
    );

    return (
      <Portal>
        <BottomSheet
          ref={ref}
          index={-1}
          enableDynamicSizing={true}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          animationConfigs={animationConfigs}
          bottomInset={0}
          detached={true}
          handleIndicatorStyle={[
            styles.indicator,
            {
              backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E0E0E0",
            },
          ]}
          backgroundStyle={[
            styles.sheetBackground,
            { backgroundColor: theme.surface },
          ]}
        >
          <BottomSheetView style={styles.content}>
            <Text style={[styles.header, { color: theme.textSecondary }]}>
              {selectedSheet === "sort" ? "TARİH ARALIĞI" : "İŞLEM TİPİ"}
            </Text>

            <View style={styles.listContainer}>
              {selectedSheet === "sort"
                ? sortOptions.map((opt, i) =>
                    renderItem(
                      opt.label,
                      opt.action,
                      i === sortOptions.length - 1,
                    ),
                  )
                : filterOptions.map((opt, i) =>
                    renderItem(
                      opt.label,
                      () => {
                        setFilter(opt.value);
                        // @ts-ignore
                        ref?.current?.close();
                      },
                      i === filterOptions.length - 1,
                    ),
                  )}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 8,
  },
  indicator: {
    width: 36,
    height: 4,
  },
  header: {
    fontFamily: "Mont-600",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: "left",
  },
  listContainer: {
    width: "100%",
    paddingBottom: 24,
  },
  optionRow: {
    paddingVertical: 16,
    alignItems: "flex-start",
    width: "100%",
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontFamily: "Mont-500",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
