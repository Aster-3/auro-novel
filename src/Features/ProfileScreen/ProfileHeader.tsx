import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import logo from "@assets/lost-ghost.jpg";
import { useAuthStore } from "@/store/useAuthStore";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { NightShardIcon } from "@/components/icons/NightShardIcon";
import { useWalletQuery } from "@/hooks/useWalletQuery";
import { useAppTheme } from "@/hooks/useTheme";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export const ProfileHeader = ({
  openLoginSheet,
}: {
  openLoginSheet: () => void;
}) => {
  const user = useAuthStore((state) => state.user);
  const { data: wallet } = useWalletQuery();
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();

  const navigateProfile = () => {
    if (user) {
      navigation.navigate("UserProfile", { userId: user.id });
    } else {
      openLoginSheet();
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode ? theme.backgroundSecondary : "#FFF",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
          borderWidth: 1,
          shadowColor: "#000",
          shadowOpacity: isDarkMode ? 0.4 : 0.08,
        },
      ]}
    >
      <View style={styles.mainRow}>
        <Pressable onPress={navigateProfile} style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profileImageUrl ? { uri: user.profileImageUrl } : logo
              }
              style={[
                styles.avatar,
                {
                  backgroundColor: isDarkMode ? theme.background : "#F2F2F7",
                  borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#FFF",
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
        </Pressable>

        <View style={styles.actionSection}>
          {!user ? (
            <Pressable
              onPress={openLoginSheet}
              // hitSlop ekleyerek dokunma alanını görünmez şekilde büyüttük
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "#111",
                  opacity: pressed ? 0.8 : 1,
                  // Scale animasyonunu çok hafiflettik (Oynaklığı ve tıklama kaybını önler)
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                },
              ]}
            >
              <Text style={[styles.loginText, { color: "#FFF" }]}>Giriş</Text>
              <RightChevronIcon size={14} color="#FFF" />
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.currencyChip,
                {
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <View style={styles.shardWrapper}>
                <NightShardIcon size={22} />
              </View>
              <Text style={[styles.currencyText, { color: theme.textPrimary }]}>
                {wallet?.moonCoins || 0}
              </Text>
              <View
                style={[
                  styles.plusIconWrapper,
                  { backgroundColor: theme.textPrimary },
                ]}
              >
                <PlusIcon size={8} color={isDarkMode ? "#000" : "#FFF"} />
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 1,
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
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 18,
  },
  textContainer: {
    marginLeft: 14,
  },
  username: {
    fontFamily: "Mont-700",
    fontSize: 15,
    letterSpacing: -0.5,
  },
  userSubtitle: {
    fontFamily: "Mont-500",
    fontSize: 11,
    opacity: 0.6,
  },
  actionSection: {
    alignItems: "flex-end",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 18, // Biraz genişlettik
    borderRadius: 100,
    gap: 4,
  },
  loginText: {
    fontFamily: "Mont-600",
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  currencyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  shardWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  currencyText: {
    fontFamily: "Mont-800",
    fontSize: 13,
    letterSpacing: -0.5,
  },
  plusIconWrapper: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
});
