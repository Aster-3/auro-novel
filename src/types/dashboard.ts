export interface DashboardStats {
  current: number;
  change: number;
  status: TrendState;
}

export enum TrendState {
  UP = "UP",
  DOWN = "DOWN",
  STABLE = "STABLE",
}

export interface GetDashboardStats {
  totalViews: DashboardStats;
  totalReviews: DashboardStats;
  totalSoldChapters: DashboardStats;
  totalRecommendations: DashboardStats;
}
