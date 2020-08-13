<template>
  <div class="activity">
    <div
      class="activity_box"
      v-if="store.isdiscount != 0"
    >
      <p class="activity_name">Discount
        <span
          class="bar"
          :class="{'rightBar':this.$route.query.lang=='sa'}"
        ></span>
      </p>

      <swiper
        class="swiper-wrapper activity_content content1"
        :options="swiperOption"
      >
        <swiperSlide
          class="swiper-slide style_d style1"
          :class="{'swiper-no-swiping':store.isdiscount==1}"
        >
          Full {{GLOBA.money_tag}} {{store.enough_price | percentageNum}} free shipping
        </swiperSlide>
        <swiperSlide
          class="swiper-slide style_d style1"
          :class="{'swiper-no-swiping':store.isdiscount==1}"
          v-for="(er,i) in store.er_json"
          :key="i"
        >
          Full {{GLOBA.money_tag}} {{er.price | percentageNum}} minus {{er.enough_price | percentageNum}}
        </swiperSlide>
        <swiperSlide
          class="swiper-slide style_d style2 swiper-no-swiping"
          v-if="store.isdiscount === 1 || 3"
        >Coming soon
        </swiperSlide>
      </swiper>

    </div>
    <div
      class="activity_box"
      v-if="store.iscoupon !=0"
    >
      <p class="activity_name">Coupon
        <span
          class="bar"
          :class="{'rightBar':this.$route.query.lang=='sa'}"
        ></span>
      </p>

      <swiper
        class="swiper-wrapper activity_content content2"
        :options="swiperOption"
      >
        <swiperSlide
          class="swiper-slide style_c style1"
          :class="{'swiper-no-swiping':store.iscoupon==1}"
          v-for="(coupon,index) in store.coupon"
          :key="index"
          dir="ltr"
        >
          <div class="discount">
            <p class="unit">{{GLOBA.money_tag}}</p>
            <p class="money">{{coupon.coupon_amount}}</p>
          </div>
          <div class="full">
            <p class="n_date">{{coupon.coupon_name}}</p>
            <p
              class="coupon_count"
              v-if="coupon.coupon_count ==0"
            >Unlimit</p>
            <p
              class="coupon_count"
              v-else
            ><span class="full">Full</span><span class="full1">{{coupon.coupon_count}}</span></p>
            <p class="n_date">{{coupon.coupon_begin_time}}~{{coupon.coupon_end_time}}</p>
          </div>
        </swiperSlide>
        <swiperSlide
          class="swiper-slide style_c style2 swiper-no-swiping"
          v-if="store.iscoupon===1 || 3"
        >Coming soon
        </swiperSlide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: { swiper, swiperSlide },
  props: ['store'],
  data () {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        noSwiping: true,
      },
    };
  },

  created () { },

  methods: {}
};
</script>
<style lang='scss' scoped>
.activity {
}
.activity_box {
  // margin-top: 0.2rem;
  .activity_name {
    margin: 0 0.3rem;
    width: calc(100vw - 0.6rem);
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #333;
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    position: relative;
  }
  .activity_name {
    .bar {
      background: #008edd;
      width: 0.08rem;
      height: 0.3rem;
      position: absolute;
      top: 0.25rem;
      left: 0;
    }
    .rightBar {
      right: 0;
    }
  }
  .activity_content {
    background-color: #dce9f3;
    padding-left: 0.3rem;
    box-sizing: border-box;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.22rem;
    color: #fff;
  }
  .content1 {
    height: 1.6rem;
    .style_d {
      margin-top: 0.35rem;
      width: 3.4rem;
      height: 0.9rem;
      margin-right: 0.4rem;
      line-height: 0.9rem;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .style1 {
      // text-indent:-0.2rem;
      background: url(../../../assets/img/store/discount.png) no-repeat;
      background-size: 100%;
    }
    .style2 {
      background: url(../../../assets/img/store/discount1.png) no-repeat;
      background-size: 100%;
    }
  }
  .content2 {
    height: 2rem;
    .style_c {
      margin-top: 0.4rem;
      margin-right: 0.4rem;
      width: 3.1rem;
      height: 1.2rem;
    }
    .style1 {
      display: flex;
      justify-content: space-between;
      background: url(../../../assets/img/store/coupon.png) no-repeat;
      background-size: 100%;
      .discount {
        width: 0.8rem;
        height: 100%;
        padding: 0.22rem 0.1rem;
        box-sizing: border-box;
        .unit {
          font-family: "Calibri";
          font-weight: 400;
          font-size: 0.2rem;
          line-height: 0.24rem;
        }
        .money {
          font-size: 0.4rem;
        }
      }
      .full {
        width: 3.1rem;
        height: 100%;
        padding: 0.1rem;
        box-sizing: border-box;
        overflow: hidden;
        .full {
          font-family: "Calibri";
          font-weight: 400;
          font-size: 0.24rem;
        }
        .full1 {
          font-size: 0.4rem;
        }
        .coupon_count {
          height: 0.5rem;
          line-height: 0.5rem;
        }
        .n_date {
          font-family: "Calibri";
          font-weight: 200;
          font-size: 0.2rem;
          line-height: 0.3rem;
        }
      }
    }
    .style2 {
      text-align: center;
      line-height: 1.2rem;
      background: url(../../../assets/img/store/coupon1.png) no-repeat;
      background-size: 100%;
    }
  }
}
</style>