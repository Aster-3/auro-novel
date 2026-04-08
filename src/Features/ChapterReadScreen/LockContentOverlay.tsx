import React, { useState, useEffect } from "react";
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

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import { CoinType } from "@/types/wallet";
import { useWalletQuery } from "@/hooks/useWalletQuery";

interface Props {
  premiumPrice: number;
  freemiumPrice: number;
  discountRate?: number;
  isDiscountActive: boolean;
  discountedEndDate: string | null;
  discountedPremiumPrice: number;
  onUnlock: (coinType: CoinType) => void;
  onTopUp?: () => void;
  translateX: SharedValue<number>;
}

export const LockedContentOverlay = ({
  premiumPrice,
  freemiumPrice,
  discountRate = 0,
  isDiscountActive,
  discountedEndDate,
  discountedPremiumPrice,
  onUnlock,
  onTopUp,
  translateX,
}: Props) => {
  const { data: wallet } = useWalletQuery();
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const insets = useSafeAreaInsets();
  const [selectedToken, setSelectedToken] = useState<CoinType>(CoinType.MOON);

  // --- ANİMASYON DEĞERLERİ ---
  const nightActive = useSharedValue(1);
  const sunActive = useSharedValue(0);

  useEffect(() => {
    nightActive.value = withTiming(selectedToken === CoinType.MOON ? 1 : 0, {
      duration: 250,
    });
    sunActive.value = withTiming(selectedToken === CoinType.SUN ? 1 : 0, {
      duration: 250,
    });
  }, [selectedToken]);

  const animatedSyncStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // --- BUSINESS LOGIC ---
  // Ay Parçası için: İndirim varsa discountedPremiumPrice, yoksa premiumPrice
  const currentMoonPrice = isDiscountActive
    ? discountedPremiumPrice
    : premiumPrice;

  // Buton ve bakiye kontrolleri
  const currentRequiredPrice =
    selectedToken === CoinType.MOON ? currentMoonPrice : freemiumPrice;
  const currentBalance =
    selectedToken === CoinType.MOON ? wallet?.moonCoins : wallet?.sunCoins;
  const hasEnoughBalance =
    currentBalance !== undefined && currentBalance >= currentRequiredPrice;

  const theme = {
    blurTint: isDarkMode ? "dark" : "light",
    title: isDarkMode ? "#FFFFFF" : "#1A1A1B",
    description: isDarkMode ? "#A1A1AA" : "#71717A",
    buttonBg: isDarkMode ? "#FFFFFF" : "#0F172A",
    buttonText: isDarkMode ? "#000000" : "#FFFFFF",
    iconColor: isDarkMode ? "#E4E4E7" : "#1C1C1E",
    divider: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)",
    selectedBorder: isDarkMode ? "#FFFFFF" : "#0F172A",
    unselectedBorder: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    selectedBg: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
    discountColor: isDarkMode ? "#4ADE80" : "#16A34A",
    oldPriceColor: isDarkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
  };

  const createCardStyle = (activeValue: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        activeValue.value,
        [0, 1],
        [theme.unselectedBorder, theme.selectedBorder],
      ),
      backgroundColor: interpolateColor(
        activeValue.value,
        [0, 1],
        ["transparent", theme.selectedBg],
      ),
    }));

  const createCheckStyle = (activeValue: SharedValue<number>) =>
    useAnimatedStyle(() => ({
      opacity: activeValue.value,
      transform: [{ scale: activeValue.value }],
    }));

  return (
    <Animated.View
      style={[styles.fullScreenWrapper, animatedSyncStyle]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={
          isDarkMode
            ? ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
            : ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]
        }
        style={StyleSheet.absoluteFill}
        locations={[0, 0.54, 1]}
        pointerEvents="none"
      />

      <View style={styles.sheetWrapper}>
        <BlurView
          intensity={80}
          tint={theme.blurTint as any}
          style={StyleSheet.absoluteFillObject}
        />

        <View
          style={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom + 12, 24) },
          ]}
        >
          <View style={styles.headerRow}>
            <ChapterLockIcon size={18} color={theme.iconColor} />
            <Text style={[styles.title, { color: theme.title }]}>
              Kilitli Bölüm
            </Text>
          </View>

          <Text style={[styles.description, { color: theme.description }]}>
            Devam etmek için token seçin ve kilidi açın.
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <View style={styles.tokenRow}>
            {/* AY PARÇASI (PREMIUM) */}
            <Pressable
              onPress={() => setSelectedToken(CoinType.MOON)}
              style={{ flex: 1 }}
            >
              <Animated.View
                style={[styles.tokenCard, createCardStyle(nightActive)]}
              >
                {isDiscountActive && discountRate > 0 && (
                  <View style={styles.discountBadge}>
                    <Text
                      style={[
                        styles.discountText,
                        { color: theme.discountColor },
                      ]}
                    >
                      %{discountRate} İNDİRİM
                    </Text>
                  </View>
                )}

                <NightShardIcon size={24} isDarkMode={isDarkMode} />
                <View style={styles.tokenInfo}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tokenName,
                      { color: isDarkMode ? "#FFF" : "#000" },
                    ]}
                  >
                    Ay Parçası
                  </Text>
                  <View style={styles.priceRow}>
                    {isDiscountActive && (
                      <Text
                        style={[
                          styles.oldPrice,
                          { color: theme.oldPriceColor },
                        ]}
                      >
                        {premiumPrice}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.tokenPrice,
                        { color: isDarkMode ? "#FFF" : "#000" },
                      ]}
                    >
                      {currentMoonPrice}
                    </Text>
                  </View>
                  <Text
                    style={[styles.balanceText, { color: theme.description }]}
                  >
                    Bakiye: {wallet?.moonCoins ?? 0}
                  </Text>

                  {/* İndirim Bitiş Süresi (Küçük Bilgi) */}
                  {isDiscountActive && discountedEndDate && (
                    <Text style={styles.timerText} numberOfLines={1}>
                      Süreli Teklif
                    </Text>
                  )}
                </View>

                <View style={styles.checkContainer}>
                  <Animated.View
                    style={[
                      styles.checkDot,
                      createCheckStyle(nightActive),
                      { backgroundColor: isDarkMode ? "#FFF" : "#1A1A1B" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={isDarkMode ? "#000" : "#FFF"}
                    />
                  </Animated.View>
                </View>
              </Animated.View>
            </Pressable>

            {/* GÜNEŞ PARÇASI (STANDART) */}
            <Pressable
              onPress={() => setSelectedToken(CoinType.SUN)}
              style={{ flex: 1 }}
            >
              <Animated.View
                style={[styles.tokenCard, createCardStyle(sunActive)]}
              >
                <SunShardIcon size={24} />
                <View style={styles.tokenInfo}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tokenName,
                      { color: isDarkMode ? "#FFF" : "#000" },
                    ]}
                  >
                    Güneş Parçası
                  </Text>
                  <Text
                    style={[
                      styles.tokenPrice,
                      { color: isDarkMode ? "#FFF" : "#000" },
                    ]}
                  >
                    {freemiumPrice}
                  </Text>
                  <Text
                    style={[styles.balanceText, { color: theme.description }]}
                  >
                    Bakiye: {wallet?.sunCoins ?? 0}
                  </Text>
                </View>

                <View style={styles.checkContainer}>
                  <Animated.View
                    style={[
                      styles.checkDot,
                      createCheckStyle(sunActive),
                      { backgroundColor: isDarkMode ? "#FFF" : "#1A1A1B" },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={isDarkMode ? "#000" : "#FFF"}
                    />
                  </Animated.View>
                </View>
              </Animated.View>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          <TouchableOpacity
            activeOpacity={0.82}
            style={[
              styles.button,
              {
                backgroundColor: hasEnoughBalance
                  ? theme.buttonBg
                  : isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(15,23,42,0.05)",
              },
            ]}
            onPress={hasEnoughBalance ? () => onUnlock(selectedToken) : onTopUp}
          >
            {hasEnoughBalance ? (
              <SparkleIcon size={18} color={theme.buttonText} />
            ) : (
              <Ionicons
                name="wallet-outline"
                size={18}
                color={theme.description}
              />
            )}
            <Text
              style={[
                styles.buttonLabel,
                {
                  color: hasEnoughBalance
                    ? theme.buttonText
                    : theme.description,
                },
              ]}
            >
              {hasEnoughBalance
                ? "Bölümün Kilidini Aç"
                : "Bakiye Yetersiz - Şimdi Yükle"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.secondaryButton}>
            <AlbumsIcon size={16} color={theme.iconColor} />
            <Text style={[styles.secondaryText, { color: theme.description }]}>
              Toplu Kilit Aç
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
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
  },
  content: { paddingHorizontal: 24, paddingTop: 26, alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  title: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },
  description: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  divider: { width: "100%", height: 1, marginVertical: 20 },
  tokenRow: { flexDirection: "row", width: "100%", gap: 10, marginBottom: 4 },
  tokenCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  tokenInfo: { flex: 1 },
  tokenName: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  oldPrice: {
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "line-through",
    marginTop: 1,
  },
  tokenPrice: { fontSize: 19, fontWeight: "800", letterSpacing: -0.5 },
  balanceText: { fontSize: 9, fontWeight: "600", marginTop: 1, opacity: 0.7 },
  timerText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#FF9500",
    marginTop: 2,
    textTransform: "uppercase",
  },
  discountBadge: { position: "absolute", top: 6, left: 12, zIndex: 10 },
  discountText: { fontSize: 8, fontWeight: "900", letterSpacing: 0.5 },
  checkContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  checkDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  buttonLabel: { fontSize: 15, fontWeight: "700" },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 44,
    gap: 6,
  },
  secondaryText: { fontSize: 14, fontWeight: "600" },
});
