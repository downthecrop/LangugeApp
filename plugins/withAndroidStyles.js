
const { withAppBuildGradle, withStringsXml, withAndroidManifest } = require('@expo/config-plugins');

function withAndroidStyles(config) {
  return withStringsXml(config, (config) => {
    config.modResults = config.modResults.replace(
      /\s*<item name="android:windowOptOutEdgeToEdgeEnforcement" tools:targetApi="35">true<\/item>/g,
      ''
    );
    return config;
  });
}

module.exports = withAndroidStyles;
