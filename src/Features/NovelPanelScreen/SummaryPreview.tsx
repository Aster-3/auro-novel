import { OverviewTitle } from "./OverviewTitle";
import { Text, View, StyleSheet } from "react-native";

export const SummaryPreview = ({
  summary,
}: {
  summary: string | undefined;
}) => {
  const hasSummary = !!summary && summary.trim() !== "";

  return (
    <View style={styles.container}>
      <OverviewTitle title="Özet" />
      <View style={styles.contentWrapper}>
        <Text
          style={[styles.summaryText, !hasSummary && styles.placeholderText]}
        >
          {hasSummary
            ? summary
            : "Henüz bir özet bulunmamaktadır. Özet eklemek için düzenleme ikonuna tıklayın."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: -16,
  },
  contentWrapper: {
    marginTop: 8,
    backgroundColor: "#f5f5f7",
    padding: 18,
    borderRadius: 18,
    marginHorizontal: -8,

    // Border yerine sadece yüzey farkı kullanarak derinlik algısı yaratıyoruz
  },
  summaryText: {
    fontSize: 14, // Okunabilirlik için bir tık büyütüldü
    fontFamily: "Poppins-400", // Veya "Mont-500"
    color: "#464E6B",
    lineHeight: 22, // Apple'ın ferahlık sırrı: geniş satır aralığı /22
    letterSpacing: -0.3,
  },
  placeholderText: {
    color: "#86868b",
    fontSize: 14,
    fontStyle: "italic",
  },
});
