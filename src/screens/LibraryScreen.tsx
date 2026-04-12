import { Screen } from "../components/layout/Screen";
import { LibraryList } from "@/Features/LibraryScreen/LibraryList";
import { useCallback, useRef, useState } from "react";
import { LibraryHeader } from "@/Features/LibraryScreen/LibraryHeader";
import { Button } from "react-native";
import {
  CustomLibrarySheet,
  LibrarySheetData,
} from "@/Features/LibraryScreen/CustomLibrarySheet";

const LibraryScreen = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [sheetIsVisible, setSheetIsVisible] = useState(false);
  const [data, setData] = useState<LibrarySheetData | null>(null);

  const handleOpenLibrarySheet = useCallback((sheetData: LibrarySheetData) => {
    setData(sheetData);
    setSheetIsVisible(true);
  }, []);

  return (
    <Screen style={{ paddingHorizontal: 16, paddingTop: 20 }}>
      <LibraryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <LibraryList openLibrarySheet={handleOpenLibrarySheet} />
      <CustomLibrarySheet
        isVisible={sheetIsVisible}
        data={data}
        onClose={() => setSheetIsVisible(false)}
      />
    </Screen>
  );
};
export default LibraryScreen;
