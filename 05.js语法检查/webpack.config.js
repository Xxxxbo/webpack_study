const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      /**
       * 语法检查：eslint-loader  eslint
       * 注意：只检查自己写的源代码，不检查第三方库
       * 设置检查规则：在package.json中eslintConfig中配置
       * "eslintConfig": {
       *    "extends": "airbnb-base"
       *  }
       * airbnb -->  eslint-config-airbnb-base eslint eslint-plugin-import
       */
      {
        // 只检查js代码
        test: /\.js$/,
        // 排除第三方库
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}
