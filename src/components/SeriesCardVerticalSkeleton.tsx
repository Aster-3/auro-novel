import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";
import { SkeletonBox } from "./SkeletonBox"; // SkeletonBox'ın olduğu dosya yolu

export const SeriesCardVerticalSkeleton = () => {
  const { theme } = useAppTheme();

  return (
    <View style={s.container}>
      {/* Cover Alanı için Skeleton */}
      <View style={[s.coverWrapper, { backgroundColor: theme.surface }]}>
        <SkeletonBox
          width="100%"
          height="100%"
          style={{ backgroundColor: theme.surfaceHover }} // Temaya göre hafif farklı tonda box
        />
      </View>

      {/* İsim Alanı için Skeleton (2 satırlı text simülasyonu) */}
      <View style={s.textContainer}>
        <SkeletonBox
          width="90%"
          height={12}
          style={{ backgroundColor: theme.surfaceHover, borderRadius: 4 }}
        />
        <SkeletonBox
          width="60%"
          height={12}
          style={{ backgroundColor: theme.surfaceHover, borderRadius: 4 }}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: 105,
    gap: 8,
  },
  coverWrapper: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 14,
    overflow: "hidden",
  },
  textContainer: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 2,
  },
});
