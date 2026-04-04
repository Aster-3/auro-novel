import { ScrollView, Text, View } from "react-native";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useNovels } from "@/hooks/useNovels";
export const SimilarNovels = () => {
  const { data, isLoading } = useNovels();

  return (
    <View style={{ gap: 16, marginTop: 16 }}>
      <Text
        style={{
          fontFamily: "Mont-700",
          fontSize: 15,
          color: "#03061ed3",
          letterSpacing: -0.2,
        }}
      >
        Sevebileceğiniz Benzer Seriler
      </Text>

      <ScrollView
        contentContainerStyle={{ gap: 12 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ width: "100%" }}
      >
        {data?.items.map((item) => (
          <SeriesCardVertical
            id={item.id}
            key={item.id}
            cover={item.coverImage}
            name={item.name}
          />
        ))}
      </ScrollView>
    </View>
  );
};
