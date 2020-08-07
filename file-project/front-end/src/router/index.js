/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-06 21:41:12
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-06 11:15:06
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from '../App.vue'
import New from '../views/New.vue'
import UploadFile from '../views/UploadFile.vue'
import VList from '../views/VList.vue'
import VRowsTable from '../views/VRowsTable.vue'
import VColumnTable from '../views/VColumnTable.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'App',
  //   component: App,
  // },
  {
    path: '/new',
    name: 'New',
    component: New,
  },
  {
    path: '/',
    name: UploadFile,
    component: UploadFile,
  },
  {
    path: '/',
    name: UploadFile,
    component: UploadFile,
  },
  {
    path: '/vlist',
    name: VList,
    component: VList,
  },
  {
    path: '/vrowstable',
    name: VRowsTable,
    component: VRowsTable,
  },
  {
    path: '/vcolumntable',
    name: VColumnTable,
    component: VColumnTable,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
