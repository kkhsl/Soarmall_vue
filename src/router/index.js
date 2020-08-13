import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeCont from '@/whole/views/home/HomeCont'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'HomeCont',
    component: HomeCont,
    meta: { keepAlive: true, index: 0, routeLevel: 1 },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/whole/views/start_pages/Categories.vue'),
    meta: { keepAlive: true, index: 0, routeLevel: 1 },
  },
  {
    path: '/discovery',
    name: 'Discovery',
    component: () => import('@/whole/views/start_pages/Discovery.vue'),
    meta: { keepAlive: true, index: 0, routeLevel: 1 },
  },
  {
    path: '/mycont',
    name: 'mycont',
    component: () => import('@/whole/views/start_pages/Mycont.vue'),
    meta: { keepAlive: true, index: 0, routeLevel: 1 },
  },
  {
    path: '/secondpage',
    name: 'Secondpage',
    component: () => import('@/whole/views/secondPage/secondPage.vue'),
    meta: { keepAlive: true, index: 1, routeLevel: 2 },
  },
  {
    path: '/columnList',
    name: 'ColumnList',
    component: () => import('@/whole/views/secondPage/productListColumn.vue'),
    meta: { keepAlive: true, index: 1, routeLevel: 2 },
  },
  // {
  //   path: '/home/details', 旧详情页 已取代
  //   name: 'Details',
  //   component: () => import('@/whole/views/main_pages/details_good.vue'),
  //   meta: { keepAlive: true, isBack: false, index: 3, routeLevel: 2 },
  // },
  {
    path: '/home/details',
    name: 'Details',
    component: () => import('@/whole/views/detail/detail.vue'),
    meta: { keepAlive: true, index: 3, routeLevel: 2 },
  },
  {
    path: '/details/cart',
    name: 'Cart',
    component: () => import('@/whole/views/main_pages/shopping_cart.vue'),
    meta: {
      keepAlive: true,
      isLogin: true,
      index: 5,
      routeLevel: 2
    }
  },
  {
    path: '/mycart',
    name: 'Mycart',
    component: () => import('@/whole/views/myCart/myCart.vue'),
    meta: {
      keepAlive: true,
      isLogin: true,
      index: 5,
      routeLevel: 2
    }
  },
  {
    path: '/account/login',
    name: 'Login',
    component: () => import('@/whole/login/login.vue'),
    meta: { keepAlive: true, isBack: false, isLogin: false, routeLevel: 2 },
  },
  {
    path: '/address',
    name: 'Address',
    component: ()=> import('@/whole/views/address/address'),
    meta: { isLogin: true, keepAlive: true, index: 7, routeLevel: 4 }
  },
  {
    path: '/newAddress',
    name: 'NewAddress',
    component: ()=> import('@/whole/views/address/newAddress'),
    meta: { isLogin: true, routeLevel: 5 }
  },
  {
    path: '/subpages/Account/about_us',
    name: 'Aboutus',
    component: () => import('@/whole/views/account/about_us.vue'),
    meta: { keepAlive: true, isBack: false, index: 2, routeLevel: 2 }
  },
  {
    path: '/subpages/Account/chat',
    name: 'Chat',
    component: () => import('@/whole/views/account/chat.vue'),
    meta: { isBack: false, routeLevel: 2 }
  },
  {
    path: '/subpages/Account/profile',//不需要缓存
    name: 'Profile',
    component: () => import('@/whole/views/account/profile.vue'),
    meta: {
      keepAlive: true,
      isLogin: true,
      index: 2,
      routeLevel: 2
    }
  },
  {
    path: '/subpages/collection/wishlist',
    name: 'Wishlist',
    component: () => import('@/whole/views/account/collection/wishlist.vue'),
    meta: {
      isLogin: true,
      keepAlive: true,
      index: 2,
      routeLevel: 2
    }
  },
  {
    path: '/subpages/collection/wef',
    name: 'Wef',
    component: () => import('@/whole/views/account/collection/wef.vue'),
    meta: {
      isLogin: true,
      keepAlive: true,
      index: 2,
      routeLevel: 2
    }
  },
  {
    path: '/discovery/article',
    name: 'Article',
    component: () => import('@/whole/views/main_pages/special_article.vue'),
    meta: { keepAlive: true, isBack: false, index: 1, routeLevel: 2 },
  },
  {
    path: '/subpages/cate_goods',
    name: 'Categoods',
    component: () => import('@/whole/views/display_goods/cate_goods.vue'),
    meta: { keepAlive: true, isBack: false, index: 1, routeLevel: 2 },
  },
  {
    path: '/subpages/cate_goods02',
    name: 'Categoods02',
    component: () => import('@/whole/views/display_goods/cate_goods02.vue'),
    meta: { keepAlive: true, isBack: false, index: 4, routeLevel: 2 }
  },
  // {
  //   path: '/subpages/search/search_navigation',  二级页面  已取代
  //   name: 'SearchNavigation',
  //   component: () => import('@/whole/views/display_goods/search_navigation.vue'),
  //   meta: { keepAlive: true, isBack: false, index: 1, routeLevel: 2 },
  // },
  {
    path: '/subpages/search/search',//不需要缓存
    name: 'Search',
    component: () => import('@/whole/views/display_goods/search.vue'),
    meta: { routeLevel: 2 },
  },
  {
    path: '/subpages/search/search_result',
    name: 'Searchresult',
    component: () => import('@/whole/views/display_goods/search_result.vue'),
    meta: { keepAlive: true, isBack: false, index: 1, routeLevel: 2 },
  },
  {
    path: '/subpages/Reviews',
    name: 'Reviews',
    component: () => import('@/whole/views/other_pages/Reviews.vue'),
    meta: { keepAlive: true, isBack: false, index: 1, routeLevel: 2 },
  },
  {
    path: '/subpages/sizeguide',
    name: 'Sizeguide',
    component: () => import('@/whole/views/other_pages/sizeguide.vue'),
    meta: { keepAlive: true, routeLevel: 4 },
  },
  {
    path: '/mycart/payment',
    name: 'Payment',
    component: () => import('@/whole/views/payPag/cartPayment.vue'),
    meta: {
      keepAlive: true, isBack: false, index: 6, routeLevel: 3
    }
  },
  {
    path: '/detail/payment',
    name: 'detailPayNow',
    component: () => import('@/whole/views/payPag/paymentNow.vue'),
    meta: { keepAlive: true, isBack: true, index: 6, routeLevel: 3 }
  },
  {
    path: '/whole/pay/payment_now',
    name: 'PayNow',
    component: () => import('@/whole/pay/payment_now.vue'),
    meta: { keepAlive: true, isBack: false, index: 6, routeLevel: 3 }
  },
  {
    path: '/account/Account/orders',
    name: 'Orders',
    component: () => import('@/whole/views/order_return/order/orders.vue'),
    meta: {
      keepAlive: true,
      isBack: false,
      isLogin: true,
      index: 1,
      routeLevel: 2
    }
  },
  {
    path: '/subpages/Account/order_evaluate/details_order',
    name: 'OrderDetails',
    component: () => import('@/whole/views/order_return/order/details_order.vue'),
    meta: {
      keepAlive: true,
      isBack: false,
      index: 2,
      routeLevel: 3
    },
  },
  {
    path: '/subpages/Account/order_evaluate/evaluate_page',
    name: 'Evaluate',
    component: () => import('@/whole/views/order_return/order/evaluate_page.vue'),
    meta: { routeLevel: 2 }
  },
  {
    path: '/whole/views/order_return/review',
    name: 'Review',
    component: () => import('@/whole/views/order_return/review.vue'),
    meta: { isLogin: true, routeLevel: 2 }
  },
  {
    path: '/whole/views/order_return/add_evaluate',
    name: 'Addevaluate',
    component: () => import('@/whole/views/order_return/add_evaluate.vue'),
    meta: { routeLevel: 4 }
  },
  {
    path: '/subpages/Account/returns/returns',
    name: 'Returns',
    component: () => import('@/whole/views/order_return/return/returns.vue'),
    meta: {
      keepAlive: true,
      isBack: false,
      isLogin: true,
      index: 1,
      routeLevel: 2
    }
  },
  {
    path: '/subpages/Account/returns/after_sale',
    name: 'Aftersale',
    component: () => import('@/whole/views/order_return/return/after_sale.vue'),
    meta: { routeLevel: 2 }
  },
  {
    path: '/subpages/Account/returns/return_details',
    name: 'Returndetails',
    component: () => import('@/whole/views/order_return/return/return_details.vue'),
    meta: { routeLevel: 2 }
  },
  //邀约活动
  {
    path: '/home/Entry',
    name: 'Entry',
    component: () => import('@/module/invite/entry.vue'),
    meta: { keepAlive: true, isBack: false, index: 1, routeLevel: 2 },
  },
  //优惠券
  {
    path: '/coupon/Coupon',
    name: 'Coupon',
    component: () => import('@/module/coupon/Coupon.vue'),
    meta: { keepAlive: true, isBack: false, isLogin: true, index: 2, routeLevel: 2 }
  },
  //抽奖
  {
    path: '/luck_draw/roundTurntable',
    name: 'RoundTurntable',
    component: () => import('@/module/luck_draw/roundTurntable.vue'),
    meta: { keepAlive: true, isBack: false, index: 2, routeLevel: 2 }
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

// router.onError((error) => {
//   console.log(error)
//   const pattern = /Loading chunk (\d)+ failed/g;
//   const isChunkLoadFailed = error.message.match(pattern);
//   const targetPath = router.history.pending.fullPath;
//   console.log(pattern,isChunkLoadFailed,targetPath)
//   if (isChunkLoadFailed) {
//     router.replace(targetPath);
//   }
// });


export default router

