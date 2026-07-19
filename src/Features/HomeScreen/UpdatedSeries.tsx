import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardHorizontal } from "@/components/SeriesCardHorizontal";
import { chunkData } from "@/utils/chunkData";
import { useLastUpdatedNovels } from "@/hooks/useLastUpdatedNovels";
import { GetLastUpdatedNovel } from "@/types/novel";

export const UpdatedSeries = () => {
  const { data, isLoading, error } = useLastUpdatedNovels(9);
  if (isLoading || !data) return <Text>Loading...</Text>;

  if (error) return <Text>{error.message}</Text>;

  const groupedData = chunkData(data, 3);

  return (
    <View style={styles.container}>
      <SectionHeader headerName="En Son Güncellenen Seriler" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
        overScrollMode="never"
        decelerationRate={0.9}
      >
        {groupedData.map((column, columnIndex) => (
          <View
            key={columnIndex}
            style={styles.column}
          >
            {column.map((item: GetLastUpdatedNovel) => (
              <SeriesCardHorizontal key={item.id} novel={item} />
            ))}
          </View>
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
    columnGap: 28,
    paddingRight: 4,
  },
  column: {
    flexDirection: "column",
    rowGap: 18,
  },
});
