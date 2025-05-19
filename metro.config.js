const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Don't exclude .ts files from the node_modules/expo directory
// But exclude TypeScript files from our own code
config.resolver = {
  ...config.resolver,
  sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
};

module.exports = withNativeWind(config, { input: './global.css' });