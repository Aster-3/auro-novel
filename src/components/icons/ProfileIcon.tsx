import { Image } from "expo-image";
import { View, ImageSourcePropType, StyleSheet } from "react-native";
import logo from "@assets/lost-ghost.jpg";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

interface ProfileIconProps {
  imgUrl?: ImageSourcePropType;
  isFocused?: boolean;
}

export const ProfileIcon = ({ isFocused }: ProfileIconProps) => {
  const { theme, isDarkMode } = useAppTheme();
  const avatar = useAuthStore((state) => state.user?.profileImageUrl);
  const imageSource = avatar ? { uri: avatar } : logo;

  return (
    <View
      style={[
        styles.outerContainer,
        isFocused && { borderColor: theme.textPrimary }, // Statik #000 yerine dinamik çerçeve
      ]}
    >
      <View
        style={[
          styles.innerWrapper,
          { backgroundColor: isDarkMode ? theme.surface : "#f0f0f0" },
        ]}
      >
        <Image
          source={imageSource}
          style={[styles.img, isFocused && styles.activeImg]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: 34,
    height: 34,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  innerWrapper: {
    width: 28,
    height: 28,
    borderRadius: 12,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  activeImg: {
    opacity: 0.9, // Önceki 5 değeri hatalıydı (maks 1), 0.9 olarak revize ettim
  },
});
