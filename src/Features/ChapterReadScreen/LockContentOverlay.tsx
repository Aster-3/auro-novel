import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useReaderStore } from "@/store/useReaderStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChapterLockIcon } from "@/components/icons/ChapterLockIcon";
import { NightShardIcon } from "@/components/icons/NightShardIcon";
import { SunShardIcon } from "@/components/icons/SunShardIcon";
import { SparkleIcon } from "@/components/icons/SparkleIcon";
import { AlbumsIcon } from "@/components/icons/AlbumsIcon";

export const LockedContentOverlay = ({
  nightPrice,
  sunPrice,
  onUnlock,
}: {
  nightPrice: number;
  sunPrice: number;
  onUnlock: () => void;
}) => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const insets = useSafeAreaInsets();
  const [selectedToken, setSelectedToken] = useState<"night" | "sun">("night");

  // Tema objesi ikonlar ve checkmark için daha yetenekli hale getirildi
  const theme = {
    blurTint: isDarkMode ? "dark" : "light",
    gradient: isDarkMode
      ? (["rgba(0, 0, 0, 0.0)", "rgba(0, 0, 0, 0.9)"] as const)
      : (["rgba(255, 255, 255, 0.0)", "rgba(255, 255, 255, 1.0)"] as const),
    overlayBg: isDarkMode
      ? "rgba(18, 18, 18, 0.2)"
      : "rgba(255, 255, 255, 0.2)",
    title: isDarkMode ? "#FFFFFF" : "#1A1A1B",
    description: isDarkMode ? "#A1A1AA" : "#71717A",
    buttonBg: isDarkMode ? "#FFFFFF" : "#0F172A",
    buttonText: isDarkMode ? "#000000" : "#FFFFFF",
    buttonIcon: isDarkMode ? "#000000" : "#FFFFFF",
    iconColor: isDarkMode ? "#E4E4E7" : "#1C1C1E",
    divider: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)",
    selectedBorder: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
    unselectedBorder: isDarkMode
      ? "rgba(255,255,255,0.07)"
      : "rgba(0,0,0,0.07)",
    selectedLabel: isDarkMode ? "#FFFFFF" : "#0F172A",
    unselectedLabel: isDarkMode ? "#52525B" : "#A1A1AA",
    badge: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    checkDotBg: isDarkMode ? "#FFFFFF" : "#1A1A1B",
    checkDotIcon: isDarkMode ? "#000000" : "#FFFFFF",
  };

  return (
    <View style={styles.fullScreenWrapper} pointerEvents="box-none">
      <LinearGradient
        colors={theme.gradient}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.5, 1]}
        pointerEvents="none"
      />

      <View style={styles.sheetWrapper}>
        <BlurView
          intensity={50}
          tint={theme.blurTint as any}
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: theme.overlayBg },
          ]}
        />

        <View
          style={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom + 12, 24) },
          ]}
        >
          {/* Icon + Title */}
          <View style={styles.headerRow}>
            <ChapterLockIcon size={18} color={theme.iconColor} />
            <Text style={[styles.title, { color: theme.title }]}>
              Kilitli Bölüm
            </Text>
          </View>

          <Text style={[styles.description, { color: theme.description }]}>
            Devam etmek için token seçin ve kilidi açın.
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Token Selector */}
          <View style={styles.tokenRow}>
            {/* Night Shard */}
            <Pressable
              onPress={() => setSelectedToken("night")}
              style={[
                styles.tokenCard,
                {
                  borderColor:
                    selectedToken === "night"
                      ? theme.selectedBorder
                      : theme.unselectedBorder,
                },
              ]}
            >
              <NightShardIcon size={28} isDarkMode={isDarkMode} />
              <View style={styles.tokenInfo}>
                <Text
                  style={[
                    styles.tokenName,
                    {
                      color:
                        selectedToken === "night"
                          ? theme.selectedLabel
                          : theme.unselectedLabel,
                    },
                  ]}
                >
                  Gece Parçası
                </Text>
                <Text
                  style={[
                    styles.tokenPrice,
                    {
                      color:
                        selectedToken === "night"
                          ? theme.title
                          : theme.unselectedLabel,
                    },
                  ]}
                >
                  {nightPrice}
                </Text>
              </View>
              {selectedToken === "night" && (
                <View
                  style={[
                    styles.checkDot,
                    { backgroundColor: theme.checkDotBg },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={theme.checkDotIcon}
                  />
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setSelectedToken("sun")}
              style={[
                styles.tokenCard,
                {
                  borderColor:
                    selectedToken === "sun"
                      ? theme.selectedBorder
                      : theme.unselectedBorder,
                },
              ]}
            >
              <SunShardIcon size={28} />
              <View style={styles.tokenInfo}>
                <Text
                  style={[
                    styles.tokenName,
                    {
                      color:
                        selectedToken === "sun"
                          ? theme.selectedLabel
                          : theme.unselectedLabel,
                    },
                  ]}
                >
                  Güneş Parçası
                </Text>
                <View style={styles.sunPriceRow}>
                  <Text
                    style={[
                      styles.tokenPrice,
                      {
                        color:
                          selectedToken === "sun"
                            ? theme.title
                            : theme.unselectedLabel,
                      },
                    ]}
                  >
                    {sunPrice}
                  </Text>
                  <View
                    style={[
                      styles.discountBadge,
                      { backgroundColor: theme.badge },
                    ]}
                  >
                    <Text
                      style={[
                        styles.discountText,
                        { color: isDarkMode ? "#86EFAC" : "#16A34A" },
                      ]}
                    >
                      %50
                    </Text>
                  </View>
                </View>
              </View>
              {selectedToken === "sun" && (
                <View
                  style={[
                    styles.checkDot,
                    { backgroundColor: theme.checkDotBg },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={12}
                    color={theme.checkDotIcon}
                  />
                </View>
              )}
            </Pressable>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* CTA Button */}
          <TouchableOpacity
            activeOpacity={0.82}
            style={[styles.button, { backgroundColor: theme.buttonBg }]}
            onPress={onUnlock}
          >
            <SparkleIcon size={18} color={theme.buttonIcon} />
            <Text style={[styles.buttonLabel, { color: theme.buttonText }]}>
              Bölümün Kilidini Aç
            </Text>
          </TouchableOpacity>

          {/* Secondary */}
          <TouchableOpacity activeOpacity={0.7} style={styles.secondaryButton}>
            <AlbumsIcon size={16} color="#ffff" />
            <Text style={[styles.secondaryText, { color: theme.description }]}>
              Toplu Kilit Aç
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.12)",
    borderBottomWidth: 0,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 26,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 20,
  },
  tokenRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginBottom: 4,
  },
  tokenCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  tokenInfo: {
    flex: 1,
    gap: 2,
  },
  tokenName: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  tokenPrice: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  sunPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: "700",
  },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 52,
    borderRadius: 14,
    gap: 8,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 44,
    gap: 6,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
