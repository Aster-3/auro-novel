import { ScrollView, Text, View } from "react-native";
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
    <View style={{ display: "flex", gap: 12 }}>
      <SectionHeader headerName="En Son Güncellenen Seriler" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 40 }}
        style={{ width: "100%" }}
        overScrollMode="never"
        decelerationRate={0.9}
      >
        {groupedData.map((column, columnIndex) => (
          <View
            key={columnIndex}
            style={{
              flexDirection: "column",
              gap: 24,
            }}
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
