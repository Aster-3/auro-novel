import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import logo from "@assets/lost-ghost.jpg";
import { useAuthStore } from "@/store/useAuthStore";
import { PlusIcon } from "@/components/icons/PlusIcon";
import gcoin from "@assets/rune.png";
import { NightShardIcon } from "@/components/icons/NightShardIcon";

export const ProfileHeader = ({
  openLoginSheet,
}: {
  openLoginSheet: () => void;
}) => {
  const user = useAuthStore((state) => state.user);

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profileImageUrl ? { uri: user.profileImageUrl } : logo
              }
              style={styles.avatar}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.username} numberOfLines={1}>
              {user?.nickname || "Misafir"}
            </Text>
            <Text style={styles.userSubtitle}>
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
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.loginText}>Giriş Yap</Text>
              <RightChevronIcon size={14} color="#007AFF" />
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
                  <Text style={styles.currencyText}>1.250</Text>
                  <View style={styles.plusIconWrapper}>
                    <PlusIcon size={10} color="#FFF" />
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
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
    backgroundColor: "#F2F2F7",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textContainer: {
    marginLeft: 8,
  },
  username: {
    fontFamily: "Mont-700",
    fontSize: 15,
    color: "#1C1C1E",
    letterSpacing: -0.4,
  },
  userSubtitle: {
    fontFamily: "Mont-500",
    fontSize: 12,
    color: "#8E8E93",
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
    gap: 8, // Sayı ile coin ikonu arasındaki boşluk
  },
  currencyText: {
    fontFamily: "Mont-700",
    fontSize: 13,
    color: "#1C274C",
    letterSpacing: -0.5,
  },
  coinImage: {
    width: 24,
    height: 24,
  },
  plusIconWrapper: {
    backgroundColor: "#1C274C",
    width: 12,
    height: 12,
    marginBottom: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1C274C",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loginText: {
    fontFamily: "Mont-600",
    fontSize: 14,
    color: "#1C274C",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    gap: 4,
  },
});
