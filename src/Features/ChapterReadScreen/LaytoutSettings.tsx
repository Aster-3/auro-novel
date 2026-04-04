import React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { FontTypeIcon } from "@/components/icons/FontTypeIcon";
import { SlidingHorizontalIcon } from "@/components/icons/SlidingHorizontalIcon";
import { PaddingHorizontalIcon } from "@/components/icons/PaddingHorizontalIcon";
import { LineHeightIcon } from "@/components/icons/LineHeightIcon";

const LINE_HEIGHT_LABELS = ["Küçük Aralık", "Orta Aralık", "Büyük Aralık"];
const PADDING_LABELS = ["Küçük Genişlik", "Orta Genişlik", "Büyük Genişlik"];

const ITEM_WIDTH = 100;

interface LayoutSettingsProps {
  lineHeight: number;
  setLineHeight: (val: number) => void;
  paddingHorizontal: number;
  setPaddingHorizontal: (val: number) => void;
}

export const LayoutSettings = ({
  lineHeight,
  setLineHeight,
  paddingHorizontal,
  setPaddingHorizontal,
}: LayoutSettingsProps) => {
  const onLineHeightScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / ITEM_WIDTH);
    if (index >= 0 && index < LINE_HEIGHT_LABELS.length) {
      setLineHeight(index + 1);
    }
  };

  // Padding Horizontal için kaydırma kontrolü
  const onPaddingScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / PADDING_LABELS.length); // Hatalı bölme düzeltildi: ITEM_WIDTH olmalı
    const actualIndex = Math.round(x / ITEM_WIDTH);
    if (actualIndex >= 0 && actualIndex < PADDING_LABELS.length) {
      setPaddingHorizontal(actualIndex + 1);
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <LineHeightIcon size={16} strokeWidth={0.1} color="#09244B" />

        <View style={{ width: ITEM_WIDTH }}>
          <FlatList
            data={LINE_HEIGHT_LABELS}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onLineHeightScroll}
            renderItem={({ item }) => (
              <View style={[styles.swipeItem, { width: ITEM_WIDTH }]}>
                <Text style={styles.swipeText} numberOfLines={1}>
                  {item}
                </Text>
              </View>
            )}
            keyExtractor={(item) => `lh-${item}`}
          />
        </View>
        <SlidingHorizontalIcon size={16} strokeWidth={0.5} color="#09244B" />
      </View>

      <View style={styles.card}>
        <PaddingHorizontalIcon size={16} strokeWidth={1.5} color="#09244B" />

        <View style={{ width: ITEM_WIDTH }}>
          <FlatList
            data={PADDING_LABELS}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            snapToAlignment="center"
            decelerationRate="fast"
            disableIntervalMomentum={true}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onPaddingScroll}
            renderItem={({ item }) => (
              <View style={[styles.swipeItem, { width: ITEM_WIDTH }]}>
                <Text style={styles.swipeText} numberOfLines={1}>
                  {item}
                </Text>
              </View>
            )}
            keyExtractor={(item) => `ph-${item}`}
          />
        </View>
        <SlidingHorizontalIcon size={16} strokeWidth={0.5} color="#09244B" />
      </View>
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
    flex: 1, // İkisi de eşit yer kaplar
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  swipeItem: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    color: "#606060",
    textAlign: "center",
  },
});
