import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaAspectRatio,
  TestIds,
} from "react-native-google-mobile-ads";
import { useAppTheme } from "@/hooks/useTheme";

const adUnitId = __DEV__ ? TestIds.NATIVE : "ca-app-pub-xxx/yyy";
const AD_REFRESH_COOLDOWN_MS = 2.5 * 60 * 1000;

type NativeAdSlot = {
  ad: NativeAd | null;
  lastRequestAt: number;
  isLoading: boolean;
  cleanupTimeout: ReturnType<typeof setTimeout> | null;
  subscribers: Set<(ad: NativeAd | null, loading: boolean) => void>;
};

const nativeAdSlots = new Map<string, NativeAdSlot>();

const getNativeAdSlot = (placement: string) => {
  const currentSlot = nativeAdSlots.get(placement);
  if (currentSlot) return currentSlot;

  const nextSlot: NativeAdSlot = {
    ad: null,
    lastRequestAt: 0,
    isLoading: false,
    cleanupTimeout: null,
    subscribers: new Set(),
  };
  nativeAdSlots.set(placement, nextSlot);
  return nextSlot;
};

const notifySlotSubscribers = (slot: NativeAdSlot) => {
  slot.subscribers.forEach((subscriber) => {
    subscriber(slot.ad, slot.isLoading);
  });
};

export const NativeAdCard = ({ placement = "default" }: { placement?: string }) => {
  const { theme, isDarkMode } = useAppTheme();
  const isFocused = useIsFocused();
  const slotRef = useRef(getNativeAdSlot(placement));
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  const surfaceColor = isDarkMode ? "rgba(255,255,255,0.045)" : "#FFFFFF";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.07)" : "#E7ECF3";
  const ctaBg = isDarkMode ? "rgba(255,255,255,0.1)" : "#EEF3FA";
  const ctaTextColor = theme.textPrimary;

  const loadNativeAd = useCallback(
    (force = false) => {
      const slot = slotRef.current;
      const now = Date.now();
      const shouldUseCurrentAd =
        slot.ad && now - slot.lastRequestAt < AD_REFRESH_COOLDOWN_MS;

      if (slot.isLoading || (!force && shouldUseCurrentAd)) {
        setLoading(false);
        return;
      }

      slot.isLoading = true;
      slot.lastRequestAt = now;

      if (!slot.ad) {
        setLoading(true);
      }
      notifySlotSubscribers(slot);

      NativeAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
        aspectRatio: NativeMediaAspectRatio.LANDSCAPE,
      })
        .then((ad) => {
          if (!isMountedRef.current) {
            ad.destroy();
            return;
          }

          slot.ad?.destroy();
          slot.ad = ad;
        })
        .catch((err) => {
          console.log("Native Ad load error:", err);
        })
        .finally(() => {
          slot.isLoading = false;
          notifySlotSubscribers(slot);
        });
    },
    [],
  );

  useEffect(() => {
    const slot = slotRef.current;
    const subscriber = (ad: NativeAd | null, isLoading: boolean) => {
      if (!isMountedRef.current) return;
      setNativeAd(ad);
      setLoading(isLoading && !ad);
    };

    if (slot.cleanupTimeout) {
      clearTimeout(slot.cleanupTimeout);
      slot.cleanupTimeout = null;
    }

    slot.subscribers.add(subscriber);
    subscriber(slot.ad, slot.isLoading);

    return () => {
      isMountedRef.current = false;
      slot.subscribers.delete(subscriber);

      if (slot.subscribers.size === 0) {
        slot.cleanupTimeout = setTimeout(() => {
          if (slot.subscribers.size > 0) return;

          slot.ad?.destroy();
          nativeAdSlots.delete(placement);
        }, AD_REFRESH_COOLDOWN_MS);
      }
    };
  }, [placement]);

  useEffect(() => {
    if (!isFocused) return;

    loadNativeAd();
  }, [isFocused, loadNativeAd]);

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: surfaceColor, borderColor },
        ]}
      >
        <ActivityIndicator size="small" color={theme.textSecondary} />
      </View>
    );
  }

  if (!nativeAd) return null;

  return (
    <View
      style={[styles.cardClip, { backgroundColor: surfaceColor, borderColor }]}
    >
      <NativeAdView nativeAd={nativeAd} style={styles.cardContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            {nativeAd.icon?.url && (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  source={{ uri: nativeAd.icon.url }}
                  style={styles.icon}
                />
              </NativeAsset>
            )}

            <View style={styles.headerText}>
              <View style={styles.titleRow}>
                <NativeAsset assetType={NativeAssetType.HEADLINE}>
                  <Text
                    style={[styles.headline, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {nativeAd.headline}
                  </Text>
                </NativeAsset>

                <Text style={styles.adBadge}>Sponsorlu</Text>
              </View>

              {!!nativeAd.advertiser && (
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text
                    style={[styles.advertiser, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {nativeAd.advertiser}
                  </Text>
                </NativeAsset>
              )}

              {!!nativeAd.body && (
                <NativeAsset assetType={NativeAssetType.BODY}>
                  <Text
                    style={[styles.tagline, { color: theme.textSecondary }]}
                    numberOfLines={1}
                  >
                    {nativeAd.body}
                  </Text>
                </NativeAsset>
              )}
            </View>
          </View>

          {!!nativeAd.callToAction && (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <View style={[styles.ctaButton, { backgroundColor: ctaBg }]}>
                <Text style={[styles.ctaText, { color: ctaTextColor }]}>
                  {nativeAd.callToAction}
                </Text>
              </View>
            </NativeAsset>
          )}
        </View>
      </NativeAdView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardClip: {
    width: "100%",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginVertical: -2,
    overflow: "hidden",
  },
  cardContainer: {
    width: "100%",
  },
  loadingContainer: {
    width: "100%",
    minHeight: 54,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    minHeight: 62,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    flex: 1,
    minWidth: 0,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  headline: {
    flex: 1,
    fontFamily: "Mont-600",
    fontSize: 12,
  },
  adBadge: {
    fontFamily: "Mont-600",
    fontSize: 8,
    color: "#5C6573",
    backgroundColor: "rgba(148,163,184,0.14)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  advertiser: {
    marginTop: 2,
    fontFamily: "Mont-500",
    fontSize: 10,
  },
  tagline: {
    fontFamily: "Mont-500",
    fontSize: 10,
    lineHeight: 14,
  },
  ctaButton: {
    minHeight: 28,
    paddingHorizontal: 9,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "Mont-600",
    fontSize: 10,
  },
});
