<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-08-05 16:14:20
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-05 16:21:05
-->
<template>
  <div>
    {{data}}
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>
<style scoped>
</style>