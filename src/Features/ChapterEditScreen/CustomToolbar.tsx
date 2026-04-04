import { LoadingDots } from "@/components/LoadingDots";
import { useVolumeQuery } from "@/hooks/useVolumeQuery";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import { VolumesModal } from "./VolumesModal";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateVolume } from "@/hooks/useCreateVolume";

export const CustomToolbar = React.memo(
  ({ editor, contentWordCount }: { editor: any; contentWordCount: number }) => {
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
      <View style={{ paddingBottom: bottomPadding, backgroundColor: "#fff" }}>
        <View style={styles.wrapper}>
          <View style={styles.toolbarWrapper}>
            <TouchableOpacity
              style={[
                styles.toolbarButton,
                editorState.isBoldActive && styles.toolbarButtonActive,
              ]}
              onPress={() => editor.toggleBold()}
            >
              <Text style={[styles.toolbarIcon, { fontWeight: "bold" }]}>
                B
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolbarButton,
                editorState.isItalicActive && styles.toolbarButtonActive,
              ]}
              onPress={() => editor.toggleItalic()}
            >
              <Text
                style={[
                  styles.toolbarIcon,
                  { fontStyle: "italic", fontFamily: "serif" },
                ]}
              >
                I
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolbarButton,
                editorState.isUnderlineActive && styles.toolbarButtonActive,
              ]}
              onPress={() => editor.toggleUnderline()}
            >
              <Text
                style={[
                  styles.toolbarIcon,
                  { textDecorationLine: "underline" },
                ]}
              >
                U
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toolbarButton,
                editorState.isStrikeActive && styles.toolbarButtonActive,
              ]}
              onPress={() => editor.toggleStrike()}
            >
              <Text
                style={[
                  styles.toolbarIcon,
                  { textDecorationLine: "line-through" },
                ]}
              >
                S
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.volumesButton}>
            <Text style={styles.volumeText}>{contentWordCount} Kelime</Text>
            <RightChevronIcon size={15} color="#1f2a39" />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: 50,
    borderTopWidth: 1,
    borderColor: "#eff2f6",
  },
  toolbarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toolbarButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  toolbarButtonActive: {
    backgroundColor: "#e6e6e6",
  },
  toolbarIcon: {
    fontSize: 16,
    color: "#334155",
  },
  volumesButton: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  volumeText: {
    color: "#0a1e3f",
    fontSize: 12,
    fontFamily: "Mont-600",
  },
});

export const customCodeBlockCSS = `
  .ProseMirror {
    background-color: #ffffff !important;
    outline: none !important;
    padding-bottom: 100px;
  }
  .ProseMirror p {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 16px !important;
    line-height: 1.6 !important; 
    margin-bottom: 16px !important; 
    color: #334155 !important;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: "Buraya yazmaya başlayın..." !important;
    color: #bcc0c6 !important;
    font-style: italic;
    float: left;
    height: 0;
    pointer-events: none;
  }
`;
