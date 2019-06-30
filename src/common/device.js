/** @format */

import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const isIphoneX =
  Platform.OS === "ios" &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (height === 812 || width === 812 || height === 896 || width == 896);

export default {
  isIphoneX,
  ToolbarHeight: isIphoneX ? 35 : 22,
};
