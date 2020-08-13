import axios from 'axios'
import service from './java/javaApi'
import qs from 'qs'
import Toast from 'vant/lib/toast';
import 'vant/lib/toast/style';

const web_app = process.env.VUE_APP_WEB
let b_url = ''
if (web_app == 1) {
  b_url = process.env.VUE_APP_WEBUA
} else if (web_app == 2) {
  b_url = process.env.VUE_APP_WEBSA
} else {
  const country_i = JSON.parse(localStorage.getItem('country_i') || 2)
  b_url = country_i == 1 ? process.env.VUE_APP_DOMAIN : process.env.VUE_APP_SAUDI // 沙特正式
  // b_url = country_i==1?process.env.VUE_APP_DOMAIN:process.env.VUE_APP_TEST //沙特测试
}
let instance = axios.create({
  baseURL: b_url,
  timeout: 10 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
  // retry: 2,
  // retryDelay: 2000,
})
const Http = {}; // 包裹请求方法的容器

// service 循环遍历输出不同的请求方法
for (let key in service) {
  let api = service[key]; // url method
  // async 作用：避免进入回调地狱
  Http[key] = async function (
    params, // 请求参数 get：url，put，post，patch（data），delete：url
    config = {
      showLoading: true // 默认显示加载中弹窗
    }, // 配置参数
    isFormData // 是否是FormData 主要用于上传图片
  ) {
    let newParams = params || {}
    if(api.token && !newParams.token){
      let user = JSON.parse(localStorage.getItem('status') || '[]')
      newParams.token = user.token || ""
    }
    if (params && isFormData) {
      newParams = new FormData()
      for (let i in params) {
        newParams.append(i, params[i])
      }
    }else{
      newParams = qs.parse(newParams)
      newParams = qs.stringify(newParams)
    }
    // 不同请求的判断
    let response = {}; // 请求的返回值
    if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
      try {
        response = await instance[api.method](api.url, newParams, config)
      } catch (err) {
        response = err
      }
    } else if (api.method === 'delete' || api.method === 'get') {
      config.params = newParams
      try {
        response = await instance[api.method](api.url, config)
      } catch (err) {
        response = err
      }
    } else if (!api.method || api.method == ''){
      try {
        response = await instance.post(api.url, newParams, config)
      } catch (err) {
        response = err
      }
    }
    return response; // 返回响应值
  }
}

// 拦截器的添加
// 请求拦截器
instance.interceptors.request.use(config => {
  // 发起请求前做些什么
  if(config.showLoading){
    Toast.loading({
      className:'requestLoading',
      getContainer() {
        return document.getElementById('app');
      },
      icon: require('@/assets/img/loading_bg.gif'),
      // loadingType: 'spinner',
      mask: false,
      duration: 0, // 一直存在
      forbidClick: true, // 禁止点击
      // message: 'loading...'
    })
  }
  return config
}, (err) => {
  // 请求错误
  setTimeout(()=>{
    Toast.clear()
  },500)
  return err
})
// 响应拦截器
instance.interceptors.response.use(res => {
  // 请求成功
  Toast.clear()
  return res.data
}, (error) => {
  setTimeout(()=>{
    Toast.clear()
  },500)
  let if_Network = JSON.parse(sessionStorage.getItem('if_Network') || true)
  let config = error.config;
  if (!config || !config.retry) return error;
  if (if_Network) {
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) {
      return error;
    }
    config.__retryCount += 1;
    let backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1);
    });
    return backoff.then(function () {
      return instance(config);
    });
  } else {
    setTimeout(() => {
      if_rec = false
      is_tips = true
    }, 100000)
    if (is_tips) {
      Toast(Network)
      is_tips = false
    }
    if (if_rec) {
      let backoff = new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 1100);
      });
      return backoff.then(function () {
        return instance(config);
      });
    }
  }
})

export default Http
