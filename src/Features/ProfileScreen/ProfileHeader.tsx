import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native";
import logo from "@assets/lost-ghost.jpg";
import { useAuthStore } from "@/store/useAuthStore";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { NightShardIcon } from "@/components/icons/NightShardIcon";
import { useWalletQuery } from "@/hooks/useWalletQuery";
import { useAppTheme } from "@/hooks/useTheme";

export const ProfileHeader = ({
  openLoginSheet,
}: {
  openLoginSheet: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  const { data: wallet } = useWalletQuery();
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? theme.backgroundSecondary : "#FFF",
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
        },
      ]}
    >
      <View style={styles.mainRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profileImageUrl ? { uri: user.profileImageUrl } : logo
              }
              style={[
                styles.avatar,
                {
                  backgroundColor: isDarkMode ? theme.background : "#F2F2F7",
                  borderColor: isDarkMode ? theme.surface : "#FFF",
                },
              ]}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              style={[styles.username, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {user?.nickname || "Misafir"}
            </Text>
            <Text style={[styles.userSubtitle, { color: theme.textSecondary }]}>
              {user
                ? user.username
                  ? `@${user.username}`
                  : "Okuyucu"
                : "Keşfetmeye başla"}
            </Text>
          </View>
        </View>

        <View>
          {!user ? (
            <Pressable
              onPress={openLoginSheet}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F2F2F7",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.loginText, { color: theme.textPrimary }]}>
                Giriş Yap
              </Text>
              <RightChevronIcon
                size={14}
                color={isDarkMode ? theme.textPrimary : "#007AFF"}
              />
            </Pressable>
          ) : (
            <View style={styles.currencyStack}>
              <Pressable
                style={({ pressed }) => [
                  styles.currencyChip,
                  {
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                <NightShardIcon size={26} />
                <View style={styles.currencyContent}>
                  <Text
                    style={[styles.currencyText, { color: theme.textPrimary }]}
                  >
                    {wallet?.moonCoins}
                  </Text>
                  <View
                    style={[
                      styles.plusIconWrapper,
                      {
                        backgroundColor: theme.accent,
                        shadowColor: theme.accent,
                      },
                    ]}
                  >
                    <PlusIcon size={10} color={isDarkMode ? "#000" : "#FFF"} />
                  </View>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 26,
    borderWidth: 2,
  },
  textContainer: {
    marginLeft: 8,
  },
  username: {
    fontFamily: "Mont-700",
    fontSize: 15,
    letterSpacing: -0.4,
  },
  userSubtitle: {
    fontFamily: "Mont-500",
    fontSize: 12,
  },
  currencyStack: {
    alignItems: "flex-end",
  },
  currencyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  currencyContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currencyText: {
    fontFamily: "Mont-700",
    fontSize: 13,
    letterSpacing: -0.5,
  },
  plusIconWrapper: {
    width: 14,
    height: 14,
    marginBottom: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loginText: {
    fontFamily: "Mont-600",
    fontSize: 14,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    gap: 4,
  },
});
