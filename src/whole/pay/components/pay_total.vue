<template>
  <div class="total_box">
    <div class="shop_foot">
      <p>Payment Method</p>
      <p>
        <span>Cash on Delivery</span>
      </p>
    </div>
    <div class="shop_foot">
      <p>Total</p>
      <p dir="ltr">
        <span>{{GLOBA.money_tag}} {{total.order_total_price | integerNum}}</span>
        <span>.{{total.order_total_price | decimalNum}}</span>
      </p>
    </div>
    <div
      class="shop_coun"
      v-if="parys.Couponinfo.length > 0 && parys.storeMap.goodsMap.goods_point != 1"
      @click="$emit('select', parys.Couponinfo)"
    >
      <p class="cou_text">Soamall Coupon</p>
      <p class="cou_money">
        <span>- {{GLOBA.money_tag}} {{sum}}</span>
        <span
          class="or_count"
          :class="{'isRotate': GLOBA.isRotate}"
        ></span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['total', "parys", "sum"],
  data () {
    return {};
  },

  created () { },

  methods: {
  }
};
</script>
<style lang='scss' scoped>
.total_box {
  border-top: 0.3rem solid #f7f7f7;
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.shop_foot {
  font-size: 0.32rem;
  display: flex;
  justify-content: space-between;
  height: 0.8rem;
  line-height: 0.8rem;
  border-bottom: 1px solid #ebebeb;

  p:nth-child(1) {
    font-size: 0.26rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #999999;
  }

  p:nth-child(2) {
    font-size: 0.26rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    display: flex;
    justify-content: flex-start;

    span:nth-child(2) {
      font-size: 0.18rem;
      line-height: 0.6rem;
      vertical-align: middle;
    }
  }
}
.shop_coun {
  font-size: 0.32rem;
  display: flex;
  justify-content: space-between;
  height: 0.9rem;
  line-height: 0.9rem;
  // border-bottom: 1px solid #ebebeb;

  .cou_text {
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #999999;
  }

  .cou_money {
    display: flex;
    font-size: 0.26rem;
    font-family: "Calibri-Bold";
    font-weight: bold;

    span:nth-child(1) {
      display: block;
      margin-right: 0.2rem;
    }

    span:nth-child(2) {
      display: block;
      background: url(../../../assets/img/other/xiangyou3.png) no-repeat;
      background-size: 0.06rem 0.12rem;
      width: 0.2rem;
      height: 0.2rem;
      background-position: center center;
      margin: auto;
    }
  }
}
</style>