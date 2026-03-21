import * as SecureStore from "expo-secure-store";

export const TokenStorage = {
  async saveTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync("accessToken");
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync("refreshToken");
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  },
};
