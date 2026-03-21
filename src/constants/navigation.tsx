import { JSX } from "react";
import { HomeIcon } from "../components/icons/HomeIcon";
import { ChatIcon } from "../components/icons/ChatIcon";
import { ProfileIcon } from "../components/icons/ProfileIcon";
import { Text, ImageSourcePropType } from "react-native";
import { LibraryIcon } from "../components/icons/LibraryIcon";
import { NotificationIcon } from "../components/icons/NotificationIcon";
import { Comment } from "@/types/comment";

export type RootStackParamList = {
  Main: undefined;
  Novel: {
    id: string;
  };
  Search: undefined;
  Comment: {
    id: string;
    isCommentTextOpen?: boolean;
  };
  Settings: undefined;
  Register: undefined;
  VerifyUser: {
    email: string;
  };
  Reply: {
    commentId: number;
    novelId: string;
  };
};

export const TAB_ICONS: Record<
  string,
  (props: { color: string; isFocused?: boolean; size?: number }) => JSX.Element
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
