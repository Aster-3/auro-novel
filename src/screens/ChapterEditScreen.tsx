import React, { useState, useEffect, useMemo } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
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
  customCodeBlockCSS,
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
import { is } from "zod/v4/locales";

const ChapterEditScreen = () => {
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
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(null);

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: data?.content || "",
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(customCodeBlockCSS),
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
    const volumeIdToSubmit =
      selectedVolumeId === "auto" ? null : selectedVolumeId;

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
      ...(volumeIdToSubmit && { volumeId: volumeIdToSubmit }),
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

  // Yükleme ekranı
  if ((isDraft && isDraftLoading) || (!isDraft && isPublishLoading)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0f3f92" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <ChapterEditHeader
          isCreating={!chapterId}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </SafeAreaView>

      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <View style={styles.editorCard}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
            placeholder={chapterId ? "Bölüm Başlığı" : "Yeni Bölüm Başlığı"}
            placeholderTextColor="#94a3b8"
            multiline
          />
          <View style={styles.divider} />

          <RichText
            editor={editor}
            style={styles.richText}
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
  screen: { flex: 1, backgroundColor: "#F2F2F7", gap: 16 },
  headerSafe: { backgroundColor: "#F2F2F7" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  flex: { flex: 1 },
  editorCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    elevation: 1,
  },
  titleInput: {
    fontSize: 18,
    fontFamily: "Mont-700",
    color: "#1e293b",
    paddingBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    width: "100%",
    marginBottom: 16,
  },
  richText: { flex: 1 },
});
