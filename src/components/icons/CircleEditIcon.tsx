import Svg, { Path } from "react-native-svg";

export const CircleEditIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M14.936 2.94a1.502 1.502 0 112.124 2.124l-6.727 6.728L7.5 12.5l.708-2.833 6.728-6.727zM13.333 5L15 6.667"
      stroke={color}
      strokeWidth={1.42}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.417 2.5H10a7.5 7.5 0 107.5 7.5v-.417"
      stroke={color}
      strokeWidth={1.42}
      strokeLinecap="round"
    />
  </Svg>
);
