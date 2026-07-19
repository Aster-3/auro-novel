import api from "@/api/axiosInstance";
import {
  GlobalNotification,
  GlobalNotificationListResponse,
} from "@/types/notification";

const unwrapGlobalNotification = (data: {
  item?: GlobalNotification;
} & Partial<GlobalNotification>) => data.item ?? (data as GlobalNotification);

export const getMyNotifications = async (dto: {
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get("/users/me/notifications/personal", {
    params: {
      page: dto.page,
      limit: dto.limit,
    },
  });
  return data;
};

export const markPersonalNotificationAsRead = async (
  notificationId: string,
) => {
  const { data } = await api.patch(
    `/users/me/notifications/personal/${notificationId}/read`,
  );
  return data;
};

export const markAllPersonalNotificationsAsRead = async () => {
  const { data } = await api.patch("/users/me/notifications/personal/read");
  return data;
};

export const getTotalUnreadNotificationsCount = async (): Promise<{
  personalUnreadCount: number;
  globalUnreadCount: number;
  totalUnreadCount: number;
}> => {
  const { data } = await api.get("/users/me/notifications/unread-count");
  return data;
};

export const getGlobalNotifications = async (dto: {
  page?: number;
  limit?: number;
}): Promise<GlobalNotificationListResponse> => {
  const { data } = await api.get("/users/me/notifications/global", {
    params: {
      page: dto.page,
      limit: dto.limit,
    },
  });
  return data;
};

export const getGlobalNotificationDetail = async (
  notificationId: string,
): Promise<GlobalNotification> => {
  const { data } = await api.get(
    `/users/me/notifications/global/${notificationId}`,
  );
  return unwrapGlobalNotification(data);
};

export const markGlobalNotificationsLastSeen = async () => {
  const { data } = await api.post("/users/me/notifications/global/last-seen");
  return data;
};
