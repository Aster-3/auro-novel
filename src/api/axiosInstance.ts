import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/types/api";
import { TokenStorage } from "@/utils/tokenStorage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.11:3000",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    let token = useAuthStore.getState().accessToken;
    if (!token) {
      token = await TokenStorage.getAccessToken();
      if (token) {
        useAuthStore.setState({ accessToken: token });
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

    if (data?.statusCode === 401) {
      // 1. ACCESS TOKEN GEÇERSİZSE YENİLEME BAŞLAT
      if (data.message === "ACCESS_TOKEN_INVALID" && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = await TokenStorage.getRefreshToken();

        if (refreshToken) {
          try {
            const refreshResponse = await api.post("/auth/refresh-token", {
              refreshToken: refreshToken,
            });

            const { accessToken, user } = refreshResponse.data;
            useAuthStore.setState({ user, accessToken });
            await TokenStorage.saveTokens(accessToken, refreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            await TokenStorage.clearTokens();
            useAuthStore.setState({ user: null, accessToken: null });
            return Promise.reject(refreshError);
          }
        } else {
          await TokenStorage.clearTokens();
          useAuthStore.setState({ user: null, accessToken: null });
          return Promise.reject(err);
        }
      } else if (data.message === "REFRESH_TOKEN_INVALID") {
        await TokenStorage.clearTokens();
        useAuthStore.setState({ user: null, accessToken: null });
        return Promise.reject(err);
      }
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
