<template>
  <div class="full_page">
    <publicHead ref="publicHead">
      <h6 slot="headCenter">{{$t("title.Reviews")}}</h6>
    </publicHead>
    <!-- 点击图片放大 -->
    <div class="swiper-container enlargement_box" v-if="isenla" @click="conceal_">
      <div class="swiper-pagination pagination"></div>
      <swiper class="swiper-wrapper enlargement_img" :options="swiperOption_">
        <swiperSlide class="swiper-slide swiper_box" v-for="(child,index) in childs" :key="index">
          <div class="swiper-zoom-container">
            <img v-lazy="child.Evaluate_photos" />
          </div>
        </swiperSlide>
      </swiper>
    </div>
    <!-- 内容 -->
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <ul>
        <li class="rev_center" v-for="(item,index) in evaluate" :key="index">
          <div class="tx">
            <img v-lazy="item.user_photo" />
          </div>
          <div class="rev_center1">
            <div class="rev_name">
              <div class="rev_name_rate">
                <p class="name">{{item.eva_userName}}</p>
                <p class="marg001 rate">
                  <span :style="{width:item.eva_buyer_val/5*100 + '%' }"></span>
                </p>
              </div>
              <p class="time">{{item.eva_addTime}}</p>
            </div>
            <div>{{item.eva_info}}</div>
            <div v-for="(photo, photoIndex) in item.eva_photo" :key="photoIndex">
              <p>
                <img
                  :imgurl="photo.Evaluate_photos"
                  :src="GLOBA.loading"
                  @click="enlargement(item.eva_photo,index)"
                />
              </p>
            </div>
            <!-- <div class="cl4">Filter: blue ; xxs</div> -->
          </div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import publicHead from "@/whole/components/header/publicHead";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: {
    publicHead,
    swiper,
    swiperSlide,
    MescrollVue,
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        auto: false,
        callback: this.downCallback,
      },
      mescrollUp: {
        auto: false,
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10, // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: "dataList", // 父布局的id;
          tip: "The search is empty",
          btntext: "GO →",
          btnClick() {
            // 点击按钮的回调,默认null
          },
        },
        lazyLoad: {},
      },
      isenla: false, // 点击图片放大
      evaluate: [],
      childs: [],
      swiperOption: {
        preventClicksPropagation: false,
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 20,
        zoom: true,
        initialSlide: 0,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      },
      swiperOption_: {
        zoom: true,
        initialSlid: 0,
        preventClicksPropagation: false,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      },
    };
  },
  created() {},
  mounted() {
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.isenla) {
          this.isenla = !this.isenla;
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      (e) => {
        if (this.isenla) {
          this.isenla = !this.isenla;
        }
      },
      false
    );
  },
  activated() {
    this.evaluate = [];
    this.mescroll.resetUpScroll();
  },
  methods: {
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
        (arr) => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.evaluate = [];
          // 把请求到的数据添加到列表
          this.evaluate = this.evaluate.concat(arr);
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
    async getListDataFromNet(
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      // 延时一秒
      var listData = [];
      const data = {
        currentPage: pageNum,
        goods_id: this.$route.query.id,
      };
      let res = await this.$HTTP.goods_evaluation(data);
      if (res.code == 0) {
        listData = res.data.evaluate;
        // listData.push(item);
      }
      successCallback(listData);
    },
    // 点击放大
    enlargement(child, i) {
      this.swiperOption_.initialSlide = i;
      this.isenla = true;
      this.childs = child;
      window.history.pushState(null, null, "#");
    },
    conceal_() {
      this.isenla = false;
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.centerWrapNoFoot {
  box-sizing: border-box;
}
.mescroll::-webkit-scrollbar {
  display: none;
}
.mescroll {
  padding-top: 0.3rem;
  background-color: #f7f7f7;
}
.rev_title {
  box-shadow: 2px 21px 33px #e2e2e2;
  width: 100%;
  height: 2rem;
  margin: 0.3rem 0;
  padding: 0 0.2rem;
  box-sizing: border-box;

  .rev_title1 {
    font-size: 0.32rem;
    height: 1rem;
    width: 100%;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    justify-content: space-between;

    div:nth-child(1) {
      font-size: 0.28rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
      line-height: 1rem;
    }

    div:nth-child(2) {
      display: flex;
      justify-content: flex-start;

      p:nth-child(1) {
        margin: auto;
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

      p:nth-child(2) {
        font-size: 0.22rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        line-height: 0.86rem;
      }
    }
  }

  .rev_title2 {
    display: flex;
    justify-content: flex-start;

    .rev_so {
      margin-top: 0.2rem;
      height: 0.5rem;
      border: 1px solid;
      border-radius: 0.24rem;
      padding: 0 0.2rem;
      box-sizing: border-box;
      margin-right: 0.2rem;
      font-size: 0.28rem;
      text-align: center;
      line-height: 0.5rem;
      color: #999999;
      font-family: "Calibri";
      font-weight: 400;
    }
  }
}
.rev_center {
  position: relative;
  font-size: 0.32rem;
  .tx {
    position: absolute;
    left: 0.4rem;
    top: 0.2rem;
    width: 0.64rem;
    height: 0.64rem;
    border-radius: 50%;
    background: #ccc;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .rev_center1 {
    box-sizing: border-box;
    width: 6.58rem;
    background: #fff;
    margin: 0 0.3rem 0.3rem 0.62rem;
    padding: 0.3rem 0.3rem 0.3rem 0.62rem;

    .rev_name {
      display: flex;
      justify-content: space-between;

      .rev_name_rate {
        display: flex;
        justify-content: flex-start;

        .name {
          font-size: 0.32rem;
          font-family: "Calibri-Bold";
          font-weight: bold;
        }

        .rate {
          margin-left: 0.1rem;
          margin-top: 0.14rem;
          width: 1.5rem;
          height: 0.32rem;
          background: url(../../../assets/img/other/z1.png) no-repeat 0 0px;
          background-size: 1.5rem 0.2rem;

          span {
            height: 0.32rem;
            float: left;
            background: url(../../../assets/img/other/z2.png) no-repeat 0px 0px;
            background-size: 1.5rem 0.2rem;
          }
        }
      }

      .time {
        font-size: 0.24rem;
        font-family: "Calibri";
        font-weight: 400;
        color: #999999;
        line-height: 0.42rem;
      }
    }

    div:nth-child(2) {
      margin: 0.2rem 0;
      height: 0.56rem;
      line-height: 0.28rem;
      font-size: 0.28rem;
      font-family: "Calibri";
      font-weight: 400;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    div:nth-child(3) {
      margin-top: 0.4rem;
      display: flex;
      justify-content: flex-start;

      p {
        width: 1.78rem;
        height: 1.78rem;
        background: #ccc;
        margin-left: 0.16rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .cl4 {
      height: 0.2rem;
      line-height: 0.2rem;
      font-size: 0.24rem;
      font-family: "Calibri";
      font-weight: 400;
      color: #999999;
      margin: 0.4rem 0.2rem 0;
    }
  }
}
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
