<template>
  <div class="shop_xx">
    <div class="shop_img">
      <img
        v-lazy="goodsMap.goods_photo"
        alt
      />
    </div>
    <div class="shop_text">
      <!-- <div>{{goodsMap.goods_name}}</div> -->
      <div :class="{'ltr':goodsMap.goods_name.substr(0, 1) !== '^'}"> {{goodsMap.goods_name.substr(0, 1) === '^' ?goodsMap.goods_name.substr(1) : goodsMap.goods_name}}</div>
      <div>
        <p :class="{'ltr':this.$route.query.lang=='sa'}">{{goodsMap.specs}}</p>
        <Xnumber
          v-model="goodsMap.goods_count"
          :min="1"
          :max="goodsMap.goods_inventory"
          :disabled="goodsMap.goods_point == 1?true:false"
          @change="$emit('CountAdjust',goodsMap) "
        ></Xnumber>
      </div>
      <div>
        <p dir="ltr">
          <span>{{GLOBA.money_tag}}{{goodsMap.goods_current_price | integerNum}}</span>
          <span>.{{goodsMap.goods_current_price | decimalNum}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Xnumber: () => import("@/whole/components/global/x_number"),
  },
  props: ["goodsMap"],
  data () {
    return {};
  },

  created () {
    console.log(this.goodsMap, "查找")
  },

  methods: {}
};
</script>
<style lang='scss' scoped>
.shop_xx {
  height: 1.76rem;
  margin-top: 0.3rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;

  box-sizing: border-box;

  .shop_img {
    width: 1.76rem;
    height: 1.7rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .shop_text {
    display: flex;
    flex-direction: column;
    padding: 0rem 0.2rem;

    div:nth-child(1) {
      margin-right: 0.5rem;
      width: 4.6rem;
      height: 0.55rem;
      line-height: 0.28rem;
      font-size: 0.26rem;
      font-family: "Calibri";
      font-weight: 400;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    div:nth-child(2) {
      font-size: 0.32rem;
      display: flex;
      justify-content: space-between;
      margin-top: 0.06rem;
      height: 0.6rem;
      line-height: 0.6rem;

      p:nth-child(1) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.24rem;
        // font-family: "Calibri-Bold";
        // font-weight: bold;
        font-weight: 400;
        font-family: "Calibri";
        color: #999999;
      }

      p:nth-child(2) {
        font-size: 0.3rem;
        font-family: "Calibri";
        font-weight: 400;
        color: #999999;
      }
    }

    div:nth-child(3) {
      font-size: 0.24rem;
      display: flex;
      justify-content: space-between;
      margin-top: 0.1rem;

      p:nth-child(1) {
        font-family: "Calibri-Bold";
        font-weight: Bold;
        font-size: 0.26rem;
        display: flex;
        justify-content: flex-start;

        span:nth-child(2) {
          font-size: 0.18rem;
          line-height: 0.2rem;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>