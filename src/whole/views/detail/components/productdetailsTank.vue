<template>
  <div>
    <div
      class="Specifications_box"
      v-if="goodsInfoGoods.goods_property.length"
      @click="showDetailsTankFn"
    >
      <div class="Specifications">
        <img class="titleImg" src="@/assets/img/other/shuxin.png" alt />
        <p class="blodFont">{{$t("common.Details")}}</p>
      </div>
      <img
        class="rightIconRow"
        :class="{'isRotate': GLOBA.isRotate}"
        src="@/assets/img/other/xiangyou3.png"
      />
    </div>
    <vantPopup
      v-model="showDetailsTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      @click-overlay="hideDetailsTankFn"
    >
      <div class="cs_title">{{$t("common.Details")}}</div>
      <div class="cs_piece">
        <ul>
          <li class="detailsItem" v-if="goodsInfoGoods.goods_brand_name">
            <p class="detailsItemLeft">Brand</p>
            <p class="detailsItemRight">{{goodsInfoGoods.goods_brand_name}}</p>
          </li>
          <li
            class="detailsItem"
            v-for="parameter in goodsInfoGoods.goods_property"
            :key="parameter.id"
          >
            <p class="detailsItemLeft">{{parameter.name}}</p>
            <p class="detailsItemRight">{{parameter.val}}</p>
          </li>
        </ul>
      </div>
      <div class="cs_foot">
        <div class="cs_bottom" @click="wancheng()">{{$t("common.Done")}}</div>
      </div>
    </vantPopup>
  </div>
</template>

<script>
import { Popup } from "vant";
export default {
  props: ["goodsInfoGoods"],
  components: { vantPopup: Popup },
  data() {
    return {
      showDetailsTank: false,
    };
  },
  mounted() {
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.showDetailsTank) {
          this.showDetailsTank = false;
        }
      },
      false
    );
  },
  methods: {
    showDetailsTankFn() {
      this.showDetailsTank = true;
      window.history.pushState(null, null, "#");
    },
    hideDetailsTankFn() {
      if (window.location.hash.length == 0 || !window.location.hash) {
        this.$router.go(-1);
      }
      this.showDetailsTank = false;
    },
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      (e) => {
        if (this.showDetailsTank) {
          this.showDetailsTank = false;
        }
      },
      false
    );
  },
};
</script>
<style lang='scss' scoped>
.cs_title {
  font-size: 0.32rem;
  text-align: center;
  height: 1rem;
  line-height: 1rem;
  font-family: "Calibri-Bold";
  font-weight: bold;
}
.cs_piece {
  max-height: 8rem;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.detailsItem:last-child {
  border: none;
}
.detailsItem {
  width: 100%;
  font-size: 0.28rem;
  font-family: "Calibri";
  font-weight: 400;
  color: #333;
  border: 1px solid #ccc;
  border: none;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  justify-content: flex-start;
  padding: 0.3rem;
  box-sizing: border-box;
  .detailsItemLeft {
    width: 1.4rem;
    font-size: 0.28rem;
    margin-right: 0.6rem;
    display: flex;
    align-items: center;
  }
  .detailsItemRight {
    width: 4.6rem;
    display: flex;
    align-items: center;
    color: #ccc;
  }
}
.cs_foot {
  width: 90%;
  height: 1rem;
  padding: 0.1rem 0px;
  box-sizing: border-box;
  margin: auto;
}
.cs_bottom {
  text-align: center;
  height: 0.8rem;
  line-height: 0.8rem;
  width: 100%;
  background: linear-gradient(to right, #33b6ff, #017ec2);
  font-size: 0.32rem;
  font-family: "Calibri-Bold";
  font-weight: bold;
  color: #fff;
  border-radius: 0.6rem;
}
</style>