import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './plugins/i18n'
import globalVariable from './assets/js/global_variable'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import preventReClick from './assets/js/preventReClick'
import filter from './assets/js/filter'

import Http from './axios/http'
import $PHP from './axios/http_php'
import './assets/css/swiper.css';
import './assets/css/base.css'
import 'vant/lib/index.css'
!function (a, b) { var c = a.documentElement, d = "orientationchange" in window ? "orientationchange" : "resize", e = function () { var a = c.clientWidth; a && (c.style.fontSize = (100 * (a / 750)>100?100:100 * (a / 750)) + "px") }; a.addEventListener && (b.addEventListener(d, e, !1), a.addEventListener("DOMContentLoaded", e, !1)) }(document, window);
if (globalVariable.getQueryString('lang')) localStorage.setItem('language_s', globalVariable.getQueryString('lang'))
Vue.config.productionTip = false


Vue.use(VueClipboard)
Vue.use(preventReClick)
Vue.use(filter)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/loader.png'),
  loading: require('./assets/img/loader.png'),
  attempt: 1
})

Vue.prototype.$HTTP = Http // 全局 java 接口
Vue.prototype.$PHP = $PHP  // 全局 php 接口
Vue.prototype.GLOBA = globalVariable

const VUE = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')


if (VUE.$route.path === '/home' && VUE.GLOBA.getQueryString('lang') == null) {
  VUE.$router.replace({
    query: {
      ...VUE.$route.query,
      lang: localStorage.getItem('language_s') || 'en'
    }
  })
}
router.beforeResolve((to, from, next) => {
  /*  
   自定义返回 历史记录管理
   VUE.GLOBA.history为全局对象 default: ['/home']
 */
  if (from.name == 'HomeCont' || from.path == '/') {
    VUE.GLOBA.history = []
  }
  let pushFlag = true
  for (let index = 0; index < VUE.GLOBA.history.length; index++) {
    if (VUE.GLOBA.history[index].name == from.name) {
      pushFlag = false
    }
  }
  if (pushFlag && from.name != 'Login') {
    VUE.GLOBA.history.push(from)
  }
  console.log(VUE.GLOBA.history)

  if (to.query.lang) {
    next();
  } else {
    next({
      path: to.path,
      query: {
        ...to.query,
        lang: from.query.lang || localStorage.getItem('language_s') || 'en'
      }
    })
  }
})

router.beforeEach((to, from, next) => {
  let getFlag = localStorage.getItem('Flag')// 获取用户登录成功后储存的登录标志
  // 如果登录标志存在且为isLogin，即用户已登录
  store.state.isLogin = getFlag === 'isLogin';
  // 设置vuex登录状态为已登录
  // 用户想进入需要登录的页面，则定向回登录界面
  if (to.meta.isLogin && !store.state.isLogin) {
    sessionStorage.setItem('fullPath', to.fullPath)
    next({
      path: '/account/login'
    })
    // 用户进入无需登录的界面，则跳转继续
  } else {
    next()
  }
})