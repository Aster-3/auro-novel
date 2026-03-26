import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RootStackParamList } from "@/constants/navigation";
import { Screen } from "@/components/layout/Screen";
import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { OverviewTab } from "@/Features/NovelPanelScreen/OverviewTab";

const Tab = createMaterialTopTabNavigator();

const DraftsTab = () => (
  <View style={styles.tabContent}>
    <Text>Taslak Bölümler</Text>
  </View>
);
const PublishedTab = () => (
  <View style={styles.tabContent}>
    <Text>Yayınlanmış Bölümler</Text>
  </View>
);

const NovelPanelScreen = () => {
  const navigation = useNavigation();
  const { id } = useRoute<RouteProp<RootStackParamList, "NovelPanel">>().params;
  console.log("NovelPanelScreen id:", id);
  return (
    <Screen
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#f5f5f5" }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>86: Eighty Six</Text>
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
          name="Overview"
          component={OverviewTab}
          initialParams={{ id }}
          options={{ title: "Genel Bakış" }}
        />
        <Tab.Screen
          name="Drafts"
          component={DraftsTab}
          options={{ title: "Taslak Bölümler" }}
        />
        <Tab.Screen
          name="Published"
          component={PublishedTab}
          options={{ title: "Yayınlanmış" }}
        />
        <Tab.Screen
          name="Published2"
          component={PublishedTab}
          options={{ title: "Okey" }}
        />
      </Tab.Navigator>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
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
});

export default NovelPanelScreen;
