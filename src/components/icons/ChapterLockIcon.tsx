import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const ChapterLockIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 1.5,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <G clipPath="url(#clip0_419_1949)" stroke={color} strokeWidth={strokeWidth}>
      <Path d="M1.667 13.334c0-2.357 0-3.536.732-4.268.732-.732 1.91-.732 4.268-.732h6.666c2.357 0 3.536 0 4.268.732.732.732.732 1.91.732 4.268 0 2.357 0 3.535-.732 4.267-.732.733-1.91.733-4.268.733H6.667c-2.357 0-3.536 0-4.268-.733-.732-.732-.732-1.91-.732-4.267z" />
      <Path
        d="M10 11.667V15M5 8.333V6.667a5 5 0 1110 0v1.666"
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_419_1949">
        <Path fill="#fff" d="M0 0H20V20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
