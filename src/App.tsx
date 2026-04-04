import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./navigation/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_600SemiBold_Italic,
} from "@expo-google-fonts/montserrat";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableFreeze } from "react-native-screens";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Portal, PortalProvider } from "@gorhom/portal";
import { navigationRef } from "./navigation/globalNavigate";
import { GlobalConfirmModal } from "./components/GlobalConfirmModal";
import { useEffect, useState } from "react";
import { TokenStorage } from "./utils/tokenStorage";
import { useAuthStore } from "./store/useAuthStore";
import { ToastContainer } from "./components/Toasts/ToastContainer";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ActivityIndicator } from "react-native";

enableFreeze(false);
const queryClient = new QueryClient();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    "Mont-400": Montserrat_400Regular,
    "Mont-500": Montserrat_500Medium,
    "Mont-500-Italic": Montserrat_500Medium_Italic,
    "Mont-600": Montserrat_600SemiBold,
    "Mont-600-Italic": Montserrat_600SemiBold_Italic,
    "Mont-700": Montserrat_700Bold,
    "Poppins-400": Poppins_400Regular,
    "Poppins-500": Poppins_500Medium,
    "Poppins-600": Poppins_600SemiBold,
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = await TokenStorage.getAccessToken();
      if (token) {
        useAuthStore.setState({ accessToken: token });
      }
      setIsReady(true);
    };
    checkToken();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!isReady) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <PortalProvider>
              <SafeAreaProvider>
                <NavigationContainer ref={navigationRef}>
                  <RootNavigator />
                  <GlobalConfirmModal />
                  <ToastContainer />
                </NavigationContainer>
              </SafeAreaProvider>
            </PortalProvider>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
