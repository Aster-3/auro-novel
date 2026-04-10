import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const BonusIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G clipPath="url(#clip0_442_297)">
      <Path
        d="M21.6 12H2.4m19.2 0a1.6 1.6 0 001.6-1.6V8.8a1.6 1.6 0 00-1.6-1.6H2.4A1.6 1.6 0 00.8 8.8v1.6A1.6 1.6 0 002.4 12m19.2 0v8a3.2 3.2 0 01-3.2 3.2H5.6A3.2 3.2 0 012.4 20v-8M12 7.2V5.6m0 1.6H6.743A2.743 2.743 0 014 4.457V4A3.2 3.2 0 017.2.8 4.8 4.8 0 0112 5.6m0 1.6h5.257A2.743 2.743 0 0020 4.457V4A3.2 3.2 0 0016.8.8 4.8 4.8 0 0012 5.6m0 1.6v16"
        stroke={color}
        strokeWidth={1.52}
      />
    </G>
  </Svg>
);
