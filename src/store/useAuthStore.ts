import { create } from "zustand";

export interface UserMe {
  id: string;
  username: string;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  profileBackgroundImageUrl?: string;
  description?: string;
}

interface AuthState {
  user: UserMe | null;
  setUser: (user: UserMe) => void;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: UserMe) => set({ user }),
  accessToken: null,
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
