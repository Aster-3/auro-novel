import { Pressable, StyleSheet, Text, View } from "react-native";
import { LibraryList } from "./LibraryList";
import { LibrarySearch } from "./LibrarySearch";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomLibrarySheet, LibrarySheetData } from "./CustomLibrarySheet";
import { LibrarySortOption } from "@/types/library";
import { useAuthStore } from "@/store/useAuthStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { LoginSheet, LoginSheetRef } from "@/Features/ProfileScreen/LoginSheet";
import { useAppTheme } from "@/hooks/useTheme";
import { LibraryIcon } from "@/components/icons/LibraryIcon";

export const LibraryView = () => {
  const [data, setData] = useState<LibrarySheetData | null>(null);
  const isLoggedIn = useAuthStore((state) => state.user !== null);
  const { theme, isDarkMode } = useAppTheme();

  const [searchText, setSearchText] = useState<string | null>(null);
  const [order, setOrder] = useState<LibrarySortOption>(
    LibrarySortOption.TITLE_ASC,
  );

  const filterRef = useRef<BottomSheet>(null);
  const loginSheetRef = useRef<LoginSheetRef>(null);

  const handleOpenLibrarySheet = useCallback((sheetData: LibrarySheetData) => {
    setData(sheetData);
  }, []);

  useEffect(() => {
    if (data && filterRef.current) {
      const timer = setTimeout(() => {
        filterRef.current?.snapToIndex(0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!isLoggedIn) {
    return (
      <View style={styles.guestState}>
        <View
          style={[
            styles.guestIcon,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "#F8FAFC",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.07)"
                : "rgba(3,9,55,0.06)",
            },
          ]}
        >
          <LibraryIcon
            size={38}
            color={theme.textSecondary}
          />
        </View>

        <Text style={[styles.guestTitle, { color: theme.textPrimary }]}>
          Kütüphanen için giriş yap
        </Text>
        <Text style={[styles.guestText, { color: theme.textSecondary }]}>
          Kaydettiğin romanlar, okuma geçmişin ve kişisel listen hesabına bağlı
          olarak burada görünür.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            {
              backgroundColor: isDarkMode ? "#FFFFFF" : "#030937",
              opacity: pressed ? 0.75 : 1,
            },
          ]}
          onPress={() => loginSheetRef.current?.expand()}
        >
          <Text
            style={[
              styles.loginButtonText,
              { color: isDarkMode ? "#030937" : "#FFFFFF" },
            ]}
          >
            Giriş yap
          </Text>
        </Pressable>

        <LoginSheet ref={loginSheetRef} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LibrarySearch
        searchText={searchText}
        setSearchText={setSearchText}
        order={order}
        setOrder={setOrder}
      />
      <LibraryList
        searchText={searchText}
        orderType={order}
        openLibrarySheet={handleOpenLibrarySheet}
      />
      <CustomLibrarySheet ref={filterRef} data={data} orderType={order} />
    </View>
  );
};

const styles = StyleSheet.create({
  guestState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingBottom: 72,
  },
  guestIcon: {
    width: 76,
    height: 76,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 18,
  },
  guestTitle: {
    fontFamily: "Mont-700",
    fontSize: 17,
    marginBottom: 8,
    textAlign: "center",
  },
  guestText: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    opacity: 0.72,
    marginBottom: 22,
  },
  loginButton: {
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontFamily: "Mont-700",
    fontSize: 13,
  },
});
