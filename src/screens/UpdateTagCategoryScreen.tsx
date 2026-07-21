import { UTCHeader } from "@/Features/UpdateTagCategoryScreen/UTCHeader";
import { UTCItems } from "@/Features/UpdateTagCategoryScreen/UTCItems";
import { UTCSearch } from "@/Features/UpdateTagCategoryScreen/UTCSearch";
import { UTCSelectedItems } from "@/Features/UpdateTagCategoryScreen/UTCSelectedİtems";
import { Screen } from "@/components/layout/Screen";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useCreateTagMutation } from "@/hooks/useCreateTagMutation";
import { useInfiniteCategories } from "@/hooks/useInfiniteCategories";
import { useInfiniteTags } from "@/hooks/useInfiniteTags";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { useModalStore } from "@/store/useModalStore";
import { useToastStore } from "@/store/useToastStore";
import { useDebounce } from "@/utils/useDebounce";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ScreenMode = "category" | "tag";

const UpdateTagCategoryScreen = ({ route }: { route: any }) => {
  const {
    id,
    mode,
    availableItems,
  }: { id: string; mode: ScreenMode; availableItems: any[] } = route.params;
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>(
    availableItems || [],
  );
  const { theme, isDarkMode } = useAppTheme();
  const { mutate: updateNovel } = useNovelMutation(id);
  const { mutate: createTag, isPending: isCreateTagPending } =
    useCreateTagMutation();
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const navigation = useAppNavigation();

  const isCategoryMode = mode === "category";
  const trimmedSearchValue = searchValue.trim();
  const normalizedSearchValue = trimmedSearchValue.toLocaleLowerCase("tr-TR");

  const { data: categories } = useInfiniteCategories(
    { search: debouncedSearchValue.trimEnd() },
    isCategoryMode,
  );

  const { data: tags } = useInfiniteTags(
    { name: debouncedSearchValue.trimEnd() },
    !isCategoryMode,
  );

  useEffect(() => {
    if (availableItems) setSelectedItems(availableItems);
  }, [availableItems]);

  const availableOptions = useMemo(() => {
    const rawData = isCategoryMode ? categories : tags;
    if (!rawData?.items) return [];

    return rawData.items.filter(
      (item) => !selectedItems.some((selected) => selected.id === item.id),
    );
  }, [categories, tags, selectedItems, isCategoryMode]);

  const canCreateTag = useMemo(() => {
    if (isCategoryMode) return false;
    if (trimmedSearchValue.length < 3 || trimmedSearchValue.length > 30) {
      return false;
    }

    const hasSelectedMatch = selectedItems.some(
      (item) =>
        item.name?.trim().toLocaleLowerCase("tr-TR") === normalizedSearchValue,
    );
    const hasTagMatch = tags?.items?.some(
      (item) =>
        item.name?.trim().toLocaleLowerCase("tr-TR") === normalizedSearchValue,
    );

    return !hasSelectedMatch && !hasTagMatch;
  }, [
    isCategoryMode,
    normalizedSearchValue,
    selectedItems,
    tags?.items,
    trimmedSearchValue.length,
  ]);

  const handleRemoveItem = (itemId: number) => {
    useModalStore.getState().showConfirm({
      title: "Öğeyi kaldır",
      message: "Bu öğeyi kaldırmak istediğinize emin misiniz?",
      onConfirm: () => {
        setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
      },
    });
  };

  const handleSelectItem = (item: any) => {
    if (mode === "category" && selectedItems.length >= 3) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "En fazla 3 kategori seçebilirsiniz.",
      });
      return;
    } else if (mode === "tag" && selectedItems.length >= 20) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "En fazla 20 etiket seçebilirsiniz.",
      });
      return;
    }
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleCreateTag = () => {
    if (!canCreateTag || isCreateTagPending) return;

    if (selectedItems.length >= 20) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "En fazla 20 etiket seçebilirsiniz.",
      });
      return;
    }

    createTag(trimmedSearchValue, {
      onSuccess: (createdTag) => {
        setSelectedItems((prev) => {
          if (prev.some((item) => item.id === createdTag.id)) return prev;
          return [...prev, createdTag];
        });
        setSearchValue("");
        useToastStore.getState().showToast({
          type: "Başarılı",
          message: "Etiket oluşturuldu ve seçildi.",
        });
      },
      onError: (error: any) => {
        useToastStore.getState().showToast({
          type: "Hata",
          message:
            error?.errors?.name?.[0] ||
            error?.message ||
            "Etiket oluşturulurken bir hata oluştu.",
        });
      },
    });
  };

  const handleSubmit = () => {
    const label = isCategoryMode ? "kategorilerle" : "etiketlerle";
    useModalStore.getState().showConfirm({
      title: `Seçilen ${label} devam et`,
      message: "Değişiklikleri kaydetmek istiyor musunuz?",
      onConfirm: handleUpdate,
    });
  };

  const handleUpdate = () => {
    const itemIds = selectedItems.map((item) => item.id);

    const updatePayload = {
      [isCategoryMode ? "categories" : "tags"]: itemIds,
    };

    updateNovel(updatePayload, {
      onSuccess: () => {
        useToastStore.getState().showToast({
          type: "Başarılı",
          message: `${isCategoryMode ? "Kategoriler" : "Etiketler"} başarıyla güncellendi.`,
        });
        navigation.goBack();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.errors?.categories?.[0] ||
          error?.errors?.tags?.[0] ||
          "Bir hata oluştu. Lütfen tekrar deneyin.";

        useToastStore.getState().showToast({
          type: "Hata",
          message: errorMessage,
        });
      },
    });
  };

  return (
    <Screen style={styles.container}>
      <UTCHeader onSave={handleSubmit} mode={mode} />
      <View style={styles.intro}>
        <Text style={[styles.introTitle, { color: theme.textPrimary }]}>
          {isCategoryMode ? "Kategori seçimi" : "Etiket seçimi"}
        </Text>
        <Text style={[styles.introText, { color: theme.textSecondary }]}>
          {isCategoryMode
            ? "Romanını en iyi anlatan en fazla 3 kategoriyi seç."
            : "Okurların romanını keşfetmesine yardımcı olacak etiketleri seç."}
        </Text>
      </View>
      <UTCSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        mode={mode}
      />
      {!isCategoryMode && canCreateTag ? (
        <Pressable
          disabled={isCreateTagPending}
          onPress={handleCreateTag}
          style={({ pressed }) => [
            styles.createTagRow,
            {
              backgroundColor: pressed
                ? isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(15,23,42,0.04)"
                : isDarkMode
                  ? "rgba(255,255,255,0.028)"
                  : "rgba(15,23,42,0.025)",
              opacity: isCreateTagPending ? 0.55 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.createTagText,
              { color: theme.textPrimary },
            ]}
          >
            {isCreateTagPending
              ? "Etiket oluşturuluyor..."
              : `"${trimmedSearchValue}" etiketini oluştur`}
          </Text>
        </Pressable>
      ) : null}
      <UTCSelectedItems
        selectedItems={selectedItems}
        onRemove={handleRemoveItem}
        mode={mode}
      />
      <UTCItems items={availableOptions} onSelect={handleSelectItem} />
    </Screen>
  );
};

export default UpdateTagCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 10,
  },
  intro: {
    paddingTop: 4,
    paddingBottom: 2,
    gap: 4,
  },
  introTitle: {
    fontFamily: "Mont-600",
    fontSize: 13,
  },
  introText: {
    fontFamily: "Mont-500",
    fontSize: 11,
    lineHeight: 17,
  },
  createTagRow: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: -4,
  },
  createTagText: {
    fontFamily: "Mont-600",
    fontSize: 11.5,
  },
});
