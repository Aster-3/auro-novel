import { Text, View, StyleSheet } from "react-native";

export const TableOfContentsView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
      <Text style={styles.placeholderText}>İçindekiler burada görünecek.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
});
