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
       * js兼容性处理：babel-loader @babel/core @babel/preset-env
       * 1.基本兼容性处理 --> @babel/preset-env
       *   问题：只能转换基本语法，如promise高级语法不能转换
       * 2.全部兼容性处理 --> @babel/polyfill 只需要在js文件中引入即可
       *   问题：只需要解决部分兼容性处理，但是将所有兼容性代码全部引入，体积太大
       * 3.按需加载 --> core-js
       * 
       * 采用1、3   由于2体积太大  使用第3种进行高级语法转换
       */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：只是babel做怎样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3,
                },
                // 指定具体做到哪个版本的浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '7',
                },
              },
            ],
          ],
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
