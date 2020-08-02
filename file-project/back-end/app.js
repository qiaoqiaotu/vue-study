/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-17 16:14:51
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-19 15:47:37
 */

const Koa = require('koa')
const app = new Koa()
// 解决跨域问题
const cors = require('@koa/cors')
app.use(cors())

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
// 解析body
const koaBody = require('koa-body')

const index = require('./routes/index')
const users = require('./routes/users')
const files = require('./routes/files')

// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)

app.use(
  koaBody({
    multipart: true, //接收form表单数据
    formidable: {
      uploadDir: path.resolve(__dirname, 'public/upload'), //文件保存路径
      keepExtensions: true, //保持源文件的扩展
      onFileBegin: (name, file) => {
        console.log(file)
        // const chunksPath
        //文件保存之前的预处理
        // 最终要保存到的文件夹目录
        const dir = path.join(__dirname, `public/upload/${file.name}`)
        // console.log('DIR=', dir)
        // 检查文件夹是否存在如果不存在则新建文件夹
        // 重新覆盖 file.path 属性
        file.path = dir //保存文件名改为源文件的文件名，否则文件名随机
        app.context.uploadpath = file.name
      },
    },
  })
)

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/public/upload'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(files.routes(), files.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
