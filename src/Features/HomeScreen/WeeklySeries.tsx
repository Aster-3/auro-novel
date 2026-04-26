import { ScrollView, Text, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useWeeklyTrendNovels } from "@/hooks/useWeeklyTrendNovels";

export const WeeklyPopular = () => {
  const { data, isLoading, error } = useWeeklyTrendNovels();
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>{error.message}</Text>;
  return (
    <View style={{ display: "flex", gap: 12, marginBottom: 24 }}>
      <SectionHeader headerName="Haftalık Popüler Seriler" />
      <ScrollView
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ width: "100%" }}
      >
        {data?.map((novel) => (
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
