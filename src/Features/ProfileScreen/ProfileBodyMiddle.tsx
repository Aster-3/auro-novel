import { Text, View, StyleSheet, Pressable } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";
import { ThemeIcon } from "@/components/icons/ThemeIcon";
import { NotificationSettingsIcon } from "@/components/icons/NotificationSettingsIcon";
import { BeAuthorIcon } from "@/components/icons/BeAuthorIcon";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme";
import { useToastStore } from "@/store/useToastStore";
import {
  useAuthorMeQuery,
  useCreateAuthorMutation,
} from "@/hooks/useAuthorMeQuery";
import { useModalStore } from "@/store/useModalStore";

const iconMap = {
  app_theme: ThemeIcon,
  notification_options: NotificationSettingsIcon,
  want_to_be_author: BeAuthorIcon,
};

const options = [
  {
    id: "app_theme",
    label: "Uygulama Teması",
    screen: "AppTheme",
    requiresAuth: false,
  },
  // {
  //   id: "notification_options",
  //   label: "Bildirim Ayarları",
  //   screen: "NotificationSettings",
  //   requiresAuth: true,
  // },
  {
    id: "want_to_be_author",
    label: "Yazar Paneli",
    screen: "AuthorPanelScreen",
    requiresAuth: true,
  },
];

export const ProfileBodyMiddle = () => {
  const navigation = useNavigation<any>();
  const isLoggedIn = !!useAuthStore((state) => state.user);
  const { theme, isDarkMode } = useAppTheme();
  const showConfirm = useModalStore((state) => state.showConfirm);
  const authorMeQuery = useAuthorMeQuery({ enabled: isLoggedIn });
  const createAuthorMutation = useCreateAuthorMutation();

  const showLoginToast = () => {
    useToastStore
      .getState()
      .showToast({ message: "Lütfen önce giriş yapın.", type: "Bilgi" });
  };

  const handleAuthorPanelPress = async () => {
    if (!isLoggedIn) {
      showLoginToast();
      return;
    }

    const authorMe = authorMeQuery.data ?? (await authorMeQuery.refetch()).data;

    if (authorMe?.isAuthor) {
      navigation.navigate("AuthorPanelScreen");
      return;
    }

    showConfirm({
      title: "Yazar olmak ister misin?",
      message:
        "Yazar paneline erişmek için bir yazar hesabı oluşturman gerekiyor.",
      confirmText: "Yazar Ol",
      cancelText: "Vazgeç",
      onConfirm: () => {
        createAuthorMutation.mutate(undefined, {
          onSuccess: () => navigation.navigate("AuthorPanelScreen"),
        });
      },
    });
  };

  const handlePress = async (option: (typeof options)[number]) => {
    if (!isLoggedIn && option.requiresAuth) {
      showLoginToast();
      return;
    }

    if (option.id === "want_to_be_author") {
      await handleAuthorPanelPress();
      return;
    }

    if (option.screen) {
      navigation.navigate(option.screen);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ProfileHeaderText title="Tercihler" />
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
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.subcontainer,
                {
                  backgroundColor: pressed
                    ? isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "#f0f0f0"
                    : "transparent",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handlePress(option)}
            >
              {IconComponent && (
                <IconComponent color={theme.textPrimary} size={18} />
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
