module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
    plugins: [
      [
        "module-resolver",
        {
          alias: [
            {
              "@preact/signals-react": "@preact-signals/safe-react",
            },
          ],
        },
      ],
      "module:@preact-signals/safe-react/babel",
    ],
  };
};
