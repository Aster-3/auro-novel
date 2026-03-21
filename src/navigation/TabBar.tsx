import { View, TouchableOpacity, StyleSheet } from "react-native";
import { TAB_ICONS, DefaultIcon } from "../constants/navigation";

export function TabBar({ state, navigation }: any) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const color = isFocused ? "#111" : "#9AA0A6";
          const IconComponent = TAB_ICONS[route.name] || DefaultIcon;

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              {isFocused && route.name !== "Profile" && (
                <View style={styles.pill} />
              )}
              {route.name === "Profile" ? (
                <IconComponent isFocused={isFocused} size={18} color={color} />
              ) : (
                <IconComponent color={color} size={18} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,
  },

  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },

  tabItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  pill: {
    position: "absolute",
    bottom: 0,
    marginBottom: 4,
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#111",
  },
});
