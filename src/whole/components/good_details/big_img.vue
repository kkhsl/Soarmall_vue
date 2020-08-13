<template>
  <!-- 点击图片放大 -->
  <div class="swiper-container enlargement_box" @click="conceal">
    <div class="swiper-pagination pagination"></div>
    <swiper class="swiper-wrapper enlargement_img" :options="swiperOption_">
      <swiperSlide
        class="swiper-slide swiper_box"
        v-for="(child,index) in big_img.photos"
        :key="index"
      >
        <div class="swiper-zoom-container">
          <img v-lazy="child.img" />
        </div>
      </swiperSlide>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: { swiper, swiperSlide },
  props: ["big_img"],
  data() {
    return {
      numH: "", 
      swiperOption_: {
        zoom: true,
        initialSlide: this.big_img.image.i,
        initialSlid: 0,
        longSwipesRatio: 0.1,
        preventClicksPropagation: false,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        }
      }
    };
  },

  methods: {
    conceal() {
      this.$emit("conceal");
    }
  }
};
</script>
<style lang='scss' scoped>
// 图片放大
.enlargement_box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1000;

  .enlargement_img {
    width: 100%;
    height: 70%;
    margin-top: 17%;

    .swiper_box {
      width: 100%;
      height: 100%;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .pagination {
    position: absolute;
    top: 3%;
    left: 0;
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    color: #333;
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: Bold;
  }
}
</style>
