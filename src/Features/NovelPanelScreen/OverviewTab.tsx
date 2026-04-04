import { useNovelDetail } from "@/hooks/useNovelDetail";
import { ScrollView, View, StyleSheet } from "react-native";
import { OverviewOptions } from "./OverviewOptions";
import { OverviewImageEdit } from "./OverviewImageEdit";
import { SeriesStatus } from "@/types/novel";

export const OverviewTab = ({ route }: { route: any }) => {
  const { id } = route.params;
  const { data } = useNovelDetail(id);

  return (
    <ScrollView
      nestedScrollEnabled
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      onScrollBeginDrag={() => {}}
    >
      <OverviewImageEdit novelId={id} coverImage={data?.coverImage || ""} />

      <View style={styles.body}>
        <OverviewOptions
          id={data?.id || ""}
          tags={data?.tags || []}
          categories={data?.categories || []}
          summary={data?.synopsis || ""}
          name={data?.name || ""}
          status={data?.status || SeriesStatus.DRAFT}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: { paddingTop: 30, paddingBottom: 40, gap: 32 },
  headContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: 150,
    aspectRatio: 2 / 3,
    marginBottom: 24,
    position: "relative",
  },
  image: { width: "100%", height: "100%", borderRadius: 20 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
  },

  body: { paddingHorizontal: 4, gap: 40, width: "100%" },
});
