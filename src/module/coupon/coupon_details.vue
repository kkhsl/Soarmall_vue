<template>
  <div class="full_coupon_box">
    <div
      class="full_coupons"
      v-if="good_data.ertagmap.length>0 || good_data.storemap.store_enough_free==1"
    >
      <div class="log">
        <img :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/FreeGit/manjian.png" alt />
        <div class="text">
          <span
            class="freeShip"
            v-if="good_data.storemap.store_enough_free==1"
          >Full {{GLOBA.money_tag}} {{good_data.storemap.store_enough_price}} free shipping</span>
          <div class="fullPage">
            <span
              v-for="(er, index) in good_data.ertagmap"
              :key="index"
            >Full {{GLOBA.money_tag}} {{er[0] | percentageNum}} minus {{er[1]}}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <img
          src="../../assets/img/other/xiangyou3.png"
          class="rightIconRow"
          alt
          :class="{'isRotate':GLOBA.isRotate}"
        />
      </div>
    </div>
    <div class="full_coupons" v-if="coupon.length>0" @click="$emit('coupon_but')">
      <div class="log">
        <img :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/FreeGit/zhekou.png" alt />
        <p class="text">
          <span>Minus {{GLOBA.money_tag}} {{coupon[0].Coupon_amount}}</span>
          <span v-if="coupon.length>1">&nbsp;/ Minus {{GLOBA.money_tag}} {{coupon[1].Coupon_amount}}</span>
        </p>
      </div>
      <div class="right">
        <img
          src="../../assets/img/other/xiangyou3.png"
          class="rightIconRow"
          alt
          :class="{'isRotate':GLOBA.isRotate}"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["coupon", "good_data"],
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
// 优惠券
.full_coupon_box {
  padding: 0.2rem 0;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  background-color: #fff;
  margin-bottom: 0.2rem;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.24rem;
  color: #ff4c40;
}
.full_coupons {
  padding: 0.2rem 0.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.log {
  display: flex;
  align-items: center;
  padding: 0 0.1rem;
  box-sizing: border-box;
  width: 90%;
  img {
    width: 0.32rem;
  }
}
.right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .text {
    width: 5.7rem;
  }
}
.text {
  padding: 0 0.2rem;
  width: 90%;
  .fullPage {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.1rem;
    span {
      // padding: 0.15rem 0.1rem 0rem 0rem;
      display: inline-block;
      width: 50%;
    }
  }
}
</style>