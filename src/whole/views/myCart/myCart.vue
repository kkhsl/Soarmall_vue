<template>
  <div class="full_page">
    <publicHead>
      <template #headCenter>
        <h6>{{$t("title.My Cart")}}</h6>
      </template>
      <template #headRight>
        <img class="header_img" src="@/assets/img/other/shangchu1.png" />
      </template>
    </publicHead>

    <mescroll-vue
      class="centerWrap"
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div class="myCartWrap">
        <div class="cartList" v-for="(cartOrde, index) of cartListInfo.normalmap" :key="index">
          <div class="storeWrap flexBox van-hairline--top">
            <div
              class="divCheckBoxWrap"
              :class="{'selected':cartOrde.checkStats}"
              @click="storeCheckBtn(cartOrde)"
            >
              <div class="divCheckBox"></div>
            </div>
            <div class="storeTitle flexBox">
              <div class="storeMsg flexBox">
                <div class="smLine"></div>
                <img v-lazy="cartOrde.store_logo" />
                <p>{{cartOrde.store_name}}</p>
              </div>
              <img
                class="rightIconRow"
                :class="{'isRotate': GLOBA.isRotate}"
                src="@/assets/img/other/xiangyou3.png"
              />
            </div>
          </div>
          <SwipeCell v-for="(productItem, productIndex) of cartOrde.goods" :key="productIndex">
            <div class="storeProduct flexBox">
              <div
                class="divCheckBoxWrap"
                :class="{'selected':productItem.checkStats}"
                @click="productItemCheckBtn(productItem)"
              >
                <div class="divCheckBox"></div>
              </div>
              <div class="productMain flexBox">
                <div class="productImg">
                  <img v-lazy="productItem.goods_main_photo" alt />
                </div>
                <div class="productMsg">
                  <p class="line-clamp">{{productItem.goods_name}}</p>
                  <div class="productSpec line-blok-clamp">
                    <span v-if="productItem.goods_spec_color">Color:{{productItem.goods_spec_color}}</span>
                    <span v-if="productItem.goods_spec" v-html="','+productItem.goods_spec"></span>
                  </div>
                  <div class="productPriceWrap flexBox">
                    <div class="priceBox">
                      <div class="currentPrice">
                        <span>{{GLOBA.money_tag}} {{productItem.goods_current_price | integerNum}}</span>
                        <span>.{{productItem.goods_current_price | decimalNum}}</span>
                      </div>
                      <del class="oldPrice">
                        <span>{{GLOBA.money_tag}} {{productItem.goods_price| integerNum}}</span>
                        <span>.{{productItem.goods_price | decimalNum}}</span>
                      </del>
                    </div>
                    <Stepper
                      v-model="productItem.cart_count"
                      disable-input
                      class="vantCount"
                      @change="cartCountChange(productItem)"
                    ></Stepper>
                  </div>
                </div>
              </div>
            </div>
            <template #left v-if="$route.query.lang=='sa'">
              <div class="deleteBtn">Delete</div>
            </template>
            <template #right v-else>
              <div class="deleteBtn">Delete</div>
            </template>
          </SwipeCell>
        </div>
      </div>
      <maylike ref="mayLick"></maylike>
    </mescroll-vue>
    <div class="bottomWrap flexBox cartFoot">
      <div class="allWrap flexBox" @click="checkAllBtn">
        <div class="divCheckBoxWrap" :class="{'selected':isCheckAll}">
          <div class="divCheckBox"></div>
        </div>All
      </div>
      <div class="allPriceWrap">
        <span class="bigPrice">{{GLOBA.money_tag}} {{50 | integerNum}}</span>
        <span class="smallPrice">.{{50 | decimalNum}}</span>
      </div>
      <div class="cartBuyBtn">Buy Now</div>
    </div>
  </div>
</template> 

<script>
import publicHead from "@/whole/components/header/publicHead";
import MescrollVue from "@/plugins/scroll/mescroll";
import { Checkbox, CheckboxGroup, Stepper, SwipeCell } from "vant";
export default {
  components: {
    publicHead,
    MescrollVue,
    Checkbox,
    CheckboxGroup,
    Stepper,
    SwipeCell,
    maylike: () => import("@/whole/components/global/may_like"),
    selectSpec: () => import("../detail/components/selectSpec"),
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20, // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: "dataList", // 父布局的id;
          tip: this.$t("tips.The cart is empty"),
          btntext: this.$t("common.Buy now"),
        },
        lazyLoad: {},
      },
      cartListInfo: {
        cart_num: 0,
        ermaps: [],
        normalmap: [],
      },
      isCheckAll: false,
    };
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      (e) => {
        if (this.isspec) {
          this.isspec = !this.isspec;
        }
      },
      false
    );
  },
  activated() {},
  mounted() {
    this.getMyCartList();
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.isspec) {
          this.isspec = !this.isspec;
        }
      },
      false
    );
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        (arr) => {
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
            // setTimeout(() => {
            //   if (this.goodsl.length < 1) {
            //     this.mescroll.showEmpty();
            //   }
            // }, 500);
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
        this.$refs.mayLick.like_goods({ currentPage: pageNum }, (res) => {
          successCallback(res);
        });
      }, 300);
    },
    async getMyCartList() {
      let postData = { language: this.$route.query.lang === "sa" ? 1 : 0 };
      let res = await this.$HTTP.goods_cart1(postData, { showLoading: false });
      if (res.data.normalmap.length) {
        // 遍历店铺及商品 加上初始化的选中状态false
        res.data.normalmap.forEach((storeOrder) => {
          storeOrder.checkStats = false;
          storeOrder.goods.forEach((productItem) => {
            productItem.checkStats = false;
          });
          this.cartListInfo.normalmap.push(storeOrder);
        });
      }
      if (res.data.ermaps.length) {
        // 遍历店铺及商品 加上初始化的选中状态false
        res.data.ermaps.forEach((storeOrder) => {});
      }
    },
    storeCheckBtn(storeItem) {
      // 店铺选择按钮
      storeItem.checkStats = !storeItem.checkStats;
      storeItem.goods.forEach((productItem) => {
        // 选中店铺下面内容选则
        productItem.checkStats = storeItem.checkStats;
      });
    },
    productItemCheckBtn(productItem) {
      // 商品选择按钮
      productItem.checkStats = !productItem.checkStats;
    },
    cartCountChange(item) {
      // 数量调整
      item.checkStats = true;
    },
    checkAllBtn() {
      this.isCheckAll = !this.isCheckAll;
      this.cartListInfo.normalmap.forEach((storeItem) => {
        storeItem.checkStats = this.isCheckAll;
        storeItem.goods.forEach((goodItem) => {
          goodItem.checkStats = this.isCheckAll;
        });
      });
    },
  },
  computed: {
    selectProducts() {
      let selectGoods = [];
      this.cartListInfo.normalmap.forEach((storeList) => {
        storeList.goods.forEach((goods) => {
          if (goods.checkStats) {
            selectGoods.push(goods);
          }
        });
      });
      return selectGoods;
    },
  },
  watch: {
    "cartListInfo.normalmap": {
      handler: function (newVal,oldVal) {
        let isCheckAll = true;
        newVal.forEach(storeOrde=>{
          let storeIsCheck = true;
          storeOrde.goods.forEach(goods=>{
            if(!goods.checkStats){
              storeIsCheck = false;
            }
          })
          storeOrde.checkStats = storeIsCheck;

          if(!storeOrde.checkStats){
            isCheckAll = false;
          }
        })
        this.isCheckAll = isCheckAll;
      },
      deep: true,
    },
  },
};
</script>

<style>
.van-swipe-cell__right {
  width: 1.4rem;
  color: #ff0101;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deleteBtn {
  padding: 0.1rem 0.3rem;
}
</style>
<style lang="scss" scoped>
.storeWrap {
  background-color: #f7f7f7;
}
.cartList {
  padding-bottom: 0.2rem;
  background-color: #fff;
}
.divCheckBoxWrap {
  padding: 0.1rem 0.2rem;
}
.divCheckBox {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  border: 1px solid #c8c9cc;
}
.selected .divCheckBox {
  background-color: #29b3ff;
  border-color: #29b3ff;
}
.storeWrap {
  .storeTitle {
    flex: 1;
    background-color: #e9e9e9;
    height: 0.72rem;
    line-height: 0.72rem;
    font-weight: 400;
    font-family: "Calibri";
  }
  .rightIconRow {
    width: 0.08rem;
  }
  .smLine {
    background: #008edd;
    width: 0.08rem;
    height: 0.26rem;
  }
  .storeMsg {
    img {
      width: 0.4rem;
      margin: 0 0.14rem;
    }
  }
}
.storeProduct {
  padding: 0.2rem 0;
  background-color: #fff;
}
.productMain {
  flex: 1;
}
.productImg {
  height: 2rem;
  img {
    height: 2rem;
  }
}
.productMsg {
  padding: 0 0.2rem;
  height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .productSpec {
    font-size: 0.24rem;
    color: #b3b3b3;
    font-weight: 400;
    font-family: "Calibri";
  }
}
.cartFoot {
  font-weight: Bold;
  font-family: "Calibri-Bold";
}
.allWrap {
  .divCheckBox {
    width: 0.38rem;
    height: 0.38rem;
  }
  font-size: 0.3rem;
  line-height: 1rem;
  color: #000;
}
.allPriceWrap {
  .bigPrice {
    font-size: 0.3rem;
    color: #333;
  }
  .smallPrice {
    font-size: 0.2rem;
    color: #333;
    line-height: 0.4rem;
    vertical-align: 0.1rem;
  }
}
.cartBuyBtn {
  color: #fff;
  background: linear-gradient(to right, #33b6ff, #017ec2);
  width: 2.4rem;
  text-align: center;
  line-height: 1rem;
  height: 1rem;
  font-size: 0.3rem;
}
</style>
