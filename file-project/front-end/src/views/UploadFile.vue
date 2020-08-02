<template>
  <div>
    <div>
      <div ref="drag" id="drag" :style="dragOverObj">
        <input type="file" name="file" @change="handleFileChange" />
      </div>
      <div>
        <label>文件上传的进度：</label>
        <el-progress
          :stroke-width="20"
          :text-inside="true"
          :percentage="uploadProgress"
        ></el-progress>
      </div>
      <el-button @click="uploadFile">上传</el-button>

      <div>
        <label>计算 hash 的进度：</label>
        <el-progress
          :stroke-width="20"
          :text-inside="true"
          :percentage="hashProgress"
        ></el-progress>
      </div>

      <div class="cube-container" :style="{ width: cubeWidth + 'px' }">
        <div class="cube" v-for="chunk in chunks" :key="chunk.name">
          <div
            :class="{
              uploading: chunk.progress > 0 && chunk.progress < 100,
              error: chunk.progress < 0,
              success: chunk.progress === 100,
            }"
            :style="{ height: chunk.progress + 'px' }"
          >
            <i
              class="el-icon-loading"
              style="color:#f56c6c"
              v-if="chunk.progress > 0 && chunk.progress < 100"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      dragOverObj: {
        borderColor: '',
      },
      hashProgress: 0,
      chunks: [],
      hash: '',
    }
  },
  computed: {
    cubeWidth() {
      return Math.floor(Math.sqrt(this.chunks.length)) * 16
    },
    uploadProgress() {
      if (!this.file || this.chunks.length) {
        return 0
      }
      const load = this.chunks
        .map((item) => item.chunk.size * item.progress)
        .reduce((prev, cur) => prev + cur, 0)
      return Number(((load * 100) / this.file.size).toFixed(2))
    },
  },
  mounted() {
    this.bindDragEvent()
  },
  methods: {
    bindDragEvent() {
      const drag = this.$refs.drag
      drag.addEventListener('dragover', (e) => {
        this.dragOverObj.borderColor = 'red'
        e.preventDefault()
      })
      drag.addEventListener('dragleave', (e) => {
        this.dragOverObj.borderColor = '#eeeeee'
        e.preventDefault()
      })
      drag.addEventListener('drop', (e) => {
        e.preventDefault()
        const fileList = e.dataTransfer.files
        this.file = fileList[0]
        console.log(this.file)
      })
    },
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = []
      let cur = 0
      while (cur < file.size) {
        chunks.push({ index: cur, file: file.slice(cur, cur + size) })
        cur += size
      }
      return chunks
    },
    async calculateFileHashWorker(chunks) {
      return new Promise((resolve) => {
        this.worker = new Worker(`/hash.js`)
        this.worker.postMessage({ chunks })
        this.worker.onmessage = (e) => {
          const { progress, hash } = e.data
          this.hashProgress = Number(progress.toFixed(2))
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    // 利用时间切片来计算 md5
    async calculateFileHashIdle(chunks) {
      return new Promise((resolve) => {
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0
        const appendToApark = async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = (e) => {
              spark.append(e.target.result)
              resolve()
            }
          })
        }
        let workLoop = async (deadline) => {
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            // 空闲时间，且有任务
            await appendToApark(chunks[count].file)
            count++
            if (count < chunks.length) {
              this.hashProgress = Number(
                ((100 * count) / chunks.length).toFixed(2)
              )
            } else {
              this.hashProgress = 100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(workLoop)
        }
        window.requestIdleCallback(workLoop)
      })
    },
    async calculateFileHashSample() {
      return new Promise((resolve) => {
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()
        const file = this.file
        const size = this.file.size
        const offset = 2 * 1024 * 1024
        // 第一个 2M，最后一个 2M，中间的前中后各 2个字节
        let chunks = [file.slice(0, offset)]
        let cur = offset
        while (cur < size) {
          if (cur + offset >= size) {
            // 最后一个区块
            chunks.push(file.slice(cur, cur + offset))
          } else {
            // 中间的区块
            const middle = (cur + offset) / 2
            const end = cur + offset
            chunks.push(file.slice(cur, cur + 2))
            chunks.push(file.slice(middle, middle + 2))
            chunks.push(file.slice(end - 2, end))
          }
          cur += offset
        }
        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = (e) => {
          spark.append(e.target.result)
          this.hashProgress = 100
          resolve(spark.end())
        }
      })
    },
    async uploadChunks(uploadedList) {
      // .filter(chunk=>uploadedList.indexOf(chunk.name)===-1) // 将已经上传的chunk过滤
      const requests = this.chunks
        .map((chunk, index) => {
          const { chunk_file, hash, name } = chunk
          const formData = new FormData()
          formData.append('chunk', chunk_file)
          formData.append('hash', hash)
          formData.append('name', name)
          return { formData, index: chunk.index, error: 0 }
        })
        .map(({ formData, index }) => {
          const config = {
            onUploadProgress: (progressEvent) => {
              // 这里不是整体的进度条，而是每个区块的进度条，整体的进度条需要计算出来
              this.chunks[index].progress =
                (progressEvent.loaded / progressEvent.total).toFixed(2) * 100
            },
          }
          return uploadFileApi(formData, config)
        })
      // @todo 并发量控制
      this.sendRequest(requests)
      // await Promise.all(requests)
    },
    /**
     * @description:
     * 1.并发量控制
     * 2.上传可能会出错：出错后，进度条变红，整体全部终止
     * 3.一个切片重试三次，整体全部终止
     * @param {type}
     * @return:
     * @author: WangQiaoLing
     */
    async sendRequest(chunks, limit = 4) {
      return new Promise((resolve, reject) => {
        const len = chunks.length
        let count = 0
        // 添加一个标识
        let isStop = false
        const start = async () => {
          if (isStop) {
            return
          }
          // 取一个任务出来
          const task = chunks.shift()
          if (task) {
            // 获取 formData 信息
            const { formData, index } = task
            try {
              // 上传 formData
              await uploadFileApi(formData, {
                onUploadProgress: (progressEvent) => {
                  // 这里不是整体的进度条，而是每个区块的进度条，整体的进度条需要计算出来
                  this.chunks[index].progress =
                    (progressEvent.loaded / progressEvent.total).toFixed(2) *
                    100
                },
              })
              if (count === len - 1) {
                // 最后一个任务
                resolve()
              } else {
                count++
                // 启动下一个任务
                start()
              }
            } catch (error) {
              // 进度条变红色处理
              this.chunks[index].progress = -1
              if (task.error < 3) {
                task.error++
                chunk.unshift()
                start()
              } else {
                // 错误三次直接结束
                isStop = true
                reject()
              }
            }
          }
        }
        while (limit > 0) {
          start()
          limit -= 1
        }
      })
    },
    async uploadFile() {
      // this.uploadProgress = 0
      // this.hashProgress = 0

      // 判断图片上传的格式
      // if (!(await this.isImage(this.file))) {
      //   console.log('文件格式不对')
      //   return
      // }
      console.log('文件格式正确')
      /**
       * 文件断点续传：
       * 1.文件切片
       * 2.使用 web-worker 计算文件的 md5 值 spark-md5
       */
      this.chunks = this.createFileChunk(this.file) // 文件切片
      this.hash = await this.calculateFileHashSample() // 计算文件的 hash 值
      // 询问后端，文件是否上传过，如果没有，是否有存在的切片
      const { uploaded, uploadedList } = await checkFileApi({
        hash: this.hash,
        ext: this.file.name.split('.').pop(),
      })
      if (uploaded) {
        console.log('秒传成功')
      }
      // 处理切片
      this.chunks = this.chunks.map((chunk, index) => {
        return {
          index,
          name: `${this.hash}-${index}`,
          hash: this.hash,
          chunk_file: chunk.file,
        }
      })
      // console.log(this.chunks)
      await this.uploadChunks(uploadedList)
      // console.log('chunks=', chunks)
      // const hash = await this.calculateFileHashWorker(chunks)
      // const hash1 = await this.calculateFileHashIdle(chunks)
      // const hash2 = await this.calculateFileHashSample()
      // console.log('文件 hash：', hash)
      // console.log('文件 hash1：', hash1)
      // console.log('文件 hash2：', hash2)
      /**
       * 抽样 hash
       * 布隆过滤器
       */
      // const formData = new FormData()
      // formData.append('name', 'file')
      // formData.append('files', this.file)
      // const config = {
      //   onUploadProgress: (progressEvent) => {
      //     // 计算进度条的值
      //     this.uploadProgress =
      //       (progressEvent.loaded / progressEvent.total).toFixed(2) * 100
      //   },
      // }
      // uploadFileApi(formData, config).then((data) => {
      //   console.log(data)
      // })
    },
    async blobToString(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = function() {
          const res = reader.result
            .split('')
            .map((v) => v.charCodeAt())
            .map((v) => v.toString(16).toUpperCase())
            .map((v) => v.padStart(2, '0'))
            .join(' ')
          resolve(res)
        }
        reader.readAsBinaryString(blob)
      })
    },
    async isPng(file) {
      // 取前六位
      const res = await this.blobToString(file.slice(0, 8))
      return res === '89 50 4E 47 0D 0A 1A 0A'
    },
    async isJpg(file) {
      const len = file.size
      // 取前2位
      const start = await this.blobToString(file.slice(0, 2))
      const tail = await this.blobToString(file.slice(-2, len))
      return start === 'FF 08' && tail === 'FF D9'
    },
    async isGif(file) {
      // GIF89a 和 GIF87a
      // 前面 6 个 16 进制，'47 49 46 38 39 61' '47 49 46 38 37 61'
      const res = await this.blobToString(file.slice(0, 6))
      console.log('res = ', res)
      const isGif = res === '47 49 46 38 39 61' || res === '47 49 46 38 37 61'
      console.log('isGif = ', isGif)
      return isGif
    },
    async isImage(file) {
      return (await this.isGif(file)) || (await this.isPng(file))
    },
    handleFileChange(e) {
      const [file] = e.target.files
      if (!file) return
      this.file = file
      console.log(this.file)
    },
  },
}
</script>

<style scoped>
#drag {
  height: 100px;
  border: 1px dashed #eeeeee;
  margin: 0 auto;
  line-height: 100px;
  text-align: center;
}
.dragover {
  border: 1px dashed red;
}
.dragleave {
  border: 1px dashed #eeeeee;
}
.cube-container {
  overflow: hidden;
}
.cube {
  width: 14px;
  height: 14px;
  line-height: 12px;
  border: 1px green solid;
  background-color: #eee;
  float: left;
}
.success {
  background: greenyellow;
}
.uploading {
  background: hotpink;
}
.error {
  background: red;
}
</style>
