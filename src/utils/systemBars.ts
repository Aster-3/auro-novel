import { StatusBar, StatusBarStyle } from "react-native";

export const getAppSystemBarColors = (
  isDarkMode: boolean,
): { backgroundColor: string; barStyle: StatusBarStyle } => ({
  backgroundColor: isDarkMode ? "#090910" : "#ffffff",
  barStyle: isDarkMode ? "light-content" : "dark-content",
});

export const applyAppStatusBar = (isDarkMode: boolean) => {
  const { barStyle } = getAppSystemBarColors(isDarkMode);

  StatusBar.setHidden(false, "fade");
  StatusBar.setBarStyle(barStyle, true);
};
