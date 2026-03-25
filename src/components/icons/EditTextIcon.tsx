import Svg, { Path } from "react-native-svg";

export const EditTextIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 14a1 1 0 01-1-1V7a1 1 0 011-1 1 1 0 000-2H2a2 2 0 00-2 2v8a2 2 0 002 2h1a1 1 0 000-2zM18 4h-7a1 1 0 000 2h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 000 2h7a2 2 0 002-2V6a2 2 0 00-2-2zm-8 15a1 1 0 01-1 1H5a1 1 0 010-2h1V2H5a1 1 0 010-2h4a1 1 0 010 2H8v16h1a1 1 0 011 1z"
      fill={color}
    />
  </Svg>
);
