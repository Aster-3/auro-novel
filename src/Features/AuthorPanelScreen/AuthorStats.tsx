import { StatCard } from "@/components/StatCard";
import { GetDashboardStats } from "@/types/dashboard";
import { View } from "react-native";

export const AuthorStats = ({
  stats,
  isLoading,
}: {
  stats: GetDashboardStats | null;
  isLoading: boolean;
}) => {
  return (
    <View style={{ gap: 16, paddingHorizontal: 12 }}>
      <View style={{ gap: 8, flexDirection: "row" }}>
        <StatCard
          label="Görüntülenme"
          stat={stats?.totalViews ?? null}
          isDark={false}
          isLoading={isLoading}
        />
        <StatCard
          label="Toplam Önerilme"
          stat={stats?.totalRecommendations ?? null}
          isDark={true}
          isLoading={isLoading}
        />
      </View>

      <View style={{ gap: 8, flexDirection: "row" }}>
        <StatCard
          label="Kitaplığa Eklenme"
          stat={stats?.totalLibraryCount ?? null}
          isDark={true}
          isLoading={isLoading}
        />
        <StatCard
          label="Toplam İnceleme Sayısı"
          stat={stats?.totalReviews ?? null}
          isDark={false}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};
