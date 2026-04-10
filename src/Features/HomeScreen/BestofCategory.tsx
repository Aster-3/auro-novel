import { CategorySelect } from "@/components/CategorySelecy";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardHorizontal } from "@/components/SeriesCardHorizontal";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { data } from "./UpdatedSeries";
import { chunkData } from "@/utils/chunkData";
const categories = [
  "Xianxia",
  "Urban Fantasy",
  "Apocalypse",
  "Isekai",
  "Mystery",
  "Cultivation",
  "Martial Art",
  "Romance",
];

export const BestofCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const groupedData = chunkData(data, 2);
  return (
    <View style={{ gap: 16 }}>
      <SectionHeader headerName="Best of Category" />
      <CategorySelect
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 40, marginTop: 4 }}
        style={{ width: "100%" }}
      >
        {groupedData.map((column, columnIndex) => (
          <View
            key={columnIndex}
            style={{
              flexDirection: "column",
              gap: 24,
            }}
          >
            {column.map((item: any) => (
              <SeriesCardHorizontal key={item.id} props={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
