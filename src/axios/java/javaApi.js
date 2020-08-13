export default {
  // 登录区块start
  forget: {
    method: 'post',
    url: '/app_forget.json'
  },
  verify: {
    method: '',
    url: '/verify_username.json'
  },
  mobile: {
    method: '',
    url: '/app_mobile.json'
  },
  register: {
    method: '',
    url: '/register_finish.json'
  },
  token_login: {
    url: '/app_koala_token_login.json'
  },
  user_login: {
    method: '',
    url: '/app_koala_user_login.json'
  },
  app_verify: {
    method: '',
    url: '/app_verify.json'
  },
  document_policy: {
    method: '',
    url: '/app_document_policy.json'
  },
  goods_evaluation: {
    method: '',
    url: '/goods_evaluation.json'
  },
  wap_register: {
    method: '',
    url: '/wap_register.json'
  },
  //登录区块end 
  article: {
    method: '',
    url: '/article_info.json'
  },
  nav_querygc: {
    method: '',
    url: '/nav_querygc_pnull.json'
  },
  nav_gcchilds: {
    method: '',
    url: '/childs/goods.json'
  },
  document_about: {
    method: '',
    url: '/app_document.json'
  },
  discovery_info: {
    method: '',
    url: '/discovery_info.json'
  },
  goods_list: {
    method: '',
    url: '/wap_store_goods_list.json'
  },
  search: {
    method: '',
    url: '/search.json'
  },
  index_discount: {
    method: '',
    url: '/index_discount.json'
  },
  hot_search: {
    method: '',
    url: '/hot_search.json'
  },
  goods_gsps: {
    method: '',
    url: '/load_goods_gsps.json'
  },
  fee_info: {
    url: '/getFreight.json'
  },
  buy_now: {
    url: '/buyNow.json',
    token: true
  },
  payNow: {
    url: '/payOnDelivery.json',
    token: true
  },
  account: {
    url: '/account.json',
    token: true
  },
  //购物车
  goods_cart1_spec: {
    url: '/goods_cart1_spec.json'
  },
  goods_cart1_spec_s: {
    url: '/goods_cart1_spec_save.json',
    token: true
  },
  remove_goods_cart: {
    url: '/remove_goods_cart.json',
    token: true
  },
  goods_count_adjust: {
    url: '/goods_count_adjust.json',
    token: true
  },
  goods_cart2: {
    url: '/goods_cart2.json',
    token: true
  },
  likegoods: {
    url: '/you_likegoods.json',
    token: true
  },



  //地址
  address_del: {
    url: '/buyer_address_del.json',
    token: true
  },
  address: {
    url: '/buyer_address.json',
    token: true
  },
  address_edit: {
    url: '/buyer_address_edit.json',
    token: true
  },
  address_save: {
    url: '/buyer_address_save.json',
    token: true
  },
  address_add: {
    url: '/buyer_address_add.json'
  },
  //支付
  point_cart3: {
    url: '/point_cart3.json',
    token: true
  },
  goods_cart3: {
    url: '/goods_cart3.json',
    token: true
  },
  pay_payafter: {
    url: '/order_pay_payafter.json',
    token: true
  },
  Order_verify: {
    url: '/Order_verify.json',
    token: true
  },
  orderCountAdjust: {
    url: '/orderCountAdjust.json',
    token: true
  },
  adjust: {
    url: '/adjust.json',
    token: true
  },
  //订单
  buyer_order: {
    url: '/buyer_order.json',
    token: true
  },
  order_delete: {
    url: '/buyer_order_delete.json',
    token: true
  },
  order_cancel: {
    url: '/buyer_order_cancel.json',
    token: true
  },
  order_cancel_save: {
    url: '/buyer_order_cancel_save.json',
    token: true
  },
  order_cofirm: {
    url: '/buyer_order_cofirm.json',
    token: true
  },
  order_cofirm_save: {
    url: '/buyer_order_cofirm_save.json',
    token: true
  },
  order_evaluate: {
    url: '/buyer_order_evaluate.json',
    token: true
  },
  order_evaluate_save: {
    url: '/buyer_order_evaluate_save.json',
    token: true
  },
  evaluate_list: {
    url: '/buyer_evaluate_list.json',
    token: true
  },
  add_evaluate: {
    url: '/buyer_add_evaluate.json',
    token: true
  },
  add_evaluate_save: {
    url: '/buyer_add_evaluate_save.json',
    token: true
  },
  //退货
  order_return: {
    url: '/buyer_order_return_list.json',
    token: true
  },
  order_return_listlog: {
    url: '/buyer_order_return_listlog.json',
    token: true
  },
  return_apply: {
    url: '/buyer_order_return_apply.json',
    token: true
  },
  returnlog_view: {
    url: '/buyer_order_returnlog_view.json',
    token: true
  },
  return_ship_save: {
    url: '/buyer_order_return_ship_save.json',
    token: true
  },
  return_apply_save: {
    url: '/buyer_order_return_apply_save.json',
    token: true
  },
  order_view: {
    url: '/buyer_order_view.json',
    token: true
  },
  // 商品
  add_goods_cart: {
    url: '/add_goods_cart.json',
    token: true
  },
  goods: {
    url: '/goods.json',
    token: true
  },
  foot_point: {
    url: '/buyer_foot_point.json',
    token: true
  },
  favorite_goods: {
    url: '/buyer_favorite_goods.json',
    token: true
  },
  favorite_store: {
    url: '/buyer_favorite_store.json',
    token: true
  },
  favorite_store_d: {
    url: '/delete_favorite_sotre.json',
    token: true
  },
  goods_cart1: {
    url: '/goods_cart1_load.json',
    token: true
  },
  add_goods_favorite: {
    url: '/add_goods_favorite.json',
    token: true
  },
  store_goods_info: {
    url: '/store_goods_info.json',
    token: true
  },
  add_store_favorite: {
    url: '/add_store_favorite.json',
    token: true
  },
  //profile接口
 
  load_area: {
    url: '/load_area.json'
  },
  mobile_save: {
    url: '/buyer_account_mobile_save.json',
    token: true
  },
  email_save: {
    url: '/buyer_account_email_save.json',
    token: true
  },
  account_save: {
    url: '/buyer_account_save.json',
    token: true
  },
  password_save: {
    url: '/buyer_accoun_password_save.json',
    token: true
  },
  buyer_account: {
    url: '/buyer_account.json',
    token: true
  },
  //活动邀约块
  point_goods: {
    url: '/point/goods/query.json',
    token: true
  },
  invitation: {
    url: 'invitation.json',
    token: true
  },
  //优惠券
  buyer_coupon: {
    url: '/app/buyer/coupon.json',
    token: true
  },
  get_coupon: {
    url: 'get_coupon.json',
    token: true
  },
  
  //  上传图片
  upload_evaluate: {
    url: '/buyer_upload_evaluate.json'
  },
}
