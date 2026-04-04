import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { FontTypeIcon } from "@/components/icons/FontTypeIcon";
import { SlidingHorizontalIcon } from "@/components/icons/SlidingHorizontalIcon";
import { FontIncrementIcon } from "@/components/icons/FontIncrementIcon";
import { FontDecrementIcon } from "@/components/icons/FontDecrementIcon";

const FONT_OPTIONS = [
  "Literata",
  "Assistant",
  "Merriweather",
  "Montserrat",
  "Lora",
  "Inter",
];
const ITEM_WIDTH = 140;

interface FontSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  setCurrentFont: (font: string) => void;
}

export const FontSettingsControl = ({
  fontSize,
  setFontSize,
  setCurrentFont,
}: FontSettingsProps) => {
  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / ITEM_WIDTH);
    if (FONT_OPTIONS[index]) {
      setCurrentFont(FONT_OPTIONS[index]);
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.fontFamilyCard}>
        <FontTypeIcon size={16} color="#09244B" />

        <View style={{ width: ITEM_WIDTH }}>
          <FlatList
            data={FONT_OPTIONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            snapToAlignment="center"
            disableIntervalMomentum
            scrollEventThrottle={16}
            onMomentumScrollEnd={onScrollEnd}
            renderItem={({ item }) => (
              <View style={[styles.fontItem, { width: ITEM_WIDTH }]}>
                <Text style={styles.fontName} numberOfLines={1}>
                  {item}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item}
          />
        </View>

        <SlidingHorizontalIcon size={16} strokeWidth={0.5} color="#09244B" />
      </View>

      <View style={styles.fontSizeCard}>
        <TouchableOpacity
          onPress={() => {
            if (fontSize > 14) {
              setFontSize(fontSize - 1);
            }
          }}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }} // Tıklama alanını genişlettik
          activeOpacity={0.6}
        >
          <FontDecrementIcon />
        </TouchableOpacity>

        <Text style={styles.fontSizeText}>{fontSize}</Text>

        <TouchableOpacity
          onPress={() => {
            if (fontSize < 18) {
              setFontSize(fontSize + 1);
            }
          }}
          hitSlop={{ top: 15, bottom: 15, left: 10, right: 15 }}
          activeOpacity={0.6}
        >
          <FontIncrementIcon />
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  fontSizeCard: {
    flex: 1,
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  fontItem: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  fontName: {
    fontFamily: "Mont-500",
    fontSize: 12,
    color: "#606060",
  },
  fontSizeText: {
    fontFamily: "Mont-600",
    fontSize: 11,
    color: "#09244B",
    minWidth: 35,
    textAlign: "center",
  },
  iconLeft: { marginLeft: 4 },
  iconRight: { marginRight: 4 },
});
