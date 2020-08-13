<template>
  <div class="full_page">
    <publicHead>
      <h6 slot="headCenter">{{$t("title.Footprint")}}</h6>
    </publicHead>
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div class="zj_conter">
        <div class="zj_plate" v-for="(item,index) in itmes" :key="index">
          <div class="zj_title">
            <span>{{item.fp_date}}</span>
            <!-- 	<span><i>1.8.2019</i></span> -->
          </div>
          <ul>
            <li
              v-for="(child,index) in item.footgoods"
              :key="index"
              @click="toCardDetail(child.goods_id)"
            >
              <p class="photo">
                <img :imgurl="child.goods_photo" src="@/assets/img/loader.png" />
              </p>
              <p
                class="name"
                :class="{'ltr':child.goods_name.substr(0, 1) !== '^'}"
              >{{child.goods_name.substr(0, 1) === '^'?child.goods_name.substr(1):child.goods_name}}</p>
              <div class="wnm">
                <!-- <span class="jg">{{GLOBA.money_tag}}{{child.goods_price}}</span>
                <span></span>-->
                <p class="justify cn" dir="ltr">
                  <span>{{GLOBA.money_tag}}{{child.goods_price | integerNum}}</span>
                  <span class="decimal">.{{child.goods_price | decimalNum}}</span>
                </p>

                <p class="dian">...</p>
              </div>
              <div class="lower" v-if="child.status">
                <p>{{$t("common.Off shelf")}}</p>
              </div>
            </li>
            <li v-if="item.isli"></li>
          </ul>
        </div>
        <Tocart ref="popout" :words="words"></Tocart>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Tocart from "@/whole/components/elastic/to_cart";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: { publicHead, Tocart, MescrollVue },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 24 // 每页数据的数量
        },
        toTop: {},
        empty: {
          tip: this.$t("tips.Wishlists is empty"),
          btntext: "GO →",
          warpId: "dataList", // 父布局的id;
          btnClick: this.upBtnClick
        },
        lazyLoad: {
          use: true
        }
      },

      itmes: [],
      words: "",
      txt_title: this.$t("title.Footprint")
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "mycont") {
      to.meta.isBack = true;
    }
    next(vm => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  activated() {
    if (this.$route.meta.isBack) {
      // this.foot_point();
      this.itmes = [];
      this.mescroll.resetUpScroll();
    }
    this.$route.meta.isBack = false;
  },

  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      // 模拟联网
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.itmes = [];
          // 把请求到的数据添加到列表
          console.log(arr, 3333);
          this.itmes = this.itmes.concat(arr);
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
    getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
      let listData = [];
      let data = {
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      this.$HTTP.foot_point(data).then(res=>{
        if (res.code == 0) {
          res.data.forEach(item => {
            let isli = item.footgoods.length % 3;
            if (isli == 2) {
              item.isli = true;
            } else {
              item.isli = false;
            }
            item.footgoods.forEach(it => {
              if (it.goods_status != 0) {
                it.status = true;
              } else if (it.store_status != 15) {
                it.status = true;
              } else {
                it.status = false;
              }
            });
            listData.push(item);
          });
        }
        successCallback(listData);
      });
    },

    async toCardDetail(id) {
      const data = {
        id: id,
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.goods(data)
      if (res.code == -5) {
        this.words = "Goods have been removed";
        this.$refs.popout.popout();
      }
      if (res.code == 0) {
        this.$router.push({ path: "/home/details", query: { id: id } });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.zj_conter {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.zj_plate {
  margin-top: 0.3rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  width: 100%;
  .zj_title {
    width: 100%;
    font-size: 0.36rem;
    font-family: "Calibri-Bold";
    font-weight: 600;
  }

  ul {
    box-shadow: 2px 2px 10px #e2e2e2;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 0.14rem;
    padding: 0.2rem;
    box-sizing: border-box;
    li {
      position: relative;
      width: 1.9rem;
      padding-bottom: 0.3rem;
      box-sizing: border-box;
      .photo {
        width: 1.9rem;
        height: 1.9rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        height: 0.5rem;
        line-height: 0.26rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 0.2rem;
        font-family: "Calibri";
        font-size: 0.24rem;
        word-break: break-all;
      }
      .wnm {
        height: 0.4rem;
        line-height: 0.5rem;
        box-sizing: border-box;
        font-size: 0.28rem;
        font-family: "Calibri-Bold";
        font-weight: Bold;
        color: #333;
        display: flex;
        justify-content: space-between;
        .cn {
          width: 100% !important;
          height: 100% !important;
          display: flex;
          span {
            display: inline-block;
          }
          .decimal {
            line-height: 0.3rem;
            font-size: 0.2rem;
          }
        }
        .dian {
          width: 0.28rem;
          font-size: 0.3rem;
        }
      }
    }
  }
}
.lower {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(56, 19, 19, 0.6);
  p {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    border: 1px solid #fff;
    height: 1rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1rem;
    color: #fff;
    margin-top: 0.8rem;
  }
}
</style>
