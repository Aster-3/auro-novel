import Svg, { Path } from "react-native-svg";

export const BookmarkIcon = ({
  color = "#030937",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 5.833v5M12.5 8.333h-5M14.167 2.5a1.667 1.667 0 011.666 1.667v12.5a.832.832 0 01-1.246.723l-3.76-2.148a1.666 1.666 0 00-1.654 0l-3.76 2.148a.833.833 0 01-1.246-.723v-12.5A1.667 1.667 0 015.833 2.5h8.334z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
