import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrendingUpIcon } from "./icons/TrendingUpIcon";
import { TrendingDownIcon } from "./icons/TrendingDownIcon";
import { MinusIcon } from "./icons/MinusIcon";
import { useRef } from "react";
import { DashboardStats, TrendState } from "@/types/dashboard";
import { StatCardSkeletonBox } from "@/components/StatCardSkeletonBox";
import { formatCurrent } from "@/utils/formatCurrent";
import { useAppTheme } from "@/hooks/useTheme";

interface StatCardProps {
  label: string;
  stat: DashboardStats | null;
  isDark?: boolean;
  onPress?: () => void;
  isLoading: boolean;
}

export const StatCard = ({
  label,
  stat,
  isDark,
  onPress,
  isLoading,
}: StatCardProps) => {
  const { isDarkMode } = useAppTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (isLoading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getTrendData = () => {
    if (!stat || isLoading) return { Icon: MinusIcon, text: "0.00%" };
    if (stat.status === TrendState.UP)
      return { Icon: TrendingUpIcon, text: `+${stat.change}%` };
    if (stat.status === TrendState.DOWN)
      return { Icon: TrendingDownIcon, text: `${stat.change}%` };
    return { Icon: MinusIcon, text: `${stat.change}%` };
  };

  const { Icon, text } = getTrendData();

  const gradientColors = (() => {
    if (isDarkMode) {
      // Karanlık Mod Varyantları:
      return isDark
        ? ["#061028", "#1E293B"] // Derin Siyah/Lacivert (Mat varyant)
        : ["#244fac", "#6283dd"]; // Canlı Gece Mavisi (Belirgin varyant)
    } else {
      // Aydınlık Mod Varyantları (Senin orijinaller):
      return isDark ? ["#050b13", "#323237ea"] : ["#3b82f6", "#8db4f3"];
    }
  })() as [string, string];

  const mainTextColor = "#ffffff";
  const labelColor = "rgba(255, 255, 255, 0.8)";
  const iconWrapperColor = "rgba(255, 255, 255, 0.15)";

  return (
    <Animated.View
      style={[styles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ flex: 1 }}
        disabled={isLoading}
      >
        <LinearGradient colors={gradientColors} style={styles.container}>
          <View style={styles.header}>
            <Text
              numberOfLines={2}
              style={[styles.label, { color: labelColor }]}
            >
              {label}
            </Text>

            {isLoading ? (
              <StatCardSkeletonBox
                width={30}
                height={30}
                style={{
                  borderRadius: 20,
                  backgroundColor: iconWrapperColor,
                }}
              />
            ) : (
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: iconWrapperColor },
                ]}
              >
                <Icon color={mainTextColor} size={14} />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            {isLoading ? (
              <StatCardSkeletonBox width={70} height={24} />
            ) : (
              <Text style={[styles.value, { color: mainTextColor }]}>
                {stat ? formatCurrent(stat.current, label) : "---"}
              </Text>
            )}

            {isLoading ? (
              <StatCardSkeletonBox
                width={45}
                height={16}
                style={{ marginBottom: 4 }}
              />
            ) : (
              <Text style={[styles.percentage, { color: mainTextColor }]}>
                {text}
              </Text>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    height: 100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontFamily: "Mont-600",
    fontSize: 11,
    width: "100%",
    flexShrink: 1,
    flexWrap: "nowrap",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
  },
  percentage: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
});
