import {post_,post1_} from '@/plugins/axios2'
// Websocket接口
export function chat_log (data,callback) {
    return post1_('api/chat/chat_log',data,res=>{
        callback(res)
    })
}
//app启动页
export function app_start (callback) {
    return post_('/api/v1/app_start/10',{},res=>{
        callback(res)
    })
}
export function app_start1 (callback) {
    return new Promise((resolve,reject) => {
        post_('/api/v1/app_start/11',{},res=>{
            resolve(res)
        },err=>{
            reject(err)
        })
    })
}
//
export function recommend (callback) {
    return post_('/api/v1/app_recommend/9',{},res=>{
        callback(res)
    })
} 
export function get_barner (ids,callback) {
    return post_('/api/v1/get_barner/' + ids,{},res=>{
        callback(res)
    })
} 
export function banner1 (callback) {
    return post_('/api/v1/banner/1',{},res=>{
        callback(res)
    })
}
export function banner2 (callback) {
    return post_('/api/v1/banner/2',{},res=>{
        callback(res)
    })
}
export function banner3 (callback) {
    return post_('/api/v1/banner/middle/3',{},res=>{
        callback(res)
    })
}
export function banner4 (callback) {
    return post_('/api/v1/banner/end/4',{},res=>{
        callback(res)
    })
} 
export function search (data,callback) {
    return post_('/api/v1/search',data,res=>{
        callback(res)
    })
} 
export function search_w (data,callback) {
    return post_('/api/v1/search/word',data,res=>{
        callback(res)
    })
} 
export function good_invite (data,callback) {
    return post_('/api/v1/goods/invite',data,res=>{
        callback(res)
    })
}
export function logistics (shipCode,callback) {
    return post_('/api/v1/logistics/' + shipCode,{},res=>{
        callback(res)
    })
}
//抽奖
export function draw_get_list (callback) {
    return post_('/api/v1/lucky_draw/get_list',{},res=>{
        callback(res)
    })
}
export function lucky_draw (data,callback) {
    return post_('/api/v1/lucky_draw',data,res=>{
        callback(res)
    })
}
export function draw_get_log (data,callback) {
    return post_('/api/v1/lucky_draw/get_log',data,res=>{
        callback(res)
    })
}
export function draw_cur_num (data,callback) {
    return post_('/api/v1/lucky_draw/cur_num',data,res=>{
        callback(res)
    })
}
// dian pu
export function store_detail (id,callback) {
    return post_('/api/v1/store/detail/' + id,{},res=>{
        callback(res)
    })
} 
