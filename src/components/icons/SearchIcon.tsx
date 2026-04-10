import Svg, { Path } from "react-native-svg";

export const SearchIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 20 20" fill="none">
    <Path
      d="M9.167 5a4.167 4.167 0 014.166 4.167m.55 4.712L17.5 17.5m-1.667-8.333a6.667 6.667 0 11-13.333 0 6.667 6.667 0 0113.333 0z"
      stroke={color}
      strokeOpacity={0.5}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
