<template>
  <div class="zhutu">
    <swiper
      class="swiper-wrapper commodity_img"
      :options="swiperOption"
      v-if="photos1.length>0"
    >
      <swiperSlide
        class="swiper-slide swiper_con_box"
        v-for="(child,index) in photos1"
        :key="index"
      >
        <img :src="child.img" @load="load" />
        <!--  @click="enlargement(child,index)" -->
      </swiperSlide>
      <template v-slot:pagination>
        <div class="lzyd swiper-pagination tietl"></div>
      </template>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
let that = null;
export default {
  components: { swiper, swiperSlide },
  props: ["photos1"],
  data() {
    return {
      numH: "",
      swiperOption: {
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 20,
        longSwipesRatio: 0.1,
        initialSlide: 0,
        preventClicks: false,
        preventClicksPropagation: true,
        freeModeSticky: true,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        on: {
          click(e) {
            that.enlargement(e.target.currentSrc, this.realIndex);
          },
        },
      },
    };
  },
  created() {
    // this.numH = document.documentElement.clientWidth || window.innerWidth;
    that = this;
  },

  methods: {
    load() {
      this.$emit("load");
    },
    enlargement(child, i) {
      let image = {
        big: 0,
        child: child,
        i: i,
      };
      this.$emit("big_image", image);
    },
  },
};
</script>
<style lang='scss' scoped>
.zhutu {
  width: 100%;
  background: url(../../../assets/img/loader.png) no-repeat center center;
  background-size: 7.5rem;
}
.commodity_img {
  background-color: #fff;
  width: 100%;

  .swiper_con_box {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
    }
  }

  .tietl {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
    width: 1rem;
    height: 0.48rem;
    line-height: 0.48rem;
    color: #fff;
    font-family: "Calibri";
    font-size: 0.24rem;
  }
}
</style>
