import Svg, { Path } from "react-native-svg";

export const ChapterIcon = ({ color }: { color: string }) => (
  <Svg width={10} height={10} viewBox="0 0 12 12" fill="none">
    <Path
      d="M8 2.5H1.5M8 6H1.5M8 9.5H1.5M10.5 2.5h.006M10.5 6h.006M10.5 9.5h.006"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
