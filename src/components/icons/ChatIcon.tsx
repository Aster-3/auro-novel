import Svg, { Path } from "react-native-svg";

export const ChatIcon = ({ size = 24, color = "#030937" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.992 16.342a2 2 0 01.094 1.167l-1.065 3.29a1 1 0 001.236 1.168l3.413-.998a2 2 0 011.099.092 10 10 0 10-4.777-4.719zM8 12h.01M12 12h.01M16 12h.01"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
