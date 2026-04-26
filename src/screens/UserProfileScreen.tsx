import { Screen } from "@/components/layout/Screen";
import { ProfileHeader } from "@/Features/UserProfileScreen/ProfileHeader";
import { UserProfileBio } from "@/Features/UserProfileScreen/UserProfileBio";
import { useUserProfileQuery } from "@/hooks/userUserProfileQuery";
import { Text, View } from "react-native";

const UserProfileScreen = ({ route }: { route: any }) => {
  const userId = route.params.userId;
  const { data: userProfile, isLoading, error } = useUserProfileQuery(userId);

  if (!userProfile) {
    return (
      <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
        {isLoading ? "Yükleniyor..." : "Kullanıcı bulunamadı"}
      </Text>
    );
  }
  return (
    <Screen style={{ flex: 1, paddingHorizontal: 8 }}>
      <ProfileHeader
        coverImage={userProfile?.profileBackgroundImageUrl}
        profileImage={userProfile?.profileImageUrl}
      />
      <UserProfileBio
        username={userProfile?.username}
        nickname={userProfile?.nickname}
        description={userProfile?.description}
        joinDate={userProfile?.joinDate}
        gender={userProfile?.gender}
        followerCount={userProfile?.followerCount}
        followingCount={userProfile?.followingCount}
      />
    </Screen>
  );
};

export default UserProfileScreen;
