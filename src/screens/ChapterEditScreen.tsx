import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChapterEditHeader } from "@/Features/ChapterEditScreen/ChapterEditHeader";
import {
  RichText,
  useEditorBridge,
  TenTapStartKit,
  CoreBridge,
} from "@10play/tentap-editor";
import {
  getCustomCSS,
  CustomToolbar,
} from "@/Features/ChapterEditScreen/CustomToolbar";
import { RootStackParamList } from "@/constants/navigation";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useGetOneChapter } from "@/hooks/useGetOneChapter";
import { useChapterMutation } from "@/hooks/useChapterMutation";
import { useToastStore } from "@/store/useToastStore";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCreateChapter } from "@/hooks/useCreateChapter";
import { updateCreateChapterSchema } from "@/schemas/chapter";
import { useGetOneDraftChapter } from "@/hooks/useGetOneDraftChapter";
import { wordCounter } from "@/utils/wordCounter";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı çektik

const ChapterEditScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const route = useRoute<RouteProp<RootStackParamList, "ChapterEdit">>();
  const { chapterId, novelId, isDraft } = route.params;
  const navigation = useAppNavigation();

  const [wordCount, setWordCount] = useState(0);

  const { data: publishChapter, isLoading: isPublishLoading } =
    useGetOneChapter(chapterId, !isDraft && !!chapterId);

  const { data: draftChapter, isLoading: isDraftLoading } =
    useGetOneDraftChapter(chapterId, !!isDraft && !!chapterId);

  const data = useMemo(
    () => (isDraft ? draftChapter : publishChapter),
    [isDraft, draftChapter, publishChapter],
  );

  const { mutate: updateChapter, isPending } = useChapterMutation(
    chapterId!,
    novelId,
    isDraft,
  );
  const { mutate: createChapter } = useCreateChapter(novelId);

  const [title, setTitle] = useState("");

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: data?.content || "",
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(getCustomCSS(isDarkMode, theme)),
    ],
    onChange() {
      const updateWordCount = async () => {
        const htmlContent = await editor.getHTML();
        const count = wordCounter(htmlContent);
        setWordCount(count);
      };
      updateWordCount();
    },
  });

  useEffect(() => {
    if (data) {
      if (data.title) setTitle(data.title);
      if (data.content) {
        editor.setContent(data.content);
      }
    }
  }, [data]);

  const handleSubmit = async () => {
    const currentContent = await editor.getHTML();
    const validate = updateCreateChapterSchema.safeParse({
      title: title.trim(),
      content: currentContent,
    });

    if (!validate.success) {
      const errors = validate.error.flatten().fieldErrors;
      useToastStore.getState().showToast({
        type: "Hata",
        message: errors.content?.[0] || errors.title?.[0] || "Hata oluştu.",
      });
      return;
    }

    const payload = {
      title: title.trim(),
      content: currentContent,
    };

    if (chapterId) {
      updateChapter(
        { id: chapterId, ...payload },
        {
          onSuccess: () => {
            useToastStore
              .getState()
              .showToast({ type: "Başarılı", message: "Bölüm güncellendi." });
            navigation.goBack();
          },
        },
      );
    } else {
      createChapter(
        { novelId, ...payload },
        {
          onSuccess: () => {
            useToastStore
              .getState()
              .showToast({ type: "Başarılı", message: "Bölüm oluşturuldu." });
            navigation.goBack();
          },
        },
      );
    }
  };

  if ((isDraft && isDraftLoading) || (!isDraft && isPublishLoading)) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="small" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: theme.background }}
      >
        <ChapterEditHeader
          isCreating={!chapterId}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </SafeAreaView>

      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={[styles.editorCard, { backgroundColor: theme.surface }]}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[styles.titleInput, { color: theme.textPrimary }]}
            placeholder={chapterId ? "Bölüm Başlığı" : "Yeni Bölüm Başlığı"}
            placeholderTextColor={theme.textSecondary}
            multiline
          />
          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "#F1F5F9",
              },
            ]}
          />

          <RichText
            editor={editor}
            style={[styles.richText, { backgroundColor: theme.surface }]}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <CustomToolbar editor={editor} contentWordCount={wordCount} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChapterEditScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flex: { flex: 1 },
  editorCard: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  titleInput: {
    fontSize: 18,
    fontFamily: "Mont-700",
    paddingBottom: 10,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  richText: { flex: 1 },
});
