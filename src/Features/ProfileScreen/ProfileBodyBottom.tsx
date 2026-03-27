import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { ProfileHeaderText } from "./ProfileHeaderText";

import { SupportIcon } from "@/components/icons/SupportIcon";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";

const getPressStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? "#f0f0f0" : "transparent",
  opacity: pressed ? 0.7 : 1,
});

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

  const handlePress = (option: any) => {
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
      <ProfileHeaderText title="Diğer" />
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
    fontSize: 14,
    color: "#03061E",
  },
});
