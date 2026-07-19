import { ProfileAuthorNovels } from "@/Features/UserProfileScreen/ProfileAuthorNovels";
import { ProfileHeader } from "@/Features/UserProfileScreen/ProfileHeader";
import { ProfileSeedComments } from "@/Features/UserProfileScreen/ProfileSeedComments";
import { ProfileSeedLibrary } from "@/Features/UserProfileScreen/ProfileSeedLibrary";
import { ProfileSeedReview } from "@/Features/UserProfileScreen/ProfileSeedReview";
import { UserProfileBio } from "@/Features/UserProfileScreen/UserProfileBio";
import { Screen } from "@/components/layout/Screen";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import {
  useToggleUserFollowMutation,
  useUserFollowCountsQuery,
  useUserFollowStatusQuery,
  useUserProfileQuery,
} from "@/hooks/userUserProfileQuery";
import { useAppTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";

const UserProfileScreen = ({ route }: { route: any }) => {
  const userId = route.params.userId;
  const currentUser = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isOwnProfile = currentUser?.id === userId;
  const canFollowProfile = !!accessToken && !!currentUser && !isOwnProfile;

  const { data: userProfile, isLoading } = useUserProfileQuery(userId);
  const { data: followCounts } = useUserFollowCountsQuery(userId);
  const { data: followStatus } = useUserFollowStatusQuery(
    userId,
    canFollowProfile,
  );
  const toggleFollowMutation = useToggleUserFollowMutation(userId);

  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const showConfirm = useModalStore((state) => state.showConfirm);
  const isFollowing = followStatus?.isFollowing ?? false;
  const followerCount =
    followStatus?.followersCount ?? followCounts?.followersCount ?? 0;
  const followingCount =
    followStatus?.followingCount ?? followCounts?.followingCount ?? 0;
  const hasFollowStatus = !!followStatus;
  const isFollowPending = toggleFollowMutation.isPending;

  const renderTabBar = useCallback(
    (props: React.ComponentProps<typeof MaterialTabBar>) => (
      <MaterialTabBar
        {...props}
        scrollEnabled
        style={[styles.tabBar, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.tabBarContent}
        tabStyle={styles.tabItem}
        indicatorStyle={[
          styles.tabIndicator,
          { backgroundColor: isDarkMode ? "#FFF" : "#000" },
        ]}
        labelStyle={styles.tabLabel}
        activeColor={isDarkMode ? "#FFF" : "#000"}
        inactiveColor={theme.textSecondary}
      />
    ),
    [isDarkMode, theme.background, theme.textSecondary],
  );

  const headerContainerStyle = useMemo(
    () => ({
      backgroundColor: theme.background,
      shadowOpacity: 0,
      elevation: 0,
      borderBottomWidth: 0,
    }),
    [theme.background],
  );

  const containerStyle = useMemo(
    () => ({ backgroundColor: theme.background }),
    [theme.background],
  );

  const handleToggleFollow = useCallback(() => {
    const displayName = userProfile?.nickname ?? "bu kullanıcı";

    showConfirm({
      title: isFollowing ? "Takipten Çık" : "Takip Et",
      message: isFollowing
        ? `${displayName} adlı kullanıcıyı takipten çıkarmak istediğinize emin misiniz?`
        : `${displayName} adlı kullanıcıyı takip etmek istediğinize emin misiniz?`,
      confirmText: isFollowing ? "Takipten Çık" : "Takip Et",
      cancelText: "Vazgeç",
      onConfirm: () => toggleFollowMutation.mutate(isFollowing),
    });
  }, [
    isFollowing,
    showConfirm,
    toggleFollowMutation,
    userProfile?.nickname,
  ]);

  const handleFollowersPress = useCallback(() => {
    navigation.navigate("UserFollows", {
      userId,
      initialTab: "followers",
      title: userProfile?.nickname,
    });
  }, [navigation, userId, userProfile?.nickname]);

  const handleFollowingPress = useCallback(() => {
    navigation.navigate("UserFollows", {
      userId,
      initialTab: "following",
      title: userProfile?.nickname,
    });
  }, [navigation, userId, userProfile?.nickname]);

  const renderHeader = useCallback(() => {
    if (!userProfile) {
      return null;
    }

    return (
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <ProfileHeader
          coverImage={userProfile.profileBackgroundImageUrl}
          profileImage={userProfile.profileImageUrl}
        />
        <UserProfileBio
          username={userProfile.username}
          nickname={userProfile.nickname}
          biography={userProfile.biography}
          gender={userProfile.gender}
          followerCount={followerCount}
          followingCount={followingCount}
          isFollowing={isFollowing}
          canFollow={canFollowProfile && hasFollowStatus}
          isFollowPending={isFollowPending}
          onToggleFollow={handleToggleFollow}
          onFollowersPress={handleFollowersPress}
          onFollowingPress={handleFollowingPress}
        />
      </View>
    );
  }, [
    canFollowProfile,
    followerCount,
    handleFollowersPress,
    handleFollowingPress,
    handleToggleFollow,
    hasFollowStatus,
    isFollowPending,
    isFollowing,
    followingCount,
    theme.background,
    userProfile,
  ]);

  if (!userProfile) {
    return (
      <Screen style={styles.loadingScreen}>
        <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
          {isLoading ? "Yükleniyor..." : "Kullanıcı bulunamadı"}
        </Text>
      </Screen>
    );
  }

  const authorIdCandidates = [
    userProfile.authorId,
    (userProfile as any).author?.id,
    (userProfile as any).author?.authorId,
  ];
  const authorId =
    authorIdCandidates.find(
      (candidate): candidate is string =>
        typeof candidate === "string" && candidate.length > 0,
    ) ?? null;
  const showAuthorNovelsTab = userProfile.isAuthor && !!authorId;

  return (
    <Screen style={styles.screen}>
      <View style={styles.tabsHost}>
        <Tabs.Container
          lazy={false}
          tabBarHeight={50}
          minHeaderHeight={0}
          headerContainerStyle={headerContainerStyle}
          renderHeader={renderHeader}
          renderTabBar={renderTabBar}
          containerStyle={containerStyle}
        >
          {showAuthorNovelsTab ? (
            <Tabs.Tab name="AuthorNovels" label="Eserler">
              <ProfileAuthorNovels authorId={authorId} />
            </Tabs.Tab>
          ) : null}
          <Tabs.Tab name="Reviews" label="İncelemeler">
            <ProfileSeedReview userId={userId} />
          </Tabs.Tab>
          <Tabs.Tab name="Comments" label="Yorumlar">
            <ProfileSeedComments userId={userId} />
          </Tabs.Tab>
          <Tabs.Tab name="UserLibrary" label="Kütüphane">
            <ProfileSeedLibrary userId={userId} />
          </Tabs.Tab>
        </Tabs.Container>
      </View>
    </Screen>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
  },
  tabsHost: {
    flex: 1,
    overflow: "hidden",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: "Mont-600",
    fontSize: 14,
  },
  header: {
    width: "100%",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tabBar: {
    height: 50,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  tabBarContent: {
    paddingTop: 8,
    alignItems: "center",
  },
  tabItem: {
    width: "auto",
    paddingHorizontal: 20,
    height: 40,
  },
  tabIndicator: {
    height: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "Mont-600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
