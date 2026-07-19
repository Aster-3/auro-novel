import { FemaleGenderIcon } from "@/components/icons/FemaleGenderIcon";
import { FollowerIcon } from "@/components/icons/FollowerIcon";
import { FollowIcon } from "@/components/icons/FollowIcon";
import { MaleGenderIcon } from "@/components/icons/MaleGenderIcon";
import { UnknownGenderIcon } from "@/components/icons/UnknownGenderIcon";
import { useAppTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type ProfileGender = "male" | "female" | "null" | null;

const getGenderConfig = (gender: ProfileGender, fallbackColor: string) => {
  if (gender === "female") {
    return {
      label: "Kadın",
      color: "#C51E48",
      gradient: ["rgba(197, 30, 72, 0.4)", "rgba(232,93,117,0.06)"] as const,
      Icon: FemaleGenderIcon,
    };
  }

  if (gender === "male") {
    return {
      label: "Erkek",
      color: "#2a6bcd",
      gradient: ["rgba(79, 143, 239, 0.47)", "rgba(38,82,156,0.08)"] as const,
      Icon: MaleGenderIcon,
    };
  }

  return {
    label: "Belirtilmedi",
    color: fallbackColor,
    gradient: ["rgba(128,128,128,0.12)", "rgba(128,128,128,0.04)"] as const,
    Icon: UnknownGenderIcon,
  };
};

export const UserProfileBio = React.memo(
  ({
    username,
    nickname,
    biography,
    gender,
    followerCount = 0,
    followingCount = 0,
    isFollowing,
    canFollow,
    isFollowPending,
    onToggleFollow,
    onFollowersPress,
    onFollowingPress,
  }: {
    username: string;
    nickname: string;
    biography: string | null;
    gender: ProfileGender;
    followerCount: number;
    followingCount: number;
    isFollowing: boolean;
    canFollow: boolean;
    isFollowPending: boolean;
    onToggleFollow: () => void;
    onFollowersPress: () => void;
    onFollowingPress: () => void;
  }) => {
    const { theme, isDarkMode } = useAppTheme();
    const genderConfig = getGenderConfig(gender, theme.textSecondary);
    const GenderIcon = genderConfig.Icon;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? theme.backgroundSecondary : "#FFFFFF",
            borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "#E5E7EB",
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text
              style={[styles.nickname, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {nickname}
            </Text>
            <Text
              style={[styles.username, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              @{username}
            </Text>
          </View>
          <View style={styles.iconGroup}>
            {canFollow ? (
              <FollowRadarButton
                isFollowing={isFollowing}
                isPending={isFollowPending}
                isDarkMode={isDarkMode}
                onPress={onToggleFollow}
              />
            ) : null}
          </View>
        </View>

        <Text
          numberOfLines={2}
          style={[styles.description, { color: theme.textPrimary }]}
        >
          {biography?.trim() || "Biyografi girilmedi."}
        </Text>

        <View style={styles.metaRow}>
          <LinearGradient
            colors={genderConfig.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.metaItem,
              styles.genderPill,
              { borderColor: genderConfig.color },
            ]}
          >
            <GenderIcon size={12} color={genderConfig.color} />
            <Text style={[styles.metaText, { color: genderConfig.color }]}>
              {genderConfig.label}
            </Text>
          </LinearGradient>

          <Pressable onPress={onFollowersPress} style={styles.metaItem}>
            <FollowerIcon size={14} color={theme.textPrimary} />
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {followerCount} Takipçi
            </Text>
          </Pressable>

          <Pressable onPress={onFollowingPress} style={styles.metaItem}>
            <View style={{ transform: [{ rotate: "90deg" }] }}>
              <FollowerIcon size={14} color={theme.textPrimary} />
            </View>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {followingCount} Takip Edilen
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

const FollowRadarButton = ({
  isFollowing,
  isPending,
  isDarkMode,
  onPress,
}: {
  isFollowing: boolean;
  isPending: boolean;
  isDarkMode: boolean;
  onPress: () => void;
}) => {
  const progress = useSharedValue(isFollowing ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isFollowing ? 1 : 0, { duration: 520 });
    iconScale.value = withSequence(
      withTiming(1.12, { duration: 160 }),
      withTiming(0.96, { duration: 140 }),
      withTiming(1, { duration: 180 }),
    );
  }, [iconScale, isFollowing, progress]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(isPending ? 0.94 : 1, { duration: 160 }) }],
    opacity: withTiming(isPending ? 0.55 : 1, { duration: 160 }),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${progress.value * 270}deg` },
      { scale: iconScale.value },
    ],
  }));

  const iconColor = isDarkMode
    ? "#FFFFFF"
    : isFollowing
      ? "#0B5FE8"
      : "#0F172A";

  return (
    <Pressable onPress={onPress} disabled={isPending} hitSlop={10}>
      <Animated.View
        style={[
          styles.followButton,
          {
            backgroundColor: isFollowing
              ? isDarkMode
                ? "rgba(0, 100, 241, 0.28)"
                : "rgba(0, 100, 241, 0.11)"
              : isDarkMode
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(15, 23, 42, 0.055)",
          },
          buttonStyle,
        ]}
      >
        <Animated.View style={iconStyle}>
          <FollowIcon color={iconColor} size={18} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 6,
  },
  nameContainer: {
    flex: 1,
  },
  nickname: {
    fontSize: 16,
    fontFamily: "Mont-700",
  },
  username: {
    fontSize: 11,
    fontFamily: "Mont-500",
    marginTop: 1,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 8,
  },
  followButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
    fontFamily: "Mont-400",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 12,
    rowGap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 18,
  },
  genderPill: {
    minHeight: 24,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 10,
    marginLeft: 5,
    fontFamily: "Mont-600",
  },
  statValue: {
    fontSize: 11,
    fontFamily: "Mont-700",
    marginTop: 1,
    marginLeft: 5,
  },
});
