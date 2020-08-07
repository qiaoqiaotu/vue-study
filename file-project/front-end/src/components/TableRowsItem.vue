<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 16:14:20
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-06 10:59:46
-->
<template>
  <div class="table-rows">
    <div v-for="(item,index) in Object.keys(data)"
         :key="index"
         class="table-rows-item">

      <el-input v-if="item!=='width'"
                :style="{width:size+'px'}"
                :value="data[item]"></el-input>
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
    data: {
      type: Object,
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
  display: inline-block;
}
</style>