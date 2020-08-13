
import Vue from 'vue'
import vueToastMessage from "@/whole/components/elastic/pop_up";

let ToastTem = Vue.extend(vueToastMessage)
let instance
let timer = null
let toastMessage = (options) => {
  if (!instance) {
    instance = new ToastTem()
    instance.vm = instance.$mount()
    document.body.appendChild(instance.vm.$el)
  }
  // console.log(options)
  if (timer) {
    clearTimeout(timer)
    timer = null
    instance.ifSuccess = 0
    instance.show = false
    instance.message = ''
  }
  let time = options.time || 2000
  instance.ifSuccess = options.i || 0 //i=0成功，i=1失败，i=2不展示图标
  if (typeof options === 'string') {
    instance.message = options
  } else if (typeof options === 'object') {
    let {message, time} = options
    instance.message = message
    time = time || 2000
  } else {
    return
  }
  instance.show = true
  timer = setTimeout(() => {
    instance.show = false
    instance.ifSuccess = 0
    clearTimeout(timer)
    timer = null
    instance.message = ''
  }, time)
}
// 关闭
toastMessage.close = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
    instance.show = false
    instance.ifSuccess = 0
    instance.message = ''
  }
}
toastMessage.install = (Vue) => {
  Vue.prototype.$toastMessage = toastMessage
}
export default toastMessage
