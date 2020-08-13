<template>
  <div class="infoWrap">
    <div class="productMsg">
      <div class="productPrice">
        <div class="activePrice">
          <span>{{goodsInfo.goods.goods_current_price | keeptwoNum}}</span>
          <span class="company">{{GLOBA.money_tag}}</span>
        </div>
        <div
          class="oldPrice"
          v-if="goodsInfo.goods.goods_current_price < goodsInfo.goods.goods_price"
        >{{goodsInfo.goods.goods_price | keeptwoNum}} {{GLOBA.money_tag}}</div>
        <div
          class="discount"
          v-if="goodsInfo.goods.goods_current_price < goodsInfo.goods.goods_price"
        >
          <div class="img_"></div>
          <div
            class="discountNum"
          >{{((goodsInfo.goods.goods_price-goodsInfo.goods.goods_current_price)/goodsInfo.goods.goods_price*100) | percentageNum}}%off</div>
        </div>
      </div>
      <div
        class="good_name"
        :class="{'ltr':goodsInfo.goods.goodsname.substr(0, 1) !== '^'}"
      >{{goodsInfo.goods.goodsname.substr(0, 1) === '^' ? goodsInfo.goods.goodsname.substr(1) : goodsInfo.goods.goodsname}}</div>
      <div class="storeMsg" @click="to_storemap(goodsInfo.storemap)">
        <div class="name_img">
          <p class="img">
            <img v-lazy="goodsInfo.goods.store_logo" />
          </p>
          <p class="p_name">{{goodsInfo.storemap.store_name}}</p>
        </div>
        <p class="toStore">{{$t('title.Go to store')}}</p>
      </div>
      <div class="storeDiscount" v-if="goodsInfo.storemap.store_enough_free==1">
        <vant-tag plain  color="#ff4c40">
          Full {{GLOBA.money_tag}} {{goodsInfo.storemap.store_enough_price}} free shipping
        </vant-tag>
      </div>
    </div>
    <div class="giftsWrap ltr" v-if="goodsInfo.goods.goods_point==1">
      <div class="giftStats">
        <div
          class="statsLine"
          :class="{'red':goodsInfo.goods.user_pointNum/goodsInfo.goods.goods_pointNum>1}"
        >
          <div
            class="activeLine"
            :style="{'width':((goodsInfo.goods.user_pointNum/goodsInfo.goods.goods_pointNum>=1?1:goodsInfo.goods.user_pointNum/goodsInfo.goods.goods_pointNum) * 100)+'%'}"
          >
            <div
              class="point_num"
            >{{goodsInfo.goods.user_pointNum}}/{{goodsInfo.goods.goods_pointNum}}</div>
          </div>
        </div>
      </div>
      <div class="getGiftsBtn" v-if="goodsInfo.goods.user_pointNum-goodsInfo.goods.goods_pointNum>=0" @click="$emit('getFreeBtn')">Get free</div>
      <div class="getGiftsBtn" v-else>Get free remain: {{goodsInfo.goods.user_pointNum-goodsInfo.goods.goods_pointNum}}</div>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
export default {
  props: ["goodsInfo"],
  components:{
    vantTag:Tag
  },
  data() {
    return {};
  },
  methods: {
    to_storemap(storemap) {
      let to_data = {
        dianpu: storemap,
        id: 1,
      };
      this.$router.push({
        path: "/subpages/cate_goods02",
        query: {
          to_data: to_data,
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
// 商品信息
.productMsg {
  padding: 0.2rem;
}
.good_name {
  font-weight: Bold;
  font-size: 0.3rem;
  color: #333;
  padding-bottom: 0.2rem;
}
.productPrice {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  display: flex;
  align-items: center;
  .company {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.3rem;
  }
}
.activePrice {
  font-size: 0.4rem;
  color: #c24343;
}
.oldPrice {
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.22rem;
  color: #999;
  text-decoration: line-through;
  margin: 0 0.2rem 0 0.1rem;
}

.discount {
  display: flex;
  background-color: rgba(194, 67, 67, 0.3);
  height: 0.4rem;
  line-height: 0.4rem;
  border-radius: 0.2rem;
  padding: 0 0.2rem;
  .img_ {
    width: 0.26rem;
    height: 0.26rem;
    background: url(~@/assets/img/other/youhui.png) no-repeat;
    background-size: cover;
    margin: 0.07rem 0 0.07rem 0;
  }
  .discountNum {
    padding: 0 0.1rem;
    font-size: 0.24rem;
    color: #c24343;
  }
}
.storeMsg {
  display: flex;
  justify-content: space-between;
  font-family: "Calibri";
  font-weight: 400;
  color: #333;    
  align-items: flex-end;
  .toStore {
    color: #017ec2;
  }
  .name_img {
    display: flex;
    align-items: flex-end;
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
    font-size: 0.3rem;
    font-weight: bold;
  }
  
}
.storeDiscount{
    padding-top: 0.2rem;
    font-size: 0.22rem;
    color: #ff4c40;
  }
.giftsWrap {
  height: 1.5rem;
  background: url(~@/assets/img/FreeGit/di.png);
  margin-bottom: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
}
.giftStats {
  padding-top: 0.5rem;
  margin-left: 0.2rem;
  width: 3.6rem;
}
.statsLine {
  background-color: #dedede;
  height: 0.06rem;
  border-radius: 0.1rem;
  width: 100%;
}
.red .activeLine,
.red .point_num {
  background: #ff4c40;
}
.red .activeLine .point_num::before {
  border-top: 0.1rem solid #ff4c40;
}
.activeLine {
  background: #017ec2;
  height: 0.06rem;
  width: 0%;
  position: relative;
  max-width: 100%;
  .point_num::before {
    content: "";
    border-top: 0.12rem solid #017ec2;
    position: absolute;
    bottom: -0.1rem;
    left: 0.35rem;
    width: 0;
    height: 0;
    border-right: 0.1rem solid transparent;
    border-left: 0.1rem solid transparent;
  }
}
.point_num {
  width: 1.2rem;
  text-align: center;
  right: -0.75rem;
  position: absolute;
  bottom: 0.16rem;
  background-color: #017ec2;
  height: 0.35rem;
  color: #fff;
  line-height: 0.35rem;
  border-radius: 0.15rem;
  padding: 0.05rem 0;
}
.getGiftsBtn {
  min-width: 1.6rem;
  height: 0.6rem;
  padding: 0 0.2rem;
  border-radius: 0.2rem;
  font-size: 0.24rem;
  line-height: 0.6rem;
  font-family: "Calibri";
  font-weight: 400;
  color: #fff;
  overflow: hidden;
  text-align: center;
  background: #017ec2;
}
</style>