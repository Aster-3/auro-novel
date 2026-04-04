import { TrashIcon } from "@/components/icons/TrashIcon";
import { useDeleteChapter } from "@/hooks/useDeleteChapter";
import { usePublishChapter } from "@/hooks/usePublishChapter";
import { useModalStore } from "@/store/useModalStore";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { VolumesModal } from "../ChapterEditScreen/VolumesModal";
import { useState } from "react";
import { PublishDownIcon } from "@/components/icons/PublishDownIcon";
import { useChapterMutation } from "@/hooks/useChapterMutation";
import { PublicationStatus } from "@/types/chapter";
import { useChapterPublication } from "@/hooks/useChapterPublication";

export const ChapterItemMoreOptions = ({
  isPublished,
  isArchived,
  chapterId,
  novelId,
}: {
  isPublished: boolean;
  isArchived: boolean;
  chapterId: string;
  novelId: string;
}) => {
  const { mutate: deleteChapter } = useDeleteChapter(isPublished, novelId);
  const { mutate: publishChapter } = usePublishChapter();
  const { mutate: changePublicationStatus } = useChapterPublication(novelId);

  const handleDelete = () => {
    useModalStore.getState().showConfirm({
      title: "Bölümü Sil",
      message: "Bu bölümü silmek istediğinize emin misiniz?",
      confirmText: "Evet, Sil",
      cancelText: "Hayır, İptal",
      onConfirm: () => deleteChapter(chapterId),
    });
  };

  const handlePublish = (volumeId?: string) => {
    useModalStore.getState().showConfirm({
      title: "Yayına Al",
      message: "Bu bölümü yayınlamak istediğinize emin misiniz?",
      confirmText: "Evet, Yayına Al",
      cancelText: "Hayır, İptal",
      onConfirm: () => {
        setIsModalVisible(false);
        publishChapter({
          chapterId,
          novelId,
          ...(volumeId ? { volumeId } : {}),
        });
      },
    });
  };

  const handleUnpublish = () => {
    useModalStore.getState().showConfirm({
      title: "Yayından Kaldır",
      message: `Bu bölümü yeni okurlar için gizlemek istediğinize emin misiniz?

Mevcut okurlarınızın deneyimi bozulmaz; bölümü daha önce satın almış olanlar içeriğe her zamanki gibi erişebilir. Ancak yeni satışlar durdurulacak ve bölüm hikaye akışında gizlenecektir.

Sıralamanız ve düzeniniz olduğu gibi korunur. Dilediğiniz an tek bir dokunuşla bölümü tekrar herkes için görünür kılabilirsiniz.`,
      confirmText: "Evet, Kaldır",
      cancelText: "Hayır, İptal",
      onConfirm: () =>
        changePublicationStatus({
          chapterId,
          publicationStatus: PublicationStatus.UNPUBLISHED,
        }),
    });
  };

  const handleRepublish = () => {
    useModalStore.getState().showConfirm({
      title: "Yayına Al",
      message: "Bu bölümü tekrar yayına almak istediğinize emin misiniz?",
      confirmText: "Evet, Yayına Al",
      cancelText: "Hayır, İptal",
      onConfirm: () =>
        changePublicationStatus({
          chapterId,
          publicationStatus: PublicationStatus.PUBLISHED,
        }),
    });
  };

  const togglePublishState = () => {
    if (isPublished && !isArchived) {
      handleUnpublish();
    } else if (isPublished && isArchived) {
      handleRepublish();
    } else {
      setIsModalVisible(true);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.leftIndicator} />

      <View style={styles.optionsWrapper}>
        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.6}
          onPress={togglePublishState}
        >
          <View
            style={{
              transform: [
                {
                  rotate: !isPublished || isArchived ? "180deg" : "0deg",
                },
              ],
            }}
          >
            <PublishDownIcon size={14} color="#0f3f92" />
          </View>
          <Text style={[styles.optionText, { color: "#0f3f92" }]}>
            {!isPublished
              ? "• Yayına Al"
              : isArchived
                ? "• Tekrar Yayına Al"
                : "• Yayından Kaldır"}
          </Text>
        </TouchableOpacity>

        <View style={styles.miniDivider} />

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.6}
          onPress={handleDelete}
        >
          <View style={{ marginBottom: 3 }}>
            <TrashIcon size={14} color="#be123c" />
          </View>
          <Text style={[styles.optionText, styles.deleteText]}>
            • Bölümü Sil
          </Text>
        </TouchableOpacity>
      </View>
      <VolumesModal
        handleVolumeSelect={(volumeId) => {
          setIsModalVisible(false);
          handlePublish(volumeId);
        }}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        novelId={novelId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingLeft: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  leftIndicator: {
    width: 2,
    backgroundColor: "#e2e8f0",
    borderRadius: 1,
    marginVertical: 4,
  },
  optionsWrapper: {
    flex: 1,
    paddingLeft: 12,
    gap: 2,
  },
  option: {
    paddingVertical: 6,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  optionText: {
    fontSize: 11.5,
    fontFamily: "Mont-500",
    letterSpacing: 0.3,
  },
  deleteText: {
    color: "#be123c",
  },
  miniDivider: {
    height: 1,
    backgroundColor: "#f1f5f9", // Seçenekler arası çok silik ayraç
    width: "40%", // Tamamını kaplamasın, daha şık durur
  },
});
