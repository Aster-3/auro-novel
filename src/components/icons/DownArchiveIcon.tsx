import Svg, { Path } from "react-native-svg";

export const DownArchiveIcon = ({
  color = "#030937",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M25.625 8.75v7.5c0 4.714 0 7.071-1.465 8.535-1.464 1.465-3.821 1.465-8.535 1.465h-1.25m-10-17.5v7.5c0 4.714 0 7.071 1.464 8.535.881.881 2.085 1.232 3.931 1.372M15 3.75H5c-1.179 0-1.768 0-2.134.366-.366.366-.366.955-.366 2.134 0 1.179 0 1.768.366 2.134.366.366.955.366 2.134.366h20c1.178 0 1.768 0 2.134-.366.366-.366.366-.955.366-2.134 0-1.179 0-1.768-.366-2.134-.366-.366-.956-.366-2.134-.366h-5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M15 8.75V20m0 0l3.75-4.167M15 20l-3.75-4.167"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
