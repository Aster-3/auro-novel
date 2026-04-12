import Svg, { Path } from "react-native-svg";

export const LittleEyeIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M2.456 11.472C1.82 10.644 1.5 10.23 1.5 9s.319-1.644.956-2.472C3.73 4.875 5.864 3 9 3c3.136 0 5.271 1.875 6.544 3.528.637.828.956 1.242.956 2.472s-.319 1.644-.956 2.472C14.27 13.125 12.136 15 9 15c-3.136 0-5.271-1.875-6.544-3.528z"
      stroke={color}
    />
    <Path
      d="M11.25 9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      stroke={color}
    />
  </Svg>
);
