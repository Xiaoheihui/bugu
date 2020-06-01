// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import api from './api'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon/iconfont.css'
import moment from 'moment'

Vue.prototype.$moment = moment;//赋值使用

Vue.prototype.$axios = axios
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem("user") != undefined) {
      next()
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  }else{
    if (to.name === 'login') {
      if (localStorage.getItem("user") != undefined) {
        next({
          path: 'main',
          query: {redirect: to.fullPath}
        })
      }
    }
    next()
  }
}
)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
