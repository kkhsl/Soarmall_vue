<template>
  <div class="swiper_box" v-if="bannerList.length">
    <swiper class="home_swiper" ref="mySwiper" :options="swipeOptions">
      <swiperSlide class="swiper_img" v-for="(imga,index) in bannerList" :key="index">
        <div class="imga_box">
          <imgCache :src="imga.img"></imgCache>
        </div>
      </swiperSlide>
      <template v-slot:pagination>
        <div :class="lang=='sa'?'lun1':'lun'" class="swiper-pagination pagination_"></div>
      </template>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import imgCache from '@/whole/components/imgCache'
export default {
  components: {
    swiper,
    swiperSlide,
    imgCache
  },
  data() {
    return {
      swipeOptions: {
        preventClicksPropagation: false, //拖动Swiper时阻止click事件
        autoplay: {
          disableOnInteraction: false, // 用户操作后是否禁止自动循环
          delay: 3000 // 自自动循环时间
        }, // 可选选项，自动滑动
        // loop: true,
        spaceBetween: 0,
        longSwipesRatio: 0.1,
        centeredSlides: true,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        pagination: {
          el: ".swiper-pagination",
          type: "bullets"
        },
        on: {}
      },
      bannerList: [],
      lang: ""
    };
  },
  mounted() {
    this.lang = this.$route.query.lang;
    let that = this;
    this.swipeOptions.on = {
      click() {
        that.to_page(this.realIndex);
      }
    };
    this.getHomeBanner();
  },
  methods: {
    async getHomeBanner() {
      try {
        let historyBanner = JSON.parse(localStorage.getItem('bannerlist') || '[]')
        this.bannerList = historyBanner
      } catch (error) {
      }
      let res = await this.$PHP.banner1();
      if (res.code == 0) {
        let bannerArr = [];
        res.data.forEach(item => {
          if (this.lang == "sa") {
            bannerArr.push({
              img: item.arabic_img || item.img,
              title: item.arabic_title || item.title,
              link:item.arabic_link
            });
          } else {
            bannerArr.push({
              img: item.img,
              title: item.title,
              link:item.link
            });
          }
        });
        this.bannerList = bannerArr;
        try {
          localStorage.setItem("bannerlist", JSON.stringify(bannerArr));
        } catch (error) {}
      }
    },
    to_page(index) {
      let type = Number(this.bannerList[index].link.type || 0)
      let value = this.bannerList[index].link.value
      //0：搜索关键字，1：品类id，2：店铺id，3：商品id,4：价格区间
      switch (type) {
        case 0:
          this.$router.push({
            path: "/subpages/search/search_result",
            query: {
              keyword: value
            }
          });
          break;
        case 1:
          this.$router.push({
            path: "/subpages/cate_goods",
            query: {
              id: value
            }
          });
          break;
        case 2:
          this.$router.push({
            path: "/subpages/cate_goods02",
            query: {
              to_data: {
                dianpu: {
                  store_id:value,
                  store_name: ''
                },
                id: 1
              }
            }
          });
          break;
        case 3:
          this.$router.push({
            path: "/home/details",
            query: {
              id: value
            }
          });
          break;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.swiper_box {
  height: 4.2rem;
}
.home_swiper {
  height: 100%;
  width: 100%;
  font-size: 0.3rem;

  .swiper_img {
    width: 100%;
    height: 100%;
  }
}
.imga_box {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  color: #fff;
  position: relative;
  width: 100%;
  height: 100%;

  .title {
    position: absolute;
    width: 100%;
    height: 0.8rem;
    line-height: 0.6rem;
    background-color: rgba(0, 0, 0, 0.3);
    bottom: 0rem;
    left: 0rem;
    text-indent: 0.3rem;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.pagination_ {
  position: absolute;
  padding: 0 0.3rem;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0.36rem;
  text-align: left !important;
  /* margin-left: 0.3rem; */
}
.swiper-pagination-bullet{
  margin: 0 0.3rem;
}
</style>
