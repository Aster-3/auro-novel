import { useAppTheme } from "@/hooks/useTheme";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CustomToolbar = React.memo(
  ({ editor, contentWordCount }: { editor: any; contentWordCount: number }) => {
    const { theme, isDarkMode } = useAppTheme();
    const [editorState, setEditorState] = useState({
      isBoldActive: false,
      isItalicActive: false,
      isUnderlineActive: false,
      isStrikeActive: false,
    });
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const bottomPadding = isKeyboardVisible ? 0 : insets.bottom;

    useEffect(() => {
      if (!editor) {
        return;
      }

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

    useEffect(() => {
      const configureAnimation = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      };

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

    const toolbarButtons = [
      {
        id: "bold",
        label: "B",
        action: () => editor.toggleBold(),
        active: editorState.isBoldActive,
        style: { fontFamily: "Mont-700" },
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
    ];

    return (
      <View
        style={{ paddingBottom: bottomPadding, backgroundColor: theme.background }}
      >
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.background,
              borderTopColor: isDarkMode
                ? "rgba(255,255,255,0.035)"
                : "rgba(15,23,42,0.045)",
            },
          ]}
        >
          <View style={styles.toolbarWrapper}>
            {toolbarButtons.map((btn) => (
              <TouchableOpacity
                key={btn.id}
                style={[
                  styles.toolbarButton,
                  btn.active && {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(15,23,42,0.045)",
                  },
                ]}
                activeOpacity={0.72}
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

          <Text style={[styles.wordCountText, { color: theme.textSecondary }]}>
            {contentWordCount} kelime
          </Text>
        </View>
      </View>
    );
  },
);

export const getCustomCSS = (isDarkMode: boolean, theme: any) => `
  .ProseMirror {
    background-color: ${theme.background} !important;
    outline: none !important;
    padding-bottom: 150px;
  }
  .ProseMirror p {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 16px !important;
    line-height: 1.72 !important;
    margin-bottom: 16px !important;
    color: ${isDarkMode ? theme.textPrimary : "#1e293b"} !important;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: "Hikayeni anlatmaya başla..." !important;
    color: ${isDarkMode ? "rgba(255,255,255,0.24)" : "#94a3b8"} !important;
    font-style: italic;
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toolbarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toolbarButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  toolbarIcon: {
    fontSize: 14,
    fontFamily: "Mont-500",
  },
  wordCountText: {
    fontSize: 10,
    fontFamily: "Mont-500",
  },
});
