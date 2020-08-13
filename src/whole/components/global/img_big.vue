<template>
    <div class="zhutu" @click="$emit('enlargement')">
      <swiper
        class="swiper-wrapper commodity_img"
        :options="swiperOption"
        v-if="photos.photo.length>0"
      >
        <swiperSlide
          class="swiper-slide swiper_con_box"
          v-for="(child,index) in photos.photo"
          :key="index"
        >
        <!-- @click="enlargement(child,index)" @load="load" -->
        <div class="swiper-zoom-container" >
           <img :src="child.photo" @load="load" />
        </div>
        </swiperSlide>
        <template v-slot:pagination>
          <div class="swiper-pagination tietl"></div>
        </template>
      </swiper>
      <Load v-if="if_load"></Load>
    </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Load from "@/whole/components/global/load";
export default {
  components: { swiper, swiperSlide,Load },
  props: ["photos"],
  data() {
    return {
      swiperOption: {
        zoom: true,
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 20,
        longSwipesRatio: 0.1,
        initialSlide: this.photos.i,
        preventClicks: false,
        preventClicksPropagation: true,
        freeModeSticky: true,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        }
      },
      if_load:true
    };
  },
  created() {
  },

  methods: {
      load(){
          this.if_load=false
      }
  }
};
</script>
<style lang='scss' scoped>
.zhutu {
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left: 0;
  z-index: 100;
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
    left: calc(50% - 0.5rem);
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
