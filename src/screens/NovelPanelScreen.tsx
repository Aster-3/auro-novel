import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RootStackParamList } from "@/constants/navigation";
import { Screen } from "@/components/layout/Screen";
import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { OverviewTab } from "@/Features/NovelPanelScreen/OverviewTab";
import { ChaptersTab } from "@/Features/NovelPanelScreen/ChaptersTab";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik
import { Header } from "@/components/Header";

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
        {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Roman Paneli
          </Text>
        </View> */}
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
              backgroundColor: theme.surface,
              shadowColor: "#000",
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
            },
          ]}
        >
          <PlusIcon size={16} color={theme.textPrimary} />
          <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>
            Yeni Bölüm
          </Text>
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: {
            paddingHorizontal: 0,
            marginTop: 12,
            paddingVertical: 0,
            borderRadius: 20,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "none",
          },
          tabBarItemStyle: { width: "auto", paddingHorizontal: 20 },
          sceneStyle: { backgroundColor: theme.background }, // Sahne rengi dinamik
          tabBarIndicatorStyle: { backgroundColor: theme.accent, height: 2 }, // İndikatör rengi aksan rengin oldu
          tabBarStyle: {
            elevation: 0,
            backgroundColor: theme.background, // Tab bar arka planı
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? "rgba(255,255,255,0.05)"
              : "#efecec",
          },
          tabBarActiveTintColor: theme.textPrimary,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      >
        <Tab.Screen
          name="Drafts"
          component={ChaptersTab}
          options={{ title: "Taslak Bölümler" }}
          initialParams={{ novelId: id, isPublished: false }}
        />
        <Tab.Screen
          name="Published"
          component={ChaptersTab}
          options={{ title: "Yayınlanmış Bölümler" }}
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
  headerTitle: {
    fontSize: 16,
    fontFamily: "Mont-600",
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
  },
  saveButtonText: {
    fontFamily: "Mont-600",
    fontSize: 12,
  },
});

export default NovelPanelScreen;
