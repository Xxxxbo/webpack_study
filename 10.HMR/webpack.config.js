/**
 * HMR：hot module replacement  模块热替换/热替换模块
 * 作用：一个模块发生变化 只会重新构建这一个模块  极大提升构建速度
 * 使用：在devServer中将hot置为true 就会开启HMR功能（只能在开发模式下使用）
 *
 * 样式文件：可以使用HMR功能  因为style-loader内部实现了HMR功能
 * js文件：默认不能使用HMR功能 --> 若要使用HMR功能  需要修改js代码 添加支持HMR功能的代码
 *    注意：HMR功能对js  只能处理非入口js文件的其他文件
 * html文件：默认不能使用HMR功能  同时会导致一个问题：html文件不能热更新了 （不需要HMR功能）
 *    解决：修改entry入口 将html文件引入
 */

// resolve用来拼接绝对路径的方法
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 开发模式 development  生产模式 production
  mode: 'development',
  // 入口
  entry: ['./src/js/index.js', './src/index.html'],
  // 输出
  output: {
    filename: 'js/build.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      // loader配置
      {
        // 处理less资源  从右往左 从下往上
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: ['sytle-loader', 'css-loader'],
      },
      {
        // 处理样式中图片资源  通过ESModule解析img资源 问题：默认处理不了html中的img图片
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024, // 8kb以下图片会经过base64处理
          name: '[hash:10].[ext]', // 重命名  取hash值前10位
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是conmonjs，
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          // 图片资源输出路径
          outputPath: 'images',
        },
      },
      {
        // 处理html中img资源  html中通过CommonJs处理img资源
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        // 处理其他资源 排除以上资源
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media',
        },
      },
    ],
  },
  plugins: [
    // html-webpack-plugin：默认会创建一个空的html文件，自动引入打包输出的所有资源（JS/CSS）
    // 需要有结构的HTML文件可以加一个template
    new HtmlWebpackPlugin({
      // 复制这个./src/index.html文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html',
    }),
  ],
  // 开发服务器devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：只会在内存中编译打包，不会有任何输出
  // 启动devServer指令：npx webpack-dev-server (因为是本地安装，启动使用npx)
  // webpack5 使用指令：npx webpack serve
  devServer: {
    // 需要运行的项目目录，项目构建后的路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gizp压缩
    compress: true,
    // 自动打开浏览器
    // open: true,
    // 端口号
    port: 3000,
    // 开启HMR功能
    hot: true,
  },
}
