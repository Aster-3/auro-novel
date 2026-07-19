export type BannerTargetType = "NOVEL" | "DISPLAY_ONLY" | "BLOG";

export interface HomeBanner {
  id: string;
  orderIndex: number;
  imageUrl: string;
  targetType: BannerTargetType;
  targetId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
