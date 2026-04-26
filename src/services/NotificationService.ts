import api from "@/api/axiosInstance";

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
}) => {
  const { data } = await api.get("/users/me/notifications/global", {
    params: {
      page: dto.page,
      limit: dto.limit,
    },
  });
  return data;
};
