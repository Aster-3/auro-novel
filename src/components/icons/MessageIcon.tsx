import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const MessageIcon = ({
  color = "#09244B",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <Path
      d="M12.252 7c0 2.9-2.35 5.25-5.25 5.25h-5.25s.91-2.184.546-2.916A5.25 5.25 0 1112.252 7z"
      stroke={color}
      strokeWidth={1.26}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
