import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { LogoutIcon } from "@/components/icons/LogoutIcon";
import { ThemeIcon } from "@/components/icons/ThemeIcon";
import { TicketIcon } from "@/components/icons/TicketIcon";
import { NotificationSettingsIcon } from "@/components/icons/NotificationSettingsIcon";
import { BeAuthorIcon } from "@/components/icons/BeAuthorIcon";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";

const getPressStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? "#f0f0f0" : "transparent",
  opacity: pressed ? 0.7 : 1,
});

const iconMap = {
  app_theme: ThemeIcon,
  reedem_code: TicketIcon,
  notification_options: NotificationSettingsIcon,
  want_to_be_author: BeAuthorIcon,
};

const options = [
  { id: "app_theme", label: "Uygulama Teması", screen: "AppTheme" },
  { id: "reedem_code", label: "Kupon Kodu Kullan" },
  {
    id: "notification_options",
    label: "Bildirim Ayarları",
    screen: "NotificationSettings",
  },
  {
    id: "want_to_be_author",
    label: "Yazar Paneli",
    screen: "AuthorPanelScreen",
  },
];

export const ProfileBodyMiddle = () => {
  const navigation = useNavigation<any>();
  const isLoggedIn = !!useAuthStore((state) => state.user);

  const handlePress = (option: any) => {
    if (option.id === "reedem_code") return;

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
      <ProfileHeaderText title="Tercihler" />
      <View style={styles.container}>
        {options.map((option) => {
          const IconComponent = iconMap[option.id as keyof typeof iconMap];
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
  text: {
    fontFamily: "Mont-500",
    fontSize: 15,
    color: "#03061E",
  },
});
