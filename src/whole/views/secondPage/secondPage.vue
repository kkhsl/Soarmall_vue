<template>
  <div class="full_page">
    <publicHead ref="publicHead">
      <h6 slot="headCenter">{{publicHeadTitle}}</h6>
    </publicHead>
    <!-- 商品分类 -->
    <div class="tabsWarp" ref="tabsWarp" v-if="showTabs">
      <div class="tabsNav">
        <div
          class="tab"
          v-for="(tab, index) of tabs"
          :key="index"
          :class="{'active':curIndex == index}"
          @click="changeTab(index)"
        >{{tab.title}}</div>
      </div>
    </div>
    <swiper ref="mySwiper" :options="swiperOption" v-if="tabs">
      <swiper-slide v-for="(swiperList, swiperIndex) of tabs" :key="swiperIndex">
        <mescroll-vue
          class="mescrollWrap"
          :class="{'dontHasNavHeight':!showTabs}"
          :ref="'mescroll'+swiperIndex"
          :down="mescrollDownOptions(swiperIndex)"
          :up="mescrollUpOptions(swiperIndex)"
          @init="mescrollInit(swiperIndex, arguments)"
        >
          <Goods :id="'dataList'+swiperIndex" :items="tabs[swiperIndex].list" class="productItems"></Goods>
        </mescroll-vue>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import MescrollVue from "@/plugins/scroll/mescroll";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import publicHead from "@/whole/components/header/publicHead";
import Goods from "@/whole/components/global/goods";
export default {
  components: { BScroll, swiper, swiperSlide, MescrollVue, publicHead, Goods },
  data() {
    return {
      lang: "en",
      showTabs: false,
      publicHeadTitle: "",
      tabs: [],
      curIndex: 0,
      swiperOption: {
        on: {
          transitionEnd: () => {
            this.changeTab(this.swiperObj.activeIndex);
          }
        }
      },
      navId: "",
      splitParms: {
        type: null,
        value: null
      }
    };
  },
  activated() {
    this.startFn();
  },
  // mounted() {
  //   this.startFn();
  // },
  computed: {
    swiperObj() {
      // 轮播对象
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    startFn() {
      this.lang = this.$route.query.lang;
      if (
        this.navId != this.$route.query.navId ||
        this.splitParms.type != this.$route.query.type ||
        this.splitParms.value != this.$route.query.value
      ) {
        this.navId = this.$route.query.navId;
        this.splitParms.type = this.$route.query.type;
        this.splitParms.value = this.$route.query.value;
        this.tabs = [];
        this.curIndex = this.swiperObj.activeIndex = 0;
        this.getTabNav();
      }
    },
    async getTabNav() {
      let res = await this.$PHP.get_barner(this.navId);
      if (res.code == 0) {
        this.publicHeadTitle =
          this.lang == "sa" ? res.data.row.arabic_title : res.data.row.title; // 头部标题
        let arrTabs = [];
        if (res.data.list.length) {
          res.data.list.forEach(item => {
            if (this.lang == "sa") {
              arrTabs.push({
                title: item.arabic_title || item.title,
                link: item.arabic_link || item.link,
                img: item.arabic_img || item.img,
                mescroll: null, //mescroll实例
                list: [], // 商品列表
                isListInit: false // 是否已经初始化
              });
            } else {
              arrTabs.push({
                title: item.title,
                link: item.link,
                img: item.img,
                mescroll: null,
                list: [],
                isListInit: false
              });
            }
          });
          this.splitParms = arrTabs[0].link;
          this.showTabs = true;
          this.$nextTick(() => {
            if (!this.betterScroll) {
              this.betterScroll = new BScroll(this.$refs.tabsWarp, {
                startX: 0,
                click: true,
                scrollX: true,
                scrollY: false,
                eventPassthrough: "vertical"
              });
            } else {
              this.betterScroll.refresh();
            }
          });
        } else {
          arrTabs.push({
            mescroll: null,
            list: [],
            isListInit: false
          });
          this.showTabs = false;
        }
        this.tabs = arrTabs;
      }
      console.log(this.splitParms.type,this.splitParms.value)
    },
    changeTab(changeIndex) {
      if (this.curIndex === changeIndex) return; // 避免重复调用
      let curTab = this.tabs[this.curIndex]; // 当前列表
      let newTab = this.tabs[changeIndex]; // 新转换的列表
      curTab.mescroll && curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
      this.curIndex = changeIndex; // 切换菜单
      this.swiperObj.slideTo(changeIndex);
      // 菜单项居中
      let currentEl = this.$refs.tabsWarp.querySelectorAll(".tab")[changeIndex];
      this.betterScroll.scrollToElement(currentEl, 300, true);
      if (newTab.mescroll) {
        this.splitParms = newTab.link;
        if (!newTab.isListInit) {
          // 加载列表
          newTab.mescroll.triggerDownScroll();
        } else {
          // 检查新转换的列表是否需要显示回到到顶按钮
          setTimeout(() => {
            let curScrollTop = newTab.mescroll.getScrollTop();
            if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
              newTab.mescroll.showTopBtn();
            } else {
              newTab.mescroll.hideTopBtn();
            }
          }, 30);
        }
      }
    },
    mescrollInit(tabIndex, arg) {
      this.tabs[tabIndex].mescroll = arg[0]; // 传入mescroll对象
      this.tabs[tabIndex].mescroll.tabIndex = tabIndex; // 加入标记,便于在回调中取到对应的list
    },
    // 下拉刷新
    mescrollDownOptions(tabIndex) {
      return {
        auto: tabIndex == 0, // 第一个mescroll传入true,列表自动加载
        callback: this.downCallback
      };
    },
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    mescrollUpOptions(tabIndex) {
      let emptyWarpId = "dataList" + tabIndex;
      return {
        auto: false,
        offset: 20,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 30 // 每页数据的数量
        },
        empty: {
          warpId: emptyWarpId, // 父布局的id;
          btnClick: this.emptyBtnFn
        }
      };
    },
    upCallback(page, mescroll) {
      this.tabs[mescroll.tabIndex].isListInit = true; // 标记列表已初始化,保证列表只初始化一次
      this.getListDataFromNet(
        mescroll.tabIndex,
        page.num,
        curPageData => {
          if (page.num === 1) {
            this.tabs[mescroll.tabIndex].list = curPageData; // 如果是第一页需手动制空列表
          } else {
            this.tabs[mescroll.tabIndex].list = this.tabs[
              mescroll.tabIndex
            ].list.concat(curPageData); // 追加新数据
          }
          mescroll.endSuccess(curPageData.length); // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        },
        () => {
          if (page.num === 1) this.tabs[mescroll.tabIndex].isListInit = false;
          mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
        }
      );
    },
    async getListDataFromNet(
      tabIndex,
      pageNum,
      successCallback,
      errorCallback
    ) {
      //0：搜索关键字，1：品类id，2：店铺id，3：商品id,5：折扣id
      console.log('type:'+this.splitParms.type,'value:'+this.splitParms.value)
      let type = Number(this.splitParms.type)
      let listData = [];
      switch (type) {
        case 0:
          let data_g = {
            orderBy: "",
            orderType: "",
            goods_type: "",
            goods_inventory: "",
            goods_transfee: "",
            goods_cod: "",
            searchType: "",
            keyword: this.splitParms.value, //关键字查询
            currentPage: pageNum,
            gc_id: ""
          };
          this.$HTTP.search(data_g,{showLoading:false}).then(res => {
            if (res.code == 0) {
              if (typeof res.data.lucen != "undefined") {
                res.data.lucen.forEach(item => {
                  let so_you = {
                    goodinventory: item.goodinventory,
                    goods_price: item.goods_price,
                    goodscurrprice: item.goodscurrprice,
                    goodsid: item.goodsid,
                    goodsname: item.goodsname,
                    main_photo_url: item.main_photo_url,
                    photos_url: item.photos_url,
                    store_price: item.store_price,
                    well_evaluate: item.vo_well_evaluate,
                    goods_discount_rate:
                      ((item.goods_price - item.goods_current_price) /
                        item.goods_price) *
                      100,
                    goods_type: item.goods_type,
                    store_logo: item.store_logo,
                    goods_collect: item.goods_collect
                  };
                  listData.push(so_you);
                });
                // 回调
                successCallback(listData);
              }
            } else {
              errorCallback();
            }
          });
          break;
        case 1:
          let data_k = {
            brand_ids: "", //品牌id
            gs_ids: "", //商品规格
            properties: "", //属性
            orderBy: "",
            orderType: "",
            all_property_status: "",
            detail_property_status: "",
            goods_type: "", //商品类型（自营）
            goods_inventory: "", //库存
            goods_transfee: "", //商品运费承担方式，0为买家承担，1为卖家承担
            goods_cod: "", //是否支持货到付款，默认为0：支持货到付款，-1为不支持货到付款
            gc_id: this.splitParms.value,
            currentPage: pageNum,
            language: this.lang == "sa" ? 1 : 0
          };
          this.$HTTP.goods_list(data_k,{showLoading:false}).then(res => {
            if (res.code == 0) {
              if (res.data.goodslist.length > 0) {
                res.data.goodslist.forEach(item => {
                  let so_you = {
                    goodinventory: "",
                    goods_price: item.goods_price,
                    goodscurrprice: item.goods_current_price,
                    goodsid: item.goodsid,
                    goodsname: item.goods_name,
                    main_photo_url: item.goods_main_photo,
                    photos_url: "",
                    store_price: "",
                    well_evaluate: item.well_evaluate,
                    goods_discount_rate:
                      ((item.goods_price - item.goods_current_price) /
                        item.goods_price) *
                      100,
                    goods_type: item.goods_type,
                    store_logo: item.store_logo,
                    goods_collect: item.goods_collect
                  };
                  listData.push(so_you);
                });
              }
              successCallback(listData);
            } else {
              errorCallback();
            }
          });
          break;
        case 2:
          let data_s = {
            orderBy: "",
            orderType: "",
            store_recommend: "",
            store_creativity: "",
            goods_global: "",
            goods_type: "",
            goods_store: this.splitParms.value,
            currentPage: pageNum
          };
          this.$HTTP.store_goods_info(data_s,{showLoading:false}).then(res => {
            if (res.code == 0) {
              if (res.data.goods_info.length > 0) {
                res.data.goods_info.forEach(item => {
                  let so_you = {
                    goodinventory: item.goods_inventory,
                    goods_price: item.goods_price,
                    goodscurrprice: item.goods_current_price,
                    goodsid: item.goodsid,
                    goodsname: item.goodsname,
                    main_photo_url: item.goodsimg,
                    photos_url: item.photos_url,
                    store_price: item.store_price,
                    vo_well_evaluate: item.well_evaluate,
                    goods_collect: item.goods_collect
                  };
                  listData.push(so_you);
                });
              }
              // 回调
              successCallback(listData);
            } else {
              errorCallback();
            }
          });
          break;
        default:
          let data = {
            orderBy: "",
            orderType: "",
            type: '', // ""：新； store_recommend : 精选； store_creativity：创意 ； goods_global：国际直发 ; desc ：折扣
            price: '', //价格区间
            currentPage: pageNum, //当前页数
            language: this.lang === "sa" ? 1 : 0
          };
          if(this.publicHeadTitle.indexOf('purchase')>=0){
            data.price = this.splitParms.value;
          }else{
            data.type = this.splitParms.value;
          }
          this.$HTTP.index_discount(data,{showLoading:false}).then(res => {
            if (res.code == 0) {
              if (res.data.goods_info.length > 0) {
                res.data.goods_info.forEach(item => {
                  let percentage = 0;
                  let inventory =
                    item.store_deals_inventory - item.goods_salenum > 0
                      ? item.store_deals_inventory - item.goods_salenum
                      : 0;
                  if (item.store_deals_inventory == 0) {
                    percentage = 0;
                  } else {
                    percentage =
                      item.goods_inventory / item.store_deals_inventory;
                  }
                  let so_you = {
                    store_price: item.goodsprice,
                    goods_price: item.goodsprice,
                    goodscurrprice: item.goods_current_price,
                    goodsid: item.goods_id,
                    goodsname: item.goods_name,
                    main_photo_url: item.goodsimaPath,
                    store_logo: item.store_logo,
                    goods_type: item.goods_type,
                    goods_discount_rate: item.goods_discount_rate,
                    well_evaluate: item.well_evaluate,
                    goods_collect: item.goods_collect,
                    goods_inventory: item.goods_inventory,
                    goods_salenum: item.goods_salenum,
                    store_deals_inventory: item.store_deals_inventory,
                    percentage: percentage,
                    inventory: inventory,
                    Deals: this.splitParms.value == "store_deals" ? 1 : 0
                  };
                  listData.push(so_you);
                });
              }
              // 回调
              successCallback(listData);
            } else {
              errorCallback();
            }
          });
      }
    },
    emptyBtnFn() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style lang="scss" scoped>
.tabsWarp {
  background-color: #017ec2;
  box-sizing: border-box;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  height: 0.6rem;
}
.tabsWarp::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.tabsNav {
  display: inline-block;
  white-space: nowrap;
  .tab {
    display: inline-block;
    height: 0.6rem;
    padding: 0 0.2rem;
    line-height: 0.3rem;
    vertical-align: middle;
    color: #ccc;
    position: relative;
    font-size: 0.22rem;
  }
  .tab.active {
    color: #fff;
    font-size: 0.26rem;
    font-weight: bold;
    &::after {
      content: "";
      position: absolute;
      bottom: 0.1rem;
      width: 50%;
      height: 0.04rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: #fff;
    }
  }
}
.isApp .mescrollWrap {
  height: calc(100vh - 2rem);
}
.isApp .mescrollWrap.dontHasNavHeight {
  height: calc(100vh - 1.4rem);
  box-sizing: border-box;
}
.mescrollWrap.dontHasNavHeight {
  height: calc(100vh - 1rem);
  box-sizing: border-box;
}
.mescrollWrap {
  height: calc(100vh - 1.6rem);
  padding: 0.2rem 0;
  box-sizing: border-box;
}
</style>
