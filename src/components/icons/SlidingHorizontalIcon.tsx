import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const SlidingHorizontalIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 1.664,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G clipPath="url(#clip0_384_904)">
      <Path
        d="M14.471 7.529a.667.667 0 010 .942l-2.666 2.667a.667.667 0 01-.943-.943L13.057 8l-2.195-2.195a.666.666 0 11.943-.943l2.666 2.667zm-9.804 3.804a.666.666 0 00.471-1.138L2.943 8l2.195-2.195a.667.667 0 10-.943-.943L1.53 7.529a.667.667 0 000 .942l2.666 2.667a.667.667 0 00.472.195z"
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_384_904">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
