import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const ContinueIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 31 31" fill="none">
    <Path
      d="M24.92 9.042l-2.773-2.773a.646.646 0 01.914-.913l3.875 3.875a.646.646 0 010 .913L23.06 14.02a.646.646 0 01-.913-.913l2.772-2.773H7.104c-1.07 0-1.937.868-1.937 1.938v7.75c0 1.07.867 1.937 1.937 1.937h6.458a.646.646 0 110 1.292H7.104a3.23 3.23 0 01-3.229-3.23v-7.75a3.23 3.23 0 013.23-3.228H24.92z"
      fill={color}
      stroke={color}
      strokeWidth={0.704}
    />
  </Svg>
);
