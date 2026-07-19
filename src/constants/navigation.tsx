import { JSX } from "react";
import { HomeIcon } from "../components/icons/HomeIcon";
import { ChatIcon } from "../components/icons/ChatIcon";
import { ProfileIcon } from "../components/icons/ProfileIcon";
import { Text } from "react-native";
import { LibraryIcon } from "../components/icons/LibraryIcon";
import { NotificationIcon } from "../components/icons/NotificationIcon";
import { Category } from "@/types/category";
import { Tag } from "@/types/tag";
import { GlobalNotification } from "@/types/notification";

export type RootStackParamList = {
  Main: undefined;
  Novel: {
    id: string;
  };
  TagNovels: {
    id: string;
    name: string;
  };
  Search: undefined;
  Comment: {
    id: string;
    isCommentTextOpen?: boolean;
  };
  WriteReview: {
    novelId: string;
  };
  Settings: undefined;
  Register: undefined;
  VerifyUser: {
    email: string;
  };
  ForgotPassword: undefined;
  ResetPassword: {
    email: string;
  };
  Reply: {
    commentId: number;
    novelId: string;
  };
  WriteReply: {
    commentId: number;
    novelId: string;
    parentReplyId?: number | null;
    replyToNickname?: string | null;
    replyPreview?: string | null;
  };
  PersonalInfo: undefined;
  PrivacySecurity: undefined;
  DownloadedChapters: undefined;
  DownloadedNovelDetail: {
    novelId: string;
  };
  AppTheme: undefined;
  NotificationSettings: undefined;
  SubscriptionPlan: undefined;
  GlobalNotificationDetail: {
    notificationId: string;
    initialNotification?: GlobalNotification;
  };
  AuthorPanelScreen: undefined;
  SupportFeedback:
    | {
        initialType?: "support" | "feedback" | "suggestion" | "report" | "other";
        initialSubject?: string;
        initialMessage?: string;
      }
    | undefined;
  CreateNovel: undefined;
  NovelPanel: {
    id: string;
  };
  UpdateTagCategory: {
    id: string;
    mode: "category" | "tag";
    availableItems?: (Category | Tag)[];
  };
  ChapterEdit: {
    novelId: string;
    chapterId?: string;
    isChapterAvailable: boolean;
    isDraft?: boolean;
  };
  ChapterRead: {
    id: string;
    chapterProgress?: number;
    isOffline?: boolean;
  };
  ChapterComments: {
    chapterId: string;
  };
  UserProfile: {
    userId: string;
  };
  UserFollows: {
    userId: string;
    initialTab?: "followers" | "following";
    title?: string;
  };
};

export const TAB_ICONS: Record<
  string,
  (props: {
    color: string;
    isFocused?: boolean;
    size?: number;
    hasUnread?: boolean;
  }) => JSX.Element
> = {
  Home: (props) => <HomeIcon {...props} />,
  Chat: (props) => <ChatIcon {...props} />,
  Profile: (props) => <ProfileIcon {...props} />,
  Library: (props) => <LibraryIcon {...props} />,
  Notification: (props) => <NotificationIcon {...props} />,
};

export const DefaultIcon = ({ color }: { color: string }) => (
  <Text style={{ color }}>●</Text>
);
