import { ScrollView, Text, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useNovels } from "@/hooks/useNovels";

export const WeeklyPopular = () => {
  const { data, isLoading, error } = useNovels();
  console.log("weekly series:", data);
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>{error.message}</Text>;
  return (
    <View style={{ display: "flex", gap: 12 }}>
      <SectionHeader headerName="Weekly Popular Series" />
      <ScrollView
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ width: "100%" }}
      >
        {data?.items.map((novel) => (
          <SeriesCardVertical
            key={novel.id}
            id={novel.id}
            cover={novel.coverImage}
            name={novel.name}
          />
        ))}
      </ScrollView>
    </View>
  );
};
