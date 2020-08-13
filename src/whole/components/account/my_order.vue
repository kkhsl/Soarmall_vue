<template>
  <div class="order_box">
    <div class="order_hear" @click="orders(1)">
      <p>{{$t("common.My Order")}}</p>
      <div>
        <p class="all">{{$t("common.All")}}</p>
        <p class="img" :class="GLOBA.rotateY"></p>
      </div>
    </div>
    <div class="order_catalog_box">
      <!-- <div class="order_catalog" @click="orders(2)"> -->
      <!-- <div class="order_catalog">
            <p class="img">
              <img src="@/assets/img/accout/order-u.png" alt />
            </p>
            <p class="name">Unpaid</p>
      </div>-->
      <div class="order_catalog" @click="orders(3)">
        <p class="img">
          <span>{{amounts.pendings || 0}}</span>
          <!--  v-if="orderstatus.order_pending!==''&& orderstatus.order_pending!==0" orderstatus.order_pending -->
          <img src="@/assets/img/accout/order-p.png" alt />
        </p>
        <p class="name">{{$t("common.Pending")}}</p>
      </div>
      <div class="order_catalog" @click="orders(5)">
        <p class="img">
          <!--v-if="orderstatus.order_shipping!=='' && orderstatus.order_shipping!==0"  {{orderstatus.order_shipping}}-->
          <span>{{amounts.shippeds || 0}}</span>
          <img src="@/assets/img/accout/order-s.png" alt />
        </p>
        <p class="name">{{$t("common.Shipped")}}</p>
      </div>
      <div class="order_catalog" @click="orders(6)">
        <!-- v-if="orderstatus.order_finish!=='' && orderstatus.order_finish!==0" {{orderstatus.order_finish}}-->
        <p class="img">
          <span>{{amounts.reviews || 0}}</span>
          <img src="@/assets/img/accout/order-r.png" alt />
        </p>
        <p class="name">{{$t("common.Review")}}</p>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  props: ["amounts"],
  data() {
    return {
      orderstatus: {
        order_submit: "",
        order_shipping: "",
        order_finish: "",
        order_pending: "",
        order_cencel: ""
      }
    };
  },
  created() {
    // this.my_order();
  },
  mounted() {},
  methods: {
    orders(id) {
      this.$router.push({
        path: "/account/Account/orders",
        query: { toPage: id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.order_box {
  position: relative;
  z-index: 2;
  width: 6.4rem;
  height: 2.06rem;
  margin: -1.16rem auto 0;
  background-color: #fff;
  box-shadow: 0.02rem 0.02rem 0.3rem rgba(51, 51, 51, 0.15);
}
.order_hear {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ebebeb;
  height: 0.6rem;
  width: 100%;
  line-height: 0.6rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  p {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #2a5872;
  }
  div {
    display: flex;
    justify-content: space-between;
    .all {
      font-family: "Calibri-Light";
      font-weight: 300;
      font-size: 0.24rem;
      color: #333;
      margin: 0 0.2rem;
    }
    .img {
      background: url(../../../assets/img/other/xiangyou3.png) no-repeat;
      background-size: cover;
      height: 0.12rem;
      width: 0.06rem;
      margin-top: 0.24rem;
    }
  }
}
.order_catalog_box {
  padding-top: 0.3rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.24rem;
  font-family: "Calibri";
  font-weight: 400;
  color: #0c2d3f;
  text-align: center;
  height: 1.44rem;
}
.order_catalog {
  width: 2rem;
  .img {
    height: 0.48rem;
    position: relative;
    img {
      height: 100%;
    }
    span {
      display: inline-block;
      position: absolute;
      top: -0.14rem;
      right: 0.5rem;
      width: 0.28rem;
      height: 0.28rem;
      line-height: 0.28rem;
      border: 1px solid #2db2fb;
      border-radius: 50%;
      font-weight: 400;
      font-family: "Calibri";
      font-size: 0.2rem;
      color: #32b5fe;
      background-color: #fff;
    }
  }
  .name {
    line-height: 0.6rem;
  }
}
</style>
