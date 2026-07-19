export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string | null;
  profileBackgroundImageUrl: string | null;
  biography: string | null;
  role: UserRoles;
  gender: "male" | "female" | "null" | null;
  authorId: string | null;
  isAuthor: boolean;
  authorIsVerified: boolean;
}

export interface UserFollowCounts {
  followersCount: number;
  followingCount: number;
}

export interface UserFollowListItem {
  id: string;
  username: string;
  nickname: string;
  profileImageUrl: string | null;
  description: string | null;
}

export interface UserFollowStatus extends UserFollowCounts {
  isFollowing: boolean;
}

export interface FollowUserResponse {
  message: string;
  isFollowing: true;
  created: boolean;
}

export interface UnfollowUserResponse {
  message: string;
  isFollowing: false;
  removed: boolean;
}

export interface UserProfileNovel {
  id: string;
  name: string;
  slug: string;
  coverImageUrl: string | null;
}

export interface UserProfileReview {
  id: number;
  content: string;
  isRecommend: boolean;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  novel: UserProfileNovel;
  viewerHasLiked: boolean;
}

export interface UserProfileReply {
  id: number;
  content: string;
  likeCount: number;
  createdAt: string;
  rootComment: {
    id: number;
    content: string;
    userId: string;
  };
  novel: UserProfileNovel;
  parentReply: {
    id: number;
    content: string | null;
    isDeleted: boolean;
    user: {
      id: string;
      nickname: string;
      profileImageUrl: string | null;
    };
  } | null;
  viewerHasLiked: boolean;
}

export interface UserPublicLibraryItem {
  novelId: string;
  title: string;
  authorName: string;
  coverImageUrl: string | null;
  isHidden: boolean;
  addedAt: string;
}

export interface PaginatedUserProfileResponse<T> {
  items: T[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
}

export enum UserRoles {
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
}
