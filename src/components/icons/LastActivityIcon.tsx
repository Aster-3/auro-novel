import Svg, { Path } from "react-native-svg";

export const LastActivityIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <Path
      d="M4.936 3.972l1.916 7.943c.104.43.706.452.842.032l1.9-5.905.341 1.222c.053.19.225.32.422.32h2.038a.438.438 0 000-.875h-1.707l-.644-2.305a.438.438 0 00-.838-.016l-1.868 5.809-1.956-8.112c-.107-.442-.733-.449-.849-.01L3.307 6.71H1.604a.437.437 0 100 .875h2.04a.437.437 0 00.423-.326l.87-3.286z"
      fill={color}
    />
  </Svg>
);
