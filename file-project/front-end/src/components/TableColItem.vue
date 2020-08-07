<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 16:14:20
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-06 13:38:13
-->
<template>
  <div class="table-cols"
       :style="{width:size+'px'}">
    <div v-for="(data,index) in tableData"
         :key="index">
      <div v-for="item in data"
           :key="item.name">
        <el-input v-if="item!=='width'"
                  :style="{width:item.width+'px'}"
                  :value="item.name" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: Number,
      default: 200
    },
    tableData: {
      type: Array,
      default: () => { }
    }
  },
  mounted () {

  }
}
</script>
<style scoped>
.table-rows {
  margin: 5px 0 5px 0;
  border: 1px solid blueviolet;
}
.table-rows-item {
  /* display: inline-block; */
}
</style>