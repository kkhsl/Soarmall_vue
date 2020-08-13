<template>
  <div class="full_page">
    <publicHead>
      <h6 slot="headCenter">{{store_name}}</h6>
    </publicHead>
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <HeadStyle :store="store_det" :conll="conll" @collect_btn="collect_btn"></HeadStyle>
      <ActivityStyle :store="store_det"></ActivityStyle>
      <!-- <div class="so_conter">
        <ul class="so_xuanze">
          <li @click="changeTab(0)">
            <p>{{$t("common.General")}}</p>
            <p class="mark_img">
              <img src="@/assets/img/other/login/tx.png" alt />
            </p>
          </li>
          <li class="sales_line">
            <p>{{$t("common.Sales")}}</p>
            <p class="mark_img">
              <img src="@/assets/img/other/login/tx.png" alt />
            </p>
            <p class="sales_btn" v-if="sales_if === 0" @click="changeTab(1)"></p>
            <p class="sales_btn" v-if="sales_if === 1" @click="changeTab(2)"></p>
          </li>
          <li>
            <p>{{$t("common.Price")}}</p>
            <p class="mark_img">
              <img src="@/assets/img/other/login/tx.png" alt />
            </p>
            <p class="sales_btn" v-if="price_if === 0" @click="changeTab(3)"></p>
            <p class="sales_btn" v-if="price_if === 1" @click="changeTab(4)"></p>
          </li>
        </ul>
      </div>-->

      <Goods :items="items"></Goods>
    </mescroll-vue>

    <Tocart ref="popout" :words="words"></Tocart>
  </div>
</template>
 
<script>
import MescrollVue from "@/plugins/scroll/mescroll";
import publicHead from "@/whole/components/header/publicHead";
import Tocart from "@/whole/components/elastic/to_cart";
import Goods from "@/whole/components/global/goods";
import Xinput from "@/whole/components/global/x_input";
export default {
  components: {
    MescrollVue,
    Tocart,
    publicHead,
    Goods,
    Xinput,
    HeadStyle: () => import("@/whole/components/store/head_style1"),
    ActivityStyle: () => import("@/whole/components/store/activity_style1")
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        auto: false,
        callback: this.downCallback
      },
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 30 // 每页数据的数量
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
        lazyLoad: {},
        onScroll: this.onScroll
      },
      pdType: 0,
      sales_if: 0,
      price_if: 0,
      way: "woman tops",
      words: "",
      conll: "",
      dianpu: {},
      items: [],
      store_det: {},
      // rgba:"",
      // black_img:true,
      // bannerHeight: document.documentElement.clientWidth || window.innerWidth,
      store_name: ""
    };
  },
  activated() {
    let click = this.$store.state.click;
    if (click == "collect_btn") {
      this.items = [];
      this.mescroll.resetUpScroll();
    }
    if (this.$route.query.to_data.id == 1 || this.$route.meta.isBack) {
      if (this.dianpu.store_id != this.$route.query.to_data.dianpu.store_id) {
        this.dianpu = this.$route.query.to_data.dianpu;
        this.items = [];
        this.mescroll.resetUpScroll();
      }
    }
    this.$route.meta.isBack = false;
    this.store();
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === "HomeCont") {
      to.meta.isBack = true;
    }
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    });
  },
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next();
  },

  methods: {
    onScroll(mescroll, y, isUp) {
      // console.log(y,this.bannerHeight)
      // if (y <= this.bannerHeight && y > 30) {
      //   this.opacity = y / this.bannerHeight;
      //   if (this.opacity < 0.9) {
      //     this.rgba = "rgba(1,126,194," + this.opacity + ")";
      //   }
      // } else if (y <= 30) {
      //   this.rgba = "";
      //   this.black_img=true
      // } else {
      //   this.black_img=false
      //   this.rgba = "rgba(1,126,194," + 0.9 + ")";
      // }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 切换菜单
    changeTab(type) {
      switch (type) {
        case 0:
          this.sales_if = 0;
          this.price_if = 0;
          break;
        case 1:
          this.sales_if = 1;
          this.price_if = 0;
          break;
        case 2:
          this.sales_if = 0;
          break;
        case 3:
          this.price_if = 1;
          this.sales_if = 0;
          break;
        case 4:
          this.price_if = 0;
          break;
      }
      if (this.pdType !== type) {
        this.pdType = type;
        this.items = []; // 在这里手动置空列表,可显示加载中的请求进度
        this.mescroll.resetUpScroll(); // 刷新列表数据
      }
    },
    // 下拉刷新
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认12
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        this.pdType,
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
      pdType,
      pageNum,
      pageSize,
      successCallback,
      errorCallback
    ) {
      // 延时一秒
      var listData = [];
      let data = {
        orderBy: "",
        orderType: "",
        store_recommend: "",
        store_creativity: "",
        goods_global: "",
        goods_type: "",
        goods_store: this.dianpu.store_id,
        currentPage: pageNum
      };
      switch (pdType) {
        case 0:
          break;
        case 1:
          data.orderBy = "goods_salenum";
          data.orderType = "asc";
          break;
        case 2:
          data.orderBy = "goods_salenum";
          data.orderType = "desc";
          break;
        case 3:
          data.orderBy = "goods_current_price";
          data.orderType = "asc";
          break;
        case 4:
          data.orderBy = "goods_current_price";
          data.orderType = "desc";
          break;
      }
      this.$HTTP.store_goods_info(data).then(res => {
        if (res.code == 0) {
          if (res.data.goods_info.length > 0) {
            this.conll = res.data.favorite_store;
            this.dianpu.store_name = res.data.store_name;
            res.data.goods_info.forEach(item => {
              let so_you = {
                goodinventory: item.goods_inventory,
                goods_price: item.goods_price,
                goodscurrprice: item.goods_current_price,
                goodsid: item.goodsid,
                goodsname: item.goodsname,
                main_photo_url: item.goodsimg,
                photos_url: item.photos_url,
                store_price: item.store_price,
                vo_well_evaluate: item.well_evaluate,
                goods_collect: item.goods_collect
              };
              listData.push(so_you);
            });
          }
        }
        // 回调
        successCallback(listData);
        let click = this.$store.state.click;
        if (click == "collect_btn") {
          setTimeout(() => {
            this.collect_btn();
            this.$store.commit("click", "");
          }, 100);
        }
      });
    },
    async collect_btn() {
      if (this.conll == 0) {
        let data = {
          id: this.dianpu.store_id
        };
        let res = await this.$HTTP.add_store_favorite(data);
        if (res.code == 0) {
          this.conll = 1;
          (this.words = this.$t("message.Collection Of Success")),
            this.$refs.popout.popout();
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            time: 2000,
            i: 1
          });
        }
      } else if (this.conll == 1) {
        const data = {
          store_id: this.dianpu.store_id,
          goods_id: ""
        };
        let res = await this.$HTTP.favorite_store_d(data);
        if (res.code == 0) {
          this.conll = 0;
          (this.words = this.$t("message.Cancel successful")),
            this.$refs.popout.popout();
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            time: 2000,
            i: 1
          });
        }
      } else {
        this.$router.push({
          path: "/account/login",
          query: { id: "collect_btn" }
        });
      }
    },
    async store() {
      let res = await this.$PHP.store_detail(this.dianpu.store_id)
      if (res.code == 0) {
        this.store_name = res.data.store_name;
        let er_json = [];
        res.data.enough_reduce.forEach(item => {
          item.er_json.forEach(e => {
            er_json.push(e);
          });
        });
        if (res.data.enough_reduce.length < 1 && !res.data.enough_price) {
          res.data.isdiscount = 0;
        } else if (res.data.enough_reduce.length < 1 && res.data.enough_price) {
          res.data.isdiscount = 1;
        } else if (
          res.data.enough_reduce.length == 1 &&
          !res.data.enough_price
        ) {
          res.data.isdiscount = 1;
        } else if (
          res.data.enough_reduce.length == 1 &&
          res.data.enough_price
        ) {
          res.data.isdiscount = 3;
        } else {
          res.data.isdiscount = 2;
        }
        if (res.data.coupon.length < 1) {
          res.data.iscoupon = 0;
        } else if (res.data.coupon.length == 1) {
          res.data.iscoupon = 1;
        } else if (res.data.coupon.length == 2) {
          res.data.iscoupon = 3;
        } else {
          res.data.iscoupon = 2;
        }
        res.data.er_json = er_json;
        this.store_det = res.data;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.so_conter {
  width: 100%;
  padding: 0.3rem;
  font-size: 0.28rem;
  box-sizing: border-box;
  font-family: "Calibri";
  font-weight: 400;
  color: #333;
  display: flex;
  justify-content: space-between;
  background-color: #f7f7f7;
  .conlle {
    width: 0.4rem;
    height: 0.4rem;
  }
  .img {
    background: url(../../../assets/img/other/login/ax2.png) no-repeat;
    background-position: center center;
    background-size: 0.4rem 0.4rem;
  }
  .img1 {
    background: url(../../../assets/img/other/login/ax.png) no-repeat;
    background-position: center center;
    background-size: 0.4rem 0.4rem;
  }
  .so_xuanze {
    display: flex;
    justify-content: flex-start;
    li {
      width: 1.7rem;
      height: 0.36rem;
      line-height: 0.36rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      position: relative;
      .mark_img {
        margin: 0 0.1rem;
        img {
          width: 0.12rem;
          height: 0.06rem;
        }
      }
    }
    .sales_line {
      border: 1px solid #d7d7d7;
      border-top: none;
      border-bottom: none;
    }
    .sales_btn {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
  }
  .so_img {
    width: 0.24rem;
    height: 0.32rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.content_wrapper {
  width: 100%;
  max-height: calc(100vh - 2.5rem);
  // background-color: #f2f;
  overflow: hidden;
}

.tangkuang {
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 0rem;
  z-index: 3333;
  width: 100%;
  height: 100%;
  background: red;
  background: rgba(0, 0, 0, 0.5);
  .sx_content {
    animation: myfirst 0.5s forwards ease;
    transition: all 0.5s ease-in;
    position: absolute;
    width: 6.3rem;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    font-size: 0.32rem;
    @keyframes myfirst {
      0% {
        left: 8rem;
      }
      100% {
        left: 1.36rem;
      }
    }
    .sx_title {
      border-bottom: 1px solid #ebebeb;
      padding: 0.6rem 0.6rem 0.3rem 0.6rem;
      p:nth-child(1) {
        width: 100%;
        font-size: 0.56rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        margin-bottom: 0.5rem;
      }
      p:nth-child(2) {
        font-family: "Calibri-Bold";
        font-weight: bold;
        margin-bottom: 0.36rem;
      }
      p:nth-child(3) {
        span {
          font-family: "Calibri-Bold";
          font-weight: bold;
          font-size: 0.26rem;
          margin-right: 0.2rem;
        }
        select {
          width: 1.9rem;
          height: 0.6rem;
          border: 1px solid #d7d7d7;
          border-radius: 0.1rem;

          .option {
            width: 1.9rem;
            height: 0.6rem;
            border: 1px solid #d7d7d7;
            border-radius: 0.1rem;
          }
        }
      }
    }
    .pingpai {
      width: 100%;
      padding: 0.4rem 0.6rem;
      box-sizing: border-box;

      .pp_title {
        margin-bottom: 0.1rem;
        display: flex;
        justify-content: space-between;

        p:nth-child(1) {
          font-family: "Calibri-Bold";
          font-weight: bold;
          font-size: 0.36rem;
        }
      }
      .pp_conter {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        p {
          width: 2.4rem;
          margin-top: 0.2rem;
          height: 0.6rem;
          line-height: 0.6rem;
          text-align: center;
          border-radius: 0.1rem;
          font-size: 0.26rem;
          font-weight: 400;
          font-family: "Calibri";
          border: 1px solid #d7d7d7;
        }
        .pp_xuanze {
          border: 1px solid #017ec2;
          color: #017ec2;
          border-radius: 0.1rem;
        }
      }
    }
    .sz_conter {
      width: 100%;

      ul {
        li {
          width: 100%;
          height: 1rem;
          border-top: 1px solid #ebebeb;
          line-height: 1rem;
          padding: 0 0.6rem;
          box-sizing: border-box;
          font-size: 0.36rem;
          font-family: "Calibri-Bold";
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }
        li:nth-child(1) {
          p:nth-child(2) {
            span {
              display: inline-block;
            }
            span:nth-child(1) {
              width: 0.32rem;
              height: 0.32rem;
              border-radius: 50%;
              background: #eecc98;
              margin-right: 0.3rem;
            }
            span:nth-child(2) {
              width: 0.06rem;
              height: 0.12rem;
              img {
                vertical-align: middle;
              }
            }
          }
        }
        li:nth-child(2),
        li:nth-child(3),
        li:nth-child(4) {
          p:nth-child(2) {
            span {
              display: inline-block;
            }
            span:nth-child(1) {
              color: #999999;
              margin-right: 0.3rem;
            }
            span:nth-child(2) {
              width: 0.06rem;
              height: 0.12rem;
              img {
                vertical-align: middle;
              }
            }
          }
        }
      }
    }
    .floot_button {
      margin-top: 0.7rem;
      padding: 0 0.6rem;
      display: flex;
      justify-content: space-between;
      p {
        width: 2.3rem;
        height: 0.8rem;
        border: 1px solid;
        border-radius: 0.4rem;
        text-align: center;
        line-height: 0.8rem;
        font-size: 0.36rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
      }

      .floot_sty {
        box-shadow: 2px 2px 5px #e2e2e2;
        color: #fff;
        background: -webkit-linear-gradient(
          left,
          #33b6ff,
          #017ec2
        ); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(
          right,
          #33b6ff,
          #017ec2
        ); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(
          right,
          #33b6ff,
          #017ec2
        ); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #33b6ff, #017ec2);
      }
    }
  }
}

.collect,
.collect1 {
  position: fixed;
  top: 0.75rem;
  height: 0.5rem;
  line-height: 0.5rem;
  background-color: #ccc;
  color: #fff;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.22rem;
  z-index: 1000;
  border-radius: 0.3rem;
  padding: 0 0.2rem;
}
.collect1 {
  background-color: #fff !important;
  color: #017ec2;
}
</style>
