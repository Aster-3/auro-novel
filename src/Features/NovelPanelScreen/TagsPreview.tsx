import { View, StyleSheet } from "react-native";
import { OverviewTitle } from "./OverviewTitle";
import { PanelChip } from "./PanelChip";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Tag } from "@/types/tag";

export const TagsPreview = ({
  tags,
  novelId,
}: {
  tags?: Tag[];
  novelId: string;
}) => {
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <OverviewTitle
        title="Etiketler"
        onPress={() =>
          navigation.navigate("UpdateTagCategory", {
            id: novelId,
            mode: "tag",
            availableItems: tags, // Tip güvenliği için cast işlemi (UpdateTagCategoryScreen'de de benzer şekilde)
          })
        }
      />
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
