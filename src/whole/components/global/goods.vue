<template>
  <div class="good_box" id="dataList">
    <div
      class="goods"
      v-for="(item,index) in items"
      :key="index"
      @click="toCardDetail(item.goodsid)"
    >
      <div class="good_imga">
        <img v-lazy="item.main_photo_url" />
        <p class="ltr" v-if="item.goods_price > item.goodscurrprice && item.point !==1">
          {{((item.goods_price-item.goodscurrprice)/item.goods_price*100) | percentageNum}}%
          <span>off</span>
        </p>
      </div>
      <div
        class="good_name"
        :class="{'ltr':item.goodsname.substr(0, 1) !== '^'}"
        v-html="item.goodsname.substr(0,1) === '^' ? item.goodsname.substr(1) : item.goodsname"
      ></div>
      <div class="good_price" :class="item.point == 1?'price_stock':'price_stock1'">
        <p class="Price_x ltr">
          <span>{{GLOBA.money_tag}} {{item.goodscurrprice | integerNum}}</span>
          <span>.{{item.goodscurrprice | decimalNum}}</span>
        </p>
        <del
          class="Price_y"
          v-if="item.goods_price > item.goodscurrprice"
        >{{GLOBA.money_tag}} {{item.goods_price |keeptwoNum}}</del>
        <p class="stock" v-if="item.point == 1">
          <span v-if="item.goods_inventory>0">Stock:{{item.goods_inventory}}</span>
          <span v-else>Sold out</span>
        </p>
      </div>
      <div class="good_eval" v-if="item.vo_well_evaluate > 0">
        <p class="rev">
          <span :style="{width:item.vo_well_evaluate*100 + '%' }"></span>
        </p>
      </div>
      <!-- 秒杀 -->
      <div class="seckill" v-if="item.Deals==1">
        <div class="point_num" v-if="item.percentage<0.6">
          <p
            class="shul"
            :class="item.goods_inventory<6?'shul1':'shul2'"
            :style="'left:calc(' + item.percentage*100 +'% - 0.28rem);'"
          >{{item.goods_inventory}}/{{item.store_deals_inventory}}</p>
        </div>
        <div class="point_num" v-else>
          <p
            class="shul3"
            :class="item.goods_inventory<6?'shul4':'shul5'"
            :style="'right:calc(' + (1 - item.percentage)*100 +'% - 0.28rem);'"
          >{{item.goods_inventory}}/{{item.store_deals_inventory}}</p>
        </div>

        <div class="line">
          <p
            class="xs"
            :class="item.goods_inventory<6?'xs1':'xs2'"
            :style="'width:'+ item.percentage*100 +'%;'"
          ></p>
        </div>
      </div>
      <!-- 活动商品兑换 -->
      <div class="progress" dir="ltr" v-if="item.point == 1">
        <div class="point_num" v-if="item.ratio<0.6">
          <p
            class="shul"
            :class="item.goodspointNum-item.user_pointNum<6?'shul1':'shul2'"
            :style="'left:calc(' + item.ratio*100 +'% - 0.28rem);'"
          >{{item.user_pointNum}}/{{item.goodspointNum}}</p>
        </div>
        <div class="point_num" v-else>
          <p
            class="shul3"
            :class="item.goodspointNum-item.user_pointNum<6?'shul4':'shul5'"
            :style="'right:calc(' + (1-item.ratio)*100 +'% - 0.28rem);'"
          >{{item.user_pointNum}}/{{item.goodspointNum}}</p>
        </div>

        <!-- <div class="line_stock"> -->
        <div class="line">
          <p
            class="xs"
            :class="item.goodspointNum-item.user_pointNum<6?'xs1':'xs2'"
            :style="'width:'+ item.ratio*100 +'%;'"
          ></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items"],
  data() {
    return {};
  },
  methods: {
    toCardDetail(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
      if (this.$route.name == "Details") {
        this.$parent.$emit("good_id", id);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.good_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 0.3rem;
  background-color: #f7f7f7;
  .goods {
    font-size: 0.32rem;
    width: 3.3rem;
    height: 5.16rem;
    margin-bottom: 0.3rem;
    background: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  }
}
.good_price {
  display: flex;
  padding: 0 0.05rem;
  box-sizing: border-box;
  height: 0.5rem;
  line-height: 0.4rem;
  overflow: hidden;
  letter-spacing: -0.005rem;
}
.Price_x {
  font-family: "Calibri-Bold";
  font-weight: bold;
  font-size: 0.28rem;
  color: #333;
  display: flex;
  justify-content: flex-start;
  span:nth-child(2) {
    font-size: 0.18rem;
    line-height: 0.2rem;
    vertical-align: middle;
  }
}
.Price_y {
  font-size: 0.22rem;
  color: #999999;
  font-family: "Calibri";
  margin: 0 0.1rem;
}
.stock {
  font-size: 0.22rem;
  font-family: "Calibri";
}
.good_eval {
  width: 100%;
  height: 0.48rem;
  padding: 0 0.1rem 0 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .rev {
    width: 2rem;
    height: 0.32rem;
    float: left;
    background: url(../../../assets/img/other/z1.png) no-repeat 0 0px;
    background-size: 1.64rem 0.22rem;
    span {
      height: 0.32rem;
      float: left;
      background: url(../../../assets/img/other/z2.png) no-repeat 0px 0px;
      background-size: 1.64rem 0.22rem;
    }
  }
}
.wishlist {
  width: 1rem;
  height: 0.32rem;
  display: flex;
  justify-content: flex-start;
  img {
    height: 0.32rem;
    width: 0.32rem;
  }
  span {
    font-family: "Calibri";
    font-size: 0.24rem;
    display: block;
    line-height: 0.32rem;
    margin-left: 0.1rem;
  }
}
.good_name {
  padding: 0 0.2rem;
  margin: 0.2rem 0;
  box-sizing: border-box;
  height: 0.62rem;
  width: 100%;
  line-height: 0.31rem;
  font-size: 0.26rem;
  font-weight: 400;
  font-family: "Calibri";
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #333;
  overflow: hidden;
}
.price_stock {
  justify-content: space-between;
}
.price_stock1 {
  justify-content: flex-start;
}
.good_imga {
  height: 3.2rem;
  width: 3.3rem;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  p {
    position: absolute;
    top: 0.48rem;
    left: -0.32rem;
    height: 0.32rem;
    width: 1.26rem;
    text-align: end;
    background: url(../../../assets/img/other/biaoqian.png) no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    color: #fff;
    font-size: 0.24rem;
    font-family: "Calibri";
    font-weight: 400;
    line-height: 0.32rem;
    transform: rotate(-90deg);
    -ms-transform: rotate(-90deg); /* IE 9 */
    -moz-transform: rotate(-90deg); /* Firefox */
    -webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
    -o-transform: rotate(-90deg);
    padding-right: 0.04rem;
    box-sizing: border-box;
  }
}
.progress {
  height: 0.6rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  .point_num {
    width: 100%;
    height: 0.4rem;
    font-size: 0.2rem;
    font-family: "Calibri";
    display: flex;
    justify-content: flex-start;
    position: relative;
    .shul {
      top: 0;
      height: 0.3rem;
      color: #fff;
      line-height: 0.3rem;
      border-radius: 0.15rem;
      text-align: center;
      padding: 0 0.1rem;
      position: relative;
    }
    .shul::after {
      content: "";
      position: absolute;
      bottom: -0.1rem;
      left: 0.2rem;
      width: 0;
      height: 0;
      border-right: 0.08rem solid transparent;
      border-left: 0.08rem solid transparent;
    }
    .shul1 {
      background-color: #ff4c40;
    }
    .shul2 {
      background-color: #017ec2;
    }
    .shul2::after {
      border-top: 0.1rem solid #017ec2;
    }
    .shul1::after {
      border-top: 0.1rem solid #ff4c40;
    }
    .shul3 {
      top: 0;
      height: 0.3rem;
      color: #fff;
      line-height: 0.3rem;
      border-radius: 0.15rem;
      text-align: center;
      padding: 0 0.1rem;
      position: absolute;
    }
    .shul3::after {
      content: "";
      position: absolute;
      bottom: -0.1rem;
      right: 0.2rem;
      width: 0;
      height: 0;
      border-right: 0.08rem solid transparent;
      border-left: 0.08rem solid transparent;
    }
    .shul4 {
      background-color: #ff4c40;
    }
    .shul5 {
      background-color: #017ec2;
    }
    .shul5::after {
      border-top: 0.1rem solid #017ec2;
    }
    .shul4::after {
      border-top: 0.1rem solid #ff4c40;
    }
  }
  .line {
    width: 100%;
    height: 0.06rem;
    background: #ebebeb;
    border-radius: 0.03rem;
    .xs {
      height: 100%;
      border-radius: 0.2rem;
    }
    .xs1 {
      background: #ff4c40;
    }
    .xs2 {
      background: #017ec2;
    }
  }
}

.seckill {
  width: 100%;
  height: 0.6rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  overflow: hidden;
  .line {
    width: 100%;
    height: 0.06rem;
    border-radius: 0.03rem;
    background: #ebebeb;
    .xs {
      height: 100%;
      border-radius: 0.2rem;
    }
    .xs1 {
      background: #ff4c40;
    }
    .xs2 {
      background: #017ec2;
    }
  }

  .point_num {
    width: 100%;
    height: 0.4rem;
    font-size: 0.2rem;
    font-family: "Calibri";
    display: flex;
    justify-content: flex-start;
    position: relative;
    .shul {
      top: 0;
      height: 0.3rem;
      color: #fff;
      line-height: 0.3rem;
      border-radius: 0.15rem;
      text-align: center;
      padding: 0 0.1rem;
      position: relative;
    }
    .shul::after {
      content: "";
      position: absolute;
      bottom: -0.1rem;
      left: 0.2rem;
      width: 0;
      height: 0;
      border-right: 0.08rem solid transparent;
      border-left: 0.08rem solid transparent;
    }
    .shul1 {
      background-color: #ff4c40;
    }
    .shul2 {
      background-color: #017ec2;
    }
    .shul2::after {
      border-top: 0.1rem solid #017ec2;
    }
    .shul1::after {
      border-top: 0.1rem solid #ff4c40;
    }
    .shul3 {
      top: 0;
      height: 0.3rem;
      color: #fff;
      line-height: 0.3rem;
      border-radius: 0.15rem;
      text-align: center;
      padding: 0 0.1rem;
      position: absolute;
    }
    .shul3::after {
      content: "";
      position: absolute;
      bottom: -0.1rem;
      right: 0.2rem;
      width: 0;
      height: 0;
      border-right: 0.08rem solid transparent;
      border-left: 0.08rem solid transparent;
    }
    .shul4 {
      background-color: #ff4c40;
    }
    .shul5 {
      background-color: #017ec2;
    }
    .shul5::after {
      border-top: 0.1rem solid #017ec2;
    }
    .shul4::after {
      border-top: 0.1rem solid #ff4c40;
    }
  }
}
</style>