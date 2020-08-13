<template>
  <div class="Returns">
    <publicHead :goSearch="true"></publicHead>
    <div class="skip" :class="GLOBA.top_hear" @click.prevent="fanghu()"></div>
    <div class="orders_hear">
      <ul class="order_catalog_box">
        <li
          :class="ids == 0?'ordercss1':'ordercss'"
          @click="all_ader(0,0)"
        >{{$t("common.Application")}}</li>
        <li
          :class="ids == 1?'ordercss1':'ordercss'"
          @click="all_ader(1,1)"
        >{{$t("common.Processing")}}</li>
        <!-- <li :class="ordercss == 3?'ordercss1':'ordercss'" @click="all_ader(3)">Evaluation</li> -->
        <li :class="ids == 2?'ordercss1':'ordercss'" @click="all_ader(1,2)">{{$t("common.Record")}}</li>
      </ul>
    </div>
    <div>
      <mescroll-vue
        ref="mescroll"
        :class="GLOBA.content_center"
        v-show="ordercss == 0"
        :down="mescrollDown(0)"
        :up="mescrollUp(0)"
        @init="mescrollInit"
      >
        <Returnall :items="tab0.goods"></Returnall>
      </mescroll-vue>

      <mescroll-vue
        ref="mescroll1"
        :class="GLOBA.content_center"
        v-show="ordercss == 1"
        :down="mescrollDown(1)"
        :up="mescrollUp(1)"
        @init="mescrollInit1"
      >
        <ReturnRecord :items="tab1.goods"></ReturnRecord>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import Returnall from "@/whole/components/order_return/return_all";
import ReturnRecord from "@/whole/components/order_return/return_record";
import MescrollVue from "@/plugins/scroll/mescroll";
import publicHead from "@/whole/components/header/publicHead";
export default {
  components: { Returnall, ReturnRecord, MescrollVue, publicHead },
  data() {
    return {
      tab0: { mescroll: null, goods: [], isListInit: false }, // 全部
      tab1: { mescroll: null, goods: [], isListInit: false }, //
      ordercss: 0,
      goods: [],

      adersid: "",
      items: [],
      ids: 0
    };
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === "Mycont") {
      to.meta.isBack = true;
    }
    next(vm => {
      let curMescroll = vm.$refs["mescroll" + vm.ordercss];
      curMescroll && curMescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    let curMescroll = this.$refs["mescroll" + this.ordercss];
    curMescroll && curMescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },
  activated() {
    if (this.$route.meta.isBack) {
      this.ordercss = this.$route.query.toPage;
      this.ids = this.$route.query.toPage;
      this.all_ader(0, 0);
    }
    this.$route.meta.isBack = false;
  },
  mounted() {
    // 样式问题
    /* document.getElementsByTagName("body")[0].style.overflow = "hidden"; */
  },
  methods: {
    // amount () {
    //   account(res => {
    //     if (res.code == 0) {
    //       this.amounts = res.data
    //       console.log(this.amounts, 117117)
    //     } else {
    //       this.amounts = {}
    //     }
    //   })
    // },
    mescrollInit(mescroll) {
      mescroll.ordercss = 0; // 加入标记,便于在回调中取到对应的list
      this.tab0.mescroll = mescroll;
    },
    mescrollInit1(mescroll) {
      mescroll.ordercss = 1;
      this.tab1.mescroll = mescroll;
    },
    mescrollDown(tabType) {
      let isAuto = tabType === 0; // 第一个mescroll传入true,列表自动加载
      return {
        // use:false,
        auto: isAuto,
        callback: this.downCallback
      };
    },
    mescrollUp(tabType) {
      console.log(tabType);
      let emptyWarpId = "dataList" + tabType;
      let that = this;
      return {
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 12 // 每页数据的数量
        },
        htmlNodata: '<p class="upwarp-nodata"></p>',
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { upCallback(page); }
        toTop: {},
        lazyLoad: {},
        empty: {
          tip: this.$t("tips.The cart is empty"),
          btntext: this.$t("common.Buy Now"),
          warpId: emptyWarpId, // 父布局的id;
          btnClick: function() {
            console.log(that);
            that.$router.push({ path: "/" });
            // if(this.warpId == "dataList0"){
            //   that.$router.push({ path: "/" });
            // }else{
            //   that.all_ader(0,0)
            // }
          }
        }
      };
    },
    /* 下拉刷新的回调 */
    downCallback(mescroll) {
      mescroll.resetUpScroll(); // 触发下拉刷新的回调,加载第一页的数据
    },
    // 上拉加载
    upCallback(page, mescroll) {
      console.log(page, mescroll.ordercss);
      if (mescroll.ordercss === 0) {
        // this.tab0.isListInit = true; // 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(
          mescroll.ordercss,
          page.num,
          page.size,
          curPageData => {
            if (page.num === 1) this.tab0.goods = [];
            this.tab0.goods = this.tab0.goods.concat(curPageData); // 追加新数据
            this.$nextTick(() => {
              mescroll.endSuccess(curPageData.length);
            });
          },
          () => {
            // if (page.num === 1) this.tab0.isListInit = false;
            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
          }
        );
      } else if (mescroll.ordercss === 1) {
        // 奶粉
        // this.tab1.isListInit = true; // 标记列表已初始化,保证列表只初始化一次
        this.getListDataFromNet(
          mescroll.ordercss,
          page.num,
          page.size,
          curPageData => {
            if (page.num === 1) this.tab1.goods = []; // 如果是第一页需手动制空列表
            this.tab1.goods = this.tab1.goods.concat(curPageData); // 追加新数据
            this.$nextTick(() => {
              mescroll.endSuccess(curPageData.length);
            });
          },
          () => {
            // if (page.num === 1) this.tab1.isListInit = false;
            mescroll.endErr(); // 联网失败的回调,隐藏下拉刷新的状态
          }
        );
      }
    },
    // 切换菜单
    all_ader(type, i) {
      this.ids = i;
      let curTab = this.getTabData(this.ordercss); // 当前列表
      let newTab = this.getTabData(type); // 新转换的列表
      curTab.mescroll.hideTopBtn(); // 隐藏当前列表的回到顶部按钮
      this.ordercss = type; // 切换菜单
      if (!newTab.isListInit) {
        newTab.mescroll.triggerDownScroll(); // 加载列表
      } else {
        setTimeout(() => {
          // 检查新转换的列表是否需要显示回到到顶按钮
          var curScrollTop = newTab.mescroll.getScrollTop();
          if (curScrollTop >= newTab.mescroll.optUp.toTop.offset) {
            newTab.mescroll.showTopBtn();
          } else {
            newTab.mescroll.hideTopBtn();
          }
        }, 30);
      }
    },
    // 获取菜单对应的数据
    getTabData(tabType) {
      if (tabType == null) tabType = this.tabType;
      if (tabType === 0) {
        this.tab1.goods = [];
        return this.tab0;
      } else if (tabType === 1) {
        this.tab0.goods = [];
        this.tab1.goods = [];
        return this.tab1;
      }
    },
    getListDataFromNet(
      tabType,
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      let listData = [];
      // tabType 全部0;
      if (tabType === 0) {
        let data = {
          order_id: "",
          currentPage: pageNum
        };
        this.$HTTP.order_return(data).then(res=>{
          console.log(res, 0);
          if (res.code == -100) {
            localStorage.setItem("Flag", " ");
            let accountout = {};
            this.$store.commit("logout", accountout);
            this.$router.push({ path: "/account/login" });
          }
          if (res.code == 0) {
            res.data.forEach(item => {
              listData.push(item);
              if (typeof item.childOrderList !== "undefined") {
                item.childOrderList.forEach(child => {
                  let childOrderList = {
                    add_time: item.add_time,
                    goodsinfo_list: child.child_goodsinfo,
                    id: child.order_id,
                    order_id: item.order_id
                  };
                  listData.push(childOrderList);
                });
              }
            });
          }
          // 回调
          successCallback && successCallback(listData);
        });
      } else if (tabType === 1) {
        let data = {
          currentPage: pageNum
        };
        this.$HTTP.order_return_listlog(data).then(res=>{
          console.log(res, 1);
          if (res.code == -100) {
            localStorage.setItem("Flag", " ");
            let accountout = {};
            this.$store.commit("logout", accountout);
            this.$router.push({ path: "/account/login" });
          }
          if (res.code == 0) {
            console.log(this.ids);
            if (typeof res.data.returnGoods !== "undefined") {
              res.data.returnGoods.forEach(item => {
                if (this.ids === 1) {
                  if (
                    item.goods_return_status == "5" ||
                    item.goods_return_status == "6" ||
                    item.goods_return_status == "7"
                  ) {
                    listData.push(item);
                  }
                } else if (this.ids === 2) {
                  listData.push(item);
                }
              });
            } else {
              listData = [];
            }
          }
          successCallback && successCallback(listData);
        });
      }
    },
    fanghu() {
      this.$router.push({ path: "/mycont" });
    }
  }
};
</script>

<style lang="scss" scoped>
.Returns {
  width: 100%;
  background-color: #f7f7f7;
}
// .skip {
//   width: 1rem;
//   height: 1rem;
//   position: fixed;
//   left: 0rem;
//   z-index: 22222;
// }

.orders_hear {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  background-color: #fff;
  position: relative;
  z-index: 10;
  .order_catalog_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: center;
    // overflow: hidden;
    // overflow-x: scroll;
    // overflow-y: hidden;
    // white-space: nowrap;
    padding: 0 0.2rem;
    box-sizing: border-box;
    li {
      min-width: 20%;
      position: relative;
    }
    .ordercss {
      color: #999;
    }
    .ordercss1 {
      color: #017ec2;
    }
    .ordercss1::after {
      position: absolute;
      bottom: 0;
      left: 0.5rem;
      content: "";
      width: 0.4rem;
      height: 0.04rem;
      background-color: #017ec2;
    }
  }
}
</style>
