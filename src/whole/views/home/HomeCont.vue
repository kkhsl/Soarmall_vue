<template>
  <div class="full_page">
    <publicHead :goSearch="true">
      <Country slot="headLeft" :ifhome="true"></Country>
    </publicHead>
    <mescroll-vue
      class="centerWrap"
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <!-- 轮播图 -->
      <swipeBanner ref="swipeBanner"></swipeBanner>

      <!-- webapp -->
      <div class="web_up" v-if="web_app == 1">
        <a href="https://play.google.com/store/apps/details?id=plus.H5ED64880">
          <img src="@/assets/img/android.png" />
        </a>
        <a href="https://apps.apple.com/cn/app/soarmall/id1487094859">
          <img src="@/assets/img/ios.png" />
        </a>
      </div>

      <!-- 秒杀专题 -->
      <secKill ref="secKill" v-if="speialNavList.deals" :speialTitle="speialNavList.deals"></secKill>

      <!-- freeGifts 邀约活动 -->
      <freeGifts ref="freeGifts"></freeGifts>

      <!-- 新品直达 -->
      <newArrive ref="newArrive" v-if="speialNavList.new" :speialTitle="speialNavList.new"></newArrive>

      <!-- 二级页面导航 -->
      <spcialNav ref="spcialNav"></spcialNav>

      <!-- discountPage -->
      <discountPage ref="discountPage"  v-if="speialNavList.discount" :speialTitle="speialNavList.discount"></discountPage>
      
      <!-- 推荐专题 -->
      <Recommend ref="recom"></Recommend>
      <!-- 热销商品 -->
      <hotProductsItem ref="trslip"></hotProductsItem>
      <!--广告图组-->
      <Adgroup ref="ad"></Adgroup>
      <!-- 猜你喜欢start -->
      <maylike ref="like"></maylike>
    </mescroll-vue>
    <Popup></Popup>
    <publicTabbar tabbarIndex="0"></publicTabbar>
  </div>
</template>
  
<script>
import Country from "@/whole/components/elastic/country";
import swipeBanner from "./components/swipeBanner";
import discountPage from "./components/discount";
import spcialNav from "./components/spcialNav";
export default {
  components: {
    Country,
    swipeBanner,
    discountPage,
    spcialNav,
    secKill: () => import("./components/secKill"),
    newArrive: () => import("./components/newArrive"),
    freeGifts: () => import("./components/freeGifts"),
    hotProductsItem: () => import("./components/hotProductsItem"),
    Recommend: () => import("./components/recommend"),
    Adgroup: () => import("./components/ad_group"),
    MescrollVue: () => import("@/plugins/scroll/mescroll"),
    publicHead: () => import("@/whole/components/header/publicHead"),
    publicTabbar: () => import("@/whole/components/publicBottom/tabbar"),
    maylike: () => import("@/whole/components/global/may_like"),
    Popup: () => import("@/module/invite/popup_coupon")
  },
  data() {
    return {
      speialNavList:{}, //专题板块
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        callback: this.downCallback
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20 // 每页数据的数量
        },
        toTop: {},
        empty: {},
        lazyLoad: {}
      },
      web_app: 0
    };
  },
  created() {
    this.web_app = localStorage.getItem("web_app");
  },
  mounted() {
    this.getSpeialNav()
    setTimeout(() => {
      if (this.web_app == 0) {
        this.to_route();
      }
    }, 2500);
  },
  methods: {
    async getSpeialNav(){ // 获取专题板块内容
      try {
        let historyNavList = JSON.parse(localStorage.getItem('historyNavList') || '[]')
        this.speialNavList = historyNavList
      } catch (error) {}
      let res = await this.$PHP.getSpeialNav()
      if(res.code == 0){
        this.speialNavList = res.data
        try {
          localStorage.setItem("historyNavList", JSON.stringify(res.data));
        } catch (error) {}
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 下拉刷新
    downCallback(mescroll) {
      setTimeout(() => {
        // this.$refs.swipeBanner.getHomeBanner(); // 刷新轮播图
        // this.$refs.secKill.getProduct(); // 刷新秒杀
        // this.$refs.freeGifts.getFreeGiftsList(); // 刷新freeGifts
        // this.$refs.newArrive.getProduct();// 刷新newArrive
        // this.$refs.spcialNav.secondNavInit();// 刷新二级页面导航
        // this.$refs.discountPage.getProduct();// 刷新discount
        // this.$refs.recom.recom();// 刷新推荐专题
        // this.$refs.trslip.hotcs_home();// 刷新热销商品
      }, 400);
      setTimeout(() => {
        mescroll.endSuccess();
        mescroll.endErr();
        mescroll.endDownScroll();
        mescroll.hideUpScroll();
      }, 3000);
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        },
        () => {
          // 联网异常,隐藏上拉和下拉的加载进度
          mescroll.endErr();
        }
      );
    },
    getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
      setTimeout(() => {
        this.$refs.like.like_goods({currentPage:pageNum}, res => {
          successCallback(res);
        });
      }, 600);
    },
    to_route() {
      try {
        let Android_iOS = JSON.parse(
          localStorage.getItem("Android_iOS") || "[]"
        );
        if (Android_iOS == 0) {
          var UIPasteboard = plus.ios.importClass("UIPasteboard");
          var generalPasteboard = UIPasteboard.generalPasteboard();
          var value = generalPasteboard.plusCallMethod({
            valueForPasteboardType: "public.utf8-plain-text"
          });
          this.to(value);
        } else {
          var Context = plus.android.importClass("android.content.Context");
          var main = plus.android.runtimeMainActivity();
          var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
          let str = plus.android.invoke(clip, "getText");
          this.to(str);
        }
      } catch (error) {
        console.log(error);
      }
    },
    to(url) {
      let length = url.length;
      let one = url.substr(0, 1);
      if (length < 80 && one == "/") {
        let route = localStorage.getItem("route") || "[]";
        if (route !== url) {
          this.$router.push({ path: url });
          localStorage.setItem("route", url);
        }
      } else {
        localStorage.setItem("route", []);
      }
    }
  }
};
</script>

<style lang="scss">
.web_up {
  height: 0.9rem;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 1.1rem 0;
  box-sizing: border-box;
  a {
    position: relative;
    height: 0.7rem;
    width: 1.8rem;
  }
  img {
    position: absolute;
    height: 0.7rem;
  }
}

// 组件包裹
.specialBox {
  padding: 0.2rem 0;
}
.homeGayText{
  padding: 0.1rem 0;
  font-size: 0.2rem;
  color: #999;
  max-width: 5.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
// 组件头部
.specialHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.specialHeadC {
  width: 2.4rem;
}
.specialHeadR {
  display: flex;
  min-height: 0.5rem;
  align-items: flex-end;
}
.specialHeadL {
  display: flex;
  .specHeadImg {
    width: 0.3rem;
    padding-top: 0.16rem;
    img {
      max-width: 100%;
    }
  }
}
.specHeadTitle {
  padding: 0 0.1rem;
}
.specHeadTitle h6 {
  font-weight: 600;
  font-size: 0.36rem;
  line-height: 0.6rem;
  color: #333;
  font-family: "Calibri-Bold";
}
.specHeadLine {
  width: 0.48rem;
  height: 0.04rem;
  background-color: #017cc1;
  border-radius: 0.02rem;
}
// 组件更多按钮
.specialMoreWrap {
  padding: 0 0.3rem;
  color: #017ec2;
  display: flex;
  align-self: flex-end;
  span {
    height: 0.3rem;
    line-height: 0.22rem;
  }
}

// 组件价格按钮
.currentPrice {
  font-family: "Calibri-Bold";
  font-weight: bold;
  font-size: 0.28rem;
  color: #333;
  white-space: nowrap;
  display: flex;
  .smallPrice {
    display: block;
    font-size: 0.18rem;
    line-height: 0.3rem;
  }
}
</style>
