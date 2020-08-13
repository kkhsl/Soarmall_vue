import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const ENV = process.env.VUE_APP_WEB;
localStorage.setItem('web_app', ENV)

let initCountry = null;
try {
  if(localStorage.getItem("country_i")){
    initCountry = localStorage.getItem("country_i");
  }else{
    initCountry = ENV == 0 ? 2 : ENV; //国家只有1阿联酋 2沙特  APP的时候默认沙特2
    localStorage.setItem("country_i", initCountry)
  }
} catch (error) {}
// 先从本地存储中，把数据读出来，放到 store 中
let status = JSON.parse(localStorage.getItem('status') || '[]')//用户个人信息
console.log(initCountry)
let country_i = initCountry //国家
let navList = JSON.parse(localStorage.getItem('navList') || '[]')//商品分类

// let gwcjs = JSON.parse(sessionStorage.getItem('gwcjs') || '[]')
let adde = JSON.parse(sessionStorage.getItem('adde') || '[]')
export default new Vuex.Store({ 
  state: {
    coup_draw:{},
    isLogin: false,
    status: status,//用户个人信息
    buyNowOrderInfo: '', // 订单商品
    adde: adde, // 订单地址
    country_i:country_i,//国家切换
    
    navList:navList,//类目二级
    hover_btn:false,//活动按钮
    click:"",
    searchs:"",
  },
  mutations: {
    hover_btn(state,if_length){//活动商品浮动按钮
      state.hover_btn = if_length
    },
    //国家切换
    country_id(state,id){
      state.country_i = id
      localStorage.setItem('country_i', JSON.stringify(state.country_i))
    },
    // 注册送优惠券和抽奖次数
    coup_draw(state, coup_draw) {
      state.coup_draw = coup_draw
    },
    // 用户账号/密码
    Login (state, account) {
      state.status = account
      localStorage.setItem('status', JSON.stringify(state.status))
    },
    logout (state, accountout) {
      state.status = accountout
      localStorage.setItem('status', JSON.stringify(state.status))
      localStorage.removeItem('state.status')
    },
    childList (state, navList) {
      state.navList = navList
      localStorage.setItem('navList', JSON.stringify(state.navList))
      localStorage.removeItem('state.navList')
    },
    // 保存登录状态
    userStatus (state, flag) {
      state.isLogin = flag
    },
    // 购物车提交订单/售后服务
    submitBuyNow (state, pays) {
      state.buyNowOrderInfo = pays
    },
    to_adders (state, adde) {
      state.adde = adde
      sessionStorage.setItem('adde', JSON.stringify(state.adde))
      sessionStorage.removeItem('state.adde')
    },
    click (state, click) {
      state.click = click
    },
    searchs (state, hot) {
      state.searchs = hot
    },
  },
  actions: {
     // 获取登录状态
     userLogin ({ commit }, flag) {
      commit('userStatus', flag)
    }
  },
  modules: {
  },
  getters: { // this.$store.getters.***
    // 获取登录状态
    isLogin: state => state.isLogin
    // 获取订单详情页ID
    // update_details_goodsid: state => state.update_details_goodsid
  },
})