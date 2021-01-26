import '../css/index.css';

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4, 5, 6))

/**
 * 1. eslint不认识 window navigatior全局变量
 *    解决：修改package.json中eslintConfig配置
 *    "eslintConfig": {
 *      "extends": "airbnb-base",
 *      "env": {
 *        "browser": true  // 支持浏览器全局变量
 *      }
 *    },
 * 2. sw代码必须运行在服务器上
 *    --> node.js
 *    --> npm i serve -g
 *        serve -s build(目录名称) 启动服务器  将build目录下所有资源作为静态资源暴露出去
 */

// 注册serviceworker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(() => {
        console.log('serviceworker注册成功');
      })
      .catch(() => {
        console.log('serviceworker注册失败');
      });
  });
}
