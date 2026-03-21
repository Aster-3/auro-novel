import React from "react";
import Svg, { Path } from "react-native-svg";

export const HomeIcon = ({ color = "#03061E", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 12.2V13.73C2 17.63 2 19.58 3.17 20.79C4.34 22 6.23 22 10 22H14C17.77 22 19.66 22 20.83 20.79C22 19.58 22 17.63 22 13.73V12.2C22 9.92 22 8.77 21.48 7.82C20.96 6.87 20.01 6.29 18.12 5.11L16.12 3.87C14.11 2.62 13.11 2 12 2C10.89 2 9.89 2.62 7.88 3.87L5.88 5.11C3.99 6.29 3.04 6.87 2.52 7.82C2 8.77 2 9.92 2 12.2Z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M15 18H9" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
