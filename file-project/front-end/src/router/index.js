/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-06 21:41:12
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-27 22:30:18
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue'
import New from '../views/New.vue'
import UploadFile from '../views/UploadFile.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'App',
    component: App,
  },
  {
    path: '/new',
    name: 'New',
    component: New,
  },
  {
    path: '/file',
    name: UploadFile,
    component: UploadFile,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
