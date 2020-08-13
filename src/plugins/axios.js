"use strict";

import Vue from 'vue';
import axios from "axios";
import qs from 'qs'
import Toast from '@/assets/js/pop_up'
let getQueryString = function (name) {
  var reg = new RegExp("(^|/?|&)" + name + "=([^&]*)(&|$)", "i");
  var r = decodeURIComponent(location.href).substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}

let if_rec = true
let is_tips = true

//是否web端 0：app; 1:web阿联酋；2：web沙特；
const web_app = process.env.VUE_APP_WEB
localStorage.setItem('web_app', web_app)
let b_url = ''
if(web_app == 1){
  localStorage.setItem("country_i",web_app)
  b_url = process.env.VUE_APP_WEBUA  //VUE_APP_WEBUA
}else if(web_app == 2){
  localStorage.setItem("country_i",web_app)
  b_url = process.env.VUE_APP_WEBSA
}else{
  const country_i = JSON.parse(localStorage.getItem('country_i') || 1)
  b_url = country_i==1?process.env.VUE_APP_DOMAIN:process.env.VUE_APP_SAUDI // 沙特正式
  // b_url = country_i==1?process.env.VUE_APP_DOMAIN:process.env.VUE_APP_TEST //沙特测试
}
let language_s = getQueryString('lang') || localStorage.getItem('language_s') || 'en'
let Network = language_s=='en'?"Network disconnected":""

let config = {
  baseURL: b_url,
  timeout: 60 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
  method: 'post',
  retry:2,
  retryDelay:1000
  // onUploadProgress: function (progressEvent) {//上传进度
  //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
  //   console.log(complete) 
  // },
  // onDownloadProgress: function (progressEvent) {//下载进度
  //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
  //   console.log(complete) 
  // },
};

console.log(web_app,b_url,config)

const _axios = axios.create(config);
// 添加请求拦截器
_axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    let data = qs.parse(config.data)
    config.data = qs.stringify(data)
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
_axios.interceptors.response.use(
  function(response) {
    is_tips = true
   // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    console.log(error)
    // if(!error.response){
    //   
    // }
    let if_Network = JSON.parse(sessionStorage.getItem('if_Network') || true)
    let config = error.config;
    if(!config || !config.retry) return Promise.reject(error);
    if(if_Network){
      config.__retryCount = config.__retryCount || 0;
      if(config.__retryCount >= config.retry) {
        return Promise.reject(error);
      }
      config.__retryCount += 1;
      let backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
      });
      return backoff.then(function() {
        return _axios(config);
      });
    }else{
      setTimeout(()=>{
        if_rec = false
        is_tips = true
      },100000)
      if(is_tips){
        Toast({message:Network,time: 3000, i: 1})
        is_tips = false
      }
      if(if_rec){
        let backoff = new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          }, 1100); 
        });
        return backoff.then(function() {
          return _axios(config);
        });
      }
    }
  }
);

export function post_(url, data, callback){
  let user = JSON.parse(localStorage.getItem('status') || '[]')
  data.token = user.token?user.token:""
  console.log(data)
  setTimeout(()=>{
  _axios({url:url, data})
    .then(response=>{
      console.log(response.data)
      if(response.data.code === -100){
        localStorage.setItem("Flag", " ");
        localStorage.setItem('status', JSON.stringify({}))
        localStorage.removeItem('state.status')
       }
      callback(response.data)
    })
    .catch(error=>{
      console.log(error)
      
    });
  },500)
}
export function post2_(url, data, callback){
  console.log(data)
  setTimeout(()=>{
    _axios({url:url, data})
    .then(response=>{
      console.log(response.data)
      callback(response.data)
    })
    .catch(error=>{
      console.log(error)
    });
  },500)
}


//上传图片
const _axios2 = axios.create(config);
// 添加请求拦截器
_axios2.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // let data = qs.parse(config.data)
    // config.data = qs.stringify(data)
    config.headers = {
      'Content-Type': 'multipart/form-data'
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);
// 添加响应拦截器
_axios2.interceptors.response.use(
  function(response) {
   // 对响应数据做点什么
   if(response.data.code === -100){
    localStorage.setItem("Flag", " ");
    localStorage.setItem('status', JSON.stringify({}))
    localStorage.removeItem('state.status')
   }
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export function post12_(url, data,config,callback){
  console.log(data,config)
  _axios2({url:url, data,config})
    .then(response=>{
      callback(response.data)
    })
    .catch(error=>{
      console.log(error);
    });
}

// Plugin.install = function(Vue) {
//   Vue.axios = _axios;
//   window.axios = _axios;
//   Object.defineProperties(Vue.prototype, {
//     axios: {
//       get() {
//         return _axios;
//       }
//     },
//     $axios: {
//       get() {
//         return _axios;
//       }
//     },
//   });
// };

// Vue.use(Plugin)

// export default _axios;
