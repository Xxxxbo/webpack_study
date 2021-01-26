const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件
const { resolve } = require('path') // resolve用来拼接绝对路径的方法

// 可以提取css为单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 定义node环境变量，决定browerslist用哪个环境
process.env.NODE_ENV = 'development'

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
          MiniCssExtractPlugin.loader,
          'css-loader',
          /*
            css兼容性处理：需要使用postcss库 使用postcss库需要安装postcss-loader postcss-preset-env

            插件postcss-preset-env帮postcss找到package.json中browserslist里面的配置 通过配置加载指定的css兼容性样式
            postcss需要通过package.json中browserslist里面的配置加载指定的css兼容性样式
            // 默认是生产环境
            "browserslist": {
              // 开发环境：--> 设置node环境变量：process.env.NODE_ENV = 'development'
              "development": [
                // last 1 chrome version  兼容最近一个版本的chrome
                "last 1 chrome version",
                "last 1 firefox version",
                "last 1 safari version"
              ],
              // 生产环境：-->
              // 需要兼容大多数浏览器
              "production": [
                ">0.2%",
                "not dead",
                "not op_mini all"
              ]
            }

            有两种写法
          */
          // 第一种：使用 loader的默认配置 或将postcss-loader的配置抽离出来  作为单独的文件 postcss.config.js
          // 加载程序自动搜索配置文件。
          // 'postcss-loader',

          // 第二种：修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // 或者将插件引入写在单独的配置js中
                // config: './postcss.config.js',
                plugins: [['postcss-preset-env', {}]],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
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
