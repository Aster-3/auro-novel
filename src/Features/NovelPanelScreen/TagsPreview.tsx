import { View, StyleSheet } from "react-native";
import { OverviewTitle } from "./OverviewTitle";
import { PanelChip } from "./PanelChip";
import { Category, Tag } from "@/types/novel";

export const TagsPreview = ({ tags }: { tags?: Tag[] }) => {
  return (
    <View style={styles.container}>
      <OverviewTitle title="Etiketler" />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {tags?.map((tag) => (
          <PanelChip key={tag.id} title={tag.name} isDot={false} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
