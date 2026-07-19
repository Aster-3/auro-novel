import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  color?: string;
  size?: number;
  hasUnread?: boolean;
};

export const NotificationIcon = ({
  color = "#030937",
  size = 24,
  hasUnread = false,
}: Props) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M10.268 21C10.4435 21.304 10.696 21.5565 11 21.732C11.3041 21.9075 11.6489 21.9999 12 21.9999C12.3511 21.9999 12.6959 21.9075 13 21.732C13.304 21.5565 13.5565 21.304 13.732 21"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3.262 15.326C3.13137 15.4692 3.04516 15.6472 3.01386 15.8385C2.98256 16.0298 3.00752 16.226 3.08571 16.4034C3.1639 16.5807 3.29194 16.7316 3.45426 16.8375C3.61658 16.9434 3.80618 16.9999 4 17H20C20.1938 17.0001 20.3834 16.9438 20.5459 16.8381C20.7083 16.7324 20.8365 16.5817 20.9149 16.4045C20.9933 16.2273 21.0185 16.0311 20.9874 15.8398C20.9564 15.6485 20.8704 15.4703 20.74 15.327C19.41 13.956 18 12.499 18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 12.499 4.589 13.956 3.262 15.326Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {hasUnread && <View style={styles.notificationDot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  notificationDot: {
    position: "absolute",
    top: -1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
});
