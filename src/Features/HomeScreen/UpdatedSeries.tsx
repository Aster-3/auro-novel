import { ScrollView, View } from "react-native";
import { SectionHeader } from "@/components/SectionHeader";
import { SeriesCardHorizontal } from "@/components/SeriesCardHorizontal";
import { chunkData } from "@/utils/chunkData";

export const data = [
  {
    id: "ffefe",
    name: "Shadow Slave",
    author: "Guilty Three",
    recommendRate: "96.9",
    lastChapter: 2453,
    cover: require("@assets/series/ss.jpg"),
  },
  {
    id: "ffefefef",
    name: "Againts the Gods",
    author: "Mars Gravity",
    recommendRate: "95.1",
    lastChapter: 1893,
    cover: require("@assets/series/atg.webp"),
  },
  {
    id: "ffefedwdfef",
    name: "Reverend Insanity",
    author: "Gu Zhen Ren",
    recommendRate: "98.5",
    lastChapter: 2453,
    cover: require("@assets/series/ri.jpg"),
  },
  {
    id: "ffefwdwaefef",
    name: "Lord of the Mysteries",
    author: "Cuttlefish That Loves Diving",
    recommendRate: "93.7",
    lastChapter: 1216,
    cover: require("@assets/series/lotm.jpg"),
  },
  {
    id: "ffefefedscf",
    name: "Omniscient Reader's Viewpoint",
    author: "singNsong",
    recommendRate: "92.4",
    lastChapter: 851,
    cover: require("@assets/series/orv.jpg"),
  },
  {
    id: "ffefecsscfef",
    name: "I Shall Seal The Heavens",
    author: "Er Gen",
    recommendRate: "91.7",
    lastChapter: 1648,
    cover: require("@assets/series/issth.jpg"),
  },
];
export const UpdatedSeries = () => {
  const groupedData = chunkData(data, 2);

  return (
    <View style={{ display: "flex", gap: 12 }}>
      <SectionHeader headerName="Recenly Updated Series" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 40 }}
        style={{ width: "100%" }}
      >
        {groupedData.map((column, columnIndex) => (
          <View
            key={columnIndex}
            style={{
              flexDirection: "column",
              gap: 24,
            }}
          >
            {column.map((item: any) => (
              <SeriesCardHorizontal key={item.id} props={item} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
