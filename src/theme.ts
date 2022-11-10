import { extendTheme } from "@chakra-ui/react";

export const colorTheme = {
  50: "#FFFBFF",
  100: "#fce9fc",
  200: "#f6bcf6",
  300: "#f08ff0",
  400: "#ea62ea",
  500: "#e435e4",
  600: "#ca1bca",
  700: "#9d159d",
  800: "#700f70",
  900: "#430943",
};

const theme = extendTheme({
  colors: {
    brand: colorTheme,
  },
});
export default theme;
