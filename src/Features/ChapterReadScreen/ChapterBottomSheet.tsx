import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Portal } from "@gorhom/portal";

// Kendi bileşenlerin ve hookların
import { MoreOptions } from "./MoreOptions";
import { TableOfContentsView } from "./TableOfContentsView";
import { SettingsView } from "./SettingsView";
import { SheetType } from "@/screens/ChapterReadScreen";
import { useAppTheme } from "@/hooks/useTheme";

interface ChapterBottomSheetProps {
  novelId: string;
  chapterId: string;
  activeSheet: SheetType;
  selectChapter: (id: string) => void;
  onClose?: () => void;
}

export const ChapterBottomSheet = forwardRef<
  BottomSheet,
  ChapterBottomSheetProps
>((props, ref) => {
  const { activeSheet, novelId, chapterId, selectChapter } = props;

  // İşte o meşhur hook: Artık isDarkMode boolean'ı ile uğraşmıyoruz, colors setini alıyoruz.
  const { theme, isDarkMode } = useAppTheme();

  const animationConfigs = useMemo(
    () => ({
      damping: 80,
      stiffness: 350,
      mass: 1,
      overshootClamping: true,
    }),
    [],
  );

  const closeSheet = useCallback(() => {
    if (ref && "current" in ref && ref.current) {
      ref.current.close();
    }
  }, [ref]);

  const renderBackdrop = useMemo(
    () => (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-0.5}
        // Karanlık modda backdrop daha koyu (0.8) olsun ki reader odaklı kalsın
        opacity={isDarkMode ? 0.8 : 0.6}
        pressBehavior="close"
      />
    ),
    [isDarkMode],
  );

  return (
    <Portal>
      <BottomSheet
        ref={ref}
        index={-1}
        enableDynamicSizing={true}
        enablePanDownToClose={activeSheet === "TOC"}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={activeSheet === "TOC"}
        animateOnMount={true}
        detached={true}
        animationConfigs={animationConfigs}
        backgroundStyle={{
          backgroundColor: theme.reader.background,
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
        }}
        handleIndicatorStyle={[
          styles.indicator,
          {
            backgroundColor: theme.textSecondary,
          },
        ]}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { backgroundColor: theme.reader.background },
          ]}
        >
          {activeSheet === "TOC" && (
            <TableOfContentsView
              id={novelId}
              selectChapter={selectChapter}
              closeSheet={closeSheet}
            />
          )}
          {activeSheet === "SETTINGS" && <SettingsView />}
          {activeSheet === "MORE" && (
            <MoreOptions
              novelId={novelId}
              chapterId={chapterId}
              closeSheet={closeSheet}
            />
          )}
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
    width: 50,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
