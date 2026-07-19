import AsyncStorage from "@react-native-async-storage/async-storage";

const PUSH_TOKEN_KEY = "expoPushToken";

export const PushTokenStorage = {
  async getToken() {
    return AsyncStorage.getItem(PUSH_TOKEN_KEY);
  },

  async saveToken(token: string) {
    return AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  },

  async clearToken() {
    return AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  },
};
