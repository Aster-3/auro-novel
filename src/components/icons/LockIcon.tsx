import Svg, { Path } from "react-native-svg";

export const LockIcon = ({
  color = "#1C274C",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 18a2 2 0 100-4 2 2 0 000 4z"
      stroke={color}
      strokeWidth={1.6}
    />
    <Path
      d="M6 10V8c0-.34.028-.675.083-1M18 10V8A6 6 0 007.5 4.031M11 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);
