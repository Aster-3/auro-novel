import React, { useState } from "react";
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
import { SlidingHorizontalIcon } from "@/components/icons/SlidingHorizontalIcon";
import { PaddingHorizontalIcon } from "@/components/icons/PaddingHorizontalIcon";
import { LineHeightIcon } from "@/components/icons/LineHeightIcon";
import { useReaderStore } from "@/store/useReaderStore";

const LINE_HEIGHT_LABELS = ["Küçük Aralık", "Orta Aralık", "Büyük Aralık"];
const PADDING_LABELS = ["Küçük Genişlik", "Orta Genişlik", "Büyük Genişlik"];

const ITEM_WIDTH = 100;

// Tekrar eden scroll kartını bağımsız bileşene aldık —
// her kart kendi genişliğini ölçer, kendi offset'ini hesaplar
const SnapScrollCard = ({
  data,
  selectedIndex,
  onSelect,
  colors,
  leftIcon,
}: {
  data: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  colors: { cardBg: string; primary: string; secondaryText: string };
  leftIcon: React.ReactNode;
}) => {
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const sidePadding =
    containerWidth != null ? (containerWidth - ITEM_WIDTH) / 2 : 0;

  const initialOffset =
    containerWidth != null
      ? { x: selectedIndex * ITEM_WIDTH, y: 0 }
      : { x: 0, y: 0 };

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth((prev) => (prev == null ? width : prev));
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / ITEM_WIDTH);
    if (index >= 0 && index < data.length && index !== selectedIndex) {
      onSelect(index);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
      {leftIcon}

      <View style={styles.scrollWrapper} onLayout={onLayout}>
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
            {data.map((item, index) => (
              <View
                key={item}
                style={[styles.swipeItem, { width: ITEM_WIDTH }]}
              >
                <Text
                  style={[
                    styles.swipeText,
                    {
                      color:
                        index === selectedIndex
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
  );
};

export const LayoutSettings = () => {
  const {
    isDarkMode,
    lineHeight,
    paddingHorizontal,
    setLineHeight,
    setPaddingHorizontal,
  } = useReaderStore();

  const colors = {
    cardBg: isDarkMode ? "#000000" : "#FFFFFF",
    primary: isDarkMode ? "#fcf3e6" : "#09244B",
    secondaryText: isDarkMode ? "#fcf3e6" : "#606060",
  };

  return (
    <View style={styles.row}>
      <SnapScrollCard
        data={LINE_HEIGHT_LABELS}
        selectedIndex={lineHeight - 1}
        onSelect={(index) => setLineHeight(index + 1)}
        colors={colors}
        leftIcon={
          <LineHeightIcon size={16} strokeWidth={0.1} color={colors.primary} />
        }
      />

      <SnapScrollCard
        data={PADDING_LABELS}
        selectedIndex={paddingHorizontal - 1}
        onSelect={(index) => setPaddingHorizontal(index + 1)}
        colors={colors}
        leftIcon={
          <PaddingHorizontalIcon
            size={16}
            strokeWidth={1.5}
            color={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    flex: 1,
    height: 45,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  scrollWrapper: {
    flex: 1,
    height: 45,
  },
  swipeItem: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    textAlign: "center",
  },
});
