<template>
  <div class="highlight" v-if="goodsInfoGoods.features_one">
    <h6>
      <img src="@/assets/img/other/liandian.png" alt />
      {{$t("common.Highlight")}}
    </h6>
    <div class="highlightList">
      <div class="highlightItems" v-if="goodsInfoGoods.features_one">
        <p></p>
        <p
          :class="{'ltr':goodsInfoGoods.features_one.substr(0, 1) !== '^'}"
        >{{goodsInfoGoods.features_one.substr(0, 1) === '^'?goodsInfoGoods.features_one.substr(1):goodsInfoGoods.features_one}}</p>
      </div>
      <div class="highlightItems" v-if="goodsInfoGoods.features_two">
        <p></p>
        <p
          :class="{'ltr':goodsInfoGoods.features_one.substr(0, 1) !== '^'}"
        >{{goodsInfoGoods.features_two.substr(0, 1) === '^'?goodsInfoGoods.features_two.substr(1):goodsInfoGoods.features_two}}</p>
      </div>
      <div class="highlightItems" v-if="goodsInfoGoods.features_three">
        <p></p>
        <p
          :class="{'ltr':goodsInfoGoods.features_one.substr(0, 1) !== '^'}"
        >{{goodsInfoGoods.features_three.substr(0, 1) === '^'?goodsInfoGoods.features_three.substr(1):goodsInfoGoods.features_three}}</p>
      </div>
      <div class="highlightItems" v-if="goodsInfoGoods.features_four">
        <p></p>
        <p
          :class="{'ltr':goodsInfoGoods.features_one.substr(0, 1) !== '^'}"
        >{{goodsInfoGoods.features_four.substr(0, 1) === '^'?goodsInfoGoods.features_four.substr(1):goodsInfoGoods.features_four}}</p>
      </div>
      <div class="highlightItems" v-if="goodsInfoGoods.features_five">
        <p></p>
        <p
          :class="{'ltr':goodsInfoGoods.features_one.substr(0, 1) !== '^'}"
        >{{goodsInfoGoods.features_five.substr(0, 1) === '^'?goodsInfoGoods.features_five.substr(1):goodsInfoGoods.features_five}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["goodsInfoGoods"],
  data() {
    return {};
  },
};
</script>
<style lang='scss' scoped>
.highlight {
  margin-top: 0.3rem;
  font-size: 0.32rem;
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  padding: 0.2rem 0;
  h6 {
    font-weight: bold;
    font-size: 0.28rem;
    font-family: "Calibri-Bold";
    padding-left: 0.24rem;
    padding-right: 0.24rem;
    img {
      width: 0.3rem;
      vertical-align: middle;
    }
  }
}
.highlightItems {
  padding: 0.1rem 0.3rem;
  display: flex;
  font-size: 0.24rem;
  align-items: center;
  p:first-child {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    overflow: hidden;
    background: #131212;
  }
  p:nth-child(2) {
    padding: 0 0.1rem;
    width: 90%;
    color: black;
  }
}
</style>