import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";
import { UserIcon } from "@/components/icons/UserIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";
import { CreditCardIcon } from "@/components/icons/CreditCardIcon";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { useModalStore } from "@/store/useModalStore";
import { use } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenStorage } from "@/utils/tokenStorage";
import { useNavigation } from "@react-navigation/native";

const getPressStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? "#f0f0f0" : "transparent",
  opacity: pressed ? 0.7 : 1,
});

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
          useAuthStore.setState({ user: null });
          TokenStorage.clearTokens();
        },
      }),
  },
];

export const ProfileBodyTop = () => {
  const isLoggedIn = !!useAuthStore((state) => state.user);
  const navigation = useNavigation<any>();

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
      <View style={styles.container}>
        {options.map((option) => {
          const IconComponent = iconMap[option.id as keyof typeof iconMap];
          if (option.id === "logout" && !isLoggedIn) return null;
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.subcontainer,
                getPressStyle(pressed),
              ]}
              onPress={() => handlePress(option)}
            >
              {IconComponent && (
                <IconComponent
                  color={option.id !== "logout" ? "#1C274C" : "#da0303"}
                  size={18}
                />
              )}
              <Text style={styles.text}>{option.label}</Text>
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
    backgroundColor: "white",
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
  text: { fontFamily: "Mont-500", fontSize: 15, color: "#03061E" },
});
