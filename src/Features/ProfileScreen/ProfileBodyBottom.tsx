import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";
import { SupportIcon } from "@/components/icons/SupportIcon";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik
import { useToastStore } from "@/store/useToastStore";

const iconMap = {
  support_and_feedback: SupportIcon,
};

const options = [
  {
    id: "support_and_feedback",
    label: "Destek ve Geri Bildirim",
    screen: "SupportFeedback",
  },
];

export const ProfileBodyBottom = () => {
  const navigation = useNavigation<any>();
  const isLoggedIn = !!useAuthStore((state) => state.user);
  const { theme, isDarkMode } = useAppTheme();

  const handlePress = (option: any) => {
    if (!isLoggedIn) {
      useToastStore
        .getState()
        .showToast({ message: "Lütfen önce giriş yapın.", type: "Bilgi" });
      return;
    }

    if (option.screen) {
      navigation.navigate(option.screen);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ProfileHeaderText title="Diğer" />
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
