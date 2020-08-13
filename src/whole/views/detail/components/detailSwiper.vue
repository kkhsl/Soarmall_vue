<template>
  <div class="detailSwiperWrap">
    <swiper ref="detailSwiper" :options="swiperOption" v-if="mainSwiperImg.length">
      <swiperSlide
        class="detailSwiperItem"
        v-for="(swiperItem,index) in mainSwiperImg"
        :key="index"
      >
        <img :src="swiperItem.photos" />
      </swiperSlide>
      <template v-slot:pagination>
        <div
          class="swiper-pagination swiperPagin"
          :style="$route.query.lang == 'sa'? 'left: 0' : 'right:0'"
        ></div>
      </template>
    </swiper>
  </div>
</template>
<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { ImagePreview } from "vant";
export default {
  components: { swiper, swiperSlide },
  props: ["mainSwiperImg"],
  data() {
    return {
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
          click: (e) => {
            let currentIndex = this.$refs.detailSwiper.swiper.realIndex;
            let images = [];
            this.mainSwiperImg.forEach((item) => {
              images.push(item.photos);
            });
            this.openImgView(images, currentIndex);
          },
        },
      },
      ImgViewInstance: null,
    };
  },
  // mounted() {
  //   window.addEventListener(
  //     "popstate",
  //     (e) => {
  //       if (this.ImgViewInstance) {
  //         this.ImgViewInstance.close();
  //       }
  //     },
  //     false
  //   );
  // },
  methods: {
    openImgView(arr, i) {
      window.history.pushState(null, null, "#");
      this.ImgViewInstance = ImagePreview({
        images: arr,
        startPosition: i,
        closeOnPopstate: true,
        onClose: () => {
          setTimeout(()=>{
            if (window.location.hash.length == 0 || !window.location.hash) {
              this.$router.go(-1);
            }
          },300)
        },
      });
    },
  },
  // beforeDestroy() {
  //   window.removeEventListener(
  //     "popstate",
  //     e => {
  //       if (this.ImgViewInstance) {
  //         this.ImgViewInstance.close();
  //       }
  //     },
  //     false
  //   );
  // }
};
</script>
<style lang='scss' scoped>
.detailSwiperWrap {
  background: url(~@/assets/img/loader.png) no-repeat center center;
  background-size: 100%;
  min-height: 6rem;
}
.detailSwiperItem {
  height: 7rem;
  img {
    width: 100%;
    min-height: 7rem;
    display: block;
  }
}
.swiperPagin {
  position: absolute;
  left: auto;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  width: 1rem;
  height: 0.48rem;
  line-height: 0.48rem;
  color: #fff;
}
</style>
