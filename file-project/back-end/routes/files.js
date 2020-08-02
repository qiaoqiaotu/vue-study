/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-17 16:59:11
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-19 22:03:09
 */
const router = require('koa-router')()
router.prefix('/files')

const path = require('path')
router.post('/upload', async (ctx, next) => {
  ctx.body = {
    url: ctx.uploadpath,
  }
})
router.post('/checkfile', async (ctx, next) => {
  ctx.body = 'checkfile'
})

module.exports = router
