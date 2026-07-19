import {
  deleteAllDownloadedData,
  deleteDownloadedDataForUser,
} from "@/db/offlineChaptersDb";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/types/api";
import { TokenStorage } from "@/utils/tokenStorage";
import axios from "axios";
import { Platform } from "react-native";

const normalizeApiBaseUrl = (baseUrl?: string) => {
  if (!baseUrl) return baseUrl;

  if (Platform.OS === "android") {
    return baseUrl.replace(
      /^http:\/\/(localhost|127\.0\.0\.1)(?=[:/])/,
      "http://10.0.2.2",
    );
  }

  return baseUrl;
};

const apiBaseUrl = normalizeApiBaseUrl(process.env.EXPO_PUBLIC_API_URL);
console.log("API Base URL:", apiBaseUrl);

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
  timeout: 5000,
});

const refreshApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

const MAX_AUTH_RETRY_COUNT = 2;
let refreshTokenPromise: Promise<string> | null = null;

const clearAuthAndOfflineData = async () => {
  const userId = useAuthStore.getState().user?.id;
  if (userId) {
    await deleteDownloadedDataForUser(userId);
  } else {
    await deleteAllDownloadedData();
  }
  await TokenStorage.clearTokens();
  useAuthStore.getState().logout();
};

const refreshAccessToken = async () => {
  const refreshToken = await TokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("REFRESH_TOKEN_MISSING");
  }

  const refreshResponse = await refreshApi.post("/auth/refresh-token", {
    refreshToken,
  });

  const {
    accessToken,
    refreshToken: nextRefreshToken = refreshToken,
    user,
  } = refreshResponse.data;

  useAuthStore.getState().setAuthSession({ user, accessToken });
  await TokenStorage.saveTokens(accessToken, nextRefreshToken);

  return accessToken;
};

api.interceptors.request.use(
  async (config) => {
    let token = useAuthStore.getState().accessToken;
    if (!token) {
      token = await TokenStorage.getAccessToken();
      if (token) {
        useAuthStore.getState().setAccessToken(token);
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    console.log("Response Interceptor - Error:", err);

    const response = err.response;
    const data = response?.data;
    const originalRequest = err.config;
    const isUnauthorized = response?.status === 401 || data?.statusCode === 401;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/auth/refresh-token",
    );

    if (isUnauthorized) {
      if (data?.message === "REFRESH_TOKEN_INVALID" || isRefreshRequest) {
        await clearAuthAndOfflineData();
        return Promise.reject(err);
      }

      const retryCount = originalRequest?._authRetryCount || 0;

      if (originalRequest && retryCount < MAX_AUTH_RETRY_COUNT) {
        originalRequest._authRetryCount = retryCount + 1;

        try {
          if (!refreshTokenPromise) {
            refreshTokenPromise = refreshAccessToken().finally(() => {
              refreshTokenPromise = null;
            });
          }

          const accessToken = await refreshTokenPromise;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          await clearAuthAndOfflineData();
          return Promise.reject(refreshError);
        }
      }

      await clearAuthAndOfflineData();
    }

    const normalizedError: ApiError = {
      statusCode: data?.statusCode || response?.status || 500,
      message: data?.message || "Beklenmedik bir hata oluştu.",
      errors: data?.errors || null,
    };
    console.log("Normalized Error:", normalizedError);
    return Promise.reject(normalizedError);
  },
);

export default api;
