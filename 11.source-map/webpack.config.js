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
  devtool: 'cheap-moudle-source-map',
  /**
   * source-map:一种提供源代码到构建后代码的映射的技术（如果源代码出错了  可以通过映射追踪到源代码错位）
   * 
   * 参数：[inline-|hidden-|eval-][nosources-][cheap-[cheap-module-]]source-map
   * 
   * source-map：外部
   *  错误代码准确信息 和 源代码的错误位置 (精确到列)
   * 
   * inline-source-map: 内联
   *  只生成一个内敛source-map
   *  错误代码准确信息 和 源代码的错误位置 (精确到列)
   * 
   * hidden-source-map: 外部
   *  错误代码准确信息 但是没有源代码的错误位置（为了隐藏源代码 防止源代码泄露） 只能提示到构建后代码的错误位置
   * 
   * eval-source-map: 内联 
   *  每个文件生成一个内敛source-map 都在eval函数中
   *  错误代码准确信息 和 源代码的错误位置 (精确到列)
   * 
   * nosources-source-map: 外部
   *  错误代码准确信息 没有任何源代码信息（为了隐藏源代码）
   * 
   * cheap-source-map：外部
   *  错误代码准确信息 和 源代码的错误位置 (精确到行)
   * 
   * cheap-moudle-source-map：外部
   *  错误代码准确信息 和 源代码的错误位置 (精确到行)
   *  moudle会加入loader的source-map
   * 
   * 内联和外部的区别：
   *  1. 外部生成了单独的文件 内联没有
   *  2. 内联构建速度更快
   * 
   * 开发/生产环境可做的选择：
   * 
   *  开发环境：速度快  调试更友好
   *    1. 速度快（eval>inline>cheap>...）
   *      i. eval-cheap-source-map
   *      ii. eval-source-map
   * 
   *    2. 调试更友好
   *      i. source-map
   *      ii. cheap-moudle-source-map
   *      iii. cheap-source-map
   *  最终得出两个最好的方案：eval-source-map(完整度高 内联速度快) 
   *                        eval-cheap-moudle-source-map(错误提示忽略列但包含其他信息 内联速度快)
   * 
   * 
   *  生产环境：源代码要不要隐藏  调试要不要更友好
   *    内联会让代码体积变大  所以生产环境不用内联
   * 
   *    隐藏源代码
   *      i. nosources-source-map 全部隐藏
   *      ii. hidden-source-map 只隐藏源代码  会提示构建后代码错误信息
   * 
   *  最终得出最好的两种方案 --> source-map（最完整） / cheap-module-souce-map（错误提示一整行忽略列）
   * 
   */
}
