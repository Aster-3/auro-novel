import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  paddingHorizontal: number;
  textAlign: "left" | "center" | "right" | "justify";
  isDarkMode: boolean;
  scrollMode: "vertical" | "horizontal";

  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setLineHeight: (val: number) => void;
  setPaddingHorizontal: (val: number) => void;
  setTextAlign: (align: "left" | "center" | "right" | "justify") => void;
  toggleDarkMode: () => void;
  setScrollMode: (mode: "vertical" | "horizontal") => void;
}

export const useReaderStore = create<ReaderSettings>()(
  persist(
    (set) => ({
      fontSize: 18,
      fontFamily: "Literata",
      lineHeight: 2,
      paddingHorizontal: 2,
      textAlign: "justify",
      isDarkMode: false,
      scrollMode: "vertical",

      setFontSize: (size) => set({ fontSize: size }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setLineHeight: (val) => set({ lineHeight: val }),
      setPaddingHorizontal: (val) => set({ paddingHorizontal: val }),
      setTextAlign: (align) => set({ textAlign: align }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setScrollMode: (mode) => set({ scrollMode: mode }),
    }),
    {
      name: "auro-reader-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
