"use strict";

import Vue from 'vue';
import axios from "axios";
import qs from 'qs'


let if_rec = true
let is_tips = true

//是否web端 0：app; 1:web阿联酋；2：web沙特；
const web_app = process.env.VUE_APP_WEB

let b_url = ''
if(web_app == 1){
  b_url = process.env.VUE_APP_PHOTO
}else if(web_app == 2){
  b_url = process.env.VUE_APP_PHOTO1
}else{
  const country_i = JSON.parse(localStorage.getItem('country_i') || 1)
  b_url = country_i==1?process.env.VUE_APP_PHOTO:process.env.VUE_APP_PHOTO1
}

let config = {
    baseURL: b_url,
    timeout: 60 * 1000, // Timeout
    withCredentials: true, // Check cross-site Access-Control
    method: 'post',
    retry:2,
    retryDelay:1000
};
console.log(config)
const _axios = axios.create(config);


_axios.interceptors.request.use(
    function (config) {
        let data = qs.parse(config.data)
        config.data = qs.stringify(data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
// 响应拦截器
_axios.interceptors.response.use(
    function (response) {
      is_tips = true
        return response;
    },
    function (error) {
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
        // return Promise.reject(error);
    }
);

export function post_(url, data, callback){
    setTimeout(()=>{
    _axios({url:url, data})
      .then(response=>{
        callback(response.data)
      })
      .catch(error=>{
        console.log(error);
      });
    },500)
  }
 
// Websocket接口
let config1 = {
    baseURL: process.env.VUE_APP_PHWS,
    timeout: 60 * 1000, // Timeout
    withCredentials: true, // Check cross-site Access-Control
    method: 'post',
};
const _axios1 = axios.create(config1);

_axios1.interceptors.request.use(
    function (config) {
        let data = qs.parse(config.data)
        config.data = qs.stringify(data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);
// Add a response interceptor
// 响应拦截器
_axios1.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export function post1_(url, data, callback){
    _axios1({url:url, data})
      .then(response=>{
        callback(response.data)
      })
      .catch(error=>{
        console.log(error);
      });
  }






// Plugin.install = function (Vue) {
//     Vue.axios = _axios;
//     window.axios = _axios;
//     Object.defineProperties(Vue.prototype, {
//         axios: {
//             get () {
//                 return _axios;
//             }
//         },
//         $axios: {
//             get () {
//                 return _axios;
//             }
//         },
//     });
// };

// Vue.use(Plugin)

// export default _axios;
