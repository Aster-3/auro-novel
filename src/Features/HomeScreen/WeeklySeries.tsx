import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useWeeklyTrendNovels } from "@/hooks/useWeeklyTrendNovels";

export const WeeklyPopular = () => {
  const { data, isLoading, error } = useWeeklyTrendNovels();
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>{error.message}</Text>;
  return (
    <View style={styles.container}>
      <SectionHeader headerName="Haftalık Popüler Seriler" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.scroll}
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

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
  },
  scroll: {
    width: "100%",
  },
  scrollContent: {
    columnGap: 14,
    paddingRight: 4,
  },
});
