import { Text, View, StyleSheet, Pressable } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";
import { SupportIcon } from "@/components/icons/SupportIcon";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "@/hooks/useTheme";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const SubscriptionIcon = ({ color, size }: { color: string; size: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3.8"
      y="6"
      width="16.4"
      height="12"
      rx="3"
      stroke={color}
      strokeWidth="1.7"
    />
    <Path
      d="M8 10H14.8"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Path
      d="M8 14H11.8"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Circle cx="5.8" cy="12" r="1" fill={color} />
    <Circle cx="18.2" cy="12" r="1" fill={color} />
  </Svg>
);

const iconMap = {
  downloaded_chapters: DownloadedsIcon,
  support_and_feedback: SupportIcon,
  subscription_plan: SubscriptionIcon,
};

const options = [
  {
    id: "downloaded_chapters",
    label: "İndirilen Bölümler",
    screen: "DownloadedChapters",
  },
  {
    id: "subscription_plan",
    label: "Auro Pass",
    screen: "SubscriptionPlan",
  },
  {
    id: "support_and_feedback",
    label: "Destek ve Geri Bildirim",
    screen: "SupportFeedback",
  },
];

export const ProfileBodyBottom = () => {
  const navigation = useNavigation<any>();
  const { theme, isDarkMode } = useAppTheme();

  const handlePress = (option: any) => {
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
