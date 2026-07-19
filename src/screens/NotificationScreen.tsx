import { GlobalNotifications } from "@/Features/NotificationScreen/GlobalNotifications";
import { Screen } from "../components/layout/Screen";
import { NotificationHeader } from "@/Features/NotificationScreen/NotificationHeader";
import { PersonalNotifications } from "@/Features/NotificationScreen/PersonalNotifications";
import { SelectNotificationType } from "@/Features/NotificationScreen/SelectNotificationType";
import { LoginSheet, LoginSheetRef } from "@/Features/ProfileScreen/LoginSheet";
import { useMarkAllPersonalNotificationsAsRead } from "@/hooks/useNotificationMutations";
import { useMyNotificationCount } from "@/hooks/useMyNotificationCount";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";

import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export enum NotificationTypeEnum {
  PERSONAL = "personal",
  GLOBAL = "global",
}

const NotificationScreen = () => {
  const isLoggedIn = useAuthStore((state) => state.user !== null);
  const loginSheetRef = useRef<LoginSheetRef>(null);
  const { theme, isDarkMode } = useAppTheme();

  if (!isLoggedIn) {
    return (
      <Screen style={{ paddingTop: 8 }}>
        <NotificationHeader />
        <View style={styles.guestState}>
          <View
            style={[
              styles.guestIcon,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "#F8FAFC",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(3,9,55,0.06)",
              },
            ]}
          >
            <BellEmptyIcon
              size={38}
              color={theme.textSecondary}
            />
          </View>

          <Text style={[styles.guestTitle, { color: theme.textPrimary }]}>
            Bildirimler için giriş yap
          </Text>
          <Text style={[styles.guestText, { color: theme.textSecondary }]}>
            Yeni bölümler, yanıtlar ve duyurular hesabına bağlı olarak burada
            görünür.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              {
                backgroundColor: isDarkMode ? "#FFFFFF" : "#030937",
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            onPress={() => loginSheetRef.current?.expand()}
          >
            <Text
              style={[
                styles.loginButtonText,
                { color: isDarkMode ? "#030937" : "#FFFFFF" },
              ]}
            >
              Giriş yap
            </Text>
          </Pressable>
        </View>

        <LoginSheet ref={loginSheetRef} />
      </Screen>
    );
  }

  return <AuthenticatedNotificationScreen />;
};

const AuthenticatedNotificationScreen = () => {
  const [selectedType, setSelectedType] = useState<NotificationTypeEnum>(
    NotificationTypeEnum.PERSONAL,
  );
  const { data: notificationCounts } = useMyNotificationCount();
  const { mutate: markAllAsRead } = useMarkAllPersonalNotificationsAsRead();
  const canMarkAllAsRead =
    selectedType === NotificationTypeEnum.PERSONAL &&
    (notificationCounts?.personalUnreadCount ?? 0) > 0;

  return (
    <Screen style={{ paddingTop: 8 }}>
      <NotificationHeader
        canMarkAllAsRead={canMarkAllAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
      <SelectNotificationType
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
      {selectedType === NotificationTypeEnum.GLOBAL && <GlobalNotifications />}
      {selectedType === NotificationTypeEnum.PERSONAL && (
        <PersonalNotifications />
      )}
    </Screen>
  );
};
export default NotificationScreen;

const BellEmptyIcon = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.27 21c.18.3.43.56.73.73.3.18.65.27 1 .27s.7-.09 1-.27c.3-.17.55-.43.73-.73"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.2 16.25c1.23-1.28 1.8-2.73 1.8-6.05 0-1.59.63-3.12 1.76-4.24A6 6 0 0 1 12 4.2c1.59 0 3.12.63 4.24 1.76A6 6 0 0 1 18 10.2c0 3.32.57 4.77 1.8 6.05.46.48.12 1.25-.55 1.25H4.75c-.67 0-1.01-.77-.55-1.25Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  guestState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingBottom: 72,
  },
  guestIcon: {
    width: 76,
    height: 76,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 18,
  },
  guestTitle: {
    fontFamily: "Mont-700",
    fontSize: 17,
    marginBottom: 8,
    textAlign: "center",
  },
  guestText: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.72,
    marginBottom: 22,
  },
  loginButton: {
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontFamily: "Mont-700",
    fontSize: 13,
  },
});
