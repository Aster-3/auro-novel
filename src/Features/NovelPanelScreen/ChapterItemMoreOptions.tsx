import { PublishDownIcon } from "@/components/icons/PublishDownIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { useChapterPublication } from "@/hooks/useChapterPublication";
import { useDeleteChapter } from "@/hooks/useDeleteChapter";
import { usePublishChapter } from "@/hooks/usePublishChapter";
import { useAppTheme } from "@/hooks/useTheme";
import { useModalStore } from "@/store/useModalStore";
import { PublicationStatus } from "@/types/chapter";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VolumesModal } from "../ChapterEditScreen/VolumesModal";

export const ChapterItemMoreOptions = ({
  isPublished,
  isArchived,
  chapterId,
  novelId,
}: {
  isPublished: boolean;
  isArchived?: boolean;
  chapterId: string;
  novelId: string;
}) => {
  const { isDarkMode } = useAppTheme();
  const { mutate: deleteChapter } = useDeleteChapter(isPublished, novelId);
  const { mutate: publishChapter } = usePublishChapter();
  const { mutate: changePublicationStatus } = useChapterPublication(novelId);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const actionBlue = isDarkMode ? "#60A5FA" : "#0F3F92";
  const actionRed = isDarkMode ? "#FB7185" : "#BE123C";

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
      message: `Bu bölümü yeni okurlar için gizlemek istediğinize emin misiniz?`,
      confirmText: "Evet, Gizle",
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

  const publishLabel = !isPublished
    ? "Yayına Al"
    : isArchived
      ? "Tekrar Yayına Al"
      : "Yayından Kaldır";

  return (
    <View style={styles.container}>
      <View style={styles.optionsWrapper}>
        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.65}
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
            <PublishDownIcon size={14} color={actionBlue} />
          </View>
          <Text style={[styles.optionText, { color: actionBlue }]}>
            {publishLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.65}
          onPress={handleDelete}
        >
          <View style={styles.trashIconOffset}>
            <TrashIcon size={14} color={actionRed} />
          </View>
          <Text style={[styles.optionText, { color: actionRed }]}>
            Bölümü Sil
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
    paddingLeft: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  optionsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  option: {
    paddingVertical: 4,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  optionText: {
    fontSize: 10.5,
    fontFamily: "Mont-500",
  },
  trashIconOffset: {
    marginBottom: 2,
  },
});
