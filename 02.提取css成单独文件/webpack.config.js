const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件
const { resolve } = require('path') // resolve用来拼接绝对路径的方法

// 可以提取css为单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'js/build.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        // 处理less资源
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: [
          // 创建style标签，将样式放入
          // 'style-loader',

          // 这个loader取代style-loader，作用：提取js中的css为单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件整合到js中
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css',
    }),
  ],
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    // open: true,
  },
}
