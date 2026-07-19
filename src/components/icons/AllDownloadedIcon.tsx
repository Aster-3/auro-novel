import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const AllDownloadedIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8.5 7v7M6 11l2.5 3 2.5-3M15.5 7v7M13 11l2.5 3 2.5-3"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 17H6M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464.974.974 1.3 2.343 1.41 4.536"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
