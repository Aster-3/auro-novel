import { SkeletonBox } from "@/components/SkeletonBox";
import { View } from "react-native";

export const NovelSkeleton = () => (
  <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
    {/* Header Skeleton */}
    <View style={{ flexDirection: "row", gap: 20, marginTop: 40 }}>
      <SkeletonBox width={120} height={180} />
      <View style={{ gap: 10, flex: 1 }}>
        <SkeletonBox width="80%" height={25} />
        <SkeletonBox width="50%" height={20} />
        <SkeletonBox width="30%" height={20} style={{ marginTop: 20 }} />
      </View>
    </View>

    {/* Chapters Skeleton */}
    <View style={{ marginTop: 70 }}>
      <SkeletonBox width="100%" height={40} />
    </View>

    {/* Summary Skeleton */}
    <View style={{ marginTop: 20, gap: 10 }}>
      <SkeletonBox width="100%" height={15} />
      <SkeletonBox width="100%" height={15} />
      <SkeletonBox width="70%" height={15} />
    </View>

    <View style={{ marginTop: 30 }}>
      <SkeletonBox width="100%" height={60} />
    </View>
  </View>
);
