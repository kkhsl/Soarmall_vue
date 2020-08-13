export default {
  // php 接口汇总 默认method：post
  // Websocket接口
  chat_log: {
    method: 'post',
    url: 'https://adm.soarmall.com/api/chat/chat_log'
  },
  //app启动页
  app_start: {
    url: '/api/v1/app_start/10'
  },
  app_start1: {
    url: '/api/v1/app_start/11'
  },
  getSpeialNav: {
    url: '/api/v1/deals_new/12'
  },
  recommend: {
    url: '/api/v1/app_recommend/9'
  },
  get_barner: {
    method: 'get',
    url: '/api/v1/get_barner/'
  },
  banner1: {
    url: '/api/v1/banner/1'
  },
  banner2: {
    url: '/api/v1/banner/2'
  },
  banner3: {
    url: '/api/v1/banner/middle/3'
  },
  banner4: {
    url: '/api/v1/banner/end/4'
  },
  search: {
    url: '/api/v1/search'
  },
  search_w: {
    url: '/api/v1/search/word'
  },
  good_invite: {
    url: '/api/v1/goods/invite'
  },
  logistics: {
    method: 'get',
    url: '/api/v1/logistics/'
  },
  //抽奖
  draw_get_list: {
    url: '/api/v1/lucky_draw/get_list'
  },
  lucky_draw: {
    url: '/api/v1/lucky_draw'
  },
  draw_get_log: {
    url: '/api/v1/lucky_draw/get_log'
  },
  draw_cur_num: {
    url: '/api/v1/lucky_draw/cur_num'
  },
  store_detail: {
    method: 'get',
    url: '/api/v1/store/detail/'
  },
  get_goods: {
    method: 'get',
    url: '/api/v1/get_goods/'
  },
}