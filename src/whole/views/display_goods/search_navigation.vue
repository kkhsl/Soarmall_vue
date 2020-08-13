<template>
  <div class="full_page">
    <publicHead ref="publicHead">
      <h6 slot="headCenter">{{txt_title}}</h6>
    </publicHead>
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <!-- 活动规则 -->
      <!-- <div class="ac">
      <div class="rule" v-if="rules">
          <div class="Rules_box">
            <div class="rulesWrap">
               <h5 class="Rules">Rules:</h5> 
              <div class="r_title">{{rules}}</div>
            </div>
          </div>
        </div>
      </div>-->
      <div class="banner" ref="bannerPic">
        <img :src="rules" />
      </div>
      <!-- 商品分类 -->
      <div class="porductBox" ref="topNav">
        <ul class="topNavList" v-if="header_re">
          <li
            class="quan_conter"
            v-for="(recom, index) in header_re"
            :key="index"
            @click="to_goods(recom.link,index,recom.title)"
            :class="{'active':currentIndex==index}"
          >
            <!-- <p class="img1">
              <img v-lazy="recom.img" />
            </p>-->
            {{recom.title}}
          </li>
        </ul>
        <Goods :items="items" class="productItems"></Goods>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "@/plugins/scroll/mescroll";
import publicHead from "@/whole/components/header/publicHead";
import Goods from "@/whole/components/global/goods";
export default {
  components: { MescrollVue, publicHead, Goods },
  data() {
    return {
      fixedNavTop: 0,
      currentIndex: 0,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        auto: false,
        callback: this.downCallback
      },
      mescrollUp: {
        auto: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 30 // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: "dataList", // 父布局的id;
          tip: "The search is empty",
          btntext: "GO →",
          btnClick: this.upBtnClick
        },
        lazyLoad: {},
        onScroll: this.onScroll
      },
      items: [],
      index: "",
      ids: "",
      header_re: [],
      url: [],
      rules: "",
      txt_title: "",
      purchasePrice: ""
    };
  },

  activated() {
    if (this.$route.meta.isBack && this.ids != this.$route.query.navId) {
      this.index = this.$route.query.productType;
      this.ids = this.$route.query.navId;
      this.items = [];
      this.header_n();
    }
    this.$route.meta.isBack = false;
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "HomeCont") {
      to.meta.isBack = true;
    }
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  mounted() {
    this.$nextTick(() => {
      this.fixedNavTop = this.$refs.bannerPic.clientHeight;
    });
  },
  methods: {
    // 头部导航
    header_n() {
      this.header_re = [];
      this.url = [];
      let header_r = [];
      this.$PHP.get_barner(this.ids).then(res => {
        if (res.code == 0) {
          if (this.$route.query.lang === "sa") {
            res.data.list.forEach(item => {
              let link = item.arabic_link || item.link;
              let items = {
                img: item.arabic_img || item.img,
                title: item.arabic_title || item.title,
                link: link ? link.split("=") : ""
              };
              header_r.push(items);
            });
            this.rules = res.data.row.arabic_image || res.data.row.image;
            this.txt_title = res.data.row.title;
          } else {
            res.data.list.forEach(item => {
              let items = {
                img: item.img,
                title: item.title,
                link: item.link ? item.link.split("=") : ""
              };
              header_r.push(items);
            });
            this.rules = res.data.row.image;
            this.txt_title = res.data.row.title;
          }
          if (header_r.length > 0) {
            this.to_goods(header_r[0].link);
          } else {
            this.mescroll.resetUpScroll();
          }
          this.header_re = header_r;
        }
      });
    },
    to_goods(url, index = 0, title) {
      this.url = url;
      this.currentIndex = index;
      if (title) {
        this.purchasePrice = title;
      }
      this.mescroll.resetUpScroll();
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 下拉刷新
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    onScroll(mescrool, y) {
      if (y >= this.fixedNavTop) {
        this.$refs.topNav.classList.add("hasFixedNav");
      } else {
        this.$refs.topNav.classList.remove("hasFixedNav");
      }
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认12
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        this.index,
        page.num,
        page.size,
        arr => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.items = [];
          // 把请求到的数据添加到列表
          this.items = this.items.concat(arr);

          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        },
        () => {
          // 联网异常,隐藏上拉和下拉的加载进度
          mescroll.endErr();
        },
        this.purchasePrice
      );
    },
    getListDataFromNet(
      index,
      pageNum,
      pageSize,
      successCallback,
      errorCallback,
      priceNum
    ) {
      // 延时一秒
      var listData = [];
      let i, id, price, purchasePrice;
      if (index && index.indexOf("=") > -1) {
        this.url = index.split("=");
      }
      if (this.url.length > 0) {
        i = Number(this.url[0]);
        id = this.url[1];
      }
      if (priceNum.indexOf("-") > -1) {
        price = priceNum.split("-");
        purchasePrice = parseInt(price[0]) + "," + parseInt(price[1]);
      }

      //0：搜索关键字，1：品类id，2：店铺id，3：商品id,5：折扣id
      switch (i) {
        case 0:
          let data_g = {
            orderBy: "",
            orderType: "",
            goods_type: "",
            goods_inventory: "",
            goods_transfee: "",
            goods_cod: "",
            searchType: "",
            keyword: id, //关键字查询
            currentPage: pageNum,
            gc_id: ""
          };
          this.$HTTP.search(data_g).then(res => {
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
              }
            }
            // 回调
            successCallback(listData);
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
            gc_id: id,
            currentPage: pageNum,
            language: this.$route.query.lang === "sa" ? 1 : 0
          };
          this.$HTTP.goods_list(data_k).then(res => {
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
            }
            successCallback(listData);
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
            goods_store: id,
            currentPage: pageNum
          };
          this.$HTTP.store_goods_info(data_s).then(res => {
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
            }
            // 回调
            successCallback(listData);
          });
          break;
        default:
          let data = {
            orderBy: "",
            orderType: "",
            type: "", // ""：新； store_recommend : 精选； store_creativity：创意 ； goods_global：国际直发 ; desc ：折扣
            price: "", //价格区间
            currentPage: pageNum, //当前页数
            language: this.$route.query.lang === "sa" ? 1 : 0
          };
          if (index == "Discount") {
            data.orderBy = "goods_discount_rate";
            data.orderType = "desc";
          } else if (index == "Deals") {
            data.type = "store_deals";
          } else if (index == "china") {
            data.type = "china";
          } else {
            data.type = index;
          }
          if (i == 4) {
            data.price = id;
          }
          data.price = purchasePrice;

          this.$HTTP.index_discount(data).then(res => {
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
                    // :(item.store_deals_inventory-item.goods_salenum)/item.store_deals_inventory
                    Deals: index == "Deals" ? 1 : 0
                  };
                  listData.push(so_you);
                });
              }
            }
            // 回调
            successCallback(listData);
          });
      }
    },
    upBtnClick() {
      this.$router.push({ path: "/home" });
    }
  }
};
</script>

<style lang="scss" scoped>
.productItems {
  padding-top: 0.2rem;
}
.banner {
  height: 3rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.isApp .hasFixedNav .topNavList{
  top: 1.4rem;
}
.hasFixedNav {
  padding-top: 1rem;
  .topNavList {
    position: fixed;
    top: 1rem;
    z-index: 1;
  }
  .topNavList {
    background-color: #017ec2;
    .quan_conter {
      color: #ccc;
    }
    .quan_conter.active {
      color: #fff;
    }
    .active::after {
      background-color: #fff;
    }
  }
}
.topNavList {
  width: 100%;
  background: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;
  overflow-x: scroll;
  color: #ccc;
  font-weight: bold;
  font-size: 0.5rem;
  .quan_conter {
    height: 1rem;
    line-height: 1rem;
    font-weight: bold;
    font-size: 0.3rem;
    position: relative;
    color: #cccccc;
  }
  .active {
    color: black;
  }
  .active::after {
    content: "";
    position: absolute;
    bottom: 0.1rem;
    width: 0.7rem;
    height: 0.04rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: black;
  }
}
.ac {
  overflow: hidden;
  overflow-y: auto;
  padding: 0 0.3rem;
  box-sizing: border-box;
  margin-top: 0.2rem;
}
.rule {
  background: url(../../../assets/img/FreeGit/banner.png);
  width: 100%;
  padding: 0.3rem 0.3rem 0.2rem;
  box-sizing: border-box;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  color: #fff;
  font-weight: Bold;
  font-family: "Calibri-Bold";
  font-size: 0.22rem;
  line-height: 0.4rem;
  .Rules_box {
    border: 1px solid #00b4ff;
    padding: 0.14rem;
    .rulesWrap {
      background-color: rgb(0, 180, 255, 0.5);
      padding: 0.2rem;
    }
  }
  .Rules {
    height: 0.5rem;
    line-height: 0.5rem;
  }
  .r_title {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.26rem;
    word-break: break-word;
  }
}

.mescroll ::v-deep .goods {
  height: 5.36rem !important;
}
</style>
