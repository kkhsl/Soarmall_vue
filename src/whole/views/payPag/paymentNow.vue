<template>
  <div class="full_page" id="apply">
    <publicHead :noHeadRight="true" ref="publicHead">
      <h6 slot="headCenter">{{$t('title.Confirm an order')}}</h6>
    </publicHead>
    <div class="centerWrap">
      <div class="shopStore" v-if="buyNowOrderInfo">
        <h4 class="storeName">
          <div class="storeTag"></div>
          <p>{{buyNowOrderInfo.storeMap.store_name}}</p>
        </h4>
        <div class="storeProduct">
          <div class="productImg">
            <img v-lazy="buyNowOrderInfo.storeMap.goodsMap.goods_photo" alt />
          </div>
          <div class="productMsg">
            <div class="productName">{{buyNowOrderInfo.storeMap.goodsMap.goods_name}}</div>
            <div class="productInfo">
              <div class="productSize">
                <span v-if="buyNowOrderInfo.storeMap.goodsMap.color">Color：{{buyNowOrderInfo.storeMap.goodsMap.color}}</span>
                <span v-if="buyNowOrderInfo.storeMap.goodsMap.goods_spec_info" v-html="buyNowOrderInfo.storeMap.goodsMap.goods_spec_info"></span>
              </div>
              <Stepper
                v-model="buyNowOrderInfo.storeMap.goodsMap.goods_count"
                :max="buyNowOrderInfo.storeMap.goodsMap.goods_inventory"
                disable-input class="vantCount"
                @change="changeProductCount"
              ></Stepper>
            </div>
            <div class="productPrice">
              <span>{{GLOBA.money_tag}}{{buyNowOrderInfo.storeMap.goodsMap.goods_current_price | integerNum}}</span>
              <span>.{{buyNowOrderInfo.storeMap.goodsMap.goods_current_price | decimalNum}}</span>
            </div>
          </div>
        </div>
        <div class="priceWrap" v-if="justPrice">
          <div class="priceRow">
            <div class="countPrice">
              <div class="collspace">
                <div class="priceTitle">{{$t('title.Subtotal')}}：</div>
                <div class="price_big">
                  {{GLOBA.money_tag}} {{(justPrice.order_goods_price) | integerNum }}
                  <span>.{{(justPrice.order_goods_price) | decimalNum}}</span>
                </div>
              </div>
              <div dir="ltr" class="discount" v-if="typeof(couponProps.storeSelect)=='number' && buyNowOrderInfo.storeMap.Couponinfo[couponProps.storeSelect].flag">- &nbsp;{{GLOBA.money_tag}}&nbsp;&nbsp;{{buyNowOrderInfo.storeMap.Couponinfo[couponProps.storeSelect].Coupon_amount}}</div>
            </div>
            <div class="morePrice" v-if="buyNowOrderInfo.storeMap.Couponinfo.length" @click="openCouponSelect('store')">Store coupon</div>
          </div>
          <div class="priceRow" v-if="justPrice.enoughReduce">
            <div class="countPrice">
                <div class="priceTitle">Minus：</div>
                <div class="price_big">
                  {{GLOBA.money_tag}} {{(justPrice.enoughReduce.er_price || 0) | integerNum }}
                  <span>.{{(justPrice.enoughReduce.er_price || 0) | decimalNum}}</span>
                </div>
            </div>
            <div class="morePrice" @click="showEnoughTankFn">
              <span>Full {{GLOBA.money_tag}}{{Object.keys(justPrice.enoughReduce.er_json)[0] | integerNum}}minus{{Object.values(justPrice.enoughReduce.er_json)[0]}}</span>
              <span v-if="Object.keys(justPrice.enoughReduce.er_json)[1]">...</span>
            </div>
          </div>
          <div class="priceRow">
            <div class="countPrice">
              <div class="collspace">
                <div class="priceTitle">{{$t("common.Delivery")}}：</div>
                <div class="price_big">
                  {{GLOBA.money_tag}} {{(buyNowOrderInfo.storeMap.transMap.ship_price) | integerNum }}
                  <span>.{{(buyNowOrderInfo.storeMap.transMap.ship_price) | decimalNum}}</span>
                </div>
              </div>
              <div dir="ltr" class="discount" v-if="buyNowOrderInfo.storeMap.transMap.flag == 1">-{{GLOBA.money_tag}} {{buyNowOrderInfo.storeMap.transMap.ship_price}}</div>
            </div>
            <div class="morePrice">Full {{buyNowOrderInfo.storeMap.store_enough_free_price}} free shipping</div>
          </div>
        </div>
      </div>
      <div class="totalBox" v-if="justPrice">
        <div class="totalBoxRow">
          <p>{{$t('title.Payment Method')}}</p>
          <span>Cash on Delivery</span>
        </div>
        <div class="totalBoxRow">
          <p>{{$t('common.Total')}}</p>
          <span class="totalMore">
            {{GLOBA.money_tag}}{{justPrice.order_total_price | integerNum}}
            <span>.{{justPrice.order_total_price | decimalNum}}</span>
          </span>
        </div>
        <div class="totalBoxRow" v-if="buyNowOrderInfo.Couponinfo.length">
          <p class="cou_text">Soamall Coupon</p>
          <div class="cou_money" @click="openCouponSelect('general')">
            <span>-{{GLOBA.money_tag}}{{typeof(couponProps.generalSelect)=="number"&&buyNowOrderInfo.Couponinfo[couponProps.generalSelect].flag?buyNowOrderInfo.Couponinfo[couponProps.generalSelect].Coupon_amount : 0}}</span>
            <span class="or_count" :class="{'isRotate': GLOBA.isRotate}"></span>
            <img
              class="rightIconRow"
              :class="{'isRotate':GLOBA.isRotate}"
              src="@/assets/img/other/xiangyou3.png"
            />
          </div>
        </div>
      </div>
      <div class="or_conter" v-if="buyNowOrderInfo">
        <!-- 更改地址 -->
        <ChangeAdd :addres="address" @dizhixz="goToAddress"></ChangeAdd>
      </div>
    </div>
    <div class="pay_button bottomWrap">
      <div class="foot_left">
        <p class="footTitle">{{$t("common.Total")}}</p>
        <div class="tota_price" v-if="justPrice">
          <div class="totaPrice" dir="ltr">
            <span>{{GLOBA.money_tag}} {{justPrice.pay_total_price | integerNum}}</span>
            <span>.{{justPrice.pay_total_price | decimalNum}}</span>
          </div>
          <p class="discountPrice">Dicounted:{{justPrice.order_discounts_amount | keeptwoNum}}</p>
        </div>
      </div>
      <div class="foot_right" v-click="submitOrder">{{$t("common.Buy Now")}}</div>
    </div>
    <!-- 选择优惠券弹框 -->
    <vantPopup
      v-model="showCouponTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      class="couponMask"
      @click-overlay ="closeCouponTankFn"
    >
      <couponTank :couponProps="couponProps" @confirm="confirmCouponSelectFn" @close="closeCouponTank" ref="couponTank"></couponTank>
    </vantPopup>
    <!-- 满减弹框 -->
    <vantPopup
      v-model="showEnoughTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      @click-overlay ="closeEnoughTankFn"
    >
      <enoughReduceTank v-if="justPrice" :enoughReduceData="justPrice.enoughReduce" @closeEnoughTank="closeEnoughTankFn"></enoughReduceTank>
    </vantPopup>
  </div>
</template>
 
<script>
import publicHead from "@/whole/components/header/publicHead";
import { Dialog, Toast, Popup, Stepper } from "vant";
export default {
  components: {
    publicHead,
    Dialog,
    Toast,
    vantPopup:Popup,
    Stepper,
    couponTank: () => import("./components/couponTank"),
    enoughReduceTank: () => import("./components/enoughReduceTank"),
    ChangeAdd: () => import("@/whole/pay/components/change_address"),
  },
  data() {
    return {
      buyNowPostInfo: null,  // 详情页提交信息
      buyNowOrderInfo: null, // 店铺及商品相关信息
      address:{},
      adjustPostData: {
        goods_id: "", //商品ID
        color: "", //颜色
        gsp: "", //规格
        cart_session: "", //购物车session
        id: "", //地址id
        count: "", //数量
        storeCouponId: "", //店铺优惠券id
        generalCouponId: "", //平台优惠券id
        type: "", // 是否为兑换
      },
      justPrice: null, // 计算后的商品价格
      showCouponTank: false,
      showEnoughTank: false,
      couponProps: {
        type: '', // 区分是哪种优惠券 店铺/平台
        storeSelect: null, 
        generalSelect: null,
        list:[]
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "Cart" || from.name === "Details") {
      to.meta.isBack = true;
    }
    next(vm => {});
  },
  activated() {
    if(this.$route.meta.isBack || !this.buyNowOrderInfo){
      this.$route.meta.isBack = false;
      this.getBuyNowOrderInfo();
    }
    if(this.$route.query.check){
      this.changeAddressFn();
    }
  },
  methods: {
    async getBuyNowOrderInfo() {// 获取详情页Buy now 按钮提交的信息
      this.buyNowPostInfo = this.$store.state.buyNowOrderInfo;
      let res = await this.$HTTP.buy_now(this.buyNowPostInfo);
      if (res.code == 4200) {// 正常情况
        let resData = this.buyNowOrderInfo = res.data;
        this.address = resData.address;
        this.adjustPostData = { // 默认请求参数
          goods_id: resData.storeMap.goodsMap.goods_id, //商品ID
          color: resData.storeMap.goodsMap.color || "", //颜色
          gsp: resData.storeMap.goodsMap.goods_gsp || "", //规格
          count: resData.storeMap.goodsMap.goods_count, //数量
          cart_session: resData.cart_session, //购物车session
          id: resData.address.addr_id, //地址id
          storeCouponId: '', //店铺优惠券id
          generalCouponId: '', //平台优惠券id
          type: resData.storeMap.goodsMap.goods_point == 1 ? "get" : "",  // 是否为免费兑换
        };
        if(resData.storeMap.Couponinfo.length){ //店铺优惠券id默认选择
          this.couponProps.storeSelect = 0;
          this.adjustPostData.storeCouponId = resData.storeMap.Couponinfo[0].id;
        }
        if(resData.Couponinfo.length){ // 平台优惠券id默认选择
          this.couponProps.generalSelect = 0;
          this.adjustPostData.generalCouponId = resData.Couponinfo[0].id
        }
        this.adjustOrder(); // 计算订单价格
      } else if (res.code == 4207) {// 如果没有默认地址
        this.haveNoAddress();
      }
    },
    async adjustOrder() {// 计算订单价格fn
      let res = await this.$HTTP.orderCountAdjust(this.adjustPostData);
      switch (res.code) {
        case 4200: // 正常情况
          this.justPrice = res.data;
          break;
        case 4206: // 库存不足
          Toast({
            message: "Goods in short stock",
            icon: require("@/assets/img/other/error.png"),
          });
          break;
        case 4204: //订单已过期
          Toast({
            message: "The order has expired",
            icon: require("@/assets/img/other/error.png"),
          });
          break;
        default:
          Toast({
            message: this.$t("message.Server is busy"),
            icon: require("@/assets/img/other/error.png"),
          });
          break;
      }
    },
    openCouponSelect(type) {
      if(type == 'store'){ // 店铺优惠券
        this.couponProps.type = 'store';
        this.couponProps.list = this.buyNowOrderInfo.storeMap.Couponinfo;
      }else{ // 平台优惠券
        this.couponProps.type = 'general';
        this.couponProps.list = this.buyNowOrderInfo.Couponinfo;
      }
      this.showCouponTank = true;
      window.history.pushState(null, null, "#");
    },
    confirmCouponSelectFn({type, index}){
      if(type == 'store'){
        this.couponProps.storeSelect = index;
        this.adjustPostData.storeCouponId = this.buyNowOrderInfo.storeMap.Couponinfo[index]?this.buyNowOrderInfo.storeMap.Couponinfo[index].id:'';
      }else{
        this.couponProps.generalSelect = index;
        this.adjustPostData.generalCouponId = this.buyNowOrderInfo.Couponinfo[index]?this.buyNowOrderInfo.Couponinfo[index].id : '';
      }
      this.adjustOrder(); //完事计算价格
    },
    closeCouponTankFn(){// 点击遮罩 调用子组件的关闭方法 可以在下次打开恢复原样 借刀kill人
      this.$refs.couponTank.closeTank();
    },
    closeCouponTank() {
      this.showCouponTank = false;
      this.$router.go(-1);
    },
    changeProductCount(num){
      this.adjustPostData.count = num;
      this.adjustOrder();
    },
    changeAddressFn(){
      let stateAdd = this.$store.state.adde;
      let address = {
        addr_child_name: stateAdd.areaChildName,
        area_name: stateAdd.areaName,
        area_parent_name: stateAdd.areaParendName,
        area_info: stateAdd.area_info,
        addr_id: stateAdd.id,
        default_val: stateAdd.default_val,
        mobile: stateAdd.mobile,
        telephone: stateAdd.telephone,
        trueName: stateAdd.consigneeName
      };
      this.address = address;
      this.adjustPostData.id = stateAdd.id;
      this.adjustOrder();
    },
    haveNoAddress() {
      Dialog.confirm({
        className: "vantConfirm",
        message: this.$t("title.You have no shipping address"),
        confirmButtonText: this.$t("title.Add New Address"),
        cancelButtonText: this.$t("common.Cancel"),
      })
        .then(() => {
          this.$router.push({
            path: "/newAddress",
            query: {
              ...this.$route.query,
              toPath: this.$route.path,
            },
          });
        })
        .catch(() => {
          this.$router.push({
            path: "/home/details",
            query: { id: this.buyNowPostInfo.id },
          }); // 返回详情页
        });
    },
    goToAddress() {
      this.$router.push({
        path: "/address",
        query: {
          paths: this.$route.path
        }
      });
    },
    async submitOrder(){

      this.FBPushEvent(); // 推送提交订单事件

      let productMsg = this.buyNowOrderInfo.storeMap.goodsMap;
      let data = {
        goods_id: productMsg.goods_id,
        color: productMsg.color,
        gsp: productMsg.goods_gsp,
        count: productMsg.goods_count,
        address_id: this.address.addr_id,
        payType: "payafter",
        cart_session: this.buyNowOrderInfo.cart_session,
        storeCouponId: '',
        generalCouponId: '',
        store_id: this.buyNowOrderInfo.storeMap.store_id,
        order_type: this.GLOBA.isApp?'app':'web'
      };
      if(this.buyNowOrderInfo.storeMap.Couponinfo.length){
        data.storeCouponId = this.buyNowOrderInfo.storeMap.Couponinfo[this.couponProps.storeSelect].id;
      }
      if(this.buyNowOrderInfo.Couponinfo.length){
        data.generalCouponId = this.buyNowOrderInfo.Couponinfo[this.couponProps.generalSelect].id;
      }
      let res = await this.$HTTP.payNow(data);
      if (res.code == 4200) {
        this.$store.commit("coup_draw", { raffle: res.data.raffle });
        this.$router.push({
          path: "/account/Account/orders",
          query: {
            toPage: 3
          }
        });
        this.FBAAAA(); // 脸书埋点相关
        if (window.fbAsyncInit) {
          FB.AppEvents.logPurchase(
            //推送 完成购买交易，标志性事件通常是收到订单、购买确认或交易收据
            this.justPrice.store_total_price /* number */,
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
        this.haveNoAddress();
      } else {
        Toast({
          message: this.$t("message.Server is busy"),
          time: 3000,
          i: 1
        });
      }
      if (window.fbAsyncInit) {// 如果FB初始化成功  添加付款信息 推送提交订单支付信息
        var params = {};
        params[FB.AppEvents.ParameterNames.SUCCESS] = res.code == 4200 ? 1 : 0;
        FB.AppEvents.logEvent(
          FB.AppEvents.EventNames.ADDED_PAYMENT_INFO,
          null,
          params
        );
      }
    },
    showEnoughTankFn() { // 打开满减弹框
      this.showEnoughTank = true;
      window.history.pushState(null, null, "#");
    },
    closeEnoughTankFn(){  // 关闭满减弹框
      this.$router.go(-1);
      this.showEnoughTank = false;
    },
    FBPushEvent(){
      try {
        if (window.fbAsyncInit) {// 如果FB初始化成功
          var params = {}; // FB推送 发起结账流程 开始结账流程
          params[FB.AppEvents.ParameterNames.CONTENT] = this.buyNowOrderInfo.storeMap.store_name;
          params[FB.AppEvents.ParameterNames.CONTENT_ID] = this.buyNowOrderInfo.cart_session;
          params[FB.AppEvents.ParameterNames.CONTENT_TYPE] = "paybefore";
          params[FB.AppEvents.ParameterNames.NUM_ITEMS] = this.buyNowOrderInfo.storeMap.goodsMap.goods_count;
          params[FB.AppEvents.ParameterNames.PAYMENT_INFO_AVAILABLE] = 1;
          params[FB.AppEvents.ParameterNames.CURRENCY] = this.GLOBA.money_tag;
          FB.AppEvents.logEvent(
            FB.AppEvents.EventNames.INITIATED_CHECKOUT,
            this.justPrice.store_total_price,
            params
          );
        }
      } catch (error) {}
    },
    FBAAAA(){// 脸书埋点 
      if (fbq && fbq != undefined && fbq != "undefined") {
        let good = this.buyNowOrderInfo.storeMap.goodsMap
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
    }
  },
  mounted() {
    window.addEventListener("popstate", (e) => {
      if (this.showCouponTank) {
        this.showCouponTank = false;
      }
      if (this.showEnoughTank) {
        this.showEnoughTank = false;
      }
    }, false);
  },
  beforeDestroy() {
    window.removeEventListener("popstate", (e) => {
      if (this.showCouponTank) {
        this.showCouponTank = false;
      }
      if (this.showEnoughTank) {
        this.showEnoughTank = false;
      }
    }, false);
  },
};
</script>

<style lang="scss" scoped>
.storeName {
  position: relative;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.24rem;
  color: #333;
  background-color: #e9e9e9;
  height: 0.7rem;
  line-height: 0.7rem;
  display: flex;
  align-items: center;
  .storeTag {
    width: 0.08rem;
    height: 0.26rem;
    color: #008edd;
    background-color: #008edd;
  }
  p {
    padding: 0 0.16rem;
  }
}
.enoughWrap {
  font-size: 0.22rem;
  color: #017ec2;
  padding: 0.3rem 0.2rem 0.1rem;
  background-color: #fff;
}
.storeProduct {
  min-height: 1.4rem;
  padding: 0.2rem;
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #ebebeb;
}
.productImg {
  width: 1.7rem;
  padding: 0 0.2rem;
  img {
    max-width: 100%;
  }
}
.productName {
  width: 4.6rem;
  height: 0.56rem;
  line-height: 0.28rem;
  font-size: 0.26rem;
  font-family: "Calibri";
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.productInfo {
  padding-top: 0.2rem;
  display: flex;
  justify-content: space-between;
  .productSize {
    width: 3rem;
    font-size: 0.24rem;
    font-family: "Calibri";
    font-weight: 400;
    color: #b3b3b3;
  }
}
.productPrice {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.26rem;
  padding-top: 0.1rem;
  span:last-child {
    font-size: 0.18rem;
    line-height: 0.2rem;
    vertical-align: 0.1rem;
  }
}
.priceWrap {
  padding: 0.2rem 0;
  background-color: #fff;
}
.priceRow,
.countPrice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.6rem;
  line-height: 0.6rem;
}
.collspace {
  display: flex;
}
.priceRow {
  padding: 0 0.2rem;
}
.priceRow {
  .priceTitle {
    color: #999;
  }
  .price_big {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    span {
      font-size: 0.18rem;
      line-height: 0.5rem;
      vertical-align: 0.1rem;
    }
  }
  .discount {
    font-size: 0.22rem;
  }
  .morePrice {
    font-size: 0.22rem;
    color: #017ec2;
  }
}
.totalBox {
  padding: 0 0.3rem;
  background-color: #fff;
  margin-top: 0.3rem;
}
.totalBoxRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.32rem;
  height: 0.8rem;
  line-height: 0.8rem;
  border-bottom: 1px solid #ebebeb;
  font-family: "Calibri-Bold";
  font-weight: bold;
  font-size: 0.26rem;
  .totalMore {
    line-height: 0.8rem;
    span {
      line-height: 0.4rem;
      vertical-align: 0.1rem;
    }
  }
  &:last-child {
    border: none;
  }
  p {
    color: #999999;
  }
}
.or_conter {
  padding: 0.3rem 0;
}
.pay_button {
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
    .footTitle {
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: 400;
      color: #999999;
      font-weight: bold;
    }
    .totaPrice {
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
    .discountPrice {
      color: #999;
      font-size: 0.22rem;
      font-weight: 400;
      font-family: "Calibri";
      line-height: 0.3rem;
      height: 0.4rem;
    }
  }
  .foot_right {
    width: 2.4rem;
    line-height: 1rem;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    background: linear-gradient(to right, #33b6ff, #017ec2);
    text-align: center;
    color: #fff;
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: 400;
  }
}
</style>
