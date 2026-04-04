import Svg, { Path, Circle } from "react-native-svg";

export const ChapterMoreOptions = ({
  color = "#09244B",
  size = 22,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
    <Path
      d="M13.5 3.5c7 0 10 3 10 10s-3 10-10 10-10-3-10-10 3-10 10-10z"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Circle cx="9.5" cy="13.5" r="1.2" fill={color} />
    <Circle cx="13.5" cy="13.5" r="1.2" fill={color} />
    <Circle cx="17.5" cy="13.5" r="1.2" fill={color} />
  </Svg>
);
