/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-17 16:40:40
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-17 17:43:38
 */
module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  outputDir: 'dist',
  assetsDir: 'public',
  indexPath: 'index.html',
  filenameHashing: true,
  devServer: {
    proxy: {
      '/files': {
        target: 'http://localhost:3000',
      },
    },
  },
}
