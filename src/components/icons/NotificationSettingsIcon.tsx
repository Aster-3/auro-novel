import Svg, { Path } from "react-native-svg";

export const NotificationSettingsIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M17.192 22.843c0 .354-.09.705-.267 1.032a2.771 2.771 0 01-.758.874c-.325.25-.711.449-1.136.585-.424.135-.88.205-1.339.205-.46 0-.914-.07-1.34-.206a3.709 3.709 0 01-1.134-.584 2.772 2.772 0 01-.759-.874 2.17 2.17 0 01-.266-1.032"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
    <Path
      d="M21.924 12.73c.116.973.385 1.924.8 2.818l.308.665c1.178 2.54-.355 5.509-3.108 6.017l-.187.035a33.251 33.251 0 01-12.09 0c-2.775-.513-4.243-3.584-2.9-6.066l.264-.488a9.121 9.121 0 001.099-4.34V9.829A6.837 6.837 0 019.9 3.708a8.827 8.827 0 016.464-.554"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
    <Path
      d="M20.837 9.96a2.917 2.917 0 100-5.833 2.917 2.917 0 000 5.833z"
      stroke={color}
      strokeWidth={1.92}
    />
  </Svg>
);
