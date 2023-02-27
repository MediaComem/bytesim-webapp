import React from "react";

//INFO : need to launch yarn debug instead of yarn start
if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");

  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [[require("react-redux"), "useSelector"]],
  });
}
