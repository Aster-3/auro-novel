import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useEffect } from "react";

export const StatCardSkeleton = ({ isDark }: { isDark?: boolean }) => {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const gradientColors = (
    isDark ? ["#050b13", "#323237ea"] : ["#3b82f6", "#8db4f3"]
  ) as [string, string];

  return (
    <View style={styles.animatedContainer}>
      <LinearGradient colors={gradientColors} style={styles.container}>
        {/* Üst Kısım Skeleton */}
        <View style={styles.header}>
          <Animated.View
            style={[styles.skeletonLabel, { opacity: shimmerAnim }]}
          />
          <Animated.View
            style={[styles.skeletonIcon, { opacity: shimmerAnim }]}
          />
        </View>

        {/* Alt Kısım Skeleton */}
        <View style={styles.footer}>
          <Animated.View
            style={[styles.skeletonValue, { opacity: shimmerAnim }]}
          />
          <Animated.View
            style={[styles.skeletonPercent, { opacity: shimmerAnim }]}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { flex: 1, height: 100 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  skeletonLabel: {
    width: "50%",
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
  },
  skeletonIcon: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
  },
  skeletonValue: {
    width: 60,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
  },
  skeletonPercent: {
    width: 40,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginBottom: 4,
  },
});
