import { View } from "react-native";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const LeafIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 1.2,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <View style={{ transform: [{ rotate: "90deg" }] }}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_415_1847)" stroke={color} strokeWidth={0.00064}>
        <Path d="M24 0H0v24h24V0z" />
        <Path
          d="M22.85 18.45c-2.3-3.85-8-7.7-11.1-8.1a1 1 0 00-1.1 1.3 1 1 0 00.85.65c1.4.25 3.8 1.5 5.95 3.2-1.8 1.7-4.5 2.45-6.7 1.8-3.85-1.1-5.8-6.05-7.2-10.15l3.8-.55c3.3-.6 6.15-1.1 8.05.2 1.9 1.3 2 2.5 2.3 4.15l1.3.9a.5.5 0 00.8-.45c-.3-2.35-1.05-4.7-3.25-6.2S10.6 4 7 4.6a40.3 40.3 0 01-4.85.65H1.5a.45.45 0 00-.45.65l.2.6c1.55 4.7 3.7 11.15 8.9 12.7.734.198 1.49.299 2.25.3a9.75 9.75 0 006.6-2.65 14.7 14.7 0 012.15 2.65.95.95 0 00.85.5 1.1 1.1 0 00.65-.2 1.05 1.05 0 00.2-1.35z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_415_1847">
          <Path fill="#fff" d="M0 0H24V24H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  </View>
);
