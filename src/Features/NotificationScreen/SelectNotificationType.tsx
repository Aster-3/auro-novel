import React, { memo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { NotificationTypeEnum } from "@/screens/NotificationScreen";
import { useAppTheme } from "@/hooks/useTheme";
import { useMyNotifications } from "@/hooks/useMyNotifications";
import { useMyNotificationCount } from "@/hooks/useMyNotificationCount";

interface Props {
  selectedType: NotificationTypeEnum;
  setSelectedType: (type: NotificationTypeEnum) => void;
}

export const SelectNotificationType = ({
  selectedType,
  setSelectedType,
}: Props) => {
  const { data: notificationCounts } = useMyNotificationCount();

  const types = [
    {
      id: NotificationTypeEnum.PERSONAL,
      label: "Kişisel",
      count: notificationCounts?.personalUnreadCount ?? 0,
    },
    {
      id: NotificationTypeEnum.GLOBAL,
      label: "Genel",
      count: notificationCounts?.globalUnreadCount ?? 0,
    },
  ];

  return (
    <View style={s.container}>
      {types.map((type) => (
        <TabItem
          key={type.id}
          label={type.label}
          count={type.count}
          isActive={selectedType === type.id}
          onPress={() => setSelectedType(type.id)}
        />
      ))}
    </View>
  );
};

interface TabItemProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  count: number;
}

const TabItem = memo(({ label, isActive, onPress, count }: TabItemProps) => {
  const { isDarkMode } = useAppTheme();

  const rTabStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isActive ? (isDarkMode ? "#FFF" : "#000") : "rgba(255,255,255,0)",
        { duration: 120 },
      ),
    };
  });

  const rTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(
        isActive
          ? isDarkMode
            ? "#000"
            : "#FFF"
          : isDarkMode
            ? "rgba(255,255,255,0.45)"
            : "rgba(0,0,0,0.45)",
        { duration: 120 },
      ),
    };
  });

  return (
    <Pressable onPress={onPress} hitSlop={12}>
      <Animated.View style={[s.tab, rTabStyle]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Animated.Text style={[s.tabText, rTextStyle]}>{label}</Animated.Text>

          {count > 0 && (
            <View
              style={[
                s.dot,
                {
                  borderColor: isActive
                    ? isDarkMode
                      ? "#FFF"
                      : "#000"
                    : isDarkMode
                      ? "#121212"
                      : "#F5F5F5",
                },
              ]}
            />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: 8,
    paddingHorizontal: 8,
    paddingBottom: 20,
    gap: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  dot: {
    position: "absolute",
    top: -4,
    right: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
  },
});
