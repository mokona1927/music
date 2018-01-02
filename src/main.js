import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

/* 懒加载 */
Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* 绑定在body上，处理dom300s延迟的点击 */
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
