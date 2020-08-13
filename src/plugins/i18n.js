import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)


function getQueryString(name) {
  var reg = new RegExp("(^|/?|&)" + name + "=([^&]*)(&|$)", "i");
  var r = decodeURIComponent(location.href).substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}

let language_s = getQueryString('lang') || localStorage.getItem('language_s') || 'en'
export default new VueI18n({
  locale: language_s == 'en' ? 'en' : 'sa',
  fallbackLocale: 'en',
  messages: {
    'en': require('@/assets/languages/en.json'),
    'sa': require('@/assets/languages/sa.json')
  }
})
