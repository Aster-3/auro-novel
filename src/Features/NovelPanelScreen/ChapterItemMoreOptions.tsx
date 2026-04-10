import { TrashIcon } from "@/components/icons/TrashIcon";
import { useDeleteChapter } from "@/hooks/useDeleteChapter";
import { usePublishChapter } from "@/hooks/usePublishChapter";
import { useModalStore } from "@/store/useModalStore";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { VolumesModal } from "../ChapterEditScreen/VolumesModal";
import { useState } from "react";
import { PublishDownIcon } from "@/components/icons/PublishDownIcon";
import { PublicationStatus } from "@/types/chapter";
import { useChapterPublication } from "@/hooks/useChapterPublication";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

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
  const { theme, isDarkMode } = useAppTheme();
  const { mutate: deleteChapter } = useDeleteChapter(isPublished, novelId);
  const { mutate: publishChapter } = usePublishChapter();
  const { mutate: changePublicationStatus } = useChapterPublication(novelId);

  // Renk Sabitleri - Custom ve Dinamik
  const ACTION_BLUE = isDarkMode ? "#60a5fa" : "#0f3f92"; // Karanlıkta daha açık bir mavi
  const ACTION_RED = isDarkMode ? "#fb7185" : "#be123c"; // Karanlıkta daha yumuşak bir kırmızı

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

Mevcut okurlarınızın deneyimi bozulmaz; bölümü daha önce satın almış olanlar içeriğe her zamanki gibi erişebilir.`,
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
      <View
        style={[
          styles.leftIndicator,
          { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0" },
        ]}
      />

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
            <PublishDownIcon size={14} color={ACTION_BLUE} />
          </View>
          <Text style={[styles.optionText, { color: ACTION_BLUE }]}>
            {!isPublished
              ? "• Yayına Al"
              : isArchived
                ? "• Tekrar Yayına Al"
                : "• Yayından Kaldır"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          activeOpacity={0.6}
          onPress={handleDelete}
        >
          <View style={{ marginBottom: 3 }}>
            <TrashIcon size={14} color={ACTION_RED} />
          </View>
          <Text style={[styles.optionText, { color: ACTION_RED }]}>
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
});
