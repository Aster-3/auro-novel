import { useAppTheme } from "@/hooks/useTheme";
import {
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Text,
  StyleSheet,
} from "react-native";

interface CategoryCardProps {
  cover: ImageSourcePropType;
  name: string;
}

export const CategoryCard = ({ cover, name }: CategoryCardProps) => {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={cover} style={styles.image} resizeMode="cover" />
      <Text style={[styles.text, { color: theme.textPrimary }]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    overflow: "hidden",
    gap: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 24,
    height: undefined,
    backgroundColor: "#f0f0f0",
  },
  text: {
    textAlign: "center",
    fontFamily: "Mont-600",
    fontSize: 12,
  },
});
