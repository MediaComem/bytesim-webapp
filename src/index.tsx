import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { store } from "./app/store";
import { Provider } from "react-redux";

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
    brand: colorTheme
  },
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
