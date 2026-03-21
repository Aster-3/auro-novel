import { Keyboard, TouchableOpacity, View } from "react-native";
import { BackArrowIcon } from "../../components/icons/BackArrowIcon";
import { SearchBar } from "../../components/searchBar";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export const SearchHeader = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  const navigation = useAppNavigation();

  const handleBack = () => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Main");
    }
  };
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          handleBack();
        }}
      >
        <BackArrowIcon />
      </TouchableOpacity>
      <SearchBar value={value} setValue={setValue} />
    </View>
  );
};
