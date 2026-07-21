import api from "@/api/axiosInstance";
import { UpdateProfileSchemaType } from "@/schemas/auth";
import { UserMe } from "@/store/useAuthStore";
import {
  LibraryResponse,
  LibrarySortOption,
  UpdateUserNovelReadingStatsPayload,
  UserNovelReadingStats,
} from "@/types/library";
import {
  PaginatedUserProfileResponse,
  FollowUserResponse,
  UserFollowCounts,
  UserFollowListItem,
  UserFollowStatus,
  UserProfile,
  UserProfileReply,
  UserProfileReview,
  UnfollowUserResponse,
  UserPublicLibraryItem,
} from "@/types/user";

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

export interface DeleteMyAccountPayload {
  password: string;
  confirmation: "ONAYLIYORUM";
}

export const deleteMyAccount = async (payload: DeleteMyAccountPayload) => {
  const { data } = await api.delete("/users/me", { data: payload });
  return data;
};

export const getMyLibrary = (query: {
  page?: number;
  limit?: number;
  sort?: LibrarySortOption;
  search?: string;
  signal?: AbortSignal;
}): Promise<LibraryResponse> => {
  return api
    .get("/users/me/library", {
      signal: query.signal,
      params: {
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        sortBy: query.sort,
        search: query.search,
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

export const getUserFollowCounts = async (
  userId: string,
): Promise<UserFollowCounts> => {
  const { data } = await api.get(`/users/${userId}/follow-counts`);
  return data;
};

export const getUserFollowStatus = async (
  userId: string,
): Promise<UserFollowStatus> => {
  const { data } = await api.get(`/users/${userId}/follow-status`);
  return data;
};

export const followUser = async (
  userId: string,
): Promise<FollowUserResponse> => {
  const { data } = await api.post(`/users/${userId}/follow`);
  return data;
};

export const unfollowUser = async (
  userId: string,
): Promise<UnfollowUserResponse> => {
  const { data } = await api.delete(`/users/${userId}/follow`);
  return data;
};

export const getUserFollowers = async (query: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUserProfileResponse<UserFollowListItem>> => {
  const { data } = await api.get(`/users/${query.userId}/followers`, {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    },
  });
  return data;
};

export const getUserFollowing = async (query: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUserProfileResponse<UserFollowListItem>> => {
  const { data } = await api.get(`/users/${query.userId}/following`, {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    },
  });
  return data;
};

export const getUserReviews = async (query: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUserProfileResponse<UserProfileReview>> => {
  const { data } = await api.get(`/users/${query.userId}/reviews`, {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    },
  });
  return data;
};

export const getUserReplies = async (query: {
  userId: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUserProfileResponse<UserProfileReply>> => {
  const { data } = await api.get(`/users/${query.userId}/replies`, {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    },
  });
  return data;
};

export const getUserPublicLibrary = async (query: {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: "LAST_READED" | "TITLE_ASC";
}): Promise<PaginatedUserProfileResponse<UserPublicLibraryItem>> => {
  const { data } = await api.get(`/users/${query.userId}/library`, {
    params: {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      sortBy: query.sortBy,
    },
  });
  return data;
};
