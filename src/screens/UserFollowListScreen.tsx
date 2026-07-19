import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import {
  useUserFollowersQuery,
  useUserFollowingQuery,
} from "@/hooks/userUserProfileQuery";
import { useAppTheme } from "@/hooks/useTheme";
import { UserFollowListItem } from "@/types/user";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getProfileImageSource } from "@/utils/profileImage";

type FollowTabParamList = {
  Followers: {
    userId: string;
    type: "followers";
  };
  Following: {
    userId: string;
    type: "following";
  };
};

const Tab = createMaterialTopTabNavigator<FollowTabParamList>();

type FollowTabProps = {
  route: {
    params: FollowTabParamList[keyof FollowTabParamList];
  };
};

const UserFollowListScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "UserFollows">>();
  const { userId, initialTab = "followers", title = "Profil" } = route.params;
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.72}
          style={[
            styles.backButton,
            {
              backgroundColor: isDarkMode ? theme.surface : "#F8FAFC",
              borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB",
            },
          ]}
        >
          <BackArrowIcon size={18} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>
            Kullanıcı
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: theme.textPrimary }]}
          >
            {title}
          </Text>
        </View>
      </View>

      <Tab.Navigator
        initialRouteName={
          initialTab === "following" ? "Following" : "Followers"
        }
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 0,
          tabBarStyle: {
            paddingTop: 4,
            backgroundColor: theme.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 48,
          },
          tabBarIndicatorStyle: {
            backgroundColor: isDarkMode ? "#FFF" : "#000",
            height: 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontFamily: "Mont-600",
            letterSpacing: 1,
            textTransform: "uppercase",
          },
          tabBarActiveTintColor: isDarkMode ? "#FFF" : "#000",
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarPressColor: "transparent",
          sceneStyle: { backgroundColor: theme.background },
        }}
      >
        <Tab.Screen
          name="Followers"
          component={FollowTab}
          initialParams={{ userId, type: "followers" }}
          options={{ title: "Takipçiler" }}
        />
        <Tab.Screen
          name="Following"
          component={FollowTab}
          initialParams={{ userId, type: "following" }}
          options={{ title: "Takip Edilen" }}
        />
      </Tab.Navigator>
    </Screen>
  );
};

const FollowTab = ({ route }: FollowTabProps) => {
  const { userId, type } = route.params;
  return type === "followers" ? (
    <FollowersTab userId={userId} />
  ) : (
    <FollowingTab userId={userId} />
  );
};

const FollowersTab = ({ userId }: { userId: string }) => {
  const query = useUserFollowersQuery(userId);
  return <FollowListContent type="followers" query={query} />;
};

const FollowingTab = ({ userId }: { userId: string }) => {
  const query = useUserFollowingQuery(userId);
  return <FollowListContent type="following" query={query} />;
};

const FollowListContent = ({
  type,
  query,
}: {
  type: "followers" | "following";
  query: ReturnType<typeof useUserFollowersQuery>;
}) => {
  const { theme } = useAppTheme();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    query;

  const renderItem = useCallback(
    ({ item }: { item: UserFollowListItem }) => <UserRow item={item} />,
    [],
  );

  return (
    <FlatList
      data={isLoading ? [] : (data?.items ?? [])}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator
            style={styles.footerLoader}
            size="small"
            color={theme.accent}
          />
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.accent} />
          ) : (
            <>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                {type === "followers"
                  ? "Henüz takipçi yok"
                  : "Henüz takip edilen yok"}
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.textSecondary }]}
              >
                Bu liste şu anda boş.
              </Text>
            </>
          )}
        </View>
      }
    />
  );
};

const UserRow = React.memo(({ item }: { item: UserFollowListItem }) => {
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
      style={({ pressed }) => [
        styles.userRow,
        pressed && styles.userRowPressed,
      ]}
    >
      <Image
        source={getProfileImageSource(item.profileImageUrl)}
        style={[styles.avatar, { backgroundColor: theme.surface }]}
        contentFit="cover"
      />
      <View style={styles.userText}>
        <Text
          numberOfLines={1}
          style={[styles.nickname, { color: theme.textPrimary }]}
        >
          {item.nickname}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.username, { color: theme.textSecondary }]}
        >
          @{item.username}
        </Text>
      </View>
    </Pressable>
  );
});

export default UserFollowListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: "Mont-600",
    fontSize: 8,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  title: {
    fontFamily: "Mont-600",
    fontSize: 16,
    lineHeight: 26,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 96,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 9,
    marginBottom: 2,
  },
  userRowPressed: {
    opacity: 0.72,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 15,
  },
  userText: {
    flex: 1,
    minWidth: 0,
  },
  nickname: {
    fontFamily: "Mont-700",
    fontSize: 13,
  },
  username: {
    fontFamily: "Mont-500",
    fontSize: 10,
    marginTop: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 72,
  },
  emptyTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 18,
  },
});
