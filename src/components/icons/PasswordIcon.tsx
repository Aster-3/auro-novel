import Svg, { Path } from "react-native-svg";

export const PasswordIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9.45 15.4a.85.85 0 11-1.7 0 .85.85 0 011.7 0zM12.85 15.4a.85.85 0 11-1.7 0 .85.85 0 011.7 0zM16.25 15.4a.85.85 0 11-1.7 0 .85.85 0 011.7 0z"
      fill={color}
    />
    <Path
      d="M6.9 10.3V8.6c0-.29.024-.574.07-.85M17.1 10.3V8.6a5.1 5.1 0 00-8.925-3.373M11.15 20.5H8.6c-2.404 0-3.606 0-4.353-.747C3.5 19.006 3.5 17.804 3.5 15.4s0-3.606.747-4.353C4.994 10.3 6.196 10.3 8.6 10.3h6.8c2.404 0 3.606 0 4.353.747.747.747.747 1.949.747 4.353s0 3.606-.747 4.353c-.747.747-1.949.747-4.353.747h-.85"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
  </Svg>
);
