import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SeriesCardVertical } from "@/components/SeriesCardVertical";
import { useNovels } from "@/hooks/useNovels";
import { useAppTheme } from "@/hooks/useTheme";

export const SimilarNovels = () => {
  const { data, isLoading } = useNovels();
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Section Başlığı: Kallavi Standart */}
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Sevebileceğiniz Benzer Seriler
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        horizontal
        // Daha akıcı bir kaydırma hissi için
        decelerationRate="fast"
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

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 20,
    paddingBottom: 40, // Sayfanın en altında ferah bir bitiş
  },
  title: {
    fontFamily: "Mont-700", // Kallavi başlık kuralı
    fontSize: 16, // Diğer sectionlarla senkron
    letterSpacing: -0.5,
  },
  scrollContent: {
    gap: 16,
  },
});
