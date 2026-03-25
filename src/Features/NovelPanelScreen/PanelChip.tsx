import { TagIcon } from "@/components/icons/TagIcon";
import { Text, View, StyleSheet, Platform } from "react-native";

export const PanelChip = ({
  title,
  isDot,
}: {
  title: string;
  isDot?: boolean;
}) => {
  return (
    <View style={styles.container}>
      {isDot ? (
        <View style={styles.dot} />
      ) : (
        <TagIcon size={12} color="#464E6B" />
      )}
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 1)", // Hafif cam efekti
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start", // İçerik kadar yer kaplaması için
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    gap: 6,
    borderColor: "rgba(0, 0, 0, 0.05)",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1, // Sert durmaması için düşürüldü
      },
    }),
  },
  text: {
    fontSize: 12, // Apple font dengesi için ideal
    fontFamily: "Mont-500", // Veya "Mont-500"
    color: "#2f2f33", // SF Pro ana metin rengi tonu
    letterSpacing: -0.2, // Karakterleri hafifçe yaklaştırarak daha profesyonel bir duruş sağlar
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 9,
    backgroundColor: "#2f2f33", // Apple Signature Blue veya duruma göre gri
    marginRight: 2, // Metinle denge kurması için
  },
});
