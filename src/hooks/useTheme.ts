import { useReaderStore } from "@/store/useReaderStore";
import { colors } from "@/types/constants";

export const useAppTheme = () => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const theme = isDarkMode ? colors.dark : colors.light;

  return { theme, isDarkMode };
};
