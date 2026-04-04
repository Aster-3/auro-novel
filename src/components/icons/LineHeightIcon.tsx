import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const LineHeightIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 1.664,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#clip0_384_915)">
      <Path
        d="M4.471 2.195L5.886 3.61a.667.667 0 01-.943.943l-.276-.276v7.448l.276-.276a.667.667 0 11.943.942L4.47 13.805a.667.667 0 01-.942 0L2.114 12.39a.667.667 0 11.943-.942l.276.276V4.276l-.276.276a.667.667 0 01-.943-.943L3.53 2.195c.26-.26.682-.26.942 0zM13.333 12a.667.667 0 01.078 1.329l-.078.004H8a.667.667 0 01-.078-1.329L8 12h5.333zm0-4.667a.667.667 0 01.078 1.33l-.078.004H8a.667.667 0 01-.078-1.33L8 7.334h5.333zm0-4.666a.667.667 0 110 1.333H8a.667.667 0 110-1.333h5.333z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_384_915">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
