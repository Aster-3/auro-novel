import { create } from "zustand";

export type ToastType = "Başarılı" | "Hata" | "Bilgi" | "Uyarı";

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

export interface Toast extends ToastConfig {
  id: string;
}

interface ToastState {
  toasts: Toast[];
  showToast: (config: ToastConfig) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (config) => {
    const currentToasts = get().toasts;

    const existingToast = currentToasts.find(
      (t) => t.message === config.message,
    );

    if (existingToast) {
      return existingToast.id;
    }

    const id = Math.random().toString(36).substring(2, 9);

    set((state) => ({
      toasts: [...state.toasts, { id, ...config }],
    }));

    if (config.duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, config.duration || 3000);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
