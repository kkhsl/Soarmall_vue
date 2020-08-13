<template>
  <div class="goods_box delivers_box">
    <div class="log_">
      <img :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/other/shipto.png" alt />
    </div>
    <div class="postage_box">
      <div class="ship_box" @click="xz_city()">
        <div class="ship_">{{$t("common.Ship to")}}</div>
        <div class="xuanz_">
          <p>{{careaName.areaName}}</p>
          <img
            class="rightIconRow"
            :class="{'isRotate':GLOBA.isRotate}"
            src="../../../assets/img/other/xiangyou3.png"
            alt
          />
        </div>
      </div>
      <div class="jia_rq">
        <div
          class="shipRow"
          v-if="trans!==0"
        >{{$t("common.Freight")}}: {{GLOBA.money_tag}} {{trans | keeptwoNum}}</div>
        <div class="shipRow" v-else>
          <span>Free shipping</span>
          <img src="../../../assets/img/biaoshi.png" />
        </div>
        <div class="shipRow">Return within 14 days of receipt</div>
        <div class="shipRow">
          <span>Cash on delivery</span>
          <img src="../../../assets/img/biaoshi.png" />
        </div>
        <div class="shipRow">E.T.A:8-15 days</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["careaName", "trans", "arrival_time"],
  data() {
    return {};
  },
  methods: {
    xz_city() {
      this.$emit("xz_city");
    },
  },
};
</script>
<style lang='scss' scoped>
.goods_box {
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .log_ {
    width: 0.36rem;
    height: 0.36rem;
    padding: 0 0.1rem;
    position: relative;
    img {
      position: absolute;
      height: 100%;
    }
  }
  .xuanz_ {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.28rem;
    color: #333;
  }
}
//运费
.delivers_box {
  padding: 0 0.1rem;
  .ship_box {
    border-bottom: 1px solid #ebebeb;
    font-weight: Bold;
    font-size: 0.28rem;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 0;
  }

  .jia_rq {
    padding: 0.12rem 0;
    font-size: 0.25rem;
    color: #999;
    display: flex;
    position: relative;
    flex-wrap: wrap;
  }
}
.shipRow {
  display: flex;
  align-items: center;
  width: 42%;
  span {
    width: 75%;
  }
  img {
    width: 0.18rem;
    height: 0.18rem;
  }
}
.jia_rq div:nth-child(2n) {
  width: 58%;
}
</style>