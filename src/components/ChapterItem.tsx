import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { LockIcon } from "./icons/LockIcon";
import { DownloadIcon } from "./icons/DownloadIcon";

export const ChapterItem = ({ chapter }: { chapter: any }) => {
  return (
    <Pressable
      style={({ pressed }) => ({
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: pressed ? "#f2f2f3" : "transparent",
      })}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 8 }}
      >
        <Text
          style={{ fontFamily: "Mont-400", fontSize: 12, color: "#9CA3AF" }}
        >
          {chapter.order} {"-"}
        </Text>
        <Text
          numberOfLines={1}
          style={{ fontFamily: "Mont-600", fontSize: 13, color: "#1F2937" }}
        >
          {chapter.title}
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        {!chapter.isUnlocked && (
          <View
            style={{
              padding: 10,
            }}
          >
            <LockIcon size={16} />
          </View>
        )}

        {!chapter.isDownloaded && chapter.isUnlocked && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              backgroundColor: "#EFF6FF",
              padding: 10,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DownloadIcon size={16} color="#0f3f92" />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
};
