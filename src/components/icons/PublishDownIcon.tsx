import Svg, { Path } from "react-native-svg";

export const PublishDownIcon = ({
  color = "#030937",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.6l-6.4-6.4m6.4 6.4l6.4-6.4M12 21.6V4.8m10.4-2.4H1.6"
      stroke={color}
      strokeWidth={1.92}
    />
  </Svg>
);
