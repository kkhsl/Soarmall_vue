<template>
  <swiper class="swiper-wrapper swiperWrap" :options="swiperOption">
      <swiperSlide v-for="(swipeItem, index) of swipeItems" :key="index">
        <slot :swipeItem="swipeItem" name="swipeItem"></slot>
      </swiperSlide>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  name:'homeSwipe',
  props:['swipeItems'],
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 12,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true //修改swiper的父元素时，自动初始化swiper
      }
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.swiperWrap {
  padding: 0 0.3rem;
  width: auto;
  overflow: visible;
}
.swiper-slide{
  width: auto;
}
</style>