import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const ScrollVerticalIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 0.00064,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G
      clipPath="url(#clip0_388_1138)"
      fill={color}
      stroke={color}
      strokeWidth="0.00064"
    >
      <Path d="M6.114 11.212l-.942.943L8 14.983l2.828-2.828-.942-.943L8 13.098l-1.886-1.886zM9.886 4.788l.942-.943L8 1.017 5.172 3.845l.942.943L8 2.902l1.886 1.886z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 6a2 2 0 110 4 2 2 0 010-4zm0 1.334a.667.667 0 110 1.333.667.667 0 010-1.333z"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_388_1138">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
