import { View, StyleSheet } from "react-native";
import { OverviewTitle } from "./OverviewTitle";
import { PanelChip } from "./PanelChip";
import { Category } from "@/types/novel";

export const CategoryPreview = ({
  categories,
}: {
  categories?: Category[];
}) => {
  return (
    <View style={styles.container}>
      <OverviewTitle title="Kategoriler" />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {categories?.map((category) => (
          <PanelChip key={category.id} title={category.trName} isDot={true} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#f0f0f0",
    gap: 12,
  },
});
