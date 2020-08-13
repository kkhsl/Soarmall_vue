<template>
  <div class="Specifications_box" @click="cp_cangshu()">
      <img src="@/assets/img/other/shuxin.png" alt />
    <div class="Specifications">
      <p class="size_details">{{$t("common.Details")}}</p>
      <img
        src="@/assets/img/other/xiangyou3.png"
        class="rightIconRow"
        alt
        :class="{'isRotate':GLOBA.isRotate}"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      if_a: this.$route.query.lang
    };
  },

  created() {},

  methods: {
    cp_cangshu() {
      this.$emit("cp_cangshu");
    }
  }
};
</script>
<style lang='scss' scoped>
.goods_box {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  display: flex;
  justify-content: space-between;
  .log_ {
    width: 0.36rem;
    height: 0.36rem;
    position: relative;

    img {
      position: absolute;
      height: 100%;
    }
  }
}
.Specifications_box {
  height: 0.92rem;
  margin-top: 0.3rem;
  .Specifications {
    height: 100%;
    width: 7rem;
    display: flex;
    justify-content: space-between;
    line-height: 0.92rem;
    // padding-right: 0.3rem;
    box-sizing: border-box;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.28rem;
    .size_details {
      width: 4.4rem;
    }
  }
}
.isRotate {
  margin-left: 0.4rem;
}
</style>