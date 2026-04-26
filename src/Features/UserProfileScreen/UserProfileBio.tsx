import { FemaleGenderIcon } from "@/components/icons/FemaleGenderIcon";
import { FollowerIcon } from "@/components/icons/FollowerIcon";
import { FollowIcon } from "@/components/icons/FollowIcon";
import { JoinDateIcon } from "@/components/icons/JoinDateIcon";
import { MaleGenderIcon } from "@/components/icons/MaleGenderIcon";
import { MessageIcon } from "@/components/icons/MessageIcon";
import { Text, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

export const UserProfileBio = ({
  username,
  nickname,
  description,
  joinDate = "03 Mart 2025",
  gender = "male",
  followerCount = 28,
  followingCount = 46,
}: {
  username: string;
  nickname: string;
  description: string;
  joinDate: string;
  gender: string;
  followerCount: number;
  followingCount: number;
}) => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.backgroundSecondary : "#FFFFFF" },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.nameContainer}>
          <Text style={[styles.nickname, { color: theme.textPrimary }]}>
            {nickname}
          </Text>
          <Text style={[styles.username, { color: theme.textSecondary }]}>
            @{username}
          </Text>
        </View>
        <View style={styles.iconGroup}>
          <View
            style={[styles.iconPlaceholder, { borderColor: theme.textPrimary }]}
          >
            <MessageIcon color={theme.textPrimary} size={16} />
          </View>
          <View
            style={[styles.iconPlaceholder, { borderColor: theme.textPrimary }]}
          >
            <FollowIcon color={theme.textPrimary} size={16} />
          </View>
        </View>
      </View>

      <Text style={[styles.description, { color: theme.textPrimary }]}>
        {description || "Biyografi girilmedi."}
      </Text>

      <View style={styles.infoRow}>
        <View style={[styles.infoItem, { marginRight: 16 }]}>
          {gender === "male" ? (
            <MaleGenderIcon size={16} color={theme.textSecondary} />
          ) : gender === "female" ? (
            <FemaleGenderIcon size={16} color={theme.textSecondary} />
          ) : (
            <View
              style={[
                styles.smallIconPlaceholder,
                { backgroundColor: theme.textSecondary },
              ]}
            />
          )}

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {gender === "male"
              ? "Erkek"
              : gender === "female"
                ? "Kadın"
                : "Belirtilmedi"}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <JoinDateIcon size={16} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {joinDate} Tarihinde Katıldı
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <FollowerIcon size={16} color={theme.textPrimary} />
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>
            {followerCount} Takipçi
          </Text>
        </View>
        <View style={[styles.statItem, { marginLeft: 12 }]}>
          <View style={{ transform: [{ rotate: "90deg" }] }}>
            <FollowerIcon size={16} color={theme.textPrimary} />
          </View>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>
            {followingCount} Takip Edilen
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
    fontFamily: "Mont-700",
    letterSpacing: -0.5,
  },
  username: {
    fontSize: 13,
    letterSpacing: -0.4,
    fontFamily: "Mont-500",
  },
  iconGroup: {
    flexDirection: "row",
    gap: 12,
  },
  iconPlaceholder: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "Mont-400",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 12,
    letterSpacing: -0.4,
    fontFamily: "Mont-700",
    marginTop: 1,
    marginLeft: 4,
  },
  smallIconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});
