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
import { ActivityIndicator, StatusBar } from "react-native";
import { useReaderStore } from "./store/useReaderStore";

enableFreeze(false);
const queryClient = new QueryClient();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const isDarkMode = useReaderStore((state) => state.isDarkMode);
  const appBackgroundColor = isDarkMode ? "#090910" : "#ffffff";
  let [fontsLoaded] = useFonts({
    "Mont-400": Montserrat_400Regular,
    Montserrat: Montserrat_400Regular,
    "Mont-500": Montserrat_500Medium,
    "Mont-500-Italic": Montserrat_500Medium_Italic,
    "Mont-600": Montserrat_600SemiBold,
    "Mont-600-Italic": Montserrat_600SemiBold_Italic,
    "Mont-700": Montserrat_700Bold,
    "Poppins-400": Poppins_400Regular,
    "Poppins-500": Poppins_500Medium,
    "Poppins-600": Poppins_600SemiBold,
    Merriweather: require("@assets/fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf"),
    "Merriweather-Bold": require("@assets/fonts/Merriweather_36pt-Bold.ttf"),
    Literata: require("@assets/fonts/Literata-VariableFont_opsz,wght.ttf"),
    "Literata-Bold": require("@assets/fonts/Literata_24pt-Bold.ttf"),
    Lora: require("@assets/fonts/Lora-VariableFont_wght.ttf"),
    "Lora-Bold": require("@assets/fonts/Lora-Bold.ttf"),
    Assistant: require("@assets/fonts/Assistant-Medium.ttf"),
    "Assistant-Bold": require("@assets/fonts/Assistant-Bold.ttf"),
    Inter: require("@assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    "Inter-Bold": require("@assets/fonts/Inter_24pt-Bold.ttf"),
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

  const myTheme = {
    dark: true,
    colors: {
      primary: isDarkMode ? "#fcf3e6" : "#09244B",
      background: isDarkMode ? "#090910" : "#ffffff",
      card: isDarkMode ? "#1a1a1a" : "#f0f0f0",
      text: isDarkMode ? "#ffffff" : "#000000",
      border: isDarkMode ? "#cccccc" : "#dddddd",
      notification: "#ff0000",
    },
    fonts: {
      regular: {
        fontFamily: "Mont-400",
        fontWeight: "normal" as const,
      },
      medium: {
        fontFamily: "Mont-500",
        fontWeight: "500" as const,
      },
      bold: {
        fontFamily: "Mont-700", // Varsa bold fontun, yoksa Mont-500 kullanabilirsin
        fontWeight: "bold" as const,
      },
      heavy: {
        fontFamily: "Mont-900", // Varsa en kalın fontun
        fontWeight: "900" as const,
      },
    },
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: appBackgroundColor }}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={appBackgroundColor}
      />
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
