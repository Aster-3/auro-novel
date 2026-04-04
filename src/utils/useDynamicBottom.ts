import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useDynamicBottom = () => {
  const insets = useSafeAreaInsets();

  if (insets.bottom === 0) {
    return 20;
  }
  if (insets.bottom > 35) {
    // Eski tip 3 tuşlu navigasyon barı varsa
    return insets.bottom + 4;
  }
  // Modern gesture bar varsa
  return insets.bottom + 10;
};
