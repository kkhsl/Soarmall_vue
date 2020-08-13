let getQueryString = function (name) {
  var reg = new RegExp("(^|/?|&)" + name + "=([^&]*)(&|$)", "i");
  var r = decodeURIComponent(location.href).substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}



// 1阿联酋，2沙特
let tag = JSON.parse(localStorage.getItem('country_i') || 2)
let lang = getQueryString('lang') || localStorage.getItem('language_s') || 'en'
//语言切换
let en = ""
if (lang === 'sa') {
  require('@/assets/css/aw.css')
  en = "_a"
} else {
  require('@/assets/css/en.css')
  en = ""
}
//系统切换
let u = navigator.userAgent;
let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
let ai = ""
if (isiOS) {
  localStorage.setItem('Android_iOS', 0)
} else {
  localStorage.setItem('Android_iOS', 1)
}
const web_app = process.env.VUE_APP_WEB
if (web_app == 1 || web_app == 2) {
  require('@/assets/css/web.css')
  ai = "_w"
} else {
  if (isiOS) {
    require('@/assets/css/ios.css')
    ai = "_i"
  } else {
    require('@/assets/css/android.css')
    ai = ""
  }
}


export default {
  isApp: process.env.VUE_APP_WEB == 0,
  isRotate: lang === 'sa',
  isIos: isiOS,
  history: [],
  getQueryString,
  //国家互换
  money_tag: tag == 1 ? "AED" : "SAR",
  phone_tag: tag == 1 ? "971" : "966",
  loading: require('../img/loader.png'),//懒加载图
  // money_tag1(i){
  //     localStorage.setItem("money",i); 
  // },
  // 语言互换
  mar_l: "mar_l" + en,
  may_lo: "may_lo" + en,
  // fs:"fs" + en,
  tck: "tck" + en,
  gc1: "gc1" + en,
  marg_: "marg_" + en,
  marg1: "marg1" + en,
  marg: "marg" + en,
  // marg001:"marg001" + en,
  marg5: "marg5" + en,
  marg32: "marg32" + en,
  rotateY: "rotateY" + en,
  florat_r: "florat_r" + en,

  //系统切换
  position: "position" + ai,
  search: "search" + ai,
  to_scroll: "to_scroll" + ai,
  wrapper: "wrapper" + ai,
  to_remove: "to_remove" + ai,
  top_search: "top_search" + ai,
  height_hear: "height_hear" + ai,
  padding_hear: "padding_hear" + ai,
  height_detail: "height_detail" + ai,
  top_hear: "top_hear" + ai,
  top_login: "top_login" + ai,
  height_foot: "height_foot" + ai,
  height_foot1: "height_foot1" + ai,
  height_foot2: "height_foot2" + ai,
  top_order_hear: "top_order_hear" + ai,
  content_center: "content_center" + ai,
  tabbar1: "tabbar1" + ai,
  padd_bot: "padd_bot" + ai,

}

