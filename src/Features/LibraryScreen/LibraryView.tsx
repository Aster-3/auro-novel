import { Text, View } from "react-native";
import { LibraryList } from "./LibraryList";
import { LibrarySearch } from "./LibrarySearch";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomLibrarySheet, LibrarySheetData } from "./CustomLibrarySheet";
import { LibrarySortOption } from "@/types/library";
import { useAuthStore } from "@/store/useAuthStore";
import BottomSheet from "@gorhom/bottom-sheet";

export const LibraryView = () => {
  const [data, setData] = useState<LibrarySheetData | null>(null);
  const isLoggedIn = useAuthStore((state) => state.user !== null);

  const [searchText, setSearchText] = useState<string | null>(null);
  const [order, setOrder] = useState<LibrarySortOption>(
    LibrarySortOption.TITLE_ASC,
  );

  const filterRef = useRef<BottomSheet>(null);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#666" }}>
          Kütüphaneni görmek için giriş yapmalısın.
        </Text>
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
      {data && <CustomLibrarySheet ref={filterRef} data={data} />}
    </View>
  );
};
