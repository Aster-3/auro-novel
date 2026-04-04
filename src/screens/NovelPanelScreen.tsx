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

const Tab = createMaterialTopTabNavigator();

const NovelPanelScreen = () => {
  const navigation = useAppNavigation();
  const { id } = useRoute<RouteProp<RootStackParamList, "NovelPanel">>().params;
  return (
    <Screen
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#f5f5f5" }}
    >
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>86: Eighty Six</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChapterEdit", {
              novelId: id,
              isChapterAvailable: false,
            })
          }
          style={styles.saveButton}
        >
          <PlusIcon size={16} color="#1C274C" />
          <Text style={styles.saveButtonText}>Yeni Bölüm</Text>
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
          sceneStyle: { backgroundColor: "#f5f5f5" },
          tabBarIndicatorStyle: { backgroundColor: "#000", height: 1 },
          tabBarStyle: {
            elevation: 0,
            backgroundColor: "#f5f5f5",
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#efecec",
          },
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
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingBottom: 2,
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#1C274C",
    fontFamily: "Mont-600",
    fontSize: 12,
  },
});

export default NovelPanelScreen;
