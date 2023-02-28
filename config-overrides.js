const { override, getBabelLoader } = require("customize-cra");

module.exports = override((config) => {
  // for now CRA overrides is only used in development mode for debugging purposes with wdyr
  if (process.env.NODE_ENV !== "development") return config;
  //@ts-ignore
  const options = getBabelLoader(config, false).options;

  const originalPreset = options.presets.find((preset) =>
    preset[0].includes("babel-preset-react-app")
  );
  if (originalPreset) {
    Object.assign(originalPreset[1], {
      development: true,
      importSource: "@welldone-software/why-did-you-render",
    });
  }

  // @ts-ignore
  config.resolve.alias = {
    // @ts-ignore
    ...config.resolve.alias,
    "react-redux":
      process.env.NODE_ENV === "development"
        ? "react-redux/dist/react-redux.js"
        : "react-redux/lib",
  };
  return config;
});
