<template>
  <div class="full_page">
    <publicHead>
      <router-link to="/subpages/search/search" slot="headLeft">
        <img class="searchIcon" src="@/assets/img/other/sousuo.png" />
      </router-link>
      <h6 slot="headCenter">{{$t("common.Discovery")}}</h6>
    </publicHead>
    <div class="centerWrap">
      <div class="discovery_box">
        <div class="carousel">
          <swiper :options="swiperOption" ref="mySwiper" v-if="items.length">
            <swiperSlide class="banner_box" v-for="(slide, index) in items" :key="index">
              <img class="banner_img" :src="slide.article_acc" />
            </swiperSlide>
            <div class="swiper-pagination swiper-p" slot="pagination"></div>
          </swiper>
          <div class="slide_title line-clamp">{{text}}</div>
        </div>
      </div>
      <mescroll-vue
        ref="mescroll"
        class="centerScroll"
        :down="mescrollDown"
        :up="mescrollUp"
        @init="mescrollInit"
      >
        <div class="discovery_c_box" id="dataList">
          <!-- 内容列表 -->
          <div
            class="marg discovery_cont"
            v-for="(item,index) in items"
            :key="index"
            @click="discovery_art(index)"
          >
            <div class="img" :class="GLOBA.marg_">
              <img :imgurl="item.middle_img" :src="GLOBA.loading" />
            </div>
            <div class="cont_box">
              <div>
                <div  dir="ltr" class="name" :class="{'ltr':item.title.substring(0,1)=='^'}">{{item.title.substring(0,1)=='^'?item.title.substring(1):item.title}}</div>
                <div class="name_"></div>
                <div class="riqi">
                  <p class="log">
                    <img src alt />
                  </p>
                  <p class="ren"></p>
                  <p class="shij"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mescroll-vue>
    </div>
    <publicTabbar tabbarIndex="2"></publicTabbar>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import publicTabbar from "@/whole/components/publicBottom/tabbar";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { constants } from "crypto";
export default {
  name: "carrousel",
  components: {
    publicHead,
    publicTabbar,
    MescrollVue: () => import("@/plugins/scroll/mescroll"),
    swiper,
    swiperSlide
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        callback: this.downCallback
      },
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10 // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: "dataList", // 父布局的id;
          tip: "The search is empty",
          btntext: "GO →",
          btnClick() {
            // 点击按钮的回调,默认null
          }
        },
        lazyLoad: {}
      },
      items: [],
      text: ""
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    swiperOption() {
      let that = this;
      let option = {
        preventClicksPropagation: false, //拖动Swiper时阻止click事件
        autoplay: {
          disableOnInteraction: false, // 用户操作后是否禁止自动循环
          delay: 3000 // 自自动循环时间
        }, // 可选选项，自动滑动
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 0,
        longSwipesRatio: 0.1,
        centeredSlides: true,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        on: {
          click: function() {
            const realIndex = this.realIndex;
            that.discovery_art(realIndex);
          }
        },
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
          formatFractionCurrent: function(number) {
            that.render_B(number);
            let myNum = number;
            return myNum;
          }
        }
      };
      return option;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  methods: {
    render_B(index) {
      let i = index - 1;
      this.text = this.items[i].title;
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 下拉刷新
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.items = [];
          // 把请求到的数据添加到列表
          this.items = this.items.concat(arr);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
          });
        },
        () => {
          // 联网异常,隐藏上拉和下拉的加载进度
          mescroll.endErr();
        }
      );
    },
    async getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
      // 延时一秒
      var listData = [];
      let data = {
        currentPage: pageNum
      };
      let res = await this.$HTTP.article(data)
      if (res.code == 0) {
        res.data.articlelist.forEach(item => {
          item.middle_img = item.article_acc.replace(
            /.png/,
            ".png_middle.png"
          );
          listData.push(item);
        });
      }
      // 回调
      successCallback(listData);
    },
    discovery_art(index) {
      console.log(index);
      let id = this.items[index].id;
      this.$router.push({
        path: "/discovery/article",
        query: {
          id: id
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.centerScroll{
  height: calc(100vh - 4.24rem - 2rem);
}
.isApp .centerScroll{
  height: calc(100vh - 4.24rem - 2.4rem);
}
.mescroll::-webkit-scrollbar {
  display: none;
}
.banner_img {
  width: 100%;
  height: 100%;
}

.discovery_box {
  width: 100%;
  height: 4.24rem;
  background-color: #f7f7f7;
  .carousel {
    position: relative;
    top: 0.1rem;
    height: 100%;
    overflow: hidden;
  }
  .banner_img {
    width: 100%;
  }
}

.discovery_c_box {
  width: 100%;
  padding: 0.3rem 0.3rem 0;
  box-sizing: border-box;
  background-color: #f7f7f7;
  .discovery_cont {
    width: 6.6rem;
    // height: 2.7rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: flex-start;
    box-shadow: 0.04rem 0.04rem 0.2rem rgba(51, 51, 51, 0.15);
    .img {
      width: 2.6rem;
      margin-top: 0.3rem;

      img {
        width: 2.6rem;
        height: 1.45rem;
      }
    }

    .cont_box {
      width: 4.3rem;
      padding: 0.3rem;
      box-sizing: border-box;
      .name {
        font-weight: Bold;
        font-family: "Calibri-Bold";
        font-size: 0.3rem;
        color: #202020ff;
        line-height: 0.3rem;
      }

      .name_ {
        font-family: "Calibri-Light";
        font-size: 0.22rem;
        color: #666;
        line-height: 0.22rem;
      }

      .riqi {
        .log {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;

          .img {
            width: 100%;
            height: 100%;
          }
        }

        .ren {
          font-weight: 400;
          font-family: "Dutch801BT-Roman";
          font-size: 0.18rem;
          color: #202020ff;
        }

        .shij {
          font-family: "Calibri-Light";
          font-size: 0.18rem;
          color: #999;
        }
      }
    }
  }

  .discovery_cont:last-of-type {
    margin-bottom: 0.15rem;
  }
}

.swiper-container {
  position: absolute;
  width: 100%;
  height: 3.2rem;
  // height: 100%;
  overflow: visible;
}

.swiper-slide-prev,
.swiper-slide-next {
  background: #fff;
  transition: 300ms;
  transform: scale(0.8125, 0.8125) !important;
}

.swiper-slide-active {
  background: #fff;
  transform: scale(1, 1) !important;
}
.banner_box {
  width: 5.7rem;
  transition: all 0.4s;
}

.swiper-p {
  opacity: 0;
  bottom: 0;
  font-size: 0rem;
}

.slide_title {
  position: absolute;
  top: 3.4rem;
  padding: 0 0.9rem;
  box-sizing: border-box;
  width: 100vw;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  color: #333;
  line-height: 0.32rem;
  text-align: center;
}
</style>
