import { RouteProp, useRoute } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ChaptersTab } from "@/Features/NovelPanelScreen/ChaptersTab";
import { OverviewTab } from "@/Features/NovelPanelScreen/OverviewTab";
import { Header } from "@/components/Header";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { Screen } from "@/components/layout/Screen";
import { RootStackParamList } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

const NovelPanelScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const { id } = useRoute<RouteProp<RootStackParamList, "NovelPanel">>().params;

  return (
    <Screen
      backgroundColor={theme.background}
      style={{ flex: 1, paddingHorizontal: 16 }}
    >
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Header title="Roman Paneli" isAdjacent={true} />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChapterEdit", {
              novelId: id,
              isChapterAvailable: false,
            })
          }
          style={[
            styles.saveButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.045)"
                : "rgba(15,23,42,0.035)",
            },
          ]}
        >
          <PlusIcon size={14} color={theme.textPrimary} />
          <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>
            Yeni Bölüm
          </Text>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: false,
          tabBarPressColor: "transparent",
          tabBarLabelStyle: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            fontSize: 10.5,
            fontFamily: "Mont-500",
            textTransform: "none",
          },
          tabBarItemStyle: {
            height: 42,
            paddingHorizontal: 0,
          },
          sceneStyle: { backgroundColor: theme.background },
          tabBarIndicatorStyle: {
            backgroundColor: isDarkMode ? "#FFFFFF" : "#111827",
            height: 1,
          },
          tabBarStyle: {
            elevation: 0,
            backgroundColor: theme.background,
            shadowOpacity: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: isDarkMode
              ? "rgba(255,255,255,0.035)"
              : "rgba(15,23,42,0.045)",
            height: 42,
          },
          tabBarActiveTintColor: isDarkMode ? "#FFFFFF" : "#111827",
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      >
        <Tab.Screen
          name="Drafts"
          component={ChaptersTab}
          options={{ title: "Taslaklar" }}
          initialParams={{ novelId: id, isPublished: false }}
        />
        <Tab.Screen
          name="Published"
          component={ChaptersTab}
          options={{ title: "Yayınlananlar" }}
          initialParams={{ novelId: id, isPublished: true }}
        />
        <Tab.Screen
          name="Overview"
          component={OverviewTab}
          initialParams={{ id }}
          options={{ title: "Genel Bakış" }}
        />
      </Tab.Navigator>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 2,
    gap: 12,
  },
  saveButton: {
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 9,
  },
  saveButtonText: {
    fontFamily: "Mont-500",
    fontSize: 11,
  },
});

export default NovelPanelScreen;
