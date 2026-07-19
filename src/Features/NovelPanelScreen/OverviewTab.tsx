import { useNovelDetail } from "@/hooks/useNovelDetail";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { OverviewOptions } from "./OverviewOptions";
import { OverviewImageEdit } from "./OverviewImageEdit";
import { SeriesStatus } from "@/types/novel";
import { useAppTheme } from "@/hooks/useTheme";

export const OverviewTab = ({ route }: { route: any }) => {
  const { id } = route.params;
  const { data } = useNovelDetail(id);
  const { isDarkMode } = useAppTheme();
  const isDraft = data?.status === SeriesStatus.DRAFT;

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
        {isDraft && (
          <Text
            style={[
              styles.draftNoticeText,
              { color: isDarkMode ? "#FCA5A5" : "#DC2626" },
            ]}
          >
            *Hazırlık aşamasında, ana sayfada görünmez.
          </Text>
        )}

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

  body: { paddingHorizontal: 4, gap: 12, width: "100%" },
  draftNoticeText: {
    alignSelf: "flex-start",
    fontFamily: "Mont-500",
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: 4,
  },
});
