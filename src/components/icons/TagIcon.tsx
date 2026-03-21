import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const TagIcon = ({
  color = "#070000",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G
      clipPath="url(#clip0_118_1628)"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
    >
      <Path d="M10.758 3.152c-1.03-1.03-1.546-1.545-2.214-1.737-.668-.192-1.378-.028-2.798.3l-.819.189c-1.195.275-1.792.413-2.2.822-.41.41-.548 1.007-.823 2.201l-.19.819c-.327 1.42-.49 2.13-.299 2.798.192.668.707 1.184 1.737 2.214l1.22 1.22c1.793 1.792 2.689 2.689 3.803 2.689 1.114 0 2.01-.897 3.803-2.69 1.792-1.792 2.689-2.688 2.689-3.802 0-.895-.58-1.65-1.737-2.842M5.738 7.253a1.333 1.333 0 10-1.333-1.334M7.694 12.333l.667-.666m3.986-3.986L10 10.028" />
    </G>
    <Defs>
      <ClipPath id="clip0_118_1628">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
