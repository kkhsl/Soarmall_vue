<template>
  <div class="coupon_r">
    <div class="option" @click="coupon_c"></div>
    <div class="coupons" @click="coupon_c">
      <p>
        <img src="@/assets/img/accout/yh2.png" alt />Coupons
      </p>
      <p :class="{'leftClose':GLOBA.isRotate}" class="close">
        <img src="@/assets/img/other/closeBtn.png" />
      </p>
    </div>
    <div class="coupons_box">
      <CouponStyle :items="lists" :is_page="1"></CouponStyle>
    </div>
  </div>
</template>
 
<script>
export default {
  props: ["lists"],
  components: {
    CouponStyle: () => import("@/module/coupon/coupon_style")
  },
  data() {
    return {};
  },
  methods: {
    coupon_c() {
      this.$emit("coupon_c");
    }
  }
};
</script>
<style lang='scss' scoped>
.coupon_r {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.option {
  width: 100%;
  height: 3.2rem;
}
.coupons {
  display: flex;
  justify-content: center;
  background-color: #fff;
  height: 0.8rem;
  width: 100vw;
  padding: 0 0.3rem;
  box-sizing: border-box;
  border-bottom: 0.5px solid #f7f7f7;
  border-bottom: 1px solid #ccc;
  position: relative;

  p:nth-child(1) {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #017ec2;
    line-height: 0.8rem;
    img {
      width: 15%;
      padding: 0 0.2rem;
      margin-top: -2px;
      vertical-align: middle;
    }
  }

  .close {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.3rem;
    color: #ccc;
    width: 1rem;
    text-align: center;
    line-height: 0.7rem;
    position: absolute;
    right: 0;
    img {
      width: 0.53rem;
      height: 0.53rem;
      vertical-align: middle;
    }
  }
  .leftClose {
    position: absolute;
    right: 6.5rem;
  }
}
.coupons_box {
  width: 100%;
  height: calc(100vh - 4rem);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f7f7f7;
  padding: 0 0.3rem 0.3rem;
  box-sizing: border-box;
}
</style>