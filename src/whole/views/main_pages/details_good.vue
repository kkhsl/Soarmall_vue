<template>
  <div class="full_page" id="badge">
    <div class="detailHeadWrap" :style="{'background-color':headColor}">
      <div class="detailHead">
        <div class="goBackWrap" @click="goBack" :class="{'isRotate': GLOBA.isRotate}">
          <div class="backBg">
            <img src="@/assets/img/other/xiangzuo1.png" />
          </div>
        </div>
        <ul class="headNav" v-show="headOpacity>0.4" :style="{'opacity':headOpacity}">
          <li
            v-for="(headNav, index) of headNavEle"
            :class="{'active':headNavEleActive == index}"
            :key="index"
            @click="getHeadNavOffset();mescroll.scrollTo(headNav.offsetTop,500)"
          >{{headNav.title}}</li>
        </ul>
        <div class="headRight">
          <div
            class="toCartWrap"
            v-show="GLOBA.isApp"
            @click="$router.push({path: '/details/cart'})"
          >
            <span>{{cartCounts}}</span>
            <img src="@/assets/img/other/baobao.png" />
          </div>
        </div>
      </div>
    </div>

    <mescroll-vue
      ref="mescroll"
      :class="GLOBA.height_foot2"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div>
        <!-- 轮播图 -->
        <SwiperG :photos1="photos1" @big_image="big_image" @load="load"></SwiperG>

        <div class="details_com">
          <!-- 商品信息 -->
          <Introduction ref="introduc" :good_data="good_data"></Introduction>
          <!-- 活动商品数据 -->
          <Shak v-if="goodsdeta.goods_point==1" ref="remain" :goodsdeta="goodsdeta"></Shak>
          <!-- 优惠券/满减 -->
          <CouponDeta
            v-if="coupon.length>0 || good_data.ertagmap || good_data.storemap.store_enough_free==1"
            :coupon="coupon"
            :good_data="good_data"
            @coupon_but="coupon_but"
          ></CouponDeta>
          <!-- 地区邮费 -->
          <Destination v-bind="ship_to" @xz_city="xz_city"></Destination>
          <!-- 商品规格 -->
          <div class="Specifications_box" @click="gu_aaa(0)" v-if="if_size">
            <div class="Specifications">
              <img class="titleImg" src="@/assets/img/other/size.png" alt />
              <div class="flexBox line-blok-clamp" v-if="specs_word.length != 0">
                <p class="selectOption" v-for="(spec,i) in specs_word" :key="i">
                  <span class="key">{{spec.spec_name}}:</span>
                  <span class="val">{{spec.gsp_value}}</span>
                </p>
              </div>
              <!-- 尺寸选择 -->
              <div class="flexBox line-blok-clamp" v-if="specs_word.length == 0">
                <p class="selectOption" v-for="(spec,e) in specs_default" :key="e">
                  <span class="key">{{spec.spec_name}}:</span>
                  <span class="val">{{spec.gsp_value}}</span>
                </p>
              </div>
            </div>
            <div class="flexBox">
              <p class="selectSizeBtn">{{$t("common.Select")}}</p>
              <img
                class="rightIconRow"
                :class="{'isRotate': GLOBA.isRotate}"
                src="../../../assets/img/other/xiangyou3.png"
                alt
              />
            </div>
          </div>
          <!-- 尺寸 -->
          <div
            class="Specifications_box"
            v-if="shoe"
            @click="$router.push({ path: '/subpages/sizeguide' })"
          >
            <div class="Specifications">
              <img class="titleImg" src="@/assets/img/other/shuxin.png" alt />
              <p class="size_details">{{$t("common.Size guide")}}</p>
            </div>
            <img
              class="rightIconRow"
              :class="{'isRotate': GLOBA.isRotate}"
              src="@/assets/img/other/xiangyou3.png"
              alt
            />
          </div>
          <!-- 详细信息 -->
          <GoodDeta v-if="if_parameter" @cp_cangshu="cp_cangshu"></GoodDeta>
          <!-- 亮点 -->
          <div class="highlight" v-if="goodsdeta.features_one">
            <h6>
              <img class="marg1" src="@/assets/img/other/liandian.png" alt />
              {{$t("common.Highlight")}}
            </h6>
            <div class="highlightList">
              <div class="highlightItems" v-if="goodsdeta.features_one">
                <p></p>
                <p
                  :class="{'ltr':goodsdeta.features_one.substr(0, 1) !== '^'}"
                >{{goodsdeta.features_one.substr(0, 1) === '^'?goodsdeta.features_one.substr(1):goodsdeta.features_one}}</p>
              </div>
              <div class="highlightItems" v-if="goodsdeta.features_two">
                <p></p>
                <p
                  :class="{'ltr':goodsdeta.features_one.substr(0, 1) !== '^'}"
                >{{goodsdeta.features_two.substr(0, 1) === '^'?goodsdeta.features_two.substr(1):goodsdeta.features_two}}</p>
              </div>
              <div class="highlightItems" v-if="goodsdeta.features_three">
                <p></p>
                <p
                  :class="{'ltr':goodsdeta.features_one.substr(0, 1) !== '^'}"
                >{{goodsdeta.features_three.substr(0, 1) === '^'?goodsdeta.features_three.substr(1):goodsdeta.features_three}}</p>
              </div>
              <div class="highlightItems" v-if="goodsdeta.features_four">
                <p></p>
                <p
                  :class="{'ltr':goodsdeta.features_one.substr(0, 1) !== '^'}"
                >{{goodsdeta.features_four.substr(0, 1) === '^'?goodsdeta.features_four.substr(1):goodsdeta.features_four}}</p>
              </div>
              <div class="highlightItems" v-if="goodsdeta.features_five">
                <p></p>
                <p
                  :class="{'ltr':goodsdeta.features_one.substr(0, 1) !== '^'}"
                >{{goodsdeta.features_five.substr(0, 1) === '^'?goodsdeta.features_five.substr(1):goodsdeta.features_five}}</p>
              </div>
            </div>
          </div>
          <!-- 商品详情/好评率 -->
          <DescripRev
            ref="reviev"
            :goodsdeta="goodsdeta"
            :goods_details_text="goods_details_text"
            :goods_details_img="goods_details_img"
            :items="items"
            @review_image="big_image"
          ></DescripRev>
        </div>

        <maylike ref="like" @good_id="good_id"></maylike>
      </div>
    </mescroll-vue>

    <!-- 底部导航 -->
    <div class="detailFootWrap bottomWrap" :class="{'isWeb':web_app != 0}">
      <div class="footSmallBtn">
        <div class="smallBtnItem home" @click="$router.push({ path: '/home'})" v-if="web_app != 0">
          <img src="../../../assets/img/tabbar/home1.png" alt />
          <p>{{$t("common.Home")}}</p>
        </div>
        <div class="smallBtnItem collect" v-click="wishlist">
          <img
            :src="wish===1 ? require('@/assets/img/other/star1.png'):require('@/assets/img/other/star.png')"
            alt
          />
          <p :class="wish===1?'color_':''">{{$t("common.Wishlist")}}</p>
        </div>
        <div class="smallBtnItem share" v-click="share_b">
          <img src="../../../assets/img/FreeGit/share.png" alt />
          <p>{{$t("common.Share")}}</p>
        </div>
      </div>
      <div
        class="addToCartBtn"
        v-DataClick="{func:tabbar_btn,data:'a'}"
      >{{$t("common.Add to cart")}}</div>
      <div class="buyBtn" v-if="isWebHasToken" v-DataClick="{func:tabbar_btn,data:'b'}">
        <p class="buy">{{$t("common.Buy now")}}</p>
      </div>
      <div class="buyBtn" v-else v-click="web_buy_now">
        <p class="buy">{{$t("common.Buy now")}}</p>
        <p>{{good_data.good_pr_co.goods_current_price | keeptwoNum}}{{GLOBA.money_tag}}</p>
      </div>
    </div>

    <!-- 选择规格  @listspec="listspec"-->
    <keep-alive>
      <Specs
        v-if="isspec"
        :id="goodsid"
        :to_guc="to_guc"
        :items="specs"
        :count="goodsdeta.well_inventory"
        :specs_word="specs_word"
        :closeSelectBox="closeSelectBox"
        :queding="queding"
        :queding_to="queding_to"
        @lists_pec="lists_pec"
        @price_number="price_number"
      ></Specs>
    </keep-alive>

    <keep-alive>
      <CouponReceive :lists="coupons" v-if="if_coupon_r" @coupon_c="coupon_c"></CouponReceive>
    </keep-alive>
    <!-- 选择地区 -->
    <SPopup v-show="xz_region" :area_info="area_info" @xz_close="xz_close" @city_qd="city_qd"></SPopup>
    <!-- 产品参数 -->
    <DPopup v-show="cs_region" :goodsdeta="goodsdeta" @wancheng="wancheng"></DPopup>
    <!-- 图片放大 -->
    <!-- <BigImg v-if="isenla" @conceal="conceal" :big_img="big_img"></BigImg> -->
    <Imgbig v-if="isenla" :photos="big_img" @enlargement="conceal"></Imgbig>
    <!-- 加载中 -->
    <Load v-if="isload"></Load>
    <WebReceiving
      @web_confirm="web_confirm"
      @closeReceivingBox="if_webrece = false"
      v-if="if_webrece"
    ></WebReceiving>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
import { constants, scrypt } from "crypto";
import Load from "@/whole/components/global/load_details";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: {
    Load,
    MescrollVue,
    SwiperG: () => import("@/whole/components/good_details/swiper"),
    Introduction: () => import("@/whole/components/good_details/introduction"),
    Specs: () => import("@/whole/components/global/spec_info"),
    CouponDeta: () => import("@/module/coupon/coupon_details"),
    CouponReceive: () => import("@/module/coupon/coupon_receive"),
    Destination: () => import("@/whole/components/good_details/destination"),
    Shak: () => import("@/module/invite/shak"),
    GoodDeta: () => import("@/whole/components/good_details/detalis"),
    DescripRev: () => import("@/whole/components/good_details/descrip_rev"),
    maylike: () => import("@/whole/components/global/may_like"),
    SPopup: () => import("@/whole/components/good_details/s_popup"),
    DPopup: () => import("@/whole/components/good_details/d_popup"),
    // BigImg: () => import("@/whole/components/good_details/big_img")
    Imgbig: () => import("@/whole/components/global/img_big"),
    WebReceiving: () => import("@/whole/components/good_details/web_receiving")
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20 // 每页数据的数量
        },
        toTop: {},
        empty: {},
        lazyLoad: {},
        onScroll: this.onScroll
      },
      //头部背景
      bannerHeight: document.documentElement.clientWidth || window.innerWidth,
      headColor: "rgba(1,126,194,0)",
      headOpacity: 0,

      goodsid: "", //商品id
      photos1: [], //商品主图
      isenla: false, //大图弹框
      big_img: {
        photo: [],
        i: ""
      },
      good_data: {
        //商品基本信息
        goodsdeta: "",
        good_pr_co: "",
        storemap: "",
        ertagmap: "",
        good_pri: 0
      },
      coupon: [], //优惠券
      coupons: [], //优惠券列表
      if_coupon_r: false, //优惠券状态
      goodsdeta: "", //商品信息
      //选择地区
      ship_to: {
        trans: 0,
        arrival_time: "",
        careaName: ""
      },
      xz_region: false,
      area_info: {
        area_name: "",
        citys: []
      },
      //规格start
      specs_word: [],
      specs_default: [],
      color_value: "", //颜色规格
      if_size: true,
      isspec: false,
      to_guc: "",
      spec_n: 0,
      specifica_tion: {},
      specs: {},
      //规格end
      shoe: true, // 判断是否为鞋子
      if_parameter: false, //商品详细介绍
      cs_region: false,
      goods_details_text: "No data ...", //商品详情文字
      goods_details_img: null,//商品详情图片
      items: [], //评价列表
      wish: "", //收藏
      //记录位置
      good_scroll: [],
      isload: true,

      isWebHasToken: true,
      if_webrece: false,
      web_app: localStorage.getItem("web_app"),
      copylink: "",
      cartCounts: 0,
      headNavEle: [
        {
          title: "Goods",
          offsetTop: 0
        },
        {
          title: this.$t('common.Details'),
          offsetTop: 0
        },
        {
          title: "Recommend",
          offsetTop: 0
        }
      ],
      headNavEleActive: 0
    };
  },
  activated() {
    this.getCartNum(); // 获取购物车数量
    let use = this.$store.state.status;
    if (this.web_app != 0) {
      if (!use.token) {
        this.isWebHasToken = false;
        this.copylink = this.$route.fullPath;
      } else {
        this.isWebHasToken = true;
      }
    }
    // window.onload=function(){console.log("1111111")};
    if (this.goodsid != this.$route.query.id || this.$route.meta.isBack) {
      this.isload = true;
      this.goods_details_img = null;
      this.goodsid = this.$route.query.id;
      this.goodsdetail();
      this.mescroll.resetUpScroll();
      setTimeout(() => {
        this.$refs.reviev.product_();
      }, 600);
    } else {
      this.isload = false;
    }
    this.isspec = false;
    this.good_scroll = [];
    setTimeout(() => {
      if (this.isload) {
        this.isload = false;
      }
    }, 20000);
    this.$route.meta.isBack = false;
  },
  mounted() {
    window.addEventListener(
      "popstate",
      e => {
        if (this.isenla) {
          this.isenla = !this.isenla;
        }
        if (this.isspec) {
          this.isspec = !this.isspec;
        }
        if (this.cs_region) {
          this.cs_region = !this.cs_region;
        }
        if (this.xz_region) {
          this.xz_region = !this.xz_region;
        }
        if (this.if_coupon_r) {
          this.if_coupon_r = !this.if_coupon_r;
        }
        if (this.if_webrece) {
          this.if_webrece = !this.if_webrece;
        }
      },
      false
    );
    this.$nextTick(() => {
      setTimeout(() => {
        this.getHeadNavOffset();
      }, 1000);
    });
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.isenla) {
          this.isenla = !this.isenla;
        }
        if (this.isspec) {
          this.isspec = !this.isspec;
        }
        if (this.xz_region) {
          this.xz_region = !this.xz_region;
        }
        if (this.cs_region) {
          this.cs_region = !this.cs_region;
        }
        if (this.if_coupon_r) {
          this.if_coupon_r = !this.if_coupon_r;
        }
        if (this.if_webrece) {
          this.if_webrece = !this.if_webrece;
        }
      },
      false
    );
  },
  beforeRouteUpdate(to, from, next) {
    if (to.query.id !== from.query.id) {
      setTimeout(() => {
        this.goodsid = to.query.id;
        this.goodsdetail();
        this.$refs.reviev.product_();
      }, 50);
    }
    next();
  },
  methods: {
    getHeadNavOffset() {
      let headHight = document.querySelector(".detailHeadWrap").offsetHeight;
      this.headNavEle[1].offsetTop =
        this.$refs.reviev.$el.offsetTop - headHight;
      this.headNavEle[2].offsetTop = this.$refs.like.$el.offsetTop - headHight;
    },
    goBack() {
      let _history = this.GLOBA.history;
      if (_history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        try {
          for(let i=_history.length-1; i>=0; i--){
            if(_history[i].meta.routeLevel > this.$route.meta.routeLevel || _history[i].name == this.$route.name || !_history[i].name){
              _history.splice(i,1);
            }
          }
        } catch (error) {console.log(error)}
        if (_history.length) {
          this.$router.push({
            name: _history[_history.length - 1].name,
            query: _history[_history.length - 1].query
          });
          this.GLOBA.history = _history.splice(0, _history.length - 1);
        } else {
          this.$router.push({ path: "/" });
        }
      }
    },
    async getCartNum() {
      let data = {
        language: this.$route.query.lang === "sa" ? 1 : 0
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
    load() {
      setTimeout(() => {
        this.isload = false;
      }, 100);
    },
    good_id(id) {
      let goodid = Number(this.goodsid);
      if (id == goodid) {
        this.mescroll.scrollTo(0, 0);
      } else {
        this.isload = true;
        let good_sc = {
          good_id: goodid,
          scroll: this.mescroll.getScrollTop()
        };
        this.good_scroll.push(good_sc);
        console.log(this.good_scroll);
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
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
    cp_cangshu() {
      this.cs_region = true;
      window.history.pushState(null, null, "#");
    },
    wancheng() {
      this.cs_region = false;
      this.$router.go(-1);
    },
    lists_pec(spec) {
      this.spec_n = spec.n;
      this.specifica_tion = spec.price;
      this.specifica_tion.count = spec.count;
      if (spec._value.length > 0) {
        this.color_value = spec._value[0].gsp_value;
      }
      this.specs_word = spec._value.concat(spec.result);
    },
    price_number(count) {
      this.specifica_tion.count = count;
    },
    // 规格确认
    async queding() {
      if (this.spec_n === -1) {
        Toast({
          message: this.$t("message.Please select a size"),
          time: 2000,
          i: 1
        });
      } else {
        this.isspec = false;
        let gsp = [];
        this.specs_word.forEach(item => {
          if (item.gsp_id) {
            gsp.push(item.gsp_id);
          }
        });
        const data = {
          id: this.goodsid,
          gsp: gsp.toString(),
          color: this.color_value
        };
        let res = await this.$HTTP.goods_gsps(data);
        if (res.code == 0) {
          // this.$router.go(-1);
          if (typeof res.data.spec_map !== "undefined") {
            this.good_data.good_pr_co = res.data.spec_map; //库存和缓存
          }
          this.city_qd(0);
        }
      }
    },
    // 确认加入购物车
    async queding_to(i) {
      if (this.spec_n === -1) {
        Toast({
          message: this.$t("message.Please select a size"),
          time: 2000,
          i: 1
        });
      } else {
        let gsp = [];
        this.specs_word.forEach(item => {
          if (item.gsp_id) {
            gsp.push(item.gsp_id);
          }
        });
        console.log(gsp.toString());
        if (i == "1") {
          // this.$router.go(-1);
          this.buy_btn(gsp, this.color_value, this.specifica_tion.count);
        } else if (i == "999") {
          this.if_webrece = true;
        } else {
          let data = {
            goods_id: this.goodsid,
            count: this.specifica_tion.count,
            price: this.specifica_tion.goods_current_price,
            gsp: gsp.toString(),
            buy_type: "",
            combin_ids: "",
            combin_version: "",
            user_id: "",
            cart_mobile_ids: "",
            color: this.color_value
          };
          let res = await this.$HTTP.add_goods_cart(data);
          if (res.code == -100)
            return this.$router.push({ path: "/account/login" });
          if (res.code == 0) {
            this.city_qd(0);
            this.isspec = false;
            Toast({
              message: this.$t("message.Added to the cart"),
              time: 2000,
              i: 0
            });
            this.getCartNum();
          } else if (res.code == 3) {
            Toast({
              message: this.$t("message.Inventory is 0"),
              time: 2000,
              i: 0
            });
          } else {
            Toast({
              message: this.$t("message.Add product error"),
              time: 2000,
              i: 1
            });
          }
        }
      }
    },
    closeSelectBox() {
      this.isspec = false;
      this.$router.go(-1);
    },
    gu_aaa(i) {
      this.isspec = true;
      this.to_guc = i;
      window.history.pushState(null, null, "#");
    },

    async goodsdetail() {
      this.specs = {};
      this.items = [];
      this.specs_word = [];
      this.specs_default = [];
      this.coupon = [];
      this.coupons = [];
      this.photos1 = [];

      const data = {
        id: this.goodsid,
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.goods(data);
      if (typeof res.data.evalist !== "undefined") {
        res.data.evalist.forEach(item => {
          this.items.push(item);
        });
      }
      if (res.code == 0) {
        this.good_data.goodsdeta = res.data.goods; //商品信息
        this.good_data.storemap = res.data.storemap; //店铺信息

        String.prototype.replaceAll = function(s1, s2) {
          return this.replace(new RegExp(s1, "gm"), s2);
        };
        this.goods_details_text = res.data.goods.goods_character_detail
        if (typeof res.data.goods.goods_photo_detail != "undefined" && res.data.goods.goods_photo_detail != "") {
          let url_ =this.$store.state.country_i == 1? "https://photo.soarmall.com/":"https://photo1.soarmall.com/";
          const reg = /<img(.*?)src="((?!http).*?)"(.*?)>/g;
          let result = res.data.goods.goods_photo_detail.replace(reg,'<img$1src="' + url_ + '$2"$3>');
          this.goods_details_img = result;
          // res.data.goods.goods_detail.replaceAll(
          //   "\n",
          //   "<br/>"
          // );
        }
        if (res.data.coupon.length > 0) {
          //优惠券
          this.coupons = res.data.coupon;
          res.data.coupon.some((ie, i) => {
            if (i < 2) {
              this.coupon.push(ie);
            }
          });
        }
        if (res.data.goods.goods_pointNum) {
          res.data.goods.ratio =
            res.data.goods.user_pointNum / res.data.goods.goods_pointNum < 1
              ? res.data.goods.user_pointNum / res.data.goods.goods_pointNum
              : 1;
        }

        this.goodsdeta = res.data.goods; // 商品信息

        if (typeof res.data.er_json !== "undefined") {
          let er_json = Object.entries(res.data.er_json);
          this.good_data.ertagmap = er_json; //商品满减
          console.log(er_json, 2222222222222222222222222222);
        } else {
          this.good_data.ertagmap = "";
        }

        let data = {
          currentPage: 1,
          goods_id: this.goodsdeta.goodsid
        };
        // 请求详情评论接口
        this.specs = res.data.spec;
        this.wish = this.goodsdeta.goods_favorite_goods;
        if (res.data.goods.goods_property.length != 0) {
          this.if_parameter = true;
        } else {
          this.if_parameter = false;
        }
        if (typeof res.data.goods.goods_current_price !== "undefined") {
          // 显示无规格价格
          this.good_data.good_pri = 1;
          this.if_size = false;
          this.good_data.good_pr_co = res.data.goods; //库存和缓存
        }
        if (res.data.goods.goods_gc_id == 688) {
          // 判断是否为鞋子
          this.shoe = true;
        } else {
          this.shoe = false;
        }
        // 默认规格
        let gsp = [];
        if (res.data.spec.color.length !== 0) {
          this.if_size = true;
          this.good_data.good_pri = 0;
          this.color_value = res.data.spec.color[0].value;
          let color_ = {
            gsp_value: res.data.spec.color[0].value,
            spec_name: "Color"
          };
          this.specs_default.push(color_);
        }
        if (res.data.spec.spec_info.length != 0) {
          this.if_size = true;
          this.good_data.good_pri = 0;
          res.data.spec.spec_info.forEach(i => {
            i.gsp_list[0].spec_name = i.spec_name;
            this.specs_default.push(i.gsp_list[0]);
            gsp.push(i.gsp_list[0].gsp_id);
          });
          const gui_ge = {
            id: this.goodsid,
            gsp: gsp.toString(),
            color: this.color_value
          };
          this.$HTTP.goods_gsps(gui_ge).then(res => {
            if (res.code == 0) {
              if (typeof res.data.spec_map !== "undefined") {
                this.good_data.good_pr_co = res.data.spec_map; //库存和缓存
              }
            }
          });
        }

        (this.ship_to = {
          trans: 0,
          arrival_time: "",
          careaName: ""
        }),
          //默认地区start
          (this.ship_to.arrival_time = res.data.goods.goods_arrival_time);
        this.area_info.area_name = res.data.area_info[0].areaname;
        this.$HTTP.load_area({pid: res.data.area_info[0].areaid},{showLoading: false}).then(res=>{
          this.area_info.citys = res.data;
          this.ship_to.careaName = res.data[0];
          const data = {
            goods_id: this.goodsdeta.goodsid,
            type: "express",
            volume: "",
            city_name: res.data[0].areaName,
            number: 1,
            gsp: gsp.toString(),
            color: this.color_value
          };
          this.$HTTP.fee_info(data).then(res => {
            console.log(res, 55);
            if (res.code == 0) {
              this.ship_to.trans = res.data;
            }
          });
        });
        //默认地区end
        let img1 = "jpeg_middle.jpeg";
        let img2 = "png_middle.png";
        let goodsimg1 = {
          img: ""
        };
        if (res.data.goods.goodsimg.includes(img1)) {
          goodsimg1.img = res.data.goods.goodsimg.replace(
            /jpeg_middle.jpeg/,
            "jpeg"
          );
        } else if (res.data.goods.goodsimg.includes(img2)) {
          goodsimg1.img = res.data.goods.goodsimg.replace(
            /png_middle.png/,
            "png"
          );
        } else {
          goodsimg1.img = res.data.goods.goodsimg;
        }
        this.photos1.push(goodsimg1);

        res.data.goods.photos.forEach(item => {
          let data_res1 = {
            img: ""
          };
          if (item.photos.includes(img1)) {
            data_res1.img = item.photos.replace(/jpeg_middle.jpeg/, "jpeg");
          } else if (item.photos.includes(img2)) {
            data_res1.img = item.photos.replace(/png_middle.png/, "png");
          } else {
            data_res1.img = item.photos;
          }
          this.photos1.push(data_res1);
        });

        if (res.data.goods.goods_point == 1) {
          setTimeout(() => {
            this.$refs.remain.remain_();
          }, 300);
        }
        let click = this.$store.state.click;
        setTimeout(() => {
          if (click == "wishlist") {
            this.wishlist();
          }
          this.$store.commit("click", "");
        }, 500);
      }

      let scroll = true;
      if (this.good_scroll.length > 0) {
        this.good_scroll.some((item, i) => {
          if (item.good_id == this.goodsid) {
            this.good_scroll.splice(i, 1);
            this.mescroll.scrollTo(item.scroll, 0);
            scroll = false;
            return true;
          }
        });
        if (scroll) {
          this.mescroll.scrollTo(0, 0);
        }
      } else {
        this.mescroll.scrollTo(0, 0);
      }
    },
    // 加入购物车
    async tabbar_btn(i) {
      let coun = "";
      let pric = "";
      if (this.good_data.good_pri == 0) {
        coun = this.specifica_tion.count;
        pric = this.specifica_tion.goods_current_price;
      } else if (this.good_data.good_pri == 1) {
        coun = 1;
        pric = this.goodsdeta.goods_current_price;
      }
      if (this.if_size == false) {
        let data = {
          goods_id: this.goodsid,
          count: coun,
          price: pric,
          gsp: "",
          buy_type: "",
          combin_ids: "",
          combin_version: "",
          user_id: "",
          cart_mobile_ids: ""
        };
        if (i == "b") {
          this.buy_btn("", "", coun);
        } else {
          let res = await this.$HTTP.add_goods_cart(data);
          if (res.code == 0) {
            this.isspec = false;
            if (i == "a") {
              Toast({
                message: this.$t("message.Added to the cart"),
                time: 2000,
                i: 0
              });
              this.getCartNum();

              if (window.fbAsyncInit) {
                // 如果FB初始化成功
                this.logAddToEvent("addToCart"); //推送加入购物车事件
              }
            }
          } else if (res.code == 3) {
            Toast({
              message: this.$t("message.Inventory is 0"),
              time: 2000,
              i: 0
            });
          } else if (res.code == -100) {
            this.$router.push({ path: "/account/login" });
          } else {
            Toast({
              message: this.$t("message.Add product error"),
              time: 2000,
              i: 0
            });
          }
        }
      } else {
        this.isspec = true;
        window.history.pushState(null, null, "#");
        if (i == "a") {
          this.to_guc = 1;
        } else if (i == "b") {
          this.to_guc = 4;
        }
      }
    },
    //直接下单
    async buy_btn(gsp, color, count) {
      let data = {
        id: this.goodsid,
        gsp: gsp ? gsp.toString() : "",
        color: color ? color : "",
        count: count,
        type: "",
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.buy_now(data);
      console.log(res)
      let goPath = "";
      switch (res.code) {
        case 0:
          goPath = "/whole/pay/payment_now";
          this.$store.commit("submitBuyNow", res.data);
          break;
        case 4205:
          goPath = "/address";
          break;
        case -100:
          goPath = "/account/login";
          break;
        case 4220:
          Toast({
            message: this.$t("common.Off shelf"),
            time: 2000,
            i: 1
          });
          break;
        default:
          Toast({
            message: this.$t("message.Server is busy"),
            time: 2000,
            i: 1
          });
          break;
      }
      if (goPath) this.$router.push({ path: goPath });
    },
    // 收藏和取消收藏
    async wishlist() {
      if (this.wish == 1) {
        const data = {
          goods_id: this.goodsid,
          store_id: ""
        };
        let res = await this.$HTTP.favorite_store_d(data);
        if (res.code == 0) {
          this.wish = 0;
          Toast({
            message: this.$t("message.Cancel successful"),
            time: 2000
          });
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            time: 2000,
            i: 1
          });
        }
      } else if (this.wish == 0) {
        const data = {
          id: this.goodsid
        };
        let res = await this.$HTTP.add_goods_favorite(data);
        if (res.code == 0) {
          this.wish = 1;
          Toast({
            message: this.$t("message.Collection Of Success"),
            time: 2000
          });

          if (window.fbAsyncInit) {
            // 如果FB初始化成功
            this.logAddToEvent("addToWish"); //推送加入收藏事件
          }
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            time: 2000,
            i: 1
          });
        }
      } else if (this.wish == undefined) {
        this.$router.push({
          path: "/account/login",
          query: { id: "wishlist" }
        });
      }
    },
    //分享
    share_b() {
      const country_i = this.$store.state.country_i;
      const ct = country_i == 1 ? "/ua" : "/sa";
      let url =
        "https://m.soarmall.com" +
        ct +
        "/#/home/details?id=" +
        this.goodsdeta.goodsid;
      let content =
        this.goodsdeta.goodsname + "; AED" + this.goodsdeta.goods_current_price;
      let message = {
        type: "web",
        thumbs: ["../../../assets/img/loader.png", this.goodsdeta.goodsimg],
        title: "Soarmall", //微信支持
        content: content,
        href: url
      };
      plus.share.sendWithSystem(
        message,
        function() {
          // alert('分享成功');
        },
        function(e) {
          // alert('分享失败：'+JSON.stringify(e));
        }
      );
    },
    //优惠券
    coupon_but() {
      this.if_coupon_r = true;
      window.history.pushState(null, null, "#");
    },
    coupon_c() {
      this.if_coupon_r = false;
      this.$router.go(-1);
    },
    // 选择城市
    xz_city() {
      this.xz_region = true;
      window.history.pushState(null, null, "#");
    },
    xz_close() {
      this.xz_region = false;
      this.$router.go(-1);
    },
    city_qd(city) {
      this.xz_region = false;
      this.$router.go(-1);
      let city_name = "";
      let gsp = [];
      let count = 1;
      if (city == 0) {
        city_name = this.ship_to.careaName.areaName;
        count = this.specifica_tion.count;
        this.specs_word.forEach(item => {
          if (item.gsp_id) {
            gsp.push(item.gsp_id);
          }
        });
      } else {
        this.ship_to.careaName = city;
        city_name = city.areaName;
        count = 1;
        this.specs_default.forEach(item => {
          if (item.gsp_id) {
            gsp.push(item.gsp_id);
          }
        });
      }
      const data = {
        goods_id: this.goodsid,
        type: "express",
        volume: "",
        city_name: city_name,
        number: count,
        gsp: gsp.toString(),
        color: this.color_value
      };
      this.$HTTP.fee_info(data).then(res => {
        if (res.code == 0) {
          console.log(res.data, 11881188);
          this.ship_to.trans = res.data;
        } else if (res.code == 2) {
          this.ship_to.trans = res.data;
        } else {
          this.ship_to.trans = 0;
        }
      });
    },
    // 放大图片
    big_image(image) {
      console.log(image);
      this.isenla = true;
      window.history.pushState(null, null, "#");
      if (image.big == 0) {
        let photos = [];
        this.photos1.forEach(item => {
          let photo = {
            photo: item.img
          };
          photos.push(photo);
        });
        this.big_img.photo = photos;
      } else if (image.big == 1) {
        this.big_img.photo = image.child;
      }
      this.big_img.i = image.i;
    },
    conceal() {
      this.isenla = false;
      this.$router.go(-1);
    },
    web_buy_now() {
      if (this.if_size) {
        this.isspec = true;
        window.history.pushState(null, null, "#");
        this.to_guc = 999;
      } else {
        this.if_webrece = true;
      }
    },
    web_confirm() {
      // this.if_webrece = false;
      this.isWebHasToken = true;
      let coun = "";
      let pric = "";
      if (this.good_data.good_pri == 0) {
        coun = this.specifica_tion.count;
        pric = this.specifica_tion.goods_current_price;
      } else if (this.good_data.good_pri == 1) {
        coun = 1;
        pric = this.goodsdeta.goods_current_price;
      }
      if (this.if_size == false) {
        this.buy_btn("", "", coun);
      } else {
        if (this.spec_n === -1) {
          Toast({
            message: this.$t("message.Please select a size"),
            time: 2000,
            i: 1
          });
        } else {
          let gsp = [];
          this.specs_word.forEach(item => {
            if (item.gsp_id) {
              gsp.push(item.gsp_id);
            }
          });
          this.buy_btn(gsp, this.color_value, this.specifica_tion.count);
        }
      }
    },
    Buy_APP() {
      let Android_iOS = JSON.parse(localStorage.getItem("Android_iOS") || "[]");
      if (Android_iOS == 0) {
        window.location.href =
          "https://apps.apple.com/cn/app/soarmall/id1487094859";
      } else {
        window.location.href =
          "https://play.google.com/store/apps/details?id=plus.H5ED64880";
      }
    },
    // FB 推送页面事件消息
    logAddToEvent(addToName) {
      let goodData = this.good_data.goodsdeta;
      var params = {};
      params[FB.AppEvents.ParameterNames.CONTENT] = goodData.goodsname;
      params[FB.AppEvents.ParameterNames.CONTENT_ID] = goodData.goodsid;
      params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = goodData.goods_detail;
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
  }
};
</script>

<style lang='scss'>
.rightIconRow{
  width: 0.1rem;
  margin: 0 0.1rem;
}
.headRight {
  height: 1rem;
  width: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.isApp .detailHeadWrap{
  padding-top: 0.4rem;
}
.detailHeadWrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
}
.detailHead {
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.goBackWrap {
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .backBg {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: rgba(1, 126, 194, 0.2);
    text-align: center;
    line-height: 0.55rem;
  }
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
    padding: 0.2rem 0.16rem;
  }
  li.active {
    text-decoration: underline;
    font-weight: bold;
  }
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
.mescroll::-webkit-scrollbar {
  display: none;
}
.detailFootWrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 1rem;
  background: #fff;
  font-size: 0.24rem;
  font-weight: 400;
  font-family: "Calibri";
  color: #333;
  text-align: center;
  background-color: #f1faff;
}
.isWeb {
  .collect,
  .addToCartBtn {
    display: none;
  }
  .footSmallBtn {
    width: 40%;
  }
  .buyBtn {
    width: 50%;
  }
}
.footSmallBtn {
  width: 36%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.smallBtnItem {
  width: 50%;
  padding-top: 0.1rem;
  img {
    width: 0.4rem;
  }
}
.collect .color_ {
  color: #017ec2;
}
.addToCartBtn {
  width: 32%;
  height: 100%;
  background-color: #33b6ff;
  color: #fff;
  text-align: center;
  line-height: 1rem;
  font-size: 0.3rem;
  font-weight: Bold;
  font-family: "Calibri-Bold";
}
.xq_right {
  height: 100%;
  width: 2.4rem;
  background: #017ec2;
  color: #fff;
  text-align: center;
  line-height: 1rem;
  font-size: 0.3rem;
  font-weight: Bold;
  font-family: "Calibri-Bold";
}
.buyBtn {
  width: 32%;
  color: #fff;
  text-align: center;
  line-height: 0.3rem;
  background-color: #017ec2;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .buy {
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.3rem;
    font-weight: Bold;
    font-family: "Calibri-Bold";
  }
}
.details_com {
  width: 100%;
  padding: 0.2rem 0;
  box-sizing: border-box;
}
// 好评率
// .reviewsbox-leave-active,
// .reviewsbox-enter-active {
//   transition: all 1s ease;
// }

// .reviewsbox-leave-active,
// .reviewsbox-enter {
//   height: 0px !important;
// }

// .reviewsbox-leave,
// .reviewsbox-enter-active {
//   height: 100%;
// }
.selectOption {
  font-weight: normal;
  .key {
    padding: 0 0.1rem;
  }
  .val {
    color: #757575;
  }
}
.size_details {
  padding: 0 0.1rem;
}
.Specifications_box {
  padding: 0 0.1rem;
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  height: 0.92rem;
  margin-top: 0.3rem;
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
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
}
.highlight {
  margin-top: 0.3rem;
  font-size: 0.32rem;
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  padding: 0.2rem 0;
  h6 {
    font-weight: bold;
    font-size: 0.28rem;
    font-family: "Calibri-Bold";
    padding-left: 0.24rem;
    padding-right: 0.24rem;
    img {
      width: 0.3rem;
    }
  }
}
.highlightItems {
  padding: 0.1rem 0.3rem;
  display: flex;
  font-size: 0.24rem;
  align-items: center;
  p:first-child {
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 50%;
    overflow: hidden;
    background: #131212;
  }
  p:nth-child(2) {
    padding: 0 0.1rem;
    width: 90%;
    color: black;
  }
}
</style>
