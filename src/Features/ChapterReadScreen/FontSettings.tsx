import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native";
import { FontTypeIcon } from "@/components/icons/FontTypeIcon";
import { SlidingHorizontalIcon } from "@/components/icons/SlidingHorizontalIcon";
import { FontIncrementIcon } from "@/components/icons/FontIncrementIcon";
import { FontDecrementIcon } from "@/components/icons/FontDecrementIcon";
import { useReaderStore } from "@/store/useReaderStore";

const FONT_OPTIONS = [
  "Literata",
  "Assistant",
  "Merriweather",
  "Montserrat",
  "Lora",
  "Inter",
];

const ITEM_WIDTH = 140;

export const FontSettingsControl = () => {
  const { isDarkMode, fontFamily, fontSize, setFontSize, setFontFamily } =
    useReaderStore();

  // null: henüz ölçülmedi → ScrollView render edilmez
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const sidePadding =
    containerWidth != null ? (containerWidth - ITEM_WIDTH) / 2 : 0;

  // containerWidth kesinleşince offset'i doğru hesapla
  const initialOffset = useMemo(() => {
    if (containerWidth == null) return { x: 0, y: 0 };
    const index = FONT_OPTIONS.indexOf(fontFamily);
    const safeIndex = index >= 0 ? index : 0;
    return { x: safeIndex * ITEM_WIDTH, y: 0 };
  }, [containerWidth]); // containerWidth gelince bir kez hesapla

  const colors = {
    cardBg: isDarkMode ? "#000000" : "#FFFFFF",
    primary: isDarkMode ? "#fcf3e6" : "#09244B",
    secondaryText: isDarkMode ? "#fcf3e6" : "#606060",
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    // Sadece ilk ölçümde set et, gereksiz re-render'ı önler
    setContainerWidth((prev) => (prev == null ? width : prev));
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / ITEM_WIDTH);
    if (FONT_OPTIONS[index] && FONT_OPTIONS[index] !== fontFamily) {
      setFontFamily(FONT_OPTIONS[index]);
    }
  };

  return (
    <View style={styles.row}>
      <View style={[styles.fontFamilyCard, { backgroundColor: colors.cardBg }]}>
        <FontTypeIcon size={16} color={colors.primary} />

        {/* Ölçüm için görünmez placeholder — her zaman render edilir */}
        <View style={styles.scrollView} onLayout={onLayout}>
          {containerWidth != null && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate={0.985}
              disableIntervalMomentum
              scrollEventThrottle={16}
              onMomentumScrollEnd={onScrollEnd}
              contentOffset={initialOffset}
              contentContainerStyle={{ paddingHorizontal: sidePadding }}
              style={StyleSheet.absoluteFill}
            >
              {FONT_OPTIONS.map((item) => (
                <View
                  key={item}
                  style={[styles.fontItem, { width: ITEM_WIDTH }]}
                >
                  <Text
                    style={[
                      styles.fontName,
                      {
                        color:
                          item === fontFamily
                            ? colors.primary
                            : colors.secondaryText,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <SlidingHorizontalIcon
          size={16}
          strokeWidth={0.5}
          color={colors.primary}
        />
      </View>

      <View style={[styles.fontSizeCard, { backgroundColor: colors.cardBg }]}>
        <TouchableOpacity
          onPress={() => fontSize > 14 && setFontSize(fontSize - 1)}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }}
          activeOpacity={0.6}
        >
          <FontDecrementIcon color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.fontSizeText, { color: colors.primary }]}>
          {fontSize}
        </Text>

        <TouchableOpacity
          onPress={() => fontSize < 18 && setFontSize(fontSize + 1)}
          hitSlop={{ top: 15, bottom: 15, left: 10, right: 15 }}
          activeOpacity={0.6}
        >
          <FontIncrementIcon color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  fontFamilyCard: {
    flex: 2.5,
    height: 45,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  fontSizeCard: {
    flex: 1,
    height: 45,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    height: 45,
  },
  fontItem: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  fontName: {
    fontFamily: "Mont-500",
    fontSize: 12,
  },
  fontSizeText: {
    fontFamily: "Mont-600",
    fontSize: 11,
    minWidth: 35,
    textAlign: "center",
  },
});
