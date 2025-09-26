import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgComponent = (props: SvgProps) => (
  <Svg viewBox="0 -1 28 28" {...props}>
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M22 14H1a1 1 0 1 0 0 2h19.833C23.687 16 26 17.791 26 20s-1.709 4-6 4v2h2a6 6 0 0 0 0-12Zm-7.998 4H6a1 1 0 1 0 0 2h8a2 2 0 0 1 0 4v2a4 4 0 0 0 .002-8ZM9 8h12a1 1 0 1 0 0-2H9a1 1 0 1 0 0 2Zm-5 4h18a6 6 0 0 0 0-12v2c2.822.531 4 1.791 4 4s-2.313 4-5.167 4H4a1 1 0 1 0 0 2Z"
    />
  </Svg>
)
export default SvgComponent
