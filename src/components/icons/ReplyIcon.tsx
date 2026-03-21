import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const ReplyIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <G clipPath="url(#clip0_220_91)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 16.25c-.73 0-1.435-.085-2.112-.23l-2.943 1.77.04-2.9C2.728 13.534 1.25 11.291 1.25 8.75c0-4.142 3.918-7.5 8.75-7.5s8.75 3.358 8.75 7.5c0 4.143-3.918 7.5-8.75 7.5zM10 0C4.478 0 0 3.918 0 8.75c0 2.762 1.466 5.221 3.75 6.824V20l4.38-2.658c.607.1 1.23.158 1.87.158 5.523 0 10-3.918 10-8.75S15.523 0 10 0zm4.375 6.875h-8.75a.625.625 0 000 1.25h8.75a.625.625 0 100-1.25zm-1.25 3.75h-6.25a.625.625 0 100 1.25h6.25a.625.625 0 100-1.25z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_220_91">
        <Path fill={color} d="M0 0H20V20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
