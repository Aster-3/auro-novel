import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { UserIcon } from "@/components/icons/UserIcon";
import { deleteDownloadedDataForUser } from "@/db/offlineChaptersDb";
import { unregisterStoredPushToken } from "@/hooks/usePushNotifications";
import { useAppTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";
import { useToastStore } from "@/store/useToastStore";
import { TokenStorage } from "@/utils/tokenStorage";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";

const iconMap = {
  personal_info: UserIcon,
  privacy_security: ShieldIcon,
  downloaded_chapters: DownloadedsIcon,
  logout: LogoutIcon,
  delete_account: TrashIcon,
};

export const ProfileBodyTop = () => {
  const isLoggedIn = !!useAuthStore((state) => state.user);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { theme, isDarkMode } = useAppTheme();

  const handlePress = (option: any) => {
    if (option.id === "logout") {
      option.callback?.();
      return;
    }

    if (!isLoggedIn) {
      useToastStore.getState().showToast({
        message: "Lütfen önce giriş yapın.",
        type: "Bilgi",
      });
      return;
    }

    if (option.screen) {
      navigation.navigate(option.screen);
    }
  };

  const options = [
    { id: "personal_info", label: "Kişisel Bilgiler", screen: "PersonalInfo" },
    {
      id: "logout",
      label: "Çıkış Yap",
      callback: () =>
        useModalStore.getState().showConfirm({
          title: "Çıkış Yap",
          message: "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
          onConfirm: async () => {
            if (user?.id) {
              await deleteDownloadedDataForUser(user.id);
            }
            await unregisterStoredPushToken();
            await TokenStorage.clearTokens();
            useAuthStore.getState().logout();
            queryClient.clear();
          },
        }),
    },
    {
      id: "delete_account",
      label: "Hesabı Sil",
      screen: "DeleteAccount",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <ProfileHeaderText title="Hesap" />
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? theme.backgroundSecondary : "#F9F9F9",
          },
        ]}
      >
        {options.map((option) => {
          const IconComponent = iconMap[option.id as keyof typeof iconMap];
          const isDestructive =
            option.id === "logout" || option.id === "delete_account";

          if (isDestructive && !isLoggedIn) {
            return null;
          }

          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.subcontainer,
                {
                  backgroundColor: pressed
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.29)"
                      : "#f0f0f0"
                    : "transparent",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handlePress(option)}
            >
              {IconComponent ? (
                <IconComponent
                  color={isDestructive ? "#da0303" : theme.textPrimary}
                  size={18}
                />
              ) : null}
              <Text
                style={[
                  styles.text,
                  { color: isDestructive ? "#da0303" : theme.textPrimary },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    width: "100%",
    paddingVertical: 12,
  },
  text: {
    fontFamily: "Mont-500",
    fontSize: 14,
  },
});
