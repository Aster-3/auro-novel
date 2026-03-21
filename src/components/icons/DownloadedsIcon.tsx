import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const DownloadedsIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <G
      clipPath="url(#clip0_142_31)"
      stroke={color}
      strokeWidth={1.92}
      strokeMiterlimit={10}
    >
      <Path d="M18.95 21L14 25.95 9.05 21" />
      <Path d="M14 23.917v-9.334" strokeLinecap="square" />
      <Path d="M17.493 17.5H21a4.667 4.667 0 100-9.333 3.5 3.5 0 00-5.783-2.653A5.25 5.25 0 006.132 10.5h-.299a3.5 3.5 0 000 7H9.91" />
    </G>
    <Defs>
      <ClipPath id="clip0_142_31">
        <Path fill="#fff" d="M0 0H28V28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
