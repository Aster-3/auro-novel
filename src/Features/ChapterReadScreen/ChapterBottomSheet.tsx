import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import { MoreOptions } from "./MoreOptions";
import { TableOfContentsView } from "./TableOfContentsView";
import { SettingsView } from "./SettingsView";
import { SheetType } from "@/screens/ChapterReadScreen";
import { Portal } from "@gorhom/portal";
import { useReaderStore } from "@/store/useReaderStore";

interface ChapterBottomSheetProps {
  activeSheet: SheetType;
  onClose?: () => void;
}

export const ChapterBottomSheet = forwardRef<
  BottomSheet,
  ChapterBottomSheetProps
>((props, ref) => {
  const { activeSheet } = props;

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
    mass: 1,
    overshootClamping: true,
  });

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
        pressBehavior="close"
      />
    ),
    [],
  );
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  return (
    <Portal>
      <BottomSheet
        ref={ref}
        index={-1}
        enableDynamicSizing={true}
        enablePanDownToClose={false}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        animationConfigs={animationConfigs}
        backgroundStyle={{
          backgroundColor: isDarkMode ? "#0e0e0e" : "#F8F9FA",
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
        }}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: isDarkMode ? "#0e0e0e" : "#F8F9FA" },
          ]}
        >
          {activeSheet === "SETTINGS" && <SettingsView />}
          {activeSheet === "TOC" && <TableOfContentsView />}
          {activeSheet === "MORE" && <MoreOptions />}
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 40,
    flex: 1,
    minHeight: 200,
  },
  indicator: {
    backgroundColor: "#e4e4e4",
    width: 50,
    height: 4,
    borderRadius: 2,
  },
});
