import { useEffect, useRef } from "react";
import { Alert, AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { deleteDevice, registerDevice } from "@/services/DeviceService";
import { getGlobalNotificationDetail } from "@/services/NotificationService";
import { globalNavigate, navigationRef } from "@/navigation/globalNavigate";
import { PushTokenStorage } from "@/utils/pushTokenStorage";
import { GlobalNotification } from "@/types/notification";
import { QueryClient } from "@tanstack/react-query";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const getPlatform = () => (Platform.OS === "ios" ? "ios" : "android");

const getExpoProjectId = () =>
  Constants.easConfig?.projectId ??
  Constants.expoConfig?.extra?.eas?.projectId ??
  Constants.manifest2?.extra?.eas?.projectId;

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

export const registerForPushNotifications = async () => {
  await ensureAndroidChannel();

  const existingPermission = await Notifications.getPermissionsAsync();

  let finalStatus = existingPermission.status;

  if (finalStatus !== "granted") {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = getExpoProjectId();

  if (!projectId) {
    return null;
  }

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  const pushToken = expoPushToken.data;

  const registerDeviceDto = {
    pushToken,
    provider: "expo",
    platform: getPlatform(),
    deviceId: null,
  } as const;

  await registerDevice(registerDeviceDto);
  await PushTokenStorage.saveToken(pushToken);

  return pushToken;
};

export const unregisterStoredPushToken = async () => {
  const pushToken = await PushTokenStorage.getToken();

  if (!pushToken) return;

  try {
    await deleteDevice(pushToken);
  } finally {
    await PushTokenStorage.clearToken();
  }
};

const openGlobalNotificationDetail = async (notificationId: string) => {
  const notification: GlobalNotification =
    await getGlobalNotificationDetail(notificationId);

  const navigate = (attempt = 0) => {
    if (navigationRef.isReady()) {
      globalNavigate("GlobalNotificationDetail", {
        notificationId,
        initialNotification: notification,
      });
      return;
    }

    if (attempt < 10) {
      setTimeout(() => navigate(attempt + 1), 300);
    }
  };

  navigate();
};

const invalidateNotificationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["my-notification-count"] });
  queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
  queryClient.invalidateQueries({ queryKey: ["my-global-notifications"] });
};

const invalidateNotificationLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
  queryClient.invalidateQueries({ queryKey: ["my-global-notifications"] });
};

const bumpNotificationCount = (
  queryClient: QueryClient,
  notificationType: unknown,
) => {
  queryClient.setQueryData(
    ["my-notification-count"],
    (
      old:
        | {
            personalUnreadCount: number;
            globalUnreadCount: number;
            totalUnreadCount: number;
          }
        | undefined,
    ) => {
      const current = old ?? {
        personalUnreadCount: 0,
        globalUnreadCount: 0,
        totalUnreadCount: 0,
      };

      if (notificationType === "global_notification") {
        return {
          ...current,
          globalUnreadCount: current.globalUnreadCount + 1,
          totalUnreadCount: current.totalUnreadCount + 1,
        };
      }

      return {
        ...current,
        personalUnreadCount: current.personalUnreadCount + 1,
        totalUnreadCount: current.totalUnreadCount + 1,
      };
    },
  );
};

export const usePushNotifications = (
  accessToken: string | null,
  queryClient: QueryClient,
) => {
  const handledResponseIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    registerForPushNotifications().catch(() => {});
  }, [accessToken]);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        bumpNotificationCount(
          queryClient,
          notification.request.content.data.notificationType,
        );
        invalidateNotificationLists(queryClient);
      },
    );

    const handleNotificationResponse = (
      response: Notifications.NotificationResponse,
    ) => {
      invalidateNotificationQueries(queryClient);

      const data = response.notification.request.content.data;
      const notificationType = data.notificationType;
      const notificationId = data.notificationId;

      if (
        notificationType !== "global_notification" ||
        typeof notificationId !== "string"
      ) {
        return;
      }

      if (handledResponseIdRef.current === response.notification.request.identifier) {
        return;
      }
      handledResponseIdRef.current = response.notification.request.identifier;

      openGlobalNotificationDetail(notificationId).catch(() => {
        Alert.alert("Duyuru açılamadı", "Lütfen daha sonra tekrar deneyin.");
      });
    };

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState) => {
        if (nextState === "active") {
          invalidateNotificationQueries(queryClient);
        }
      },
    );

    return () => {
      receivedSubscription.remove();
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [queryClient]);
};
