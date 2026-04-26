import React, { forwardRef, useCallback } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { useAppTheme } from "@/hooks/useTheme";
import { LibrarySortOption } from "@/types/library";

interface Props {
  order: LibrarySortOption;
  setOrder: (order: LibrarySortOption) => void;
}

export const LibraryFilterSheet = forwardRef<BottomSheet, Props>(
  ({ order, setOrder }, ref) => {
    const { theme, isDarkMode } = useAppTheme();

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      stiffness: 350,
      mass: 1,
      overshootClamping: true,
    });

    const filterOptions = [
      { label: "Son Okunan", value: LibrarySortOption.LAST_READED },
      { label: "Son Eklenen", value: LibrarySortOption.LAST_ADDED },
      { label: "Başlığa Göre", value: LibrarySortOption.TITLE_ASC },
    ];

    const handleSelect = (value: LibrarySortOption) => {
      setOrder(value);
      // @ts-ignore
      ref?.current?.close();
    };

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
          animationConfigs={animationConfigs}
          enableOverDrag={false}
          handleIndicatorStyle={[
            styles.indicator,
            {
              backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E0E0E0",
            },
          ]}
          backgroundStyle={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <BottomSheetView style={styles.content}>
            <Text style={[styles.header, { color: theme.textSecondary }]}>
              Sıralama Seçenekleri
            </Text>

            <View style={styles.listContainer}>
              {filterOptions.map((opt, i) => {
                const isSelected = order === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.7}
                    style={[
                      styles.optionRow,
                      {
                        borderBottomColor: isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "#EEEEEE",
                      },
                      i === filterOptions.length - 1 && {
                        borderBottomWidth: 0,
                      },
                    ]}
                    onPress={() => handleSelect(opt.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected
                            ? theme.textPrimary
                            : theme.textPrimary,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 20,
  },
  indicator: {
    width: 36,
    height: 4,
  },
  header: {
    fontFamily: "Mont-500",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: "left",
  },
  listContainer: {
    width: "100%",
  },
  optionRow: {
    paddingVertical: 18,
    width: "100%",
    borderBottomWidth: 0.5,
  },
  optionText: {
    fontFamily: "Mont-500",
    fontSize: 14,
  },
});
