import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useGetLastCreatedNovels } from "@/hooks/useGetLastCreatedNovels";

export const RecenltyAdded = () => {
  const { data, isLoading, error } = useGetLastCreatedNovels(10);
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading novels.</Text>;
  if (!data || data.length === 0) return <Text>No novels found.</Text>;
  return (
    <View style={styles.container}>
      <SectionHeader headerName="En Son Eklenen Seriler" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.scroll}
      >
        {data.map((i) => (
          <SeriesCardVertical
            key={i.id}
            id={i.id}
            cover={i.coverImage}
            name={i.name}
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
