import axios from 'axios'
import service from './php/phpApi'
import qs from 'qs'


//是否web端 0：app; 1:web阿联酋；2：web沙特；
const web_app = process.env.VUE_APP_WEB
let b_url = ''
if(web_app == 1){
  b_url = process.env.VUE_APP_PHOTO
}else if(web_app == 2){
  b_url = process.env.VUE_APP_PHOTO1
}else{
  const country_i = JSON.parse(localStorage.getItem('country_i') || 2)
  b_url = country_i==1?process.env.VUE_APP_PHOTO:process.env.VUE_APP_PHOTO1
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
    config={}, // 配置参数
    isFormData // 是否是FormData 主要用于上传图片
  ) {
    let newParams = params || {}
    if(api.token && !newParams.token){
      let user = JSON.parse(localStorage.getItem('status') || '[]')
      newParams.token = user.token || ""
    }
    if (isFormData) {
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
      try {
        response = await instance[api.method](api.url + params, config)
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
  return config
}, (err) => {
  // 请求错误
  return err
})
// 响应拦截器
instance.interceptors.response.use(res => {
  // 请求成功
  return res.data
}, (error) => {
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
