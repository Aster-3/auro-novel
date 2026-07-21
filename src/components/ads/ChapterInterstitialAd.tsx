import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { TestIds, useInterstitialAd } from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || null;

export type ChapterInterstitialAdRef = {
  showBeforeContinue: (onContinue: () => void) => void;
  showNow: () => void;
};

export const ChapterInterstitialAd = forwardRef<ChapterInterstitialAdRef>(
  (_, ref) => {
    const hasRequestedLoadRef = useRef(false);
    const hasShownAdRef = useRef(false);
    const pendingContinueRef = useRef<(() => void) | null>(null);

    const { error, isLoaded, isClosed, isOpened, load, show } =
      useInterstitialAd(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

    const requestLoad = useCallback(
      (reason: string) => {
        if (!adUnitId) return;

        console.log("[AdMob Interstitial]: load requested", {
          reason,
          adUnitId,
          isDev: __DEV__,
          hasRequestedLoad: hasRequestedLoadRef.current,
        });

        hasRequestedLoadRef.current = true;
        load();
      },
      [load],
    );

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        requestLoad("initial-delayed-preload");
      }, 650);

      return () => clearTimeout(timeoutId);
    }, [requestLoad]);

    useEffect(() => {
      console.log("[AdMob Interstitial State]:", {
        adUnitId,
        isLoaded,
        isOpened,
        isClosed,
        hasRequestedLoad: hasRequestedLoadRef.current,
      });
    }, [isClosed, isLoaded, isOpened]);

    useEffect(() => {
      if (!adUnitId || !isClosed || !hasShownAdRef.current) return;

      hasShownAdRef.current = false;

      const pendingContinue = pendingContinueRef.current;
      pendingContinueRef.current = null;
      pendingContinue?.();

      requestLoad("closed-preload-next");
    }, [isClosed, requestLoad]);

    useEffect(() => {
      if (!error) return;

      console.warn("[AdMob Interstitial Error]:", error);
      hasRequestedLoadRef.current = false;
      hasShownAdRef.current = false;

      const pendingContinue = pendingContinueRef.current;
      pendingContinueRef.current = null;
      pendingContinue?.();
    }, [error]);

    useImperativeHandle(
      ref,
      () => ({
        showNow: () => {
          if (!adUnitId) {
            console.warn("[AdMob Manual Test]: Missing interstitial ad unit id.");
            return;
          }

          if (!isLoaded) {
            console.warn("[AdMob Manual Test]: Interstitial is not loaded yet.");
            requestLoad("manual-test-not-loaded");
            return;
          }

          hasShownAdRef.current = true;

          try {
            show();
          } catch (err) {
            console.warn("[AdMob Manual Test Show Exception]:", err);
            hasShownAdRef.current = false;
          }
        },
        showBeforeContinue: (onContinue) => {
          if (!adUnitId) {
            onContinue();
            return;
          }

          if (!isLoaded) {
            requestLoad("chapter-change-not-loaded");
            onContinue();
            return;
          }

          pendingContinueRef.current = onContinue;
          hasShownAdRef.current = true;

          try {
            show();
          } catch (err) {
            console.warn("[AdMob Show Exception]:", err);
            hasShownAdRef.current = false;
            pendingContinueRef.current = null;
            onContinue();
          }
        },
      }),
      [isLoaded, requestLoad, show],
    );

    return null;
  },
);

ChapterInterstitialAd.displayName = "ChapterInterstitialAd";
