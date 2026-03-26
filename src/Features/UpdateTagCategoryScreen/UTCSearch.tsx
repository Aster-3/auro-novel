import { SearchIcon2 } from "@/components/icons/SearchIcon2";
import { TextInput, StyleSheet, View } from "react-native";

export const UTCSearch = ({
  searchValue,
  setSearchValue,
  mode,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  mode: "tag" | "category";
}) => {
  return (
    <View style={styles.container}>
      {/* Referansındaki 'subContainer' mantığıyla dış çerçeve */}
      <View style={styles.searchWrapper}>
        <SearchIcon2 color="#1C274C" size={16} />
        <TextInput
          style={styles.textInput}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text.trimStart())}
          placeholder={mode === "tag" ? "Etiket Ara..." : "Kategori Ara..."}
          placeholderTextColor="#9D9D9D"
          selectionColor="#1C274C"
          cursorColor="#1C274C" // Android için imleç rengi
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10, // Diğer kutuyla arasındaki mesafe
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 45, // Referans kodundaki height: 45 ile aynı
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E5E5", // Referans kodundaki borderColor
    borderRadius: 10, // Referans kodundaki borderRadius
  },
  textInput: {
    flex: 1,
    height: "100%",
    marginLeft: 10,
    fontSize: 14, // Referans kodundaki label fontSize
    fontFamily: "Mont-500",
    color: "#1C274C", // Referans kodundaki ana yazı rengi
    paddingVertical: 0, // Gereksiz iç boşlukları sıfırladık
  },
});
