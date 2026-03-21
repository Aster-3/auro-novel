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
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={cover} style={styles.image} resizeMode="cover" />
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200, // Sabit genişlik burada zaten var
    overflow: "hidden",
    // display: "flex" // RN'de zaten varsayılan budur, silebilirsin
    gap: 4,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    height: undefined, // Oranın (aspectRatio) çalışması için yüksekliği boşa çıkarıyoruz
    borderRadius: 24,
    backgroundColor: "#f0f0f0", // Görsel yüklenirken veya hata varken alanı görmek için
  },
  text: {
    textAlign: "center",
    fontFamily: "Mont-600",
    fontSize: 12,
    color: "#353535",
  },
});
