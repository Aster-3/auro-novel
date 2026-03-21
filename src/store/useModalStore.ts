import { create } from "zustand";

interface ModalConfig {
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalState {
  isVisible: boolean;
  config: ModalConfig | null;
  showConfirm: (config: ModalConfig) => void;
  hideModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isVisible: false,
  config: null,
  showConfirm: (config) => set({ isVisible: true, config }),
  hideModal: () => set({ isVisible: false, config: null }),
}));
