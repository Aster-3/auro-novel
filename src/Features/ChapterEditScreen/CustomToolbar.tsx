import { LoadingDots } from "@/components/LoadingDots";
import { useVolumeQuery } from "@/hooks/useVolumeQuery";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const CustomToolbar = React.memo(
  ({ editor, contentWordCount }: { editor: any; contentWordCount: number }) => {
    const { theme, isDarkMode } = useAppTheme();
    const [editorState, setEditorState] = useState({
      isBoldActive: false,
      isItalicActive: false,
      isUnderlineActive: false,
      isStrikeActive: false,
    });

    useEffect(() => {
      if (!editor) return;
      const interval = setInterval(() => {
        const newState = editor.getEditorState();
        setEditorState((prevState) => {
          if (
            prevState.isBoldActive !== newState.isBoldActive ||
            prevState.isItalicActive !== newState.isItalicActive ||
            prevState.isUnderlineActive !== newState.isUnderlineActive ||
            prevState.isStrikeActive !== newState.isStrikeActive
          ) {
            return newState;
          }
          return prevState;
        });
      }, 150);
      return () => clearInterval(interval);
    }, [editor]);

    const configureAnimation = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        configureAnimation();
        setKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setTimeout(() => {
          configureAnimation();
          setKeyboardVisible(false);
        }, 100);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    const insets = useSafeAreaInsets();
    const bottomPadding = isKeyboardVisible ? 0 : insets.bottom;

    return (
      <View
        style={{ paddingBottom: bottomPadding, backgroundColor: theme.surface }}
      >
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.surface,
              borderColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#eff2f6",
            },
          ]}
        >
          <View style={styles.toolbarWrapper}>
            {[
              {
                id: "bold",
                label: "B",
                action: () => editor.toggleBold(),
                active: editorState.isBoldActive,
                style: { fontWeight: "bold" as const },
              },
              {
                id: "italic",
                label: "I",
                action: () => editor.toggleItalic(),
                active: editorState.isItalicActive,
                style: { fontStyle: "italic" as const, fontFamily: "serif" },
              },
              {
                id: "underline",
                label: "U",
                action: () => editor.toggleUnderline(),
                active: editorState.isUnderlineActive,
                style: { textDecorationLine: "underline" as const },
              },
              {
                id: "strike",
                label: "S",
                action: () => editor.toggleStrike(),
                active: editorState.isStrikeActive,
                style: { textDecorationLine: "line-through" as const },
              },
            ].map((btn) => (
              <TouchableOpacity
                key={btn.id}
                style={[
                  styles.toolbarButton,
                  btn.active && {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "#f1f5f9",
                  },
                ]}
                onPress={btn.action}
              >
                <Text
                  style={[
                    styles.toolbarIcon,
                    { color: theme.textPrimary },
                    btn.style,
                  ]}
                >
                  {btn.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={[
              styles.wordCountBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "#F8FAFC",
              },
            ]}
          >
            <Text style={[styles.volumeText, { color: theme.textSecondary }]}>
              {contentWordCount} Kelime
            </Text>
          </View>
        </View>
      </View>
    );
  },
);

// EDITÖRÜN İÇİNDEKİ CSS (Dinamik Renkler)
export const getCustomCSS = (isDarkMode: boolean, theme: any) => `
  .ProseMirror {
    background-color: ${isDarkMode ? theme.surface : "#ffffff"} !important;
    outline: none !important;
    padding-bottom: 150px;
  }
  .ProseMirror p {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 16px !important;
    line-height: 1.7 !important; 
    margin-bottom: 16px !important; 
    color: ${isDarkMode ? theme.textPrimary : "#1e293b"} !important;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: "Hikayeni anlatmaya başla..." !important;
    color: ${isDarkMode ? "rgba(255,255,255,0.2)" : "#94a3b8"} !important;
    font-style: italic;
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    height: 56,
    borderTopWidth: 1,
  },
  toolbarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toolbarButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  toolbarIcon: {
    fontSize: 15,
    fontFamily: "Mont-600",
  },
  wordCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  volumeText: {
    fontSize: 10, // Mikro-tipografi
    fontFamily: "Mont-700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
