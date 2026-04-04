import { Text, View, StyleSheet } from "react-native";

export const MoreOptions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>
        Daha fazla seçenek burada görünecek.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
});
