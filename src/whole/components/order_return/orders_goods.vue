<template>
  <div class="goods_" @click="commodity(goods.goods_id)">
    <div class="goods_img">
      <img :src="goods.goods_mainphoto_path" />
    </div>
    <div class="goods_cont">
      <div
        class="line-clamp goods_n"
        :class="{'ltr':goods.goods_name.substr(0, 1) !== '^'}"
      >{{goods.goods_name.substr(0, 1) === '^'?goods.goods_name.substr(1):goods.goods_name}}</div>
      <div class="goods_s">
        <p class="size_">{{goods.good_specs?goods.good_specs:goods.goods_gsp_val}} <span v-if="goods.goods_color"> color：{{goods.goods_color}}</span></p>
        <p class="item_">x{{goods.goods_count}}</p>
      </div>
      <div class="goods_p">
        <p class="pric_r ltr">
          <span>{{GLOBA.money_tag}} {{(goods.goods_current_price || goods.goods_price) | integerNum}}</span>
          <span class="xiaoshu">.{{(goods.goods_current_price || goods.goods_price) | decimalNum}}</span>
        </p>
        <p
          class="review"
          @click.stop="evalua(order_id,goods.goods_id)"
          v-if="goods.evaluate==0"
        >{{$t("common.Review")}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "goods",
    "shipprice",
    "total_price",
    "delivery_visibility",
    "order_id",
  ],
  data() {
    return {};
  },
  methods: {
    evalua(order_id, good_id) {
      this.$router.push({
        path: "/subpages/Account/order_evaluate/evaluate_page",
        query: {
          orderId: order_id,
          goodId: good_id,
        },
      });
    },
    commodity(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    },
  },
};
</script>
<style lang='scss' scoped>
.goods_:last-child {
  border: none;
  margin-bottom: 0;
}
.goods_ {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.2rem;
  padding-bottom: 0.2rem;
  width: 100%;
  // border-bottom: 1px solid #ebebeb;
  .goods_img {
    width: 1.76rem;
    height: 1.7rem;
    margin-right: 0.3rem;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  .goods_cont {
    width: calc(100% - 2.06rem);
    .goods_n {
      font-family: "Calibri";
      font-weight: 400;
      font-size: 0.26rem;
      color: #333;
      height: 0.7rem;
      line-height: 0.35rem;
    }
    .goods_s {
      display: flex;
      justify-content: space-between;
      height: 0.4rem;
      line-height: 0.5rem;
      .size_ {
        font-family: "Calibri-Bold";
        font-weight: Bold;
        font-size: 0.24rem;
        /* color: #b3b3b3; */
        overflow: hidden;
        color: gray;
      }
      .item_ {
        font-family: "Calibri";
        font-weight: 400;
        font-size: 0.23rem;
        color: black;
      }
    }
    .goods_p {
      display: flex;
      justify-content: space-between;
      height: 0.6rem;
      line-height: 0.9rem;
      font-size: 0.26rem;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      color: #333;
      .review {
        color: #017ec2;
        font-size: 0.24rem;
      }
      .pric_r {
        height: 100%;
        .xiaoshu {
          font-size: 0.18rem;
          display: inline-block;
          line-height: 0.4rem;
          height: 100%;
          vertical-align: middle;
        }
      }
      .delivery {
        font-family: "Calibri";
        font-weight: 400;
        color: #999;
      }
    }
  }
}
</style>
