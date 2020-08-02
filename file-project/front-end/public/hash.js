/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-19 09:57:55
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-20 11:03:26
 */

// debugger
// console.log('sss')
// // 引入 spark-md5
self.importScripts('spark-md5.min.js')
self.onmessage = (e) => {
  // 接收主线程传递的数据
  const { chunks } = e.data
  const spark = new self.SparkMD5.ArrayBuffer()
  let progress = 0
  let count = 0
  const loadNext = (index) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(chunks[index].file)
    reader.onload = (e) => {
      count++
      spark.append(e.target.result)
      if (count === chunks.length) {
        self.postMessage({
          progress: 100,
          hash: spark.end(),
        })
      } else {
        self.postMessage({
          progress: progress + 100 / chunks.length,
        })
        loadNext(count)
      }
    }
  }
  loadNext(0)
}
