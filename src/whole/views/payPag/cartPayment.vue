<template>
  <div>
    <publicHead :noHeadRight="true">
      <h6 slot="headCenter">{{$t('title.Confirm an order')}}</h6>
    </publicHead>
    <div class="mainWrap centerWrap" v-show="adjustPrice.orderlist">
      <div class="shopContent">
        <div
          class="shopStore"
          v-for="(orderList, orderListIndex) in adjustPrice.orderlist"
          :key="orderListIndex"
        >
          <h4 class="storeName">
            <div class="storeTag"></div>
            <p>{{orderList.store_name}}</p>
          </h4>
          <div v-if="orderList.gc_list && orderList.gc_list.length">
            <!-- 普通产品 无满减-->
            <div
              class="storeProduct"
              v-for="(product,productIndex) in orderList.gc_list"
              :key="productIndex"
            >
              <div class="productImg">
                <img v-lazy="product.gcg_main_photo" alt />
              </div>
              <div class="productMsg">
                <div
                  class="productName"
                  :class="{'ltr':product.gcg_name.substring(0,1)!=='^'}"
                >{{product.gcg_name.substr(0, 1) === '^' ?product.gcg_name.substr(1) : product.gcg_name}}</div>
                <div class="productInfo">
                  <div class="productSize">
                    <span v-if="product.goods_spec_color">Color:{{product.goods_spec_color}}</span>
                    <span v-if="product.gc_sepc_info" v-html="product.gc_sepc_info"></span>
                  </div>
                  <Xnumber
                    :min="1"
                    :max="product.goods_inventory"
                    v-model="product.gc_count"
                    :disabled="product.point == 1"
                    @change="changeProductCount(product)"
                  ></Xnumber>
                </div>
                <div class="productPrice">
                  <span>{{GLOBA.money_tag}}{{product.gcg_price | integerNum}}</span>
                  <span>.{{product.gcg_price | decimalNum}}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="orderList.enoughReduce && orderList.enoughReduce.length">
            <!-- 满减产品 有满减-->
            <div
              v-for="(enoughReduceItem,enoughReduceIndex) of orderList.enoughReduce"
              :key="enoughReduceIndex"
            >
              <div class="enoughWrap" @click="showEnoughTankFn(enoughReduceItem)">
                Full {{GLOBA.money_tag}} {{Object.keys(enoughReduceItem.er_json)[0] | integerNum }} minus {{Object.values(enoughReduceItem.er_json)[0]}}
                <span
                  class="er"
                  v-if="Object.keys(enoughReduceItem.er_json).length>1"
                >Full {{GLOBA.money_tag}} {{Object.keys(enoughReduceItem.er_json)[1] | integerNum}} minus {{Object.values(enoughReduceItem.er_json)[1]}}</span>
                <span class="er" v-if="Object.keys(enoughReduceItem.er_json).length>2">...</span>
              </div>
              <div
                class="storeProduct"
                v-for="(er_good_items,er_good_item_index) in enoughReduceItem.er_goods"
                :key="er_good_item_index"
              >
                <div class="productImg">
                  <img v-lazy="er_good_items.gcg_main_photo" alt />
                </div>
                <div class="productMsg">
                  <div
                    class="productName"
                    :class="{'ltr':er_good_items.gcg_name.substring(0,1)!=='^'}"
                  >{{er_good_items.gcg_name.substr(0, 1) === '^' ?er_good_items.gcg_name.substr(1) : er_good_items.gcg_name}}</div>
                  <div class="flexBox productInfo">
                    <div class="productSize"></div>
                    <Xnumber
                      :min="1"
                      :max="er_good_items.goods_inventory"
                      v-model="er_good_items.gc_count"
                      :disabled="er_good_items.point == 1"
                      @change="changeProductCount(er_good_items)"
                    ></Xnumber>
                  </div>
                  <div class="productPrice">
                    <span>{{GLOBA.money_tag}}{{er_good_items.gcg_price | integerNum}}</span>
                    <span>.{{er_good_items.gcg_price | decimalNum}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="priceWrap">
            <div class="priceRow">
              <div class="countPrice">
                <div class="collspace">
                  <div class="priceTitle">{{$t('title.Subtotal')}}:</div>
                  <div class="price_big">
                    {{GLOBA.money_tag}} {{(orderList.store_goods_price) | integerNum }}
                    <span>.{{(orderList.store_goods_price) | decimalNum}}</span>
                  </div>
                </div>
                <div
                dir="ltr"
                  class="discount"
                  v-if="orderList.Couponinfo && orderList.Couponinfo.length"
                >-{{GLOBA.money_tag}}&nbsp;&nbsp;{{discount(orderList)}}</div>
              </div>
              <div
                class="morePrice"
                v-if="orderList.Couponinfo && orderList.Couponinfo.length"
                @click="couponSelect(orderList.Couponinfo,orderList.store_id)"
              >Store coupon</div>
            </div>
            <div class="priceRow" v-if="orderList.enoughReduce && orderList.enoughReduce[0].er_price">
              <div class="countPrice">
                <div class="collspace">
                  <div class="priceTitle">Minus:</div>
                  <div class="price_big">
                    {{GLOBA.money_tag}} {{(orderList.enoughReduce[0].er_price) | integerNum }}
                    <span>.{{(orderList.enoughReduce[0].er_price) | decimalNum}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="priceRow" v-if="orderList.sys_info && orderList.sys_info.length">
              <div class="countPrice">
                <div class="collspace">
                  <div class="priceTitle">{{$t("common.Delivery")}}:</div>
                  <div class="price_big">
                    {{GLOBA.money_tag}} {{(orderList.sys_info[0].ship_price) | integerNum }}
                    <span>.{{(orderList.sys_info[0].ship_price) | decimalNum}}</span>
                  </div>
                </div>
                <div
                dir="ltr"
                  class="discount"
                  v-if="orderList.store_enough_free==1 && orderList.sys_info[0].flag"
                >-{{GLOBA.money_tag}} {{orderList.sys_info[0].ship_price}}</div>
              </div>
              <div
                class="morePrice"
                v-if="orderList.store_enough_free==1"
              >Full {{orderList.store_enough_free_price}} free shipping</div>
            </div>
          </div>
        </div>
      </div>
      <div class="totalBox">
        <div class="totalBoxRow">
          <p>{{$t('title.Payment Method')}}</p>
          <span>Cash on Delivery</span>
        </div>
        <div class="totalBoxRow">
          <p>{{$t('common.Total')}}</p>
          <span class="totalMore">
            {{GLOBA.money_tag}}{{adjustPrice.order_tota_price | integerNum}}
            <span>.{{adjustPrice.order_tota_price | decimalNum}}</span>
          </span>
        </div>
        <div
          class="totalBoxRow"
          v-if="adjustPrice.Couponinfo && adjustPrice.Couponinfo.length > 0 && adjustPrice.point != 1"
          @click="couponSelect(adjustPrice.Couponinfo, 0)"
        >
          <p class="cou_text">Soamall Coupon</p>
          <div class="cou_money" >
            <span >-{{GLOBA.money_tag}}{{discount(adjustPrice,0)}}</span>
            <span class="or_count" :class="{'isRotate': GLOBA.isRotate}"></span>
            <img class="rightIconRow" :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/other/xiangyou3.png"/>
          </div>
        </div>
      </div>
      <div class="or_conter">
        <!-- 更改地址 -->
        <ChangeAdd :addres="addres" @dizhixz="goToAddress"></ChangeAdd>
      </div>
    </div>
    <div class="pay_button bottomWrap" v-show="adjustPrice.orderlist">
      <div class="foot_left">
        <p class="footTitle">{{$t("common.Total")}}</p>
        <div class="tota_price">
          <div class="totaPrice" dir="ltr">
            <span>{{GLOBA.money_tag}} {{adjustPrice.pay_total_price | integerNum}}</span>
            <span>.{{adjustPrice.pay_total_price | decimalNum}}</span>
          </div>
          <p class="discountPrice">Dicounted:{{adjustPrice.order_discounts_amount | keeptwoNum}}</p>
        </div>
      </div>
      <div class="foot_right" v-click="submitOrder">{{$t("common.Buy Now")}}</div>
    </div>
    <!-- 满减弹框 -->
    <vantPopup
      v-model="showEnoughTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      @click-overlay ="closeEnoughTankFn"
    >
      <enoughReduceTank :enoughReduceData="enoughReduceData" @closeEnoughTank="closeEnoughTankFn"></enoughReduceTank>
    </vantPopup>
    <!-- 选择优惠券弹框 -->
    <vantPopup
      v-model="showCouponTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      @click-overlay ="closeCouponTank"
      class="couponMask"
      :class="{'green':storeCouponIndex!=0}"
    >
      <div class="couponWrap" @click.stop>
        <div class="couponTitle">
          <h6>
            <img src="@/assets/img/accout/yh2.png" alt />Coupons
          </h6>
          <div class="close" :class="{'smallClose':GLOBA.isRotate}" @click="closeCouponTank">
            <img src="@/assets/img/other/closeBtn.png" />
          </div>
        </div>
        <div class="couponList">
          <div
            class="couponItem"
            v-for="(item, i) of couponList"
            :key="i"
            @click="changeCoupon(item,item.id)"
          >
            <div class="coupTag">
              <div class="tag">{{GLOBA.money_tag}}</div>
              <div class="value">{{item.Coupon_amount}}</div>
            </div>
            <div class="coupMsg">
              <div class="row1 line-blok-clamp">{{item.Coupon_name}}</div>
              <div
                class="row2 line-blok-clamp"
              >{{item.Coupon_order_amount ==0 ? 'Unlimit' : item.Coupon_order_amount + 'available'}}</div>
              <div class="row3 line-blok-clamp">{{item.Coupon_begin_time}}~{{item.Coupon_end_time}}</div>
            </div>
            <div class="coupSelect" :class="{'rightBot':$route.query.lang=='sa'}">
              <div
                class="coupCheck"
                :class="{'select': couponListIndex[storeCouponIndex] == item.id && item.flag}"
              ></div>
            </div>
            <div class="unSelectCoup" v-show="item.show || !item.flag"></div>
          </div>
        </div>
        <div class="coupConfimBtn" @click="coupConfimFn">Confirm</div>
      </div>
    </vantPopup>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import {Dialog,Toast,Popup} from 'vant';
export default {
  components: {
    publicHead,
    Dialog,
    vantPopup: Popup,
    ChangeAdd: () => import("@/whole/pay/components/change_address"),
    Xnumber: () => import("@/whole/components/global/x_number"),
    enoughReduceTank: () => import("./components/enoughReduceTank")
  },
  data() {
    return {
      adjustPrice: {}, // 计算商品价格对象
      adjustPostData: {
        //获取商品总价接口postData
        gcs: this.$route.query.goodsId, //订单页面所有购物车id
        cart_session: "",
        gc_id: "", //需要调整的购物车id
        count: "", //需要调整的商品数量
        address_id: "", //用户地址id
        storeCouponId: "", //店铺优惠券id
        generalCouponId: "" //平台优惠券id
      },
      addres: "",
      showEnoughTank: false,
      enoughReduceData: [],

      showCouponTank: false,
      couponList: [], // 店铺优惠券列表
      couponListIndex: {}, // 记录优惠券选择id
      oldCouponListIndex: null, // 记录上一次 优惠券选择id   以便于取消的时候还原
      storeCouponIndex: "" // 店铺索引 为couponListIndex的key值
    };
  },
  activated() {
    // this.getAddress();
    this.getProductInfo();
    this.getAddress();
  },
  mounted() {
    window.addEventListener(
      "popstate",
      e => {
        if (this.showCouponTank) {
          this.showCouponTank = false;
        }
        if (this.showEnoughTank) {
          this.showEnoughTank = false;
        }
      },
      false
    );
  },
  methods: {
    discount(coupList, i) {
      // 获取满减金额
      let obj = this.couponListIndex; // {0:241, 16:404}
      let couponSelectId = obj[0]; // 默认平台优惠券下标0key
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (coupList.store_id == key) {
            couponSelectId = obj[key]; // 店铺优惠券  店铺Id key
          }
        }
      }
      for (let index = 0; index < coupList.Couponinfo.length; index++) {
        if (coupList.Couponinfo[index].id == couponSelectId) {
          return `${coupList.Couponinfo[index].Coupon_amount}`;
        } else {
          return 0;
        }
      }
    },
    couponSelect(couponList, i) {
      // 打开平台优惠券选择弹框couponList优惠券列表  i为store id   0代表平台优惠券
      this.couponList = couponList;
      this.storeCouponIndex = i;
      this.showCouponTank = true;
      this.oldCouponListIndex = Object.assign({}, this.couponListIndex);
      window.history.pushState(null, null, "#");
    },
    changeCoupon(couponItem, id) {
      //切换优惠券
      if (couponItem.show || !couponItem.flag) return;
      if (this.couponListIndex[this.storeCouponIndex] == id) {
        // 如果点击已选中的 则取消选中
        this.couponListIndex[this.storeCouponIndex] = "";
      } else {
        this.couponListIndex[this.storeCouponIndex] = id;
      }
      this.$forceUpdate(); // 强制跟新视图
    },
    closeCouponTank() {
      this.couponListIndex = this.oldCouponListIndex;
      this.showCouponTank = false;
      this.$router.go(-1);
    },
    coupConfimFn() {
      // 优惠券选择提交
      let obj = this.couponListIndex;
      let arr = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key == 0) {
            // 如果key = 0  平台优惠券id
            this.adjustPostData.generalCouponId = obj[key] || "";
          } else {
            if (key && obj[key]) {
              arr.push(`${key}_${obj[key]}`);
            }
          }
        }
      }
      this.adjustPostData.storeCouponId = arr.join();
      this.oldCouponListIndex = obj;
      this.closeCouponTank()
      this.getAdjust(() => {
        for (
          let index = 0;
          index < this.adjustPrice.Couponinfo.length;
          index++
        ) {
          let element = this.adjustPrice.Couponinfo[index];
          if (obj[0] == element.id) {
            if (!element.flag) {
              obj[0] = "";
            }
          }
        }
      }); // 获取商品总价
    },
    changeProductCount(product) {
      // 修改商品数量count
      this.adjustPostData.gc_id = product.gc_id;
      this.adjustPostData.count = product.gc_count;
      this.getAdjust(); // 获取商品总价
    },
    async getProductInfo() {
      let data = {
        gcs: this.$route.query.productId,
        language: this.lang === "sa" ? 1 : 0
      }
      let res = await this.$HTTP.goods_cart2(data)
      if (res.code == 2) {this.haveNoAddress()};
      if (res.code == 0) {
        let gwcSelectGoods = res.data;
        this.addres = gwcSelectGoods.address[0];
        let key = gwcSelectGoods.orderlist[0].store_id;
        let val = gwcSelectGoods.orderlist[0].Couponinfo.length
          ? gwcSelectGoods.orderlist[0].Couponinfo[0].id
          : "";
        let aaa = key && val ? `${key}_${val}` : ""; //{[key]:val}

        let goodsCount = 0;
        if (gwcSelectGoods.orderlist[0].gc_list.length) {
          goodsCount = gwcSelectGoods.orderlist[0].gc_list[0].gc_count;
        } else if (gwcSelectGoods.orderlist[0].enoughReduce.length) {
          goodsCount =
            gwcSelectGoods.orderlist[0].enoughReduce[0].er_goods[0].gc_count;
        }
        this.adjustPostData = {
          // 获取商品总价接口postData
          gcs: gwcSelectGoods.gcs,
          gc_id: gwcSelectGoods.gcs.split(",")[0],
          count: goodsCount,
          storeCouponId: aaa,
          generalCouponId: gwcSelectGoods.Couponinfo.length
            ? gwcSelectGoods.Couponinfo[0].id
            : "",
          cart_session: gwcSelectGoods.cart_session,
          address_id: gwcSelectGoods.address[0].addr_id
        };

        this.getAdjust(() => {
          let orderList = this.adjustPrice.orderlist;
          for (let index = 0; index < orderList.length; index++) {
            //初始化店铺优惠券
            if (orderList[index].Couponinfo.length) {
              this.couponListIndex[orderList[index].store_id] =
                orderList[index].Couponinfo[0].flag &&
                orderList[index].Couponinfo[0].id;
            }
          }
          if (this.adjustPrice.Couponinfo.length) {
            //初始化平台优惠券
            this.couponListIndex[0] = this.adjustPrice.Couponinfo[0].flag
              ? this.adjustPrice.Couponinfo[0].id
              : "";
          }
        }); // 获取商品总价
        console.log(this.couponListIndex)
      }
    },
    async getAdjust(callBack) {
      // 获取商品总价
      let res = await this.$HTTP.adjust(this.adjustPostData);
      if(res.code == 0){
        this.adjustPrice = res.data;
        if (callBack) callBack();
      }
    },
    getAddress() {
      let changeAdd = this.$route.query.check;
      if (changeAdd) {
        let adde = this.$store.state.adde;
        this.addres = {
          addr_child_name: adde.areaChildName,
          area_name: adde.areaName,
          area_parent_name: adde.areaParendName,
          area_info: adde.area_info,
          addr_id: adde.id,
          default_val: adde.default_val,
          mobile: adde.mobile,
          telephone: adde.telephone,
          trueName: adde.consigneeName
        };
        this.adjustPostData.address_id = adde.id;
        this.getAdjust();
      }
    },
    goToAddress() {
      this.$router.push({
        path: "/address",
        query: {
          paths: this.$route.path
        }
      });
    },
    async submitOrder() {
      let obj = this.couponListIndex;
      let arr = [];
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key != 0) {
            // 排除平台优惠券
            arr.push(`${key}_${obj[key]}`);
          }
        }
      }
      let storeIdArr = [];
      for (let index = 0; index < this.adjustPrice.orderlist.length; index++) {
        storeIdArr.push(this.adjustPrice.orderlist[index].store_id);
      }
      let data = {
        cart_session: this.adjustPostData.cart_session,
        store_id: storeIdArr.join(),
        addr_id: this.adjustPostData.address_id,
        gcs: this.adjustPostData.gcs,
        delivery_time: "",
        delivery_type: "",
        delivery_id: "",
        payType: "payafter",
        gifts: "",
        mobile: "",
        mobile_verify_code: "",
        generalCouponId: this.couponListIndex[0],
        storeCouponId: arr.join()
      };
      let res = await this.$HTTP.goods_cart3(data);
      if (res.code == 0) {
        this.order_payafter(res.data);
      } else {
        Toast({
          message: this.$t("message.Server is busy"),
          icon: require("@/assets/img/other/error.png"),
        });
      }
    },
    async order_payafter(dat) {
      const data = {
        payType: "payafter",
        order_id: dat.order_id,
        pay_msg: "",
        pay_session: dat.payafter_payTypemap.pay_session
      };
      let res = await this.$HTTP.pay_payafter(data);
      if (res.code == 0) {
        this.$store.commit("coup_draw", { raffle: res.data.raffle });
        this.$router.push({
          path: "/account/Account/orders",
          query: {
            toPage: 3
          }
        });
      }
    },
    haveNoAddress(){
      Dialog.confirm({
        className: 'vantConfirm',
        message: this.$t("title.You have no shipping address"),
        confirmButtonText: this.$t('title.Add New Address'),
        cancelButtonText: this.$t("common.Cancel")
      })
      .then(() => {
        this.$router.push({ 
          path: "/newAddress",
          query:{
            ...this.$route.query,
            toPath: this.$route.path
          }
        })
      })
      .catch(()=>{
        this.$router.push({name: 'Cart'})
      })
    },
    showEnoughTankFn(currentEnoughReduce) { // 打开满减弹框
      this.enoughReduceData = currentEnoughReduce;
      this.showEnoughTank = true;
      window.history.pushState(null, null, "#");
    },
    closeEnoughTankFn(){  // 关闭满减弹框
      if(window.location.hash.length == 0 || !window.location.hash){
        this.$router.go(-1);
      }
      this.showEnoughTank = false;
    }
  },
  beforeDestroy(){
    window.removeEventListener(
      "popstate",
      e => {
        if (this.showCouponTank) {
          this.showCouponTank = false;
        }
        if (this.showEnoughTank) {
          this.showEnoughTank = false;
        }
      },
      false
    );
  }
};
</script>
<style lang="scss" scoped>
.mainWrap {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
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
  display: flex;
  justify-content: space-between;
  padding-top: 0.1rem;
  .productSize {
    width: 3.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  padding: 0.3rem;
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
.green .couponItem {
  background-color: lightgreen;
}
.green .coupSelect {
  border-color: lightgreen;
}
.green .coupSelect .coupCheck.select {
  background-color: lightgreen;
}
.couponTitle {
  display: flex;
  justify-content: center;
  background-color: #fff;
  height: 0.8rem;
  padding: 0 0.3rem;
  border-bottom: 1px solid #ccc;
  position: relative;
  .close {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.3rem;
    color: #ccc;
    height: 0.8rem;
    line-height: 0.7rem;
    width: 1rem;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    img {
      width: 0.53rem;
      height: 0.53rem;
      vertical-align: middle;
    }
  }
  .smallClose {
    right: 6.5rem;
  }
  h6 {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #017ec2;
    line-height: 0.8rem;
    img {
      width: 0.3rem;
      padding: 0 0.2rem;
      vertical-align: middle;
    }
  }
}
.couponList {
  height: 7rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f7f7f7;
  padding: 0.3rem;
  padding-top: 0px;
}
.couponItem {
  background-color: #33b6ff;
  box-shadow: 2px 2px 10px #e2e2e2;
  height: 1.6rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.1rem;
  position: relative;
  .coupTag {
    width: 2.6rem;
    height: 100%;
    text-align: center;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #fff;
    display: flex;
    -webkit-box-pack: start;
    padding: 0 0.1rem;
    box-sizing: border-box;
    .tag {
      font-size: 0.2rem;
      line-height: 1rem;
    }
    .value {
      font-size: 0.8rem;
      line-height: 1.6rem;
    }
  }
  .coupMsg {
    width: 2.8rem;
    height: 100%;
    font-size: 0.26rem;
    padding: 0.2rem 0;
    box-sizing: border-box;
    color: #fff;
    .row1 {
      font-size: 0.3rem;
      font-weight: bold;
    }
    .row2 {
      font-size: 0.3rem;
      margin-top: 0.06rem;
    }
    .row3 {
      font-size: 0.23rem;
    }
  }
  .coupSelect {
    height: 100%;
    width: 1.5rem;
    position: relative;
    border-left: 2px dotted #33b6ff;
    background: #fff;
  }
  .rightBot {
    border-left: none;
    border-right: 2px dotted lightgreen;
  }
}
.coupSelect {
  display: flex;
  justify-content: center;
  align-items: center;
  .coupCheck {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    border: 1px solid #999999;
  }
  .coupCheck.select {
    background-color: #33b6ff;
    border: none;
  }
}
.coupConfimBtn {
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background-color: #008edd;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.34rem;
  color: #fff;
}
.unSelectCoup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
</style>