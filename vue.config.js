process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
        contentScripts: {
          entries: {
            'content-script': 'src/content-scripts/content-script.js',
          },
        },
      },
    },
  },
  filenameHashing: false,
  chainWebpack: (webpackConfig) => {
    webpackConfig.module
      .rule('wasm')
      .test(/.wasm$/)
      .use('wasm-loader')
      .loader('wasm-loader');

    webpackConfig.merge({
      entry: {
        injected: ['./src/content-scripts/injected-script.js'],
      },
    });
  },
  configureWebpack: (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // eslint-disable-next-line no-param-reassign
    webpackConfig.optimization.splitChunks = false;
  },
};
