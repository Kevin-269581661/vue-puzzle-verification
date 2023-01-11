'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
   proxyTable: {
    //   '/devURL/UCAPI/': {  //使用"/api"来代替
    //     target: 'http://192.168.1.177:8010/', //源地址
    //     changeOrigin: true, //改变源
    //     pathRewrite: {
    //       '^/devURL': '' //路径重写
    //     }
    //   },
    //   '/devURL/national/': {  //使用"/api"来代替
    //     target: 'http://192.168.1.177:8040/', //源地址
    //     changeOrigin: true, //改变源
    //     pathRewrite: {
    //       '^/devURL': '' //路径重写
    //     }
    //   },
    //   '/devURL/addsp/': {  //使用"/api"来代替
    //     target: 'http://192.168.1.106:8026/', //源地址
    //     changeOrigin: true, //改变源
    //     pathRewrite: {
    //       '^/devURL': '' //路径重写
    //     }
    //   },
    //   '/devURL/': {  //使用"/api"来代替
    //     target: 'https://test-qadn.qinlindmp.com/', //源地址
    //     changeOrigin: true, //改变源
    //     pathRewrite: {
    //       '^/devURL': '' //路径重写
    //     }
    //  }
    },
    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    host:'localhost',
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    grayEnv: require('./gray.env'),

    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    // productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    // devtool: '#source-map',
    productionSourceMap: false,
    devtool: '',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
