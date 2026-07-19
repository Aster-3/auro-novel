import { ChapterEditHeader } from "@/Features/ChapterEditScreen/ChapterEditHeader";
import {
  CustomToolbar,
  getCustomCSS,
} from "@/Features/ChapterEditScreen/CustomToolbar";
import { RootStackParamList } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useChapterMutation } from "@/hooks/useChapterMutation";
import { useCreateChapter } from "@/hooks/useCreateChapter";
import { useGetOneChapter } from "@/hooks/useGetOneChapter";
import { useGetOneDraftChapter } from "@/hooks/useGetOneDraftChapter";
import { updateCreateChapterSchema } from "@/schemas/chapter";
import { useToastStore } from "@/store/useToastStore";
import { wordCounter } from "@/utils/wordCounter";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  CoreBridge,
  RichText,
  TenTapStartKit,
  useEditorBridge,
} from "@10play/tentap-editor";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const ChapterEditScreen = () => {
  const { theme, isDarkMode } = useAppTheme();
  const route = useRoute<RouteProp<RootStackParamList, "ChapterEdit">>();
  const { chapterId, novelId, isDraft } = route.params;
  const navigation = useAppNavigation();

  const [title, setTitle] = useState("");
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
    if (!data) {
      return;
    }

    if (data.title) {
      setTitle(data.title);
    }

    if (data.content) {
      editor.setContent(data.content);
    }
  }, [data, editor]);

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
            useToastStore.getState().showToast({
              type: "Başarılı",
              message: "Bölüm güncellendi.",
            });
            navigation.goBack();
          },
        },
      );
    } else {
      createChapter(
        { novelId, ...payload },
        {
          onSuccess: () => {
            useToastStore.getState().showToast({
              type: "Başarılı",
              message: "Bölüm oluşturuldu.",
            });
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
        <View
          style={[styles.editorArea, { backgroundColor: theme.background }]}
        >
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[styles.titleInput, { color: theme.textPrimary }]}
            placeholder={chapterId ? "Bölüm başlığı" : "Yeni bölüm başlığı"}
            placeholderTextColor={theme.textSecondary}
            multiline
          />

          <View
            style={[
              styles.divider,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.035)"
                  : "rgba(15, 23, 42, 0.19)",
              },
            ]}
          />

          <RichText
            editor={editor}
            style={[styles.richText, { backgroundColor: theme.background }]}
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
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  editorArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  titleInput: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "Mont-700",
    paddingTop: 2,
    paddingBottom: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    borderRadius: 10,
  },
  richText: {
    flex: 1,
  },
});
