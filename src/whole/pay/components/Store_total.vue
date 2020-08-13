<template>
  <div class="z_zonghe">
    <ul class="s_total">
      <li class="total">
        <p>Subtotal:</p>
        <p class="total_p" dir="ltr">
          <span>{{GLOBA.money_tag}} {{(total.order_goods_price) | integerNum }}</span>
          <span>.{{(total.order_goods_price) | decimalNum}}</span>
        </p>
      </li>
      <li
        class="discount"
        v-if="pay_good.Couponinfo.length>0 && pay_good.goodsMap.goods_point != 1"
      >- {{GLOBA.money_tag}} {{store_sum || 0}}</li>
      <li
        class="more"
        v-if="pay_good.Couponinfo.length>0 && pay_good.goodsMap.goods_point != 1"
        @click="$emit('m_currency',pay_good.Couponinfo)"
      >Store coupon</li>
    </ul>

    <ul class="s_total" v-if="total.if_full">
      <li class="total">
        <p>Minus:</p>
        <p class="total_p" dir="ltr">
          <span>{{GLOBA.money_tag}} {{total.enoughReduce.er_price?total.enoughReduce.er_price: 0 | integerNum }}</span>
          <span>.{{total.enoughReduce.er_price?total.enoughReduce.er_price: 0 | decimalNum}}</span>
        </p>
      </li>
      <li class="more special" @click="$emit('ertagmap_btn',0)">
        Full {{GLOBA.money_tag}} {{total.enoughReduce.ertagmap[0][0] | integerNum }} minus {{total.enoughReduce.ertagmap[0][1]}}
        <span
          class="er"
          v-if="total.enoughReduce.ertagmap.length>1"
        >Full {{GLOBA.money_tag}} {{total.enoughReduce.ertagmap[1][0] | integerNum}} minus {{total.enoughReduce.ertagmap[1][1]}}</span>
        <span class="er" v-if="total.enoughReduce.ertagmap.length>2">...</span>
      </li>
    </ul>

    <ul class="s_total" v-if="total.transMap">
      <li class="total">
        <p>{{$t("common.Delivery")}}:</p>
        <p class="total_p" dir="ltr">
          <span>{{GLOBA.money_tag}} {{total.transMap.ship_price | integerNum}}</span>
          <span>.{{total.transMap.ship_price | decimalNum}}</span>
        </p>
        <p class="reach" v-if="!total.flag">The goods are out of range</p>
      </li>
      <li class="discount" v-if="flag == 1">- {{GLOBA.money_tag}} {{pay_good.transMap.ship_price}}</li>
      <li
        class="more"
        v-if="pay_good.store_enough_free==1"
      >Full {{pay_good.store_enough_free_price}} free shipping</li>
    </ul>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
export default {
  props: ["total", "pay_good", "store_sum", "flag"],
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.z_zonghe {
  width: 100%;
  // height: 1.2rem;
  margin-top: 0.1rem;
  border-top: 1px solid #ebebeb;
  font-size: 0.32rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
  .s_total {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
    font-family: "Calibri";
    font-weight: 400;
    .total {
      width: 4.9rem;
      font-size: 0.26rem;
      display: flex;
      justify-content: flex-start;
      p:nth-child(1) {
        color: #999999;
      }
      .total_p {
        font-family: "Calibri-Bold";
        font-weight: Bold;
        display: flex;
        justify-content: flex-start;
        white-space: nowrap;
        span {
          color: black;
          display: block;
        }
        span:nth-child(2) {
          font-size: 0.18rem;
          line-height: 0.35rem;
          vertical-align: 0.3rem;
        }
      }
      .reach {
        padding-top: 0.04rem;
        line-height: 0.25rem;
        color: #f00;
        font-size: 0.22rem;
      }
    }

    .discount {
      font-size: 0.22rem;
      width: 1.4rem;
      text-align: start;
      white-space: nowrap;
    }
    .more {
      width: 5.6rem;
      font-size: 0.22rem;
      color: #017ec2;
      text-align: end;
      padding: 0 0.1rem;
      white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
    .special {
      width: 8.6rem;
    }
  }
}
</style>