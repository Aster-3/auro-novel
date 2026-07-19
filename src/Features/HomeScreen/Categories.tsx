import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollView, StyleSheet, View } from "react-native";
const data = [
  {
    id: 1,
    name: "Xianxia",
    cover: require("@assets/categories/xianxia.jpg"),
  },
  {
    id: 2,
    name: "Urban Fantasy",
    cover: require("@assets/categories/urban.jpg"),
  },
  {
    id: 3,
    name: "Isekai",
    cover: require("@assets/categories/isekai.jpg"),
  },
  {
    id: 4,
    name: "Apocalypse",
    cover: require("@assets/categories/Apocalypse.png"),
  },
];

export const Categories = () => {
  return (
    <View style={styles.container}>
      <SectionHeader headerName="Kategoriler" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((i) => (
          <CategoryCard cover={i.cover} name={i.name} key={i.id} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
  },
  scrollContent: {
    columnGap: 14,
    paddingRight: 4,
  },
});
