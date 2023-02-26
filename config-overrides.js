const { override, getBabelLoader } = require("customize-cra");

module.exports = override((config) => {
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
  return config;
});
