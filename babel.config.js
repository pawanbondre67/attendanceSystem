module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-paper/babel',
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',
  ],
  // env: {
  //   production: {
  //     plugins: [
  //       'react-native-paper/babel',
  //       ['module:react-native-dotenv'],
  //       'react-native-reanimated/plugin',
  //     ],
  //   },
  // },
};
