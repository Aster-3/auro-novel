import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const SaveButtonIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G
      clipPath="url(#clip0_318_1619)"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
    >
      <Path d="M5.667 8.333L7 9.667l3.333-3.334" strokeLinejoin="round" />
      <Path d="M14.667 8c0 3.143 0 4.714-.977 5.69-.976.977-2.547.977-5.69.977-3.143 0-4.714 0-5.69-.977-.977-.976-.977-2.547-.977-5.69 0-3.143 0-4.714.977-5.69.976-.977 2.547-.977 5.69-.977 3.143 0 4.714 0 5.69.977.65.649.867 1.561.94 3.023" />
    </G>
    <Defs>
      <ClipPath id="clip0_318_1619">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
