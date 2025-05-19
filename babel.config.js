module.exports = function (api) {
  api.cache(true);
  
  // Use the override config if it exists
  try {
    const overrideConfig = require('./babel.config.override');
    return overrideConfig(api);
  } catch (e) {
    // Fallback to the default config
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
    };
  }
};