const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'), // Loại bỏ svg khỏi assetExts
      sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'], // Thêm svg vào sourceExts
    },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
