<template>
  <div class="or_geren flexBox" @click="$emit('dizhixz')">
    <div class="addressBox">
      <div class="or_xx">
        <p></p>
        <p>{{addres.trueName}}</p>
        <p>+{{GLOBA.phone_tag}} {{addres.telephone}}</p>
      </div>
      <div class="or_dz flexBox">
        <p class="or_dz_icon"></p>
        <p>{{addres.area_parent_name}} {{addres.area_name}} {{addres.addr_child_name}}</p>
      </div>
    </div>
    <div class="or_buttom" :class="{'isRotate':GLOBA.isRotate}"></div>
  </div>
</template>

<script>
export default {
  props: ["addres"],
  data() {
    return {};
  },
};
</script>
<style lang='scss' scoped>
.or_geren {
  box-shadow: 2px 2px 10px #e2e2e2;
  height: 1.84rem;
  background: #fff;
  padding: 0 0.2rem;
  .or_buttom {
    background: url(~@/assets/img/other/xiangyou3.png) no-repeat;
    background-size: contain;
    background-position: right;
    width: 0.24rem;
    height: 0.24rem;
  }
  .or_xx {
    height: 0.8rem;
    line-height: 0.92rem;
    display: flex;
    justify-content: flex-start;
    font-size: 0.32rem;
    align-items: center;
    p:nth-child(1) {
      width: 0.26rem;
      height: 0.32rem;
      background: url(~@/assets/img/other/rt.png) no-repeat;
      background-size: 0.26rem 0.3rem;
    }

    p:nth-child(2) {
      font-size: 0.32rem;
      font-weight: bold;
      font-family: "Calibri-Bold";
      margin: 0 0.2rem;
    }

    p:nth-child(3) {
      font-size: 0.28rem;
      font-weight: 400;
      font-family: "Calibri";
      color: #999999;
    }
  }

  .or_dz {
    height: 0.92rem;
    font-size: 0.32rem;
    p:nth-child(1) {
      width: 0.25rem;
      height: 0.32rem;
      background: url(~@/assets/img/other/dw.png) no-repeat;
      position: relative;
    }
    p:nth-child(2) {
      font-size: 0.28rem;
      font-weight: 400;
      font-family: "Calibri";
      margin: 0 0.2rem;
      color: #222222;
    }
  }
}
</style>