import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export const AuthorGraphics = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, { fontSize: 16 }]}>Grafikler</Text>
        <TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 12 }]}>Tümü</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 4,
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Mont-600",
    color: "#1c274c",
  },
});
