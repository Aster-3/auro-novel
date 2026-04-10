import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";
import { UserIcon } from "@/components/icons/UserIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { CreditCardIcon } from "@/components/icons/CreditCardIcon";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenStorage } from "@/utils/tokenStorage";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/hooks/useTheme";

const iconMap = {
  personal_info: UserIcon,
  privacy_security: ShieldIcon,
  purchases_history: CreditCardIcon,
  downloaded_chapters: DownloadedsIcon,
  logout: LogoutIcon,
};

const options = [
  { id: "personal_info", label: "Kişisel Bilgiler", screen: "PersonalInfo" },
  {
    id: "privacy_security",
    label: "Gizlilik ve Güvenlik",
    screen: "PrivacySecurity",
  },
  {
    id: "purchases_history",
    label: "Satın Alımlar ve Geçmiş",
    screen: "PurchaseHistory",
  },
  {
    id: "downloaded_chapters",
    label: "İndirilen Bölümler",
    screen: "DownloadedChapters",
  },
  {
    id: "logout",
    label: "Çıkış Yap",
    callback: () =>
      useModalStore.getState().showConfirm({
        title: "Çıkış Yap",
        message: "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
        onConfirm: () => {
          TokenStorage.clearTokens();
          useAuthStore.getState().logout();
        },
      }),
  },
];

export const ProfileBodyTop = () => {
  const isLoggedIn = !!useAuthStore((state) => state.user);
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useAppTheme();

  const handlePress = (option: any) => {
    if (option.id === "logout") {
      option.callback?.();
      return;
    }

    if (!isLoggedIn) {
      Alert.alert("Uyarı", "Bu sayfaya girmek için giriş yapmalısınız.");
      return;
    }

    if (option.screen) {
      navigation.navigate(option.screen);
    }
  };

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
          if (option.id === "logout" && !isLoggedIn) return null;
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
              {IconComponent && (
                <IconComponent
                  color={option.id !== "logout" ? theme.textPrimary : "#da0303"}
                  size={18}
                />
              )}
              <Text style={[styles.text, { color: theme.textPrimary }]}>
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
