import { Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");
export const navBarHeight = 50
export const screenWidth = width
export const screenHeight = height

//BOOKING Category
export const BOOKING_UPCOMING = "Upcoming"
export const BOOKING_COMPLETED = "Completed"
export const BOOKING_CANCELLED = "Cancelled"
export const BOOKING_OTHER = "Other"