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

// interface AuthState {
//   user: UserMe | null;
//   setUser: (user: UserMe) => void;
//   accessToken: string | null;
//   setAccessToken: (token: string) => void;
// }

// Başlangıç değerlerini bir objede topla
const initialState = {
  user: null,
  accessToken: null,
};

interface AuthState {
  user: UserMe | null;
  setUser: (user: UserMe) => void;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  logout: () => void; // Reset fonksiyonu ekle
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setUser: (user: UserMe) => set({ user }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
  logout: () => set(initialState), // Tüm state'i tek seferde sıfırla
}));
