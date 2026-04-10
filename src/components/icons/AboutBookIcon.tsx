import Svg, { Path } from "react-native-svg";

export const AboutBookIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2.5 12.5h15m-15 3.333h10m-10-10h6.667M2.5 9.167h6.667m7 0h-2.334c-.466 0-.7 0-.878-.091a.833.833 0 01-.364-.364c-.091-.178-.091-.412-.091-.879V5.5c0-.467 0-.7.09-.878a.833.833 0 01.365-.364c.178-.091.412-.091.878-.091h2.334c.466 0 .7 0 .878.09.157.08.284.208.364.365.091.178.091.411.091.878v2.333c0 .467 0 .7-.09.879a.833.833 0 01-.365.364c-.178.09-.412.09-.878.09z"
      stroke={color}
      strokeWidth={1.22}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
