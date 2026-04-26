import api from "@/api/axiosInstance";
import { UpdateProfileSchemaType } from "@/schemas/auth";
import { UserMe } from "@/store/useAuthStore";
import {
  LibraryResponse,
  LibrarySortOption,
  UpdateUserNovelReadingStatsPayload,
  UserNovelReadingStats,
} from "@/types/library";
import { UserProfile } from "@/types/user";

export const getMe = (fields: (keyof UserMe)[]) => {
  return api
    .get<UserMe>("/users/me", {
      params: {
        fields: fields.join(","),
      },
    })
    .then((res) => res.data);
};

export const updateMe = (data: UpdateProfileSchemaType | FormData) => {
  const isFormData = data instanceof FormData;
  return api
    .patch<UserMe>("/users/me", data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    })
    .then((res) => res.data);
};

export const getMyLibrary = (query: {
  page?: number;
  limit?: number;
  sort?: LibrarySortOption;
}): Promise<LibraryResponse> => {
  return api
    .get("/users/me/library", {
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        sortBy: query.sort,
      },
    })
    .then((res) => res.data);
};

export const toggleNovelInLibrary = async (novelId: string) => {
  const { data } = await api.post(`/users/me/library`, {
    novelId,
  });
  return data;
};

export const isNovelInLibrary = async (novelId: string) => {
  const { data } = await api.get(`/users/me/library/${novelId}`);
  return data;
};

export const getUserNovelReadingStats = async (
  novelId: string,
): Promise<UserNovelReadingStats> => {
  const { data } = await api.get(`/users/me/reading-stats/${novelId}`);
  return data;
};

export const updateUserNovelReadingStats = async (
  dto: UpdateUserNovelReadingStatsPayload,
) => {
  const { data } = await api.patch(`/users/me/reading-stats`, dto);
  return data;
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};
