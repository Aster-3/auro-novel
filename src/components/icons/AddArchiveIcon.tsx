import Svg, { Path } from "react-native-svg";

export const AddArchiveIcon = ({
  color = "#030937",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M2.5 15c0-5.893 0-8.84 1.83-10.67 1.552-1.55 3.904-1.788 8.17-1.824M27.5 15c0-5.893 0-8.84-1.83-10.67-1.552-1.55-3.904-1.788-8.17-1.824"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M12.5 27.5c-3.5 0-5.25 0-6.587-.681a6.25 6.25 0 01-2.732-2.732C2.5 22.75 2.5 21 2.5 17.5c0-3.5 0-5.25.681-6.587A6.25 6.25 0 015.913 8.18C7.25 7.5 9 7.5 12.5 7.5h5c3.5 0 5.25 0 6.587.681a6.25 6.25 0 012.732 2.732C27.5 12.249 27.5 14 27.5 17.5c0 3.5 0 5.25-.681 6.587a6.25 6.25 0 01-2.732 2.732C22.75 27.5 21 27.5 17.5 27.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M15 21.25v-7.5m0 0l3.125 3.125M15 13.75l-3.125 3.125"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
