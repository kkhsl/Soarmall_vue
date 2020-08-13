<template>
  <div class="full_page" id="apply">
    <publicHead :noHeadRight="true">
      <h6 slot="headCenter">{{$t('title.Confirm an order')}}</h6>
    </publicHead>
    <div class="order_c centerWrap">
      <div class="ar_box">
        <div class="shop_content" :class="{'rightPaad':this.$route.query.lang=='sa'}">
          <div class="ifreach" v-if="!total.flag"></div>
          <div class="shop_box">
            <span class="smallBar"></span>
            <p class="shop_name">{{pay_good.store_name}}</p>
          </div>
          <!-- 商品 -->
          <Goods :goodsMap="pay_good.goodsMap" @CountAdjust="CountAdjust"></Goods>
          <!-- 店铺总价 -->
          <StoreTotal
            :total="total"
            :pay_good="pay_good"
            :store_sum="store_sum"
            :flag="flag"
            @m_currency="m_currency"
            @ertagmap_btn="ertagmap_btn"
          ></StoreTotal>
          <keep-alive>
            <CouponS
              :coupons_l="coupons_l"
              v-if="iscoupon_s==0"
              @confirm_but_s="confirm_but_st"
              @yu_mask="yu_mask"
            ></CouponS>
          </keep-alive>
          <EnoughReduce
            :enoughReduce="total.enoughReduce"
            v-if="if_er"
            @ertagmap_btn="ertagmap_btn"
          ></EnoughReduce>
        </div>
        <!-- 订单总价 -->
        <Total :total="total" :parys="parys" :sum="sum" @select="select"></Total>
        <keep-alive>
          <CouponS
            :coupons_l="coupons_l"
            v-if="iscoupon_s==-1"
            @confirm_but_s="confirm_but_s"
            @yu_mask="yu_mask"
          ></CouponS>
        </keep-alive>
      </div>

      <div class="or_conter">
        <!-- 更改地址 -->
        <ChangeAdd :addres="addres" @dizhixz="dizhixz"></ChangeAdd>
        <!-- 发送验证码 -->
        <!-- <Code :phone="phone" :istimes="istimes" v-model="code_phone"></Code> -->
      </div>
    </div>

    <div class="pay_button bottomWrap">
      <div class="foot_left">
        <p>{{$t("common.Total")}}</p>
        <div class="tota_price">
          <p dir="ltr">
            <span>{{GLOBA.money_tag}} {{total.pay_total_price | integerNum}}</span>
            <span>.{{total.pay_total_price | decimalNum}}</span>
          </p>
          <p
            v-if="parys.storeMap.goodsMap.goods_point != 1"
            dir="ltr"
          >Dicounted:{{GLOBA.money_tag}}&nbsp;&nbsp;{{total.order_discounts_amount | keeptwoNum}}</p>
        </div>
      </div>
      <div
        class="foot_right"
        v-DataClick="{func:submitOrder,data:{pay_good,addres}}"
      >{{$t("common.Buy Now")}}</div>
      <div class="overstep" v-if="is_overstep" @click="buy_now">{{$t("common.Buy Now")}}</div>
    </div>
    <!-- <Jump v-if="jump_if"></Jump> -->

    <Popout :Cue_title="Cue_title" :cue_words="cue_words" @popout_btn="popout_btn" v-if="if_cue"></Popout>

    <!-- <keep-alive>
      <Coupons :parys="orders" v-if="coupon" @yu_mask="yu_mask" @confirm_but="confirm_but"></Coupons>
    </keep-alive>-->
  </div>
</template>
 
<script>
import Toast from "@/assets/js/pop_up";
import publicHead from "@/whole/components/header/publicHead";
// import Jump from "@/whole/components/elastic/jump";
import Popout from "@/whole/components/elastic/popout";
import Coupons from "@/module/coupon/Coupon_select";
export default {
  components: {
    publicHead,
    // Jump,
    Popout,
    Coupons,
    Goods: () => import("@/whole/pay/components/goods"),
    StoreTotal: () => import("@/whole/pay/components/Store_total"),
    Total: () => import("@/whole/pay/components/pay_total"),
    ChangeAdd: () => import("@/whole/pay/components/change_address"),
    // Code: () => import("@/whole/pay/components/code"),
    CouponS: () => import("@/module/coupon/coupon_select_c"),
    Xnumber: () => import("@/whole/components/global/x_number"),
    EnoughReduce: () => import("@/whole/pay/components/enoughReduce")
  },
  data() {
    return {
      // coupon: false,
      parys: {}, // 商品信息
      addres: {}, // 地址信息
      phone: "",
      // jump_if: false,

      Cue_title: this.$t("common.Out of range"),
      cue_words: this.$t(
        "common.There are goods beyond the distribution scope"
      ),
      if_cue: false,
      is_overstep: false,
      orders: [],
      number: [],

      close_price: 0,
      coupon_inof: [],
      iscoupon_s: -2,
      coupons_l: [],

      pay_good: {}, //商品信息
      total: {}, //订单金额集合
      store_sum: 0, //店铺优惠券金额
      sum: 0, //平台优惠券金额
      generalCouponId: "", //平台优惠券id
      storeCouponId: "", //店铺优惠券id
      code_phone: "", //电话号码和验证码
      istimes: true,
      if_er: false,
      flag: 0
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "Cart" || from.name === "Details"|| from.name === "Detail") {
      to.meta.isBack = true;
    }
    next(vm => {});
  },
  activated() {
    this.istimes = true;
    this.code_ = "";
    let path = this.$route.query.check;
    // if (this.$route.meta.isBack) {
    let orderStats = this.$store.state.buyNowOrderInfo;
    if(orderStats.code == 4207){
      this.$HTTP.buy_now(orderStats.data).then(res=>{
        if(res.code = 4200)this.parys = res.data;
        this.goods_data();
      })
    }else if(orderStats.code == 4200){
      this.parys = orderStats.data;
      this.goods_data();
    }
      // this.coupon_();
    // }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    // this.$route.meta.isBack = false;
    if (path) {
      let adder = this.$store.state.adde;
      let address = {
        addr_child_name: adder.areaChildName,
        area_name: adder.areaName,
        area_parent_name: adder.areaParendName,
        area_info: adder.area_info,
        addr_id: adder.id,
        default_val: adder.default_val,
        mobile: adder.mobile,
        telephone: adder.telephone,
        trueName: adder.consigneeName
      };
      this.addres = address;
      this.phone = this.addres.telephone;
      this.CountAdjust(adder.id, 1);
    }
  },
  mounted() {
    var clientHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = function() {
      var nowClientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      if (clientHeight - nowClientHeight > 60) {
        // 因为ios有自带的底部高度
        // 键盘弹出的事件处理
        document.getElementById("apply").classList.add("focusState");
      } else {
        // 键盘收起的事件处理
        document.getElementById("apply").classList.remove("focusState");
      }
    };
    window.addEventListener(
      "popstate",
      e => {
        if (this.iscoupon_s != -2) {
          this.iscoupon_s = -2;
        }
        if (this.if_er) {
          this.if_er = !this.if_er;
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.iscoupon_s != -2) {
          this.iscoupon_s = -2;
        }
        if (this.if_er) {
          this.if_er = !this.if_er;
        }
      },
      false
    );
  },
  methods: {
    m_currency(coupons) {
      this.coupons_l = coupons;
      this.iscoupon_s = 0;
      window.history.pushState(null, null, "#");
    },
    select(coupons) {
      //平台优惠券
      this.iscoupon_s = -1;
      this.coupons_l = coupons;
      window.history.pushState(null, null, "#");
    },
    ertagmap_btn(i) {
      if (i === 0) {
        this.if_er = true;
        window.history.pushState(null, null, "#");
      } else if (i === 1) {
        this.if_er = false;
        this.$router.go(-1);
      }
    },
    confirm_but_st(p) {
      console.log(p, 22);
      this.CountAdjust(p.id, 2);
      this.store_sum = p.Coupon_amount;
      this.iscoupon_s = -2;
      this.$router.go(-1);
    },
    confirm_but_s(p) {
      console.log(p);
      this.CountAdjust(p.id, 3);
      this.sum = p.Coupon_amount;
      this.iscoupon_s = -2;
      this.$router.go(-1);
    },
    yu_mask() {
      this.iscoupon_s = -2;
      this.$router.go(-1);
    },
    goods_data() {
      // 商品信息
      let goods = this.parys.storeMap;
      let good_spec = goods.goodsMap.goods_spec_info.split("<br>").join(",");
      let good_specs = good_spec.substring(0, good_spec.lastIndexOf(",")); //删除最后一个，号
      let good_color = "";
      if (goods.goodsMap.color) {
        good_color = "Color:" + goods.goodsMap.color + ",";
      }
      goods.goodsMap.specs = good_color + good_specs;
      this.pay_good = goods;
      console.log(this.pay_good, "商品");
      //优惠券
      if (goods.goodsMap.goods_point === 1) {
        this.storeCouponId = "";
        this.generalCouponId = "";
        this.parys.Couponinfo = [];
        this.parys.storeMap.Couponinfo = [];
      } else {
        this.store_sum = 0;
        this.storeCouponId = "";
        if (goods.Couponinfo.length > 0) {
          goods.Couponinfo.some((cou, n) => {
            if (cou.flag) {
              this.storeCouponId = cou.id; //店铺优惠券id
              this.store_sum = cou.Coupon_amount;
              return true;
            }
          });
        }
        this.sum = 0;
        this.generalCouponId = "";
        if (goods.store_total_price - this.store_sum > 0) {
          if (this.parys.Couponinfo.length > 0) {
            this.parys.Couponinfo.some((cou, n) => {
              if (cou.flag) {
                this.generalCouponId = cou.id; //平台优惠券id
                this.sum = cou.Coupon_amount;
                return true;
              }
            });
          }
        }
      }
      this.CountAdjust(this.generalCouponId, 3);

      //地址信息
      this.addres = this.parys.address;
      this.phone = this.addres.telephone;
      console.log(this.addres, "地址");
    },
    async CountAdjust(just, i) {
      //i=''数量，i=1地址，i=2店铺优惠券，i=3平台优惠券,
      let type = "";
      if (this.parys.storeMap.goodsMap.goods_point === 1) {
        type = "get";
      }
      let data = {
        goods_id: this.parys.storeMap.goodsMap.goods_id, //商品ID
        color: this.parys.storeMap.goodsMap.color, //颜色
        gsp: this.parys.storeMap.goodsMap.goods_gsp, //规格
        cart_session: this.parys.cart_session, //购物车session
        id: this.parys.address.addr_id, //地址id
        count: this.parys.storeMap.goodsMap.goods_count, //数量
        storeCouponId: this.storeCouponId, //店铺优惠券id
        generalCouponId: this.generalCouponId, //平台优惠券id
        type: type
      };
      let adjust = just ? just : "";
      switch (i) {
        case 1:
          data.id = adjust;
          break;
        case 2:
          data.storeCouponId = adjust;
          break;
        case 3:
          data.generalCouponId = adjust;
          break;
        default:
          data.count = adjust.goods_count;
      }
      this.storeCouponId = data.storeCouponId;
      this.generalCouponId = data.generalCouponId;
      let res = await this.$HTTP.orderCountAdjust(data);
      if (res.code == 4200) {
        if (res.data.hasOwnProperty("enoughReduce")) {
          let er_json = Object.entries(res.data.enoughReduce.er_json);
          res.data.enoughReduce.ertagmap = er_json; //商品满减
          res.data.if_full = true;
        } else {
          res.data.if_full = false;
        }
        this.total = res.data;
        this.flag = res.data.transMap.flag;
        if (i == 1) {
        } else if (i == 2) {
          if (res.data.general_couponinfo.length > 0) {
            let is_flag = false;
            res.data.general_couponinfo.some((cou, n) => {
              if (cou.id == this.generalCouponId) {
                if (!cou.flag) {
                  is_flag = true;
                }
                return true;
              }
            });
            if (is_flag) {
              res.data.general_couponinfo.some((cou, n) => {
                if (cou.flag) {
                  this.sum = cou.Coupon_amount;
                  this.CountAdjust(cou.id, 3);
                  return true;
                }
              });
            }
          }
          this.parys.Couponinfo = res.data.general_couponinfo;
        } else if (i == 3) {
        } else {
          this.store_sum = 0;
          this.storeCouponId = "";
          if (res.data.store_couponinfo.length > 0) {
            res.data.store_couponinfo.some((cou, n) => {
              if (cou.flag) {
                this.storeCouponId = cou.id; //店铺优惠券id
                this.store_sum = cou.Coupon_amount;
                return true;
              }
            });
          }
          this.pay_good.Couponinfo = res.data.store_couponinfo;

          this.sum = 0;
          if (res.data.store_total_price - this.store_sum > 0) {
            if (res.data.general_couponinfo.length > 0) {
              res.data.general_couponinfo.some((cou, n) => {
                if (cou.flag) {
                  this.CountAdjust(cou.id, 3);
                  this.sum = cou.Coupon_amount;
                  return true;
                }
              });
            }
          }
          this.parys.Couponinfo = res.data.general_couponinfo;
        }
      } else if (res.code == 4205) {
        Toast({ message: "Out of stock", time: 2000, i: 1 });
      } else if (res.code == 4204) {
        Toast({ message: "Order failure", time: 2000, i: 1 });
      }
    },
    popout_btn(id) {
      this.if_cue = false;
    },
    buy_now() {
      this.if_cue = true;
    },
    dizhixz() {
      this.$router.push({
        path: "/address",
        query: {
          paths: this.$route.path,
          canNotDelete: 1
        }
      });
    },

    // 提交订单
    async submitOrder(obj) {
      let good = obj.pay_good;
      let addr = obj.addres;
      let data = {
        goods_id: good.goodsMap.goods_id,
        color: good.goodsMap.color,
        gsp: good.goodsMap.goods_gsp,
        count: good.goodsMap.goods_count,
        address_id: addr.addr_id,
        payType: "payafter",
        cart_session: this.parys.cart_session,
        storeCouponId: this.storeCouponId,
        generalCouponId: this.generalCouponId,
        // mobile: this.GLOBA.phone_tag + this.code_phone.phone,
        // mobile_verify_code: this.code_phone.code,
        store_id: good.store_id,
        order_type: this.GLOBA.isApp?'app':'web'
      };

      if (window.fbAsyncInit) {
        // 如果FB初始化成功
        var params = {}; // FB推送 发起结账流程 开始结账流程
        params[FB.AppEvents.ParameterNames.CONTENT] = this.parys.store_name;
        params[
          FB.AppEvents.ParameterNames.CONTENT_ID
        ] = this.parys.cart_session;
        params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = "paybefore";
        params[FB.AppEvents.ParameterNames.NUM_ITEMS] = data.count;
        params[FB.AppEvents.ParameterNames.PAYMENT_INFO_AVAILABLE] = 1;
        params[FB.AppEvents.ParameterNames.CURRENCY] = this.GLOBA.money_tag;
        FB.AppEvents.logEvent(
          FB.AppEvents.EventNames.INITIATED_CHECKOUT,
          this.total.store_total_price,
          params
        );
      }
      let res = await this.$HTTP.payNow(data);
      if (res.code == 4200) {
        try {
          // 脸书埋点
          if (fbq && fbq != undefined && fbq != "undefined") {
            let fb = fbq(
              "track",
              "Purchase",
              // begin parameter object data
              {
                value: good.goods_price,
                currency: "货币",
                contents: [
                  {
                    id: good.goods_id,
                    quantity: good.goods_count
                  }
                ],
                content_type: good.goods_type,
                content_name: good.goods_name
              }
              // end parameter object data
            );
          }
        } catch (error) {}
        this.$store.commit("coup_draw", { raffle: res.data.raffle });
        this.$router.push({
          path: "/account/Account/orders",
          query: {
            toPage: 3
          }
        });

        if (window.fbAsyncInit) {
          // 如果FB初始化成功
          FB.AppEvents.logPurchase(
            //推送 完成购买交易，标志性事件通常是收到订单、购买确认或交易收据
            this.total.store_total_price /* number */,
            this.GLOBA.money_tag /* string, http://en.wikipedia.org/wiki/ISO_4217 */,
            JSON.stringify(res.data) /* Object, optional */
          );
        }
      } else if (res.code == 0) {
        Toast({
          message: this.$t("common.Off shelf"),
          time: 2000,
          i: 1
        });
      } else if (res.code == 4410) {
        this.$router.push({
          path: "/address",
          query: {
            paths: this.$route.path
          }
        });
      } else {
        Toast({
          message: this.$t("message.Server is busy"),
          time: 3000,
          i: 1
        });
      }
      if (window.fbAsyncInit) {
        // 如果FB初始化成功  添加付款信息 推送提交订单支付信息
        var params = {};
        params[FB.AppEvents.ParameterNames.SUCCESS] = res.code == 4200 ? 1 : 0;
        FB.AppEvents.logEvent(
          FB.AppEvents.EventNames.ADDED_PAYMENT_INFO,
          null,
          params
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.order_c::-webkit-scrollbar {
  display: none;
}
.order_c {
  width: 100vw;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.ar_box {
  background-color: #fff;
}

h4,
h5,
p {
  margin: 0;
}

.shop_content {
  background: #fff;
  width: 100vw;
  padding-left: 0.3rem;
  // padding: 0rem 0.3rem;
  // padding-top: 0.1rem;
  box-sizing: border-box;
  // border-bottom: 1px solid #ebebeb;
  position: relative;

  .ifreach {
    position: absolute;
    left: 0;
    top: 0.8rem;
    width: 100%;
    height: calc(100% - 2rem);
    background-color: rgba(0, 0, 0, 0.2);
    // color: #f00;
    // font-size: 0.4rem;
    // text-align: end;
    // line-height: 1rem;
  }
  .shop_box .smallBar {
    width: 0.08rem;
    height: 0.26rem;
    color: #008edd;
    // position: absolute;
    // top: 0.22rem;
    // left: 0;
    background-color: #008edd;
    margin-top: 0.22rem;
  }
  .shop_box {
    position: relative;
    display: flex;
    justify-content: flex-start;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.24rem;
    color: #333;
    background-color: #e9e9e9;
    height: 0.7rem;
    line-height: 0.7rem;
    .shop_name {
      margin: 0 0.32rem;
    }
    .mangjian {
      font-size: 0.2rem;
      color: #017ec2;
      width: 84%;
    }

    .all {
      background: url(../../assets/img/other/xiangyou3.png) no-repeat;
      background-size: cover;
      height: 0.12rem;
      width: 0.06rem;
      margin-top: 0.1rem;
    }
  }
}
.rightPaad {
  padding-left: 0;
  padding-right: 0.3rem;
}
.or_conter {
  padding: 0.3rem;
  box-sizing: border-box;
}

.pay_button {
  width: 100%;
  height: 1rem;
  background: #fff;
  display: flex;
  .foot_left {
    width: 5.1rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    line-height: 1rem;

    p:nth-child(1) {
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: 400;
      color: #999999;
      font-weight: bold;
    }

    .tota_price {
      p:nth-child(1) {
        height: 0.6rem;
        font-size: 0.3rem;
        font-family: "Calibri-Bold";
        font-weight: 400;
        font-weight: bold;
        font-size: 0.28rem;
        display: flex;
        justify-content: flex-start;
        line-height: 0.8rem;
        color: #333;
        span:nth-child(2) {
          font-size: 0.18rem;
          line-height: 0.6rem;
          vertical-align: middle;
        }
      }
      p:nth-child(2) {
        color: #999;
        font-size: 0.22rem;
        font-weight: 400;
        font-family: "Calibri";
        line-height: 0.3rem;
        height: 0.4rem;
      }
    }
  }

  .overstep {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.4rem;
    height: 1rem;
    z-index: 20;
    background-color: #999;
    text-align: center;
    color: #ccc;
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: 400;
    line-height: 1rem;
  }

  .foot_right {
    width: 2.4rem;
    line-height: 1rem;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #33b6ff, #017ec2);
    text-align: center;
    color: #fff;
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: 400;
  }
}

.focusState {
  position: absolute;
}
</style>
