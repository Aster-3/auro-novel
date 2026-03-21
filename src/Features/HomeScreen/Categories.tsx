import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollView, Text, View } from "react-native";
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
    <View style={{ display: "flex", gap: 12 }}>
      <SectionHeader headerName="Categories You Might Be Interested In" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{ gap: 12 }}
      >
        {data.map((i) => (
          <CategoryCard cover={i.cover} name={i.name} key={i.id} />
        ))}
      </ScrollView>
    </View>
  );
};
