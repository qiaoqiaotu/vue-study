<!--
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-06 21:41:11
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-06 11:13:40
-->
<template>
  <div id="app">
    <div>
      <router-link to="/">传文件</router-link> |
      <router-link to="/new">写文章</router-link> |
      <router-link to="/vlist">虚拟列表</router-link> |
      <router-link to="/vrowstable">添加行表</router-link> |
      <router-link to="/vcolumntable">添加行表</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { uploadFileApi, checkFileApi } from './Axios/api'
import sparkMD5 from 'spark-md5'
const CHUNK_SIZE = 0.1 * 1024 * 1024
export default {}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
