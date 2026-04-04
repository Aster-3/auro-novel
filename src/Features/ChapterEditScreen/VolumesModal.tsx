import { useCreateVolume } from "@/hooks/useCreateVolume";
import { useDeleteVolume } from "@/hooks/useDeleteVolume";
import { useUpdateVolume } from "@/hooks/useUpdateVolume";
import { useVolumeQuery } from "@/hooks/useVolumeQuery";
import { useModalStore } from "@/store/useModalStore";
import { Volume } from "@/types/volume";
import { useState, useRef } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Alert,
} from "react-native";

export const VolumesModal = ({
  handleVolumeSelect,
  isModalVisible,
  setIsModalVisible,
  novelId,
}: {
  handleVolumeSelect: (volumeId: string) => void;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  novelId: string;
}) => {
  const [view, setView] = useState<"LIST" | "ADD" | "EDIT">("LIST");
  const [editingVolume, setEditingVolume] = useState<Volume | null>(null);

  const { data: volumes } = useVolumeQuery(novelId);
  const [newVolumeName, setNewVolumeName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: createVolume } = useCreateVolume(novelId);
  const { mutate: deleteVolume } = useDeleteVolume(novelId);
  const { mutate: updateVolume } = useUpdateVolume(novelId);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleView = (targetView: "LIST" | "ADD" | "EDIT", volume?: Volume) => {
    setError(null); // Görünüm (sayfa) değişirken hatayı temizle

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -15,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setView(targetView);

      if (targetView === "EDIT" && volume) {
        setNewVolumeName(volume.name || "");
        setEditingVolume(volume);
      } else {
        setNewVolumeName("");
        setEditingVolume(null);
      }

      slideAnim.setValue(15);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setView("LIST");
      setNewVolumeName("");
      setEditingVolume(null);
      setError(null); // Modal tamamen kapandığında hatayı temizle
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    }, 300);
  };

  const handleSave = () => {
    setError(null); // Yeni bir kaydetme denemesinde önceki hatayı temizle
    const finalName = newVolumeName.trim(); // Boş bırakmaya izin veriliyor

    if (view === "EDIT" && editingVolume) {
      updateVolume(
        {
          volumeId: editingVolume.id,
          name: finalName,
        },
        {
          onError: (err) => {
            setError(err.message || "Cilt güncellenirken bir hata oluştu.");
          },
          onSuccess: () => {
            setNewVolumeName("");
            setEditingVolume(null);
            toggleView("LIST");
          },
        },
      );
    } else {
      createVolume(finalName, {
        onError: (err) => {
          setError(err.message || "Cilt oluşturulurken bir hata oluştu.");
        },
        onSuccess: () => {
          setNewVolumeName("");
          setEditingVolume(null);
          toggleView("LIST");
        },
      });
    }
  };

  const handleDelete = (volumeId: string) => {
    useModalStore.getState().showConfirm({
      title: "Cilt Sil",
      message: "Bu cildi silmek istediğinize emin misiniz?",
      confirmText: "Evet, Sil",
      cancelText: "Hayır, İptal",
      onConfirm: () => {
        setError(null); // Silme işlemi başlarken mevcut hatayı temizle
        deleteVolume(volumeId, {
          onError: (err) => {
            setError(err.message || "Cilt silinirken bir hata oluştu.");
          },
          onSuccess: () => {
            setView("LIST");
          },
        });
      },
    });
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            {view === "LIST" ? (
              <View key="list-content">
                <Text style={styles.modalTitle}>Cilt Seç</Text>
                <View style={{ maxHeight: 300 }}>
                  <FlatList
                    data={volumes}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.modalItemRow}>
                        <TouchableOpacity
                          style={styles.modalItemContent}
                          onPress={() => handleVolumeSelect(item.id)}
                        >
                          <Text style={styles.modalItemText}>
                            {`${item.name ? `Cilt ${item.orderIndex}: ${item.name}` : `Cilt ${item.orderIndex}`}`}
                          </Text>
                        </TouchableOpacity>

                        <View style={styles.actionButtonsContainer}>
                          <TouchableOpacity
                            onPress={() => toggleView("EDIT", item)}
                          >
                            <Text style={styles.actionTextEdit}>Düzenle</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(item.id)}
                          >
                            <Text style={styles.actionTextDelete}>Sil</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                  style={styles.modalAddButton}
                  onPress={() => toggleView("ADD")}
                >
                  <Text style={styles.modalAddText}>+ Cilt Oluştur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.modalCancelText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View key="form-content">
                <Text style={styles.modalTitle}>
                  {view === "EDIT" ? "Cildi Düzenle" : "Yeni Cilt Oluştur"}
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Cilt Adı</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Örn: Başlangıç Seviyesi"
                    placeholderTextColor="#94a3b8"
                    value={newVolumeName}
                    onChangeText={(text) => {
                      setNewVolumeName(text);
                      if (error) setError(null); // Kullanıcı yazmaya başladığında hatayı temizle
                    }}
                    autoFocus
                  />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* Buton engeli (disabled) ve opaklık düşürme kaldırıldı */}
                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleSave}
                >
                  <Text style={styles.modalSubmitText}>
                    {view === "EDIT" ? "Güncelle" : "Kaydet"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalBackButton}
                  onPress={() => toggleView("LIST")}
                >
                  <Text style={styles.modalBackText}>Geri Dön</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Mont-700",
    color: "#1e293b",
    marginBottom: 20,
    textAlign: "center",
  },
  modalItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 14,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 10,
    fontFamily: "Mont-600",
    marginTop: 8,
    textAlign: "center",
  },
  modalItemContent: {
    flex: 1,
    paddingRight: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionTextEdit: {
    fontSize: 12,
    fontFamily: "Mont-600",
    color: "#3b82f6",
  },
  actionTextDelete: {
    fontSize: 12,
    fontFamily: "Mont-600",
    color: "#ef4444",
  },
  modalItemActive: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  modalItemText: {
    fontSize: 13,
    fontFamily: "Mont-500",
    color: "#475569",
    textAlign: "left",
  },
  modalItemTextActive: {
    color: "#0a1e3f",
    fontFamily: "Mont-700",
  },
  modalAddButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#abb5c2",
    borderStyle: "dashed",
  },
  modalAddText: {
    fontSize: 12,
    fontFamily: "Mont-600",
    color: "#334155",
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Mont-600",
    color: "#64748b",
    marginBottom: 8,
    marginLeft: 4,
  },
  modalInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Mont-500",
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  modalSubmitButton: {
    backgroundColor: "#0a1e3f",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#0a1e3f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalSubmitText: {
    fontSize: 14,
    fontFamily: "Mont-700",
    color: "#fff",
  },
  modalBackButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalBackText: {
    fontSize: 12,
    fontFamily: "Mont-600",
    color: "#94a3b8",
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#eceff2",
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 13,
    fontFamily: "Mont-700",
    color: "#64748b",
  },
});
