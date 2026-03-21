import { ScrollView, Text, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useNovels } from "@/hooks/useNovels";

export const RecenltyAdded = () => {
  const { data, isLoading, error } = useNovels();
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading novels.</Text>;
  if (!data?.items || data.items.length === 0)
    return <Text>No novels found.</Text>;
  return (
    <View style={{ display: "flex", gap: 12 }}>
      <SectionHeader headerName="Recently Added Series" />
      <ScrollView
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ width: "100%" }}
      >
        {data.items.map((i) => (
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
