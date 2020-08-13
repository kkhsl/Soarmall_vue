<template>
  <div class="eva_box">
    <publicHead>
      <h6 slot="headCenter">{{txt_title}}</h6>
    </publicHead>
    <!-- 头部 -->
    <!-- <div class="eva_hear">
      <ul class="eva_catalog_box">
        <li :class="eva_css == 0?'eva_css1':'eva_css'" @click="eva_ader(0)">{{$t("common.All")}}</li>
        <li :class="eva_css == 1?'eva_css1':'eva_css'" @click="eva_ader(1)">{{$t("common.Pending")}}</li>
      </ul>
    </div>-->

    <!-- 评价列表 -->
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div id="dataList">
        <div
          class="good_box"
          v-for="(good, i) in items"
          :key="i"
        >
          <div class="time">{{good.Add_Time}}</div>
          <div class="goods">
            <img
              v-lazy="good.goods_photo"
              alt
            />
            <div class="good_cont">
              <div
                class="good_name line-clamp"
                :class="{'ltr':good.goods_name.substr(0, 1) !== '^'}"
              > {{good.goods_name.substr(0, 1) === '^'?good.goods_name.substr(1):good.goods_name}}</div>
              <p
                class="good_price"
                dir="ltr"
              >
                <span>{{GLOBA.money_tag}} {{good.goods_current_price | integerNum}}</span>
                <span class="xiaoshu">.{{good.goods_current_price | decimalNum}}</span>
              </p>
            </div>
          </div>
          <ul class="grade">
            <li class="scoring">
              <p>{{$t("common.Scoring")}}</p>
              <Grade :grades="good.evaluate_buyer_val"></Grade>
            </li>
            <li>
              <p>{{$t("common.Commodity similarity")}}</p>
              <Grade :grades="good.description_evaluate"></Grade>
            </li>
            <li>
              <p>{{$t("common.Logistics speed")}}</p>
              <Grade :grades="good.ship_evaluate"></Grade>
            </li>
            <li>
              <p>{{$t("common.Service Attitude")}}</p>
              <Grade :grades="good.service_evaluate"></Grade>
            </li>
          </ul>
          <div class="eva_info">{{good.evaluate_info}}</div>
          <div class="eva_photo_box">
            <img
              v-for="(img,e) in good.photos"
              :key="e"
              v-lazy="img.photo"
              @click="img_big(good.photos,e)"
            />
          </div>
          <div
            class="add_eva"
            v-if="good.flag === 1"
          >
            <div class="time">{{good.Addeva_time}}</div>
            <div class="eva_info">{{good.Addeva_info}}</div>
            <div class="eva_photo_box">
              <img
                v-for="(img,ae) in good.eva_photo"
                :key="ae"
                v-lazy="img.photo"
                @click="img_big(good.eva_photo,ae)"
              />
            </div>
          </div>

          <div class="btn_box">
            <p @click="commodity(good.goods_id)">{{$t("common.Snapshot")}}</p>
            <p
              v-if="good.flag==0"
              @click="add_review(good.id)"
            >{{$t("message.Add review")}}</p>
          </div>
        </div>
      </div>
    </mescroll-vue>
    <Imgbig
      v-if="if_imgbig"
      :photos="big_photo"
      @enlargement="enlargement"
    ></Imgbig>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
export default {
  components: {
    publicHead,
    MescrollVue: () => import("@/plugins/scroll/mescroll"),
    Grade: () => import("@/whole/components/global/rater_grade"),
    Imgbig: () => import("@/whole/components/global/img_big")
  },
  data () {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {},
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20 // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          tip: this.$t("tips.No orders in the moment"),
          warpId: "dataList", // 父布局的id;
          btnClick: this.upBtnClick,
          btntext: this.$t("common.Buy Now")
        },
        lazyLoad: {}
      },

      txt_title: this.$t("common.Review") + "ed",
      eva_css: 0,
      items: [],
      if_imgbig: false,
      big_photo: {}
    };
  },

  created () { },
  mounted () {
    window.addEventListener(
      "popstate",
      e => {
        if (this.if_imgbig) {
          this.if_imgbig = !this.if_imgbig;
        }
      },
      false
    );
  },
  beforeDestroy () {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.if_imgbig) {
          this.if_imgbig = !this.if_imgbig;
        }
      },
      false
    );
  },
  methods: {
    // eva_ader(id) {
    //   if (this.eva_css !== id) {
    //     this.eva_css = id;
    //     this.mescroll.resetUpScroll(); // 刷新列表数据
    //   }
    // },
    img_big (photo, i) {
      let photos = {
        photo: photo,
        i: i
      };
      this.big_photo = photos;
      this.if_imgbig = true;
      window.history.pushState(null, null, "#");
    },
    enlargement () {
      this.if_imgbig = false;
      this.$router.go(-1);
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll;
    },
    upCallback (page, mescroll) {
      this.getListDataFromNet(
        this.eva_css,
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
    getListDataFromNet (
      pdType,
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      var listData = [];
      // if(pdType == 0){
      //     // 改参数或者接口
      // }else{
      // }
      let data = {
        language: this.$route.query.lang === 'sa' ? 1 : 0
      }
      this.$HTTP.evaluate_list(data).then(res=>{
        console.log(res);
        if (res.code == 4200) {
          listData = res.data;
        }
        // 回调
        successCallback(listData);
      });
    },
    commodity (id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    },
    add_review (id) {
      this.$router.push({
        path: "/whole/views/order_return/add_evaluate",
        query: { id: id }
      });
    },
    upBtnClick () {
      this.$router.push({
        path: "/",
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.eva_box {
  height: 100vh;
  background: #f7f7f7;
}
ul {
  // padding: 0 0.3rem;
  // box-sizing: border-box;
}
.good_box {
  margin-bottom: 0.3rem;
  background-color: #fff;
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.time {
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.22rem;
  color: #999;
  line-height: 0.6rem;
}
.goods {
  display: flex;
  justify-content: space-between;
  img {
    width: 1.7rem;
    height: 1.7rem;
  }
  .good_cont {
    width: 4.9rem;
  }
  .good_name {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.26rem;
    color: #333;
    height: 0.7rem;
    line-height: 0.35rem;
  }
  .good_price {
    line-height: 0.9rem;
    font-size: 0.26rem;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    color: #333;
    display: flex;
    justify-content: flex-start;
    .xiaoshu {
      font-size: 0.18rem;
      display: inline-block;
      line-height: 0.8rem;
      height: 100%;
      vertical-align: middle;
    }
  }
}
.grade {
  margin: 0.2rem 0;
  font-size: 0.28rem;
  font-family: "Calibri";
  font-weight: 400;
  color: #333;
  line-height: 0.4rem;
  p:nth-child(1) {
    width: 3.5rem;
  }
  li {
    display: flex;
    justify-content: flex-start;
  }
  .scoring {
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
  }
}

.eva_info {
  font-size: 0.28rem;
  font-family: "Calibri";
  font-weight: 400;
  color: #333;
  line-height: 0.4rem;
  background-color: #f7f7f7;
}
.eva_photo_box {
  background-color: #f7f7f7;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  img {
    width: 2.2rem;
    max-height: 3.6rem;
    margin-bottom: 0.05rem;
  }
}
.btn_box {
  display: flex;
  justify-content: space-around;
  height: 0.8rem;
  line-height: 0.8rem;
  width: 100%;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.24rem;
  color: #017ec2;
  text-align: center;
  p {
    // width: 1.8rem;
    padding: 0 0.2rem;
  }
}
// .eva_hear {
//   width: 100%;
//   height: 0.8rem;
//   line-height: 0.8rem;
//   font-family: "Calibri-Bold";
//   font-weight: Bold;
//   font-size: 0.3rem;
//   background-color: #fff;
//   .eva_catalog_box::-webkit-scrollbar {
//     display: none;
//   }
//   .eva_catalog_box {
//     width: 100%;
//     display: flex;
//     justify-content: space-between;
//     text-align: center;
//     li {
//       width: 48%;
//       position: relative;
//     }
//     .eva_css {
//       color: darkgray;
//     }
//     .eva_css1 {
//       color: black;
//     }
//     .eva_css1::after {
//       position: absolute;
//       bottom: 0;
//       left: 44%;
//       content: "";
//       width: 0.4rem;
//       height: 0.04rem;
//       background-color: black;
//     }
//     span {
//       position: absolute;
//       top: 0px;
//       right: 1px;
//       line-height: 0.4rem;
//       color: #f00;
//       font-size: 0.18rem;
//     }
//   }
// }
</style>