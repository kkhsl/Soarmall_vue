<template>
  <div class="full_page" id="badge">
    <publicHead ref="publicHead" :style="{'background-color':headColor}" class="detailHeadWrap" :noHeadRight="true">
      <div
        slot="headLeft"
        class="backBg"
        :class="{'isRotate': GLOBA.isRotate}"
        @click="$refs.publicHead.goBack()"
      >
        <img src="@/assets/img/other/xiangzuo1.png" />
      </div>
      <ul
        v-if="!showNotFound"
        slot="headCenter"
        class="headNav"
        v-show="headOpacity>0.4"
        :style="{'opacity':headOpacity}"
      >
        <li
          v-for="(headNav, index) of headNavEle"
          :class="{'active':headNavEleActive == index}"
          :key="index"
          @click="getHeadNavOffset();mescroll.scrollTo(headNav.offsetTop,500)"
        >{{headNav.title}}</li>
      </ul>
      <div
        slot="headRight"
        class="toCartWrap"
        v-show="GLOBA.isApp"
        @click="$router.push({path: '/details/cart'})"
      >
        <span>{{cartCounts}}</span>
        <img src="@/assets/img/other/baobao.png" />
      </div>
    </publicHead>
    <mescroll-vue
      ref="mescroll"
      class="detailCenterWrap"
      :down="mescrollDownOptions"
      :up="mescrollUpOptions"
      @init="mescrollInit"
    >
      <div id="notFoundProduct" v-if="showNotFound">
        <div class="notFoundImg"><img src="@/assets/image/icon/notFoundProduct.png" alt=""></div>
        <p class="notFoundTips">Product was not found</p>
      </div>
      <div class="detailsWrap" v-if="goodsInfo">
        <detailSwiper :mainSwiperImg="goodsInfo.goods.photos"></detailSwiper>
        <productMsg :goodsInfo="goodsInfo" @getFreeBtn="getFreeBtn"></productMsg>
        <detailDiscount :goodsInfo="goodsInfo"></detailDiscount>
        <delivers :goodsInfo="goodsInfo" ref="delivers" :selectSpec="detaultSpec"></delivers><!-- 运费组件  -->
        <!-- 商品规格 -->
        <div
          class="Specifications_box"
          @click="openSelectSpecBtn"
          v-if="goodsInfo.spec.color.length || goodsInfo.spec.spec_info.length"
        >
          <div class="Specifications">
            <img class="titleImg" src="@/assets/img/other/size.png" alt />
            <div class="line-blok-clamp" v-if="goodsInfo.spec.color.length">
              <p>
                <span class="key">{{$t('title.Color')}}:</span>
                <span class="val">{{goodsInfo.spec.color[detaultSpec.color.selectIndex].value}}</span>
              </p>
            </div>
            <div class="line-blok-clamp" v-if="goodsInfo.spec.spec_info.length">
              <p v-for="(spec,i) in goodsInfo.spec.spec_info" :key="i">
                <span class="key">{{spec.spec_name}}:</span>
                <span class="val">{{spec.gsp_list[detaultSpec.otherSpec[i].selectIndex].gsp_value}}</span>
              </p>
            </div>
          </div>
          <div class="flexBox">
            <p class="selectSizeBtn">{{$t("common.Select")}}</p>
            <img
              class="rightIconRow"
              :class="{'isRotate': GLOBA.isRotate}"
              src="@/assets/img/other/xiangyou3.png"
            />
          </div>
        </div>
        <!-- 尺寸说明 -->
        <div
          class="Specifications_box"
          v-if="goodsInfo.goods.goods_gc_id == 688"
          @click="$router.push({ path: '/subpages/sizeguide' })"
        >
          <div class="Specifications">
            <img class="titleImg" src="@/assets/img/other/shuxin.png" alt />
            <p class="blodFont">{{$t("common.Size guide")}}</p>
          </div>
          <img
            class="rightIconRow"
            :class="{'isRotate': GLOBA.isRotate}"
            src="@/assets/img/other/xiangyou3.png"
          />
        </div>
        <!-- details -->
        <productDetailsTank :goodsInfoGoods="goodsInfo.goods"></productDetailsTank>
        <!-- 亮点 -->
        <highlight :goodsInfoGoods="goodsInfo.goods"></highlight>
        <!-- 商品详情 评论 -->
        <productRev
          ref="reviev"
          :goodsInfoGoods="goodsInfo.goods"
          :productEvalist="goodsInfo.evalist"
        ></productRev>
      </div>
      <mayLike ref="mayLike"></mayLike>
    </mescroll-vue>
    <!-- 选择商品规格弹窗 -->
    <selectSpec
      v-if="openSelectSpec"
      :detaultSpec="detaultSpec"
      @closeSelectSpecFn="closeSelectSpecFn"
      @specConfirm="specConfirm"
      @addToCart="addToCartFn"
      @buyNow="buyNowFn"
      @webBuyNowSpec="webBuyNowConfirmSpec"
      :goodsInfo="goodsInfo"
    ></selectSpec>
    <div class="bottomWrap flexBox">
      <div class="positionMask" v-if="showNotFound"></div>
      <div class="footSmallBtn">
        <div class="smallBtnItem home" @click="$router.push({ path: '/home'})" v-if="!GLOBA.isApp">
          <img src="@/assets/img/tabbar/home1.png" alt />
          <p>{{$t("common.Home")}}</p>
        </div>
        <div class="smallBtnItem collect" v-click="collectionBtn" v-if="GLOBA.isApp">
          <img :src="isWish===1 ? require('@/assets/img/other/star1.png'):require('@/assets/img/other/star.png')"/>
          <p :class="{'activeWish':isWish==1}">{{$t("common.Wishlist")}}</p>
        </div>
        <div class="smallBtnItem shareBtn" v-click="shareBtnFn">
          <img src="@/assets/img/FreeGit/share.png" alt />
          <p>{{$t("common.Share")}}</p>
        </div>
      </div>
      <div class="addToCartBtn" v-click="addToCartBtn" v-if="GLOBA.isApp">{{$t("common.Add to cart")}}</div>
      <div class="tabBarBuyBtn" style="width:50%;" v-if="!$store.state.status.token && !GLOBA.isApp" v-click="openWebBuyNowBtn">
        <h6 class="buy">{{$t("common.Buy now")}}</h6>
        <p v-if="goodsInfo">{{goodsInfo.goods.goods_current_price | keeptwoNum}}{{GLOBA.money_tag}}</p>
      </div>
      <div class="tabBarBuyBtn" v-click="buyNowBtn" v-else><h6 class="buy">{{$t("common.Buy now")}}</h6></div>
    </div>
    <vantPopup
      v-model="showWebBuyNowTank"
      get-container="#app"
      :close-on-click-overlay="false"
    >
      <webBuyNow v-if="showWebBuyNowTank" @close="closeWebBuyNowTank" @webConfirm="webConfirmBuyNow"></webBuyNow>
    </vantPopup>
    
    <!-- 加载中 -->
    <Load v-if="isload"></Load>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Load from "@/whole/components/global/load_details";
import MescrollVue from "@/plugins/scroll/mescroll";
import { Toast,Popup } from "vant";
export default {
  components: {
    publicHead,
    Load,
    Toast,
    vantPopup:Popup,
    MescrollVue,
    detailSwiper: () => import("./components/detailSwiper"),
    productMsg: () => import("./components/productMsg"),
    detailDiscount: () => import("./components/detailDiscount"),
    delivers: () => import("./components/delivers"),
    selectSpec: () => import("./components/selectSpec"),
    productDetailsTank: () => import("./components/productdetailsTank"),
    highlight: () => import("./components/highlight"),
    productRev: () => import("./components/productRev"),
    webBuyNow: () => import("./components/webBuyNow"),
    mayLike: () => import("@/whole/components/global/may_like"),
  },
  data() {
    return {
      //头部背景
      bannerHeight: document.documentElement.clientWidth || window.innerWidth,
      headColor: "rgba(1,126,194,0)",
      headOpacity: 0,
      headNavEle: [
        {
          title: this.$t("title.Goods"),
          offsetTop: 0,
        },
        {
          title: this.$t("common.Details"),
          offsetTop: 0,
        },
        {
          title: this.$t("title.Recommend"),
          offsetTop: 0,
        },
      ],
      headNavEleActive: 0,
      cartCounts: 0,
      mescroll: null, // mescroll实例对象
      mescrollDownOptions: {
        use: false,
      },
      mescrollUpOptions: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20, // 每页数据的数量
        },
        onScroll: this.onScroll,
      },
      isload: true, // 骨架屏控制器
      showNotFound: false,
      productId: null, // 商品id
      goodsInfo: null, // 商品详情
      isWish: undefined, // 是否收藏
      openSelectSpec: false, // 选择规格组件 控制器
      hasSpec: false, // 是否是多规格产品
      detaultSpec: { // 默认选择的规格下标
        btnType: null,
        color: {
          selectIndex: 0,
        },
        otherSpec: [],
      },
      showWebBuyNowTank: false, // 是否显示web 下单弹框
      webConfirmBuySelectSpec: null  // 记录web弹框下单之前多规划选择的参数
    };
  },
  activated() {
    if (this.productId != this.$route.query.id) {
      this.isload = true;
      this.goodsInfo = null; // 初始商品详情
      this.mescroll.scrollTo(0, 0);
      this.mescroll.resetUpScroll();
      this.$nextTick(() => {
        setTimeout(() => {
          this.getHeadNavOffset();
        }, 1000);
      });
    }
    this.getProductInfo();
    this.getCartNum(); // 获取购物车数量
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.id !== from.query.id) {
      setTimeout(() => {
        this.mescroll.scrollTo(0, 0);
        this.isload = true;
        this.goodsInfo = null; // 初始商品详情
        this.getProductInfo();
      }, 300);
    }
    next();
  },
  mounted() {
    // if (this.productId != this.$route.query.id) {
    //   this.getProductInfo();
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       this.getHeadNavOffset();
    //     }, 1000);
    //   });
    // }
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.openSelectSpec) {
          this.openSelectSpec = false;
        }
        if (this.showWebBuyNowTank) {
          this.showWebBuyNowTank = false;
        }
      },
      false
    );
  },
  methods: {
    getHeadNavOffset() {
      let headHight = this.$refs.publicHead.$el.offsetHeight;
      this.headNavEle[1].offsetTop =
        this.$refs.reviev.$el.offsetTop - headHight;
      this.headNavEle[2].offsetTop =
        this.$refs.mayLike.$el.offsetTop - headHight;
    },
    async getCartNum() {
      let data = {
        language: this.$route.query.lang === "sa" ? 1 : 0,
      };
      let res = await this.$HTTP.goods_cart1(data, { showLoading: false });
      if (res.code == 0) {
        this.cartCounts = res.data.cart_num;
      } else if (res.code == -100) {
        this.cartCounts = 0;
        this.$store.commit("Login", {});
        this.$store.dispatch("userLogin", false);
        localStorage.setItem("Flag", " ");
      } else {
        this.cartCounts = 0;
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    onScroll(mescroll, y, isUp) {
      let opacity = y / this.bannerHeight > 1 ? 1 : y / this.bannerHeight;
      this.headOpacity = opacity;
      this.headColor = "rgba(1,126,194," + opacity + ")";
      this.headNavEle.forEach((headNavEleItem, i) => {
        if (y + 5 > headNavEleItem.offsetTop) {
          this.headNavEleActive = i;
        }
      });
    },
    upCallback(page, mescroll) {
      setTimeout(() => {
        this.$refs.mayLike.like_goods({currentPage:page.num, productId:this.productId}, (res) => {
          this.$nextTick(() => {
            mescroll.endSuccess(res.length);
          });
        });
      }, 600);
    },
    async getProductInfo() {// 根据id获取商品数据
      const data = {
        id: this.$route.query.id,
        language: this.$route.query.lang === "sa" ? 1 : 0,
      };
      this.productId = data.id;
      let res = await this.$HTTP.goods(data);
      if (res.code == 0) {
        let resData = res.data;
        this.goodsInfo = resData;
        this.isWish = resData.goods.goods_favorite_goods; // 是否收藏赋值0未收藏 1收藏
        this.setDefaultSpec(); // 设置默认规格下标
        this.showNotFound = false; // 是否显示没找到商品样式
      } else if(res.code == -4){
        this.showNotFound = true;
        Toast.fail("The store is off the shelves");
      } else {
        Toast.fail("loading faild");
      }
      setTimeout(() => {
        this.isload = false;
      }, 500);
    },
    async collectionBtn() {// 收藏按钮功能
      if (this.isWish == 1) {
        let res = await this.$HTTP.favorite_store_d({
          goods_id: this.productId,
          store_id: "",
        });
        if (res.code == 0) {
          this.isWish = 0;
          Toast({
            message: this.$t("message.Cancel successful"),
            icon: require("@/assets/img/other/zhenque.png"),
          });
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            icon: require("@/assets/img/other/error.png"),
          });
        }
      } else if (this.isWish == 0) {
        let res = await this.$HTTP.add_goods_favorite({ id: this.productId });
        if (res.code == 0) {
          this.isWish = 1;
          Toast({
            message: this.$t("message.Collection Of Success"),
            icon: require("@/assets/img/other/zhenque.png"),
          });
          if (window.fbAsyncInit) {
            // 如果FB初始化成功
            this.FBAddToEvent("addToWish"); //推送加入收藏事件
          }
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            icon: require("@/assets/img/other/error.png"),
          });
        }
      } else {
        this.$router.push({
          path: "/account/login",
          query: { id: "wishlist" },
        });
      }
    },
    shareBtnFn() { // app 内分享功能
      // app 内分享功能
      const country_i = this.$store.state.country_i;
      const ct = country_i == 1 ? "/ua" : "/sa";
      let url = `https://m.soarmall.com${ct}/#/home/details?id=${this.productId}`;
      let content = `${this.goodsInfo.goods.goodsname}; AED${this.goodsInfo.goods.goods_current_price}`;
      let message = {
        type: "web",
        thumbs: [
          require("@/assets/img/loader.png"),
          this.goodsInfo.goods.goodsimg,
        ],
        title: "Soarmall", //微信支持
        content: content,
        href: url,
      };
      try {
        plus.share.sendWithSystem(
          message,
          function () {
            // alert('分享成功');
          },
          function (e) {
            // alert('分享失败：'+JSON.stringify(e));
          }
        );
      } catch (error) {
        console.log(error + "请在app内分享！");
      }
    },
    addToCartBtn() {// 购物车按钮逻辑
      //  加入购物车功能
      if (this.hasSpec) {
        this.detaultSpec.btnType = "toCart";
        this.openSelectSpecFn(); // 打开规格选择界面
      } else {
        let cartData = {
          goods_id: this.productId,
          count: 1,
          price: this.goodsInfo.goods.goods_current_price,
          gsp: "",
          buy_type: "",
          combin_ids: "",
          combin_version: "",
          user_id: "",
          cart_mobile_ids: "",
          color: "",
        };
        this.addToCartFn(cartData);// 加入购物车处理函数
      }
    },
    async addToCartFn(data) {  // 购物车功能实现
      // 加入购物车处理函数
      let res = await this.$HTTP.add_goods_cart(data);
      if (res.code == 0) {
        Toast({
          message: this.$t("message.Added to the cart"),
          icon: require("@/assets/img/other/zhenque.png"),
        });
        this.getCartNum(); // 获取购物车数量
        if (window.fbAsyncInit) {
          // 如果FB初始化成功
          this.FBAddToEvent("addToCart"); //推送加入购物车事件
        }
      } else if (res.code == 3) {
        Toast({
          message: this.$t("message.Inventory is 0"),
          icon: require("@/assets/img/other/error.png"),
        });
      } else if (res.code == -100) {
        this.$router.push({ path: "/account/login" });
      } else {
        Toast({
          message: this.$t("message.Add product error"),
          icon: require("@/assets/img/other/error.png"),
        });
      }
    },
    getFreeBtn(){ // 兑换商品 兑换按钮
      if (this.hasSpec) { // 是否为多规格商品
        this.detaultSpec.btnType = "buyNow";
        this.detaultSpec.isGetFree = true; // 是否为兑换
        this.openSelectSpecFn(); // 打开规格选择界面
      } else {
        let buyNowData = {
          id: this.productId,
          gsp: "",
          color: "",
          count: 1,
          type: "get",
          language: this.$route.query.lang === "sa" ? 1 : 0,
        };
        this.buyNowFn(buyNowData);  // 单规格直接下单
      }
    },
    buyNowBtn() { // 立即购买按钮逻辑
      if (this.hasSpec) {
        this.detaultSpec.btnType = "buyNow";
        this.openSelectSpecFn(); // 打开规格选择界面
      } else {
        let buyNowData = {
          id: this.productId,
          gsp: "",
          color: "",
          count: 1,
          type: "",
          language: this.$route.query.lang === "sa" ? 1 : 0,
        };
        this.buyNowFn(buyNowData);
      }
    },
    async buyNowFn(data) { // 立即购买功能
      // let res = await this.$HTTP.buy_now(data);
      // let goPath = "";
      // let query={};
      // switch (res.code) {
      //   case 4200:
      //     goPath = "/whole/pay/payment_now";
      //     this.$store.commit("submitBuyNow", res);
      //     break;
      //   case 4207:
      //     goPath = "/address";
      //     query = {
      //       toPath: "/whole/pay/payment_now"
      //     }
      //     this.$store.commit("submitBuyNow", res);
      //     break;
      //   case -100:
      //     goPath = "/account/login";
      //     break;
      //   case 4206:
      //     Toast({
      //       message: this.$t("common.Off shelf"),
      //       icon: require("@/assets/img/other/error.png"),
      //     });
      //     break;
      //   default:
      //     Toast({
      //       message: this.$t("message.Server is busy"),
      //       icon: require("@/assets/img/other/error.png"),
      //     });
      //     break;
      // }
      // if (goPath) this.$router.push({ path: goPath, query:query });


      let res = await this.$HTTP.buy_now(data);
      let goPath = "";
      let query={};
      if(res.code == 4200 || res.code == 4207){
        goPath = "/detail/payment";
        this.$store.commit("submitBuyNow", data);
      }else if(res.code == -100){
        goPath = "/account/login";
      }else if(res.code == 4206){
        Toast({
          message: this.$t("common.Off shelf"),
          icon: require("@/assets/img/other/error.png"),
        });
      }else{
        Toast({
          message: this.$t("message.Server is busy"),
          icon: require("@/assets/img/other/error.png"),
        });
      }
      if (goPath) this.$router.push({ path: goPath});
    },
    setDefaultSpec() {   // 多规格产品 选择默认规格
      // 设置默认规格下标
      let colorArr = this.goodsInfo.spec.color;
      let specArr = this.goodsInfo.spec.spec_info;
      this.hasSpec = false;
      this.detaultSpec.count = 1;
      this.detaultSpec.maxCount = this.goodsInfo.goods.goods_inventory;
      if (colorArr.length) {
        // 如果颜色数组存在
        this.hasSpec = true;
        this.detaultSpec.color.selectIndex = 0;
        this.detaultSpec.color.value = colorArr[0].value;
      } else {
        this.detaultSpec.color = {};
      }
      if (specArr.length) {
        // 如果规格数组存在
        this.hasSpec = true;
        specArr.forEach((specItem, index) => {
          this.$set(this.detaultSpec.otherSpec, index, {
            selectIndex: 0,
            gsp_id:specItem.gsp_list[0].gsp_id,
            gsp_value:specItem.gsp_list[0].gsp_value,
            spec_name:specItem.spec_name
          });
        });
      } else {
        this.detaultSpec.otherSpec = [];
      }
    },
    specConfirm(selectSpec) { // 多规格选择  普通确定按钮  改变父组件默认选择规格
      // 规格确定按钮  把选择的下标赋给默认下标
      this.detaultSpec = selectSpec;
      this.closeSelectSpecFn();
    },
    openSelectSpecBtn(){
      this.detaultSpec.btnType = null;
      this.openSelectSpecFn();
    },
    openSelectSpecFn() { // 打开多规格选择窗口
      this.openSelectSpec = true;
      window.history.pushState(null, null, "#");
    },
    closeSelectSpecFn() {// 关闭多规格选择窗口
      if (window.location.hash.length == 0 || !window.location.hash) {
        this.$router.go(-1);
      }
      this.openSelectSpec = false;
    },
    webConfirmBuyNow(){  // web直接下单 提交按钮
      let webConfirmPostData = null;
      if (this.hasSpec) {
        webConfirmPostData = this.webConfirmBuySelectSpec;
      } else {
        webConfirmPostData = {
          id: this.productId,
          gsp: "",
          color: "",
          count: 1,
          type: "",
          language: this.$route.query.lang === "sa" ? 1 : 0,
        };
      }
      this.closeWebBuyNowTank(); //关闭web填写信息弹窗
      this.buyNowFn(webConfirmPostData); // 调用buynow功能
    },
    openWebBuyNowBtn(){  // 详情页底部web buy now按钮
      if (this.hasSpec) {
        this.detaultSpec.btnType = "webBuyNow";
        this.openSelectSpecFn(); // 打开规格选择界面
      } else {
        this.openWebBuyNowTank();// 打开web填写信息弹窗
      }
    },
    webBuyNowConfirmSpec(specData){ // 多规格选择页面提交规格  web下单前
      setTimeout(()=>{
        this.openWebBuyNowTank();// 打开web填写信息弹窗
        this.webConfirmBuySelectSpec = specData; // 赋值规格选择的值 以便于web下单提交
      },100)
    },
    closeWebBuyNowTank(){ // 关闭web填写信息弹窗
      this.$router.go(-1);
      this.showWebBuyNowTank = false;
    },
    openWebBuyNowTank(){ //打开web填写信息弹窗
      this.showWebBuyNowTank = true;
      window.history.pushState(null, null, "#");
    },
    FBAddToEvent(addToName) {// FB 推送页面事件消息
      let goodData = this.goodsInfo.goods;
      var params = {};
      params[FB.AppEvents.ParameterNames.CONTENT] = goodData.goodsname;
      params[FB.AppEvents.ParameterNames.CONTENT_ID] = goodData.goodsid;
      params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = goodData.goods_character_detail;
      params[FB.AppEvents.ParameterNames.CURRENCY] = this.GLOBA.money_tag;

      if (addToName === "addToCart") {
        // FB 推送加入购物车事件
        FB.AppEvents.logEvent(
          FB.AppEvents.EventNames.ADDED_TO_CART,
          goodData.goods_current_price,
          params
        );
      }
      if (addToName === "addToWish") {
        // FB 推送收藏事件
        FB.AppEvents.logEvent(
          FB.AppEvents.EventNames.ADDED_TO_WISHLIST,
          goodData.goods_current_price,
          params
        );
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      (e) => {
        if (this.openSelectSpec) {
          this.openSelectSpec = false;
        }
        if (this.showWebBuyNowTank) {
          this.showWebBuyNowTank = false;
        }
      },
      false
    );
  },
};
</script>

<style lang='scss'>
.Specifications_box {
  padding: 0 0.1rem;
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  height: 0.92rem;
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .titleImg {
    height: 0.36rem;
    width: 0.36rem;
  }
}
.Specifications {
  width: 6.06rem;
  display: flex;
  align-items: center;
  font-size: 0.28rem;
  .line-blok-clamp {
    padding: 0 0.1rem;
  }
}
.blodFont {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
  padding: 0 0.1rem;
}
</style>

<style lang="scss" scoped>
.detailHeadWrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.backBg {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: rgba(1, 126, 194, 0.2);
  text-align: center;
  line-height: 0.55rem;
  img {
    width: 0.18rem;
    vertical-align: middle;
  }
}
.headNav {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 0.3rem;
  justify-content: space-between;
  li {
    padding: 0 0.16rem;
    height: 0.48rem;
    position: relative;
    color: #cccccc;
  }
  li.active {
    font-weight: bold;
    color: #fff;
    &::after{
      content: "";
      position: absolute;
      bottom: 0;
      left: 20%;
      width: 60%;
      height: 2px;
      background-color: #fff;
    }
  }
}
.headRight {
  height: 1rem;
  width: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toCartWrap {
  background-color: rgba(1, 126, 194, 0.2);
  border-radius: 50%;
  position: relative;
  width: 0.6rem;
  height: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 0.32rem;
    height: 0.32rem;
  }
  span {
    position: absolute;
    text-align: center;
    top: 0.06rem;
    right: 0.12rem;
    display: inline-block;
    background-color: #f00;
    border-radius: 50%;
    min-width: 0.2rem;
    min-height: 0.2rem;
    max-width: 0.4rem;
    max-height: 0.4rem;
    font-size: 0.18rem;
    color: #fff;
    line-height: 0.2rem;
  }
}
.detailCenterWrap {
  height: calc(100vh - 1rem);
}
.activeWish {
  color: #017ec2;
}
.footSmallBtn {
  padding: 0 0.1rem;
  flex: 1;
  height: 1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .smallBtnItem {
    width: 50%;
    padding-top: 0.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 0.4rem;
    }
    p {
      font-size: 0.24rem;
      line-height: 0.4rem;
    }
  }
}
.addToCartBtn {
  width: 32%;
  height: 1rem;
  background-color: #33b6ff;
  color: #fff;
  text-align: center;
  line-height: 1rem;
  font-size: 0.3rem;
  font-weight: Bold;
  font-family: "Calibri-Bold";
}
.isWeb .tabBarBuyBtn{
  width: 50%;
}
.tabBarBuyBtn {
  width: 32%;
  color: #fff;
  text-align: center;
  height: 1rem;
  line-height: 0.3rem;
  background-color: #017ec2;
  display: flex;
  justify-content: center;
  flex-direction: column;
  h6 {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.3rem;
    font-weight: Bold;
    font-family: "Calibri-Bold";
  }
}
#notFoundProduct{
  background-color: #fff;
  padding-top: 5rem;
  padding-bottom: 2rem;
  text-align: center;
}
.notFoundImg{
  width: 60%;
  margin: 0 auto;
  img{
    width: 2rem;
  }
}
.notFoundTips{
  padding: 0.2rem 0;
  color: #949494;
}
.bottomWrap{
  background-color: #f1faff;
  position: relative;
}
.positionMask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.6);
}
</style>