import { head } from "lodash";

export enum SortType {
  ASC = "asc",
  DESC = "desc",
}

export const paddingMap = { 1: 16, 2: 24, 3: 36 };

export const lineHeightMap = { 1: 1.2, 2: 1.5, 3: 1.8 };

export const fontSizeMap = { 1: 14, 2: 18, 3: 22 };

export const FONT_OPTIONS = [
  "Merriweather",
  "Roboto",
  "Open Sans",
  "Lora",
  "Montserrat",
];

export const renderHtmlBaseStyle = {
  fontSize: 16,
  lineHeight: 24,
  fontFamily: "Merriweather",
};

export const colors = {
  light: {
    background: "#FFFFFF",
    backgroundSecondary: "#f7f6f6",
    surface: "#F8FAFC",
    textPrimary: "#1B2838",
    textSecondary: "#64748B",
    accent: "#0f3f92",
    headerOverlay: "rgba(0,0,0,0.4)",
    headerGradient: ["transparent", "rgba(0,0,0,0.8)"],
    statusbarStyle: "dark-content",
    reader: {
      background: "#F8F9FA",
      textPrimary: "#1B2838",
      textSecondary: "#64748B",
    },
    commentCard: {
      background: "#ffffff",
      textPrimary: "#1b2838",
      textSecondary: "#64748b",
    },
  },
  dark: {
    background: "#10121B",
    backgroundSecondary: "#010612bd",
    surface: "#1E293B",
    textPrimary: "#F0F5FF",
    textSecondary: "#bac1cb",
    accent: "#c3c7c8", // Electric Blue
    headerOverlay: "rgba(15, 23, 42, 0.4)",
    headerGradient: ["transparent", "rgba(15, 23, 42, 1)"],
    statusbarStyle: "light-content",
    reader: {
      background: "#090909", // Reader için biraz daha açık bir ton
      textPrimary: "#E5E9F0",
      textSecondary: "#94a3b8",
    },
    commentCard: {
      background: "#1e293b",
      textPrimary: "#f0f5ff",
      textSecondary: "#94a3b8",
    },
  },
};
