<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 16:26:23
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-05 17:39:12
-->
<template>
  <div class="vlist">
    <el-button @click="addData">添加数据</el-button>
    <virtual-list class="virtual-list-demo"
                  :listData="listData" />
  </div>
</template>
<script>
import VirtualList from '../components/VirtualList'
export default {
  components: {
    VirtualList
  },
  data () {
    return {
      listData: []
    }
  },
  mounted () {
    this.listData = this.gen_bigdata()
  },
  methods: {
    gen_bigdata () {
      let list = []
      for (let index = 0; index < 100; index++) {
        list.push({
          id: index,
          content: `${index} - 数据可以是连续的值，比如声音、图像，称为模拟数据。`,
        })
      }
      return list
    },
    addData () {
      this.listData.push({
        id: Math.random(3) * 100,
        content: `${Math.random(3) * 100} - 新增数据`
      })
    }
  }
}
</script>
<style scoped>
.vlist {
  height: 100%;
  width: 100%;
  padding-top: 10px;
}

.virtual-list-demo {
  height: 500px;
  width: 80%;
  margin: 0 auto;
  margin-top: 10px;
  border: 1px solid sienna;
  overflow: auto;
}
.virtual-list-demo::-webkit-scrollbar {
  /* display: none; */
}
</style>