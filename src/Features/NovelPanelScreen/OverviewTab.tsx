import React, { useState, useEffect, use } from "react";
import { SelectImageIcon } from "@/components/icons/SelectImageIcon";
import { useNovelDetail } from "@/hooks/useNovelDetail";
import { Image } from "expo-image";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { CategoryPreview } from "./CategoryPreview";
import { TagsPreview } from "./TagsPreview";
import { SummaryPreview } from "./SummaryPreview";
import { XIcon } from "@/components/icons/XIcon";
import * as ImagePicker from "expo-image-picker";
import { useModalStore } from "@/store/useModalStore";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { LoadingDots } from "@/components/LoadingDots";
import { OverviewOptions } from "./OverviewOptions";

export const OverviewTab = ({ route }: { route: any }) => {
  const { id } = route.params;
  const { data } = useNovelDetail(id);
  const { mutate: updateNovel, isPending } = useNovelMutation(id);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(data?.name || "");
  const isChanged = name !== data?.name && name.trim() !== "";

  useEffect(() => {
    if (data?.name) setName(data.name);
  }, [data?.name]);

  const handleReset = () => {
    setName(data?.name || "");
  };

  const handleImagePress = async () => {
    console.log("Resim seçme işlemi tetiklendi");
    const selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });
    if (!selectedImage.canceled) {
      useModalStore.getState().showConfirm({
        title: "Kapak Fotoğrafını Değiştir",
        message:
          "Seçilen resmi kapak fotoğrafı olarak ayarlamak istediğinize emin misiniz?",
        onConfirm: () => {
          console.log(
            "Kapak fotoğrafı olarak ayarlandı:",
            selectedImage.assets[0].uri,
          );
          // Burada resmi yükleme ve güncelleme işlemi yapılabilir
          console.log("Seçilen resim:", selectedImage);
        },
      });
    }
  };

  const handleTitleChange = async () => {
    if (!isChanged) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    updateNovel(
      { name },
      {
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <ScrollView
      nestedScrollEnabled
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.tabContent}
      onScrollBeginDrag={() => {}}
    >
      <View style={styles.headContainer}>
        <Pressable style={styles.imageWrapper} onPress={handleImagePress}>
          <Image
            blurRadius={1}
            source={data?.coverImage}
            style={styles.image}
          />
          <View style={styles.imageOverlay} />
          <View style={styles.iconContainer}>
            <SelectImageIcon size={32} color="#ffffffd3" />
          </View>
        </Pressable>

        <View style={styles.inputWrapper}>
          <View style={styles.inputRow}>
            {/* <View style={styles.sideIconArea}></View> */}
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              multiline={false}
              autoCorrect={false}
              placeholder="İsim giriniz..."
            />

            <View style={styles.sideIconArea}>
              {isChanged && (
                <TouchableOpacity onPress={handleReset} hitSlop={10}>
                  <XIcon size={14} color="#d9d9d9" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {isChanged && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleTitleChange}
            >
              {isLoading ? (
                <LoadingDots />
              ) : (
                <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <OverviewOptions
          id={data?.id || ""}
          tags={data?.tags || []}
          categories={data?.categories || []}
        />
        {/* <CategoryPreview id={data?.id || ""} categories={data?.categories} />
        <TagsPreview tags={data?.tags} novelId={data?.id || ""} />
        <SummaryPreview summary={data?.synopsis} /> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabContent: { paddingTop: 30, paddingBottom: 40, gap: 32 },
  headContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: 150,
    aspectRatio: 2 / 3,
    marginBottom: 24,
    position: "relative",
  },
  image: { width: "100%", height: "100%", borderRadius: 20 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  inputWrapper: { width: "100%", alignItems: "center" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  input: {
    flex: 1,
    fontFamily: "Mont-500",
    // KESİN ÇÖZÜM: Sağdaki ikon alanı kadar solda da boşluk bırakıyoruz
    paddingHorizontal: 30,
    minHeight: 0,
    fontSize: 17,
    color: "#404040",
    textAlign: "center",
    paddingVertical: 8,
  },
  sideIconArea: {
    position: "absolute",
    right: 0,
    // Z-index ekleyerek ikonun her zaman üstte ve tıklanabilir olduğundan emin olalım
    zIndex: 1,
    height: "100%",
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 4,
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: "#0d0638",
    height: 40,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  saveButtonText: { color: "#fff", fontFamily: "Mont-600", fontSize: 12 },
  body: { paddingHorizontal: 4, gap: 40, width: "100%" },
});
