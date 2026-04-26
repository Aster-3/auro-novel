import Svg, { Path } from "react-native-svg";

export const ShowLibraryIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M18.75 15A3.746 3.746 0 0115 18.75 3.746 3.746 0 0111.25 15 3.746 3.746 0 0115 11.25 3.746 3.746 0 0118.75 15z"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 24.087c4.413 0 8.525-2.285 11.388-6.242 1.125-1.55 1.125-4.154 0-5.703C23.525 8.186 19.413 5.9 15 5.9c-4.412 0-8.525 2.286-11.387 6.242-1.125 1.55-1.125 4.154 0 5.703 2.862 3.957 6.974 6.242 11.387 6.242z"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
