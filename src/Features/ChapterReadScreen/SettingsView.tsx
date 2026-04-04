import { Text, View, StyleSheet } from "react-native";

export const SettingsView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
      <Text style={styles.placeholderText}>Ayarlar burada görünecek.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
});
