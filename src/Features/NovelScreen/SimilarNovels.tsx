import { ScrollView, Text, View } from "react-native";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { data } from "../HomeScreen/UpdatedSeries";

export const SimilarNovels = () => {
  return (
    <View style={{ gap: 16, marginTop: 16 }}>
      <Text
        style={{
          fontFamily: "Mont-700",
          fontSize: 15,
          color: "#03061E",
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
        {data.map((i) => (
          <SeriesCardVertical
            id={i.id}
            key={i.id}
            cover={i.cover}
            name={i.name}
          />
        ))}
      </ScrollView>
    </View>
  );
};
