/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-06 21:41:11
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-08-05 15:48:36
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import service from './axios'
Vue.prototype.$http = service
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
