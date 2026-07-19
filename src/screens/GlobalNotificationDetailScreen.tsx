import { Header } from "@/components/Header";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { useGlobalNotificationDetail } from "@/hooks/useGlobalNotificationDetail";
import { useAppTheme } from "@/hooks/useTheme";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const GlobalNotificationDetailScreen = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "GlobalNotificationDetail">>();
  const { notificationId, initialNotification } = route.params;
  const { theme, isDarkMode } = useAppTheme();

  const { data: notification, isLoading } = useGlobalNotificationDetail(
    notificationId,
    initialNotification,
  );

  return (
    <Screen>
      <Header title="Duyuru" isAdjacent={false} />

      {isLoading && !notification ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.article}>
            <View style={styles.metaRow}>
              <Text style={[styles.badge, { color: theme.accent }]}>
                DUYURU
              </Text>
              <View
                style={[
                  styles.metaDot,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(3,9,55,0.18)",
                  },
                ]}
              />
              <Text style={[styles.date, { color: theme.textSecondary }]}>
                {notification?.publishedAt
                  ? formatSmartDate(notification.publishedAt)
                  : null}
              </Text>
            </View>

            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {notification?.title}
            </Text>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(3,9,55,0.08)",
                },
              ]}
            />

            <Text style={[styles.body, { color: theme.textPrimary }]}>
              {notification?.content}
            </Text>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
};

export default GlobalNotificationDetailScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  article: {
    paddingTop: 14,
    paddingBottom: 36,
    paddingHorizontal: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  badge: {
    fontFamily: "Mont-700",
    fontSize: 9,
    letterSpacing: 1.1,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 9,
  },
  date: {
    fontFamily: "Mont-600",
    fontSize: 11,
    opacity: 0.55,
  },
  title: {
    fontFamily: "Mont-700",
    fontSize: 23,
    lineHeight: 31,
    marginBottom: 12,
    letterSpacing: 0,
  },
  summary: {
    fontFamily: "Mont-500",
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.78,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 8,
    marginBottom: 22,
  },
  body: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 26,
    opacity: 0.9,
  },
});
