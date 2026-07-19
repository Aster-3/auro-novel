import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const AuthorIcon = ({
  color = "#070000",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12.5 1C5.837 1 1 5.416 1 11.5v1a.5.5 0 101 0v-1c0-1.103.897-2 2-2a7.74 7.74 0 006.848-4.122.5.5 0 00-.184-.663l-.359-.215H11a.5.5 0 00.429-.243l1.5-2.5A.5.5 0 0012.5 1zm-1.783 2.5H8.5a.5.5 0 00-.257.929l1.486.891A6.74 6.74 0 014 8.5c-.622 0-1.201.19-1.68.516 1.05-3.934 4.598-6.674 9.279-6.986l-.882 1.47z"
      fill={color}
    />
  </Svg>
);
