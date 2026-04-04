import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const ScrollHorizontalIcon = ({
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
      clipPath="url(#clip0_388_1144)"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
    >
      <Path d="M4.788 6.114l-.943-.942L1.017 8l2.828 2.829.943-.943L2.902 8l1.886-1.886zM11.212 9.886l.943.943L14.983 8l-2.828-2.828-.943.942L13.098 8l-1.886 1.886z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 8a2 2 0 11-4 0 2 2 0 014 0zM8.667 8a.667.667 0 11-1.334 0 .667.667 0 011.334 0z"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_388_1144">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
