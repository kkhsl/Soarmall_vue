<template>
  <div class="commodity_price">
    <div class="price_box">
      <div
        class="good_price"
        v-if="good_data.good_pri === 0"
      >
        <p class="xianj">
          <span>{{good_data.good_pr_co.goods_current_price | keeptwoNum}}</span>
          <span class="company">{{GLOBA.money_tag}}</span>
        </p>
        <p
          class="yuanj"
          v-if="good_data.good_pr_co.goods_current_price < good_data.good_pr_co.goods_price"
        >{{good_data.good_pr_co.goods_price | keeptwoNum}} {{GLOBA.money_tag}}</p>
        <div
          class="zhek"
          v-if="good_data.good_pr_co.goods_current_price < good_data.good_pr_co.goods_price"
        >
          <p class="img_"></p>
          <p class="zhe_lu">{{((good_data.good_pr_co.goods_price-good_data.good_pr_co.goods_current_price)/good_data.good_pr_co.goods_price*100) | percentageNum}}%off</p>
        </div>
      </div>
      <div
        class="good_price"
        v-if="good_data.good_pri === 1"
      >
        <p class="xianj">
          <span>{{good_data.goodsdeta.goods_current_price | keeptwoNum}}</span>
          <span class="company">{{GLOBA.money_tag}}</span>
        </p>
        <p
          class="yuanj"
          v-if="good_data.goodsdeta.goods_current_price < good_data.goodsdeta.goods_price"
        >{{good_data.goodsdeta.goods_price | keeptwoNum}}{{GLOBA.money_tag}}</p>

        <div
          class="zhek"
          v-if="good_data.goodsdeta.goods_current_price < good_data.goodsdeta.goods_price"
        >
          <p class="img_"></p>
          <p class="zhe_lu">{{((good_data.goodsdeta.goods_price-good_data.goodsdeta.goods_current_price)/good_data.goodsdeta.goods_price*100) | percentageNum}}%off</p>
        </div>
      </div>
      <!-- <div class="ertagmap">{{good_data.ertagmap}}</div> -->
    </div>

    <div
      class="good_name"
      v-if="good_data.goodsdeta.goodsname != undefined"
      :class="{'ltr':good_data.goodsdeta.goodsname.substr(0, 1) !== '^'}"
    >
      {{good_data.goodsdeta.goodsname.substr(0, 1) === '^' ? good_data.goodsdeta.goodsname.substr(1) : good_data.goodsdeta.goodsname}}
    </div>
    <div class="pingpai">
      <div class="name_img">
        <p class="img">
          <img v-lazy="good_data.goodsdeta.store_logo" />
        </p>
        <p class="p_name">{{good_data.storemap.store_name}}</p>

      </div>
      <p class="toStore" @click="to_storemap(good_data.storemap)"><span>Go to store</span></p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["good_data"],
  data () {
    return {};
  },
  methods: {
    to_storemap (storemap) {
      let to_data = {
        dianpu: storemap,
        id: 1
      };
      this.$router.push({
        path: "/subpages/cate_goods02",
        query: {
          to_data: to_data
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
// 商品信息
.commodity_price {
  margin-bottom: 0.2rem;
  padding: 0 0.2rem;
  .good_name {
    width: 100%;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #333;
  }
  .price_box {
    width: 100%;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    line-height: 0.6rem;
    .good_price {
      display: flex;
      justify-content: flex-start;
      .company {
        font-family: "Calibri";
        font-weight: 400;
        font-size: 0.3rem;
      }
    }
    .xianj {
      font-size: 0.4rem;
      color: #c24343;
    }
    .yuanj {
      font-family: "Calibri";
      font-weight: 400;
      font-size: 0.22rem;
      color: #999;
      text-decoration: line-through;
      margin: 0 0.2rem 0 0.1rem;
    }

    .zhek {
      margin-top: 0.1rem;
      display: flex;
      justify-content: flex-start;
      background-color: rgba(194, 67, 67, 0.3);
      height: 0.4rem;
      line-height: 0.4rem;
      border-radius: 0.2rem;
      padding: 0 0.2rem;
      .img_ {
        width: 0.26rem;
        height: 0.26rem;
        background: url(../../../assets/img/other/youhui.png) no-repeat;
        background-size: cover;
        margin: 0.07rem 0 0.07rem 0;
      }
      .zhe_lu {
        margin: 0 0.1rem;
        font-size: 0.24rem;
        color: #c24343;
      }
    }

    .ertagmap {
      font-family: "Calibri";
      font-weight: 400;
      margin-top: 0.1rem;
      word-wrap: break-word;
      font-size: 0.24rem;
      color: #017ec2;
    }
  }
  .pingpai {
    margin-top: 0.1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-family: "Calibri";
    font-weight: 400;
    color: #333;
    line-height: 0.64rem;
    height: 0.64rem;

    .toStore {
      height: 0.64rem;
      line-height: 0.64rem;
      color: #017ec2;
    }
    .name_img {
      display: flex;
      justify-content: flex-start;
    }
    .img {
      width: 0.64rem;
      height: 0.64rem;
      box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
      position: relative;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
    .p_name {
      margin: 0 0.1rem;
      font-size: 0.24rem;
    }
  }
}
</style>