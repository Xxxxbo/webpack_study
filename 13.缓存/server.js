/**
 * 服务器代码
 * 启动服务器指令：
 * 1.nodemon server.js
 *  npm i nodemon -g
 * 2.node server.js
 * 
 * 访问服务器地址：http://localhost:3000/
 */

const express = require('express')

const app = express()

app.use(express.static('build', { maxAge: 1000 * 3600 }))

app.listen(3000)
