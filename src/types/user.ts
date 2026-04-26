export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  displayName: string;
  profileImageUrl: string;
  profileBackgroundImageUrl: string;
  description: string;
  role: UserRoles;
  joinDate: string;
  gender: "male" | "female" | "null";
  followerCount: number;
  followingCount: number;
}

export enum UserRoles {
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user",
}
