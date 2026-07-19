import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { TAB_ICONS, DefaultIcon } from "../constants/navigation";
import { useDynamicBottom } from "@/utils/useDynamicBottom";
import { useAppTheme } from "@/hooks/useTheme";
import { useMyNotificationCount } from "@/hooks/useMyNotificationCount";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

export function TabBar({ state, navigation }: any) {
  const dynamicBottom = useDynamicBottom();
  const { theme, isDarkMode } = useAppTheme();
  const isLoggedIn = useAuthStore((store) => store.user !== null);
  const { data: notificationCounts } = useMyNotificationCount(isLoggedIn);
  const hasUnreadNotifications =
    (notificationCounts?.totalUnreadCount ?? 0) > 0;

  return (
    <View style={[styles.wrapper, { bottom: dynamicBottom }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? "#16151b" : "#FFFFFF",
            shadowColor: isDarkMode ? "#000" : "#000",
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const color = isFocused ? theme.textPrimary : theme.textSecondary;
          const IconComponent = TAB_ICONS[route.name] || DefaultIcon;
          const isChat = route.name === "Chat";

          const onPress = () => {
            if (isChat) {
              useToastStore.getState().showToast({
                type: "Bilgi",
                message: "Sohbet Odaları özelliği yakında aktif olacaktır.",
              });
              return;
            }

            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              {isFocused && route.name !== "Profile" && (
                <View
                  style={[styles.pill, { backgroundColor: theme.textPrimary }]}
                />
              )}
              {route.name === "Profile" ? (
                <IconComponent isFocused={isFocused} size={18} color={color} />
              ) : route.name === "Notification" ? (
                <IconComponent
                  color={color}
                  size={18}
                  hasUnread={hasUnreadNotifications}
                />
              ) : (
                <IconComponent color={color} size={18} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  container: {
    flexDirection: "row",
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    bottom: 0,
    marginBottom: 6,
    width: 20,
    height: 2.5,
    borderRadius: 2,
  },
});
