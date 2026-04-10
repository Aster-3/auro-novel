import Svg, { Path } from "react-native-svg";

export const CategoryIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 16 16" fill="none">
    <Path
      d="M5.667 9.667A1.667 1.667 0 007.333 8c0-.92-.333-1.333-.666-2C5.952 4.571 6.517 3.297 8 2c.333 1.667 1.333 3.267 2.667 4.333 1.333 1.067 2 2.334 2 3.667a4.667 4.667 0 01-9.334 0c0-.769.289-1.53.667-2a1.667 1.667 0 001.667 1.667z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
