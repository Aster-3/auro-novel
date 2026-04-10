import { View, ScrollView, StyleSheet } from "react-native";
import { Screen } from "../components/layout/Screen";
import { FakeSearchBar } from "../components/fakeSearchBar";
import { HomeCarousel } from "../Features/HomeScreen/Carousel";
import { WeeklyPopular } from "../Features/HomeScreen/WeeklySeries";
import { UpdatedSeries } from "@/Features/HomeScreen/UpdatedSeries";
import { Categories } from "@/Features/HomeScreen/Categories";
import { BestofCategory } from "@/Features/HomeScreen/BestofCategory";
import { RecenltyAdded } from "@/Features/HomeScreen/RecenltyAdded";
import { useDynamicBottom } from "@/utils/useDynamicBottom";
import { useAppTheme } from "@/hooks/useTheme";

const HomeScreen = () => {
  const dynamicBottom = useDynamicBottom();
  const { theme, isDarkMode } = useAppTheme();

  return (
    <Screen
      style={[styles.container, { backgroundColor: theme.background }] as any}
    >
      {/* Search Bar Wrapper: Scroll'dan bağımsız, sabit kalarak güven verir */}
      <View style={styles.searchWrapper}>
        <FakeSearchBar />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        // gap'i buraya değil, bileşenlerin kendi içindeki marjinlerine bırakıyoruz
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: dynamicBottom + 40 },
        ]}
      >
        {/* Karusel: En üstte, nefes alan bir alanla */}
        <View style={styles.section}>
          <HomeCarousel />
        </View>

        {/* Popüler ve Güncellenenler: Birbirine daha yakın durmalı (Haftalık Akış) */}
        <View style={styles.groupSection}>
          <WeeklyPopular />
          <UpdatedSeries />
        </View>

        {/* Kategoriler: Araya giren bir ayraç gibi (Surface rengi burada fark yaratır) */}
        <View style={styles.categoryWrapper}>
          <Categories />
        </View>

        {/* Kategori Bazlı En İyiler ve Yeni Eklenenler */}
        <View style={styles.section}>
          <BestofCategory />
        </View>

        <View style={styles.section}>
          <RecenltyAdded />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  scrollContent: {
    paddingTop: 4,
  },
  section: {
    marginBottom: 32, // Sectionlar arası belirgin boşluk
  },
  groupSection: {
    gap: 28, // İlgili sectionlar arası mesafe
    marginBottom: 24,
  },
  categoryWrapper: {
    marginBottom: 24,
    // Burada istersen çok hafif bir arka plan rengiyle kategorileri ayırabilirsin
    paddingVertical: 4,
  },
});
