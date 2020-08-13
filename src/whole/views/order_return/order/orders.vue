<template>
  <div class="orders">
    <publicHead>
      <div slot="headCenter" class="search_">
        <img src="@/assets/img/other/ss.png" />
        <form class="search_block" @submit.prevent="formSubmit" action="javascript:return true">
          <input
            type="text"
            :placeholder="$t('tips.What are you looking for')"
            v-model="order_search"
          />
        </form>
      </div>
      <div slot="headRight" class="s_sou" @click="act_sou(1)"></div>
    </publicHead>
    <div class="orders_hear">
      <ul class="order_catalog_box">
        <li
          v-for="orderNav of orderListNav"
          :class="{'active': listNavIndex == orderNav.index}"
          :key="orderNav.index"
          @click="all_ader(orderNav.index)"
        >{{orderNav.title}}</li>
      </ul>
    </div>
    <!-- 订单信息 -->
    <mescroll-vue
      ref="mescroll"
      class="centerWrap"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <Orderall :items="items" @order_cont="order_cont" @toReview="toReview"></Orderall>
    </mescroll-vue>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Orderall from "@/whole/components/order_return/order_all";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: {
    publicHead,
    Orderall,
    MescrollVue
  },
  data() {
    return {
      orderListNav: [
        {
          title: this.$t("common.All"),
          index: 1
        },
        {
          title: this.$t("common.Pending"),
          index: 3
        },
        {
          title: this.$t("common.Shipped"),
          index: 5
        },
        {
          title: this.$t("common.Review"),
          index: 6
        },
        {
          title: this.$t("common.Finished"),
          index: 8
        },
        {
          title: this.$t("common.Canceled"),
          index: 7
        }
      ],
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
      listNavIndex: 1,
      items: [],
      orderstatus: {
        order_submit: "",
        order_shipping: "",
        order_finish: "",
        order_pending: "",
        order_cencel: ""
      },
      order_search: ""
    };
  },
  activated() {
    if (this.$route.meta.isBack || this.$route.query.page === 1) {
      this.listNavIndex = Number(this.$route.query.toPage);
    }
    this.$route.meta.isBack = false;
    this.mescroll.resetUpScroll();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "mycont" || from.name === "Payment") {
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
  mounted() {},
  methods: {
    //订单搜索
    act_sou(i) {
      this.listNavIndex = i;
      this.items = []; // 在这里手动置空列表,可显示加载中的请求进度
      this.mescroll.resetUpScroll(); // 刷新列表数据
    },

    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    all_ader(navIndex) {
      if (this.listNavIndex !== navIndex) {
        this.order_search = "";
        this.listNavIndex = navIndex;
        this.items = []; // 在这里手动置空列表,可显示加载中的请求进度
        this.mescroll.resetUpScroll(); // 刷新列表数据
      }
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        this.listNavIndex,
        page.num,
        page.size,
        arr => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.items = [];
          // 把请求到的数据添加到列表
          console.log(arr);
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
    getListDataFromNet(
      navActiveIndex,
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      // 延时一秒
      setTimeout(() => {
        var listData = [];
        let data = {
          currentPage: pageNum,
          order_id: "",
          beginTime: "",
          endTime: "",
          order_status: "",
          name: "",
          language: this.$route.query.lang === "sa" ? 1 : 0
        };
        switch (navActiveIndex) {
          case 1:
            data.name = this.order_search;
            break;
          case 2:
            break;
          case 3:
            data.order_status = "payOnDelivery";
            break;
          case 4:
            break;
          case 5:
            data.order_status = "order_shipping";
            break;
          case 6:
            data.order_status = "order_receive";
            break;
          case 7:
            data.order_status = "order_cancel";
            break;
          case 8:
            data.order_status = "order_finish";
            break;
        }
        this.$HTTP.buyer_order(data,{showLoading: false}).then(res=>{
          console.log(res, 123);
          if (res.code == 0) {
            if (typeof res.data.orderstatus !== "undefined") {
              this.orderstatus.order_cencel =
                res.data.orderstatus[0].order_cencel; // 已取消
              this.orderstatus.order_submit =
                res.data.orderstatus[1].order_submit; // 已提交待付款
              this.orderstatus.order_pending =
                res.data.orderstatus[2].order_pending; //  未发货
              this.orderstatus.order_shipping =
                res.data.orderstatus[3].order_shipping; // 已发货
              this.orderstatus.order_finish =
                res.data.orderstatus[4].order_finish; // 已评价
            }
            if (typeof res.data.orderlist !== "undefined") {
              res.data.orderlist.forEach(item => {
                if (typeof item.main_order !== "undefined") {
                  item.main_order.forEach(item => {
                    item.goodsinfo.forEach(e => {
                      if (e.goods_gsp_val) {
                        let goods_specs = e.goods_gsp_val
                          .split("<br>")
                          .join(",");
                        e.good_specs = goods_specs.substring(
                          0,
                          goods_specs.lastIndexOf(",")
                        ); //删除最后一个，号
                      }
                    });
                    listData.push(item);
                  });
                }
                if (typeof item.child_order !== "undefined") {
                  item.child_order.forEach(item_c => {
                    item_c.goodsinfo.forEach(e => {
                      if (e.goods_gsp_val) {
                        let goods_specs = e.goods_gsp_val
                          .split("<br>")
                          .join(",");
                        e.good_specs = goods_specs.substring(
                          0,
                          goods_specs.lastIndexOf(",")
                        ); //删除最后一个，号
                      }
                    });
                    listData.push(item_c);
                  });
                }
              });
            }
          }
          // 回调
          successCallback(listData);
        });
      }, 200);
    },
    upBtnClick() {
      this.$router.push({
        path: "/home"
      });
    },

    toReview() {
      this.order_cont();
      this.all_ader(6);
    },
    async order_cont() {
      const data = {
        currentPage: "1",
        order_id: "",
        beginTime: "",
        endTime: "",
        order_status: ""
      };
      this.mescroll.resetUpScroll();
      let res = await this.$HTTP.buyer_order(data,{showLoading: false})
      if (res.code == 0) {
        if (typeof res.data.orderstatus !== "undefined") {
          this.orderstatus.order_cencel =
            res.data.orderstatus[0].order_cencel; // 已取消
          this.orderstatus.order_submit =
            res.data.orderstatus[1].order_submit; // 已提交待付款
          this.orderstatus.order_pending =
            res.data.orderstatus[2].order_pending; //  未发货
          this.orderstatus.order_shipping =
            res.data.orderstatus[3].order_shipping; // 已发货
          this.orderstatus.order_finish =
            res.data.orderstatus[4].order_finish; // 已评价
        }
      }
    },
    fanghu() {
      this.$router.push({
        path: "/mycont"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.orders {
  margin: 0;
}

.orders_hear {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  background-color: #fff;
  .order_catalog_box::-webkit-scrollbar {
    display: none;
  }
  .order_catalog_box {
    display: flex;
    justify-content: space-between;
    text-align: center;
    overflow: hidden;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;

    li {
      position: relative;
      padding: 0 0.16rem;
      color: darkgray;
    }
    li.active {
      color: black;
    }

    li.active::after {
      content: "";
      position: absolute;
      bottom: 0;
      width: 0.4rem;
      height: 0.04rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: black;
    }

    span {
      position: absolute;
      top: 0px;
      right: 1px;
      line-height: 0.4rem;
      color: #f00;
      font-size: 0.18rem;
    }
  }
}

.search_block {
  display: flex;
  align-items: center;
  padding: 0 0.1rem;
  height: 0.54rem;
  input{
    padding: 0.1rem 0;
    height: 0.3rem;
    line-height: 0.3rem;
    width: 4.6rem;
  }
  input::-webkit-input-placeholder {
    color: rgba(51, 51, 51, 0.3);
    line-height: 0.54rem;
  }
}

.s_sou {
  width: 0.52rem;
  height: 0.52rem;
  background: url(../../../../assets/img/other/sousuo.png) no-repeat #017ec2
    center;
  background-size: 0.4rem;
}
</style>
