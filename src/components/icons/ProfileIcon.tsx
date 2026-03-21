import { Image } from "expo-image";
import { View, ImageSourcePropType, StyleSheet } from "react-native";
import logo from "@assets/lost-ghost.jpg";
import { useAuthStore } from "@/store/useAuthStore";
interface ProfileIconProps {
  imgUrl?: ImageSourcePropType;
  isFocused?: boolean;
}

export const ProfileIcon = ({ isFocused }: ProfileIconProps) => {
  const avatar = useAuthStore((state) => state.user?.profileImageUrl);
  const imageSource = avatar ? { uri: avatar } : logo;
  return (
    <View style={[styles.outerContainer, isFocused && styles.activeOuter]}>
      <View style={styles.innerWrapper}>
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
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  activeOuter: {
    borderColor: "#000",
  },
  innerWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  activeImg: {
    // Seçili olduğunda belki biraz daha parlak durabilir
    opacity: 5,
  },
});
