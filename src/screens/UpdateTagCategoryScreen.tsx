import { Screen } from "@/components/layout/Screen";
import { UTCHeader } from "@/Features/UpdateTagCategoryScreen/UTCHeader";
import { UTCItems } from "@/Features/UpdateTagCategoryScreen/UTCItems";
import { UTCSearch } from "@/Features/UpdateTagCategoryScreen/UTCSearch";
import { UTCSelectedItems } from "@/Features/UpdateTagCategoryScreen/UTCSelectedİtems";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useInfiniteCategories } from "@/hooks/useInfiniteCategories";
import { useInfiniteTags } from "@/hooks/useInfiniteTags";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { useModalStore } from "@/store/useModalStore";
import { useToastStore } from "@/store/useToastStore";
import { LanguageType } from "@/types/novel";
import { useDebounce } from "@/utils/useDebounce";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";

type ScreenMode = "category" | "tag";

const UpdateTagCategoryScreen = ({ route }: { route: any }) => {
  const {
    id,
    mode,
    availableItems,
  }: { id: string; mode: ScreenMode; availableItems: any[] } = route.params;
  const [searchValue, setSearchValue] = useState("");
  const { mutate: updateNovel } = useNovelMutation(id);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const navigation = useAppNavigation();

  const [selectedItems, setSelectedItems] = useState<any[]>(
    availableItems || [],
  );

  const isCategoryMode = mode === "category";

  const { data: categories } = useInfiniteCategories(
    { lang: LanguageType.TR, search: debouncedSearchValue.trimEnd() },
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
        message: `En fazla 3 kategori seçebilirsiniz.`,
      });
      return;
    } else if (mode === "tag" && selectedItems.length >= 20) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: `En fazla 20 etiket seçebilirsiniz.`,
      });
      return;
    }
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleSubmit = () => {
    const label = isCategoryMode ? "kategorilerle" : "etiketlerle";
    useModalStore.getState().showConfirm({
      title: `Seçilen ${label} devam et`,
      message: `Değişiklikleri kaydetmek istiyor musunuz?`,
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
      <UTCSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        mode={mode}
      />
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
    backgroundColor: "#F8FAFC",
    gap: 12,
  },
});
