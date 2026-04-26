import { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Screen } from "../components/layout/Screen";
import { LibraryHeader } from "@/Features/LibraryScreen/LibraryHeader";
import { useAppTheme } from "@/hooks/useTheme";
import { LibraryView } from "@/Features/LibraryScreen/LibraryView";

const Tab = createMaterialTopTabNavigator();

const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState("library");

  const { theme } = useAppTheme();

  return (
    <Screen style={{ paddingTop: 8 }}>
      <LibraryHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <Tab.Navigator
        tabBar={() => null}
        overScrollMode="never"
        screenOptions={{
          swipeEnabled: true, // İstersen kaydırmayı kapatabilirsin (false)
          sceneStyle: { backgroundColor: theme.background },
        }}
        screenListeners={{
          state: (e) => {
            const routeName = e.data.state.routeNames[e.data.state.index];
            setActiveTab(routeName);
          },
        }}
      >
        <Tab.Screen name="library">{() => <LibraryView />}</Tab.Screen>
        {/* <Tab.Screen name="readlist">
          {() => (
            <View style={{ flex: 1 }}>
              <Text>Read List Tab Content</Text>
            </View>
          )}
        </Tab.Screen> */}
      </Tab.Navigator>
    </Screen>
  );
};

export default LibraryScreen;
