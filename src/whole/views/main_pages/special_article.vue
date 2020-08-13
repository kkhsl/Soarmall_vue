<template>
  <div class="full_page">
    <publicHead ref="publicHead">
      <h6 slot="headCenter">{{$t("title.Article")}}</h6>
    </publicHead>
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div class="art_box">
        <div class="art_img">
          <img :src="item.article_acc" />
        </div>
        <div class="art_conter">
          <div>
            <div class="art_title" dir="ltr">{{item.title}}</div>
            <!-- <div class="art_xinxi">
            <p></p>
            <p>Gibson</p>
            <p>31.7.2019</p>
            </div>-->
            <div class="art_text" v-html="item.articlecontent" dir="ltr"></div>
          </div>

          <div>
            <ul>
              <div class="art_wl" v-for="(good,index) in items" :key="index">
                <div class="imga" @click="details(good.goodsid)">
                  <img :imgurl="good.goodsimg" :src="GLOBA.loading" />
                </div>
                <div class="cont">
                  <p class="cont_name line-clamp" @click="details(good.goodsid)" :class="{'ltr':good.goodsname.substring(0,1)!=='^'}">{{good.goodsname.substring(0,1)==='^'?good.goodsname.substring(1):good.goodsname}}</p>
                  <div>
                    <div
                      @click="details(good.goodsid)"
                      class="good_price"
                    >
                    <!-- <span @click="tocart(good.goodsid,good.goods_current_price)" v-if="good.goods_inventory !== 0">
                  <img src="@/assets/img/other/addtocart.png" alt />Add to cart
                    </span>-->
                  <span>{{GLOBA.money_tag}}&nbsp;&nbsp;{{good.goods_current_price | integerNum}}</span>
                  <span>.{{good.goods_current_price| decimalNum}}</span>
                </div>
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
        <!-- 猜你喜欢start -->
        <maylike ref="like"></maylike>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Toast from "@/assets/js/pop_up";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: {
    publicHead,
    MescrollVue,
    maylike: () => import("@/whole/components/global/may_like")
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20 // 每页数据的数量
        },
        toTop: {},
        empty: {},
        lazyLoad: {}
      },
      currentId: '',
      item: {},
      items: []
    };
  },
  activated() {
    if (this.$route.query.id != this.currentId) {
      this.currentId = this.$route.query.id;
      this.discoveryInfo();
      this.mescroll.scrollTo(0, 0);
      this.mescroll.resetUpScroll();
    }
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
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
      setTimeout(() => {
        this.$refs.like.like_goods({currentPage:pageNum}, res => {
          successCallback(res);
        });
      }, 600);
    },

    async discoveryInfo() {
      let goods_list = [];
      let res = await this.$HTTP.discovery_info({param: this.$route.query.id});
      if (res.code == 0) {
        this.item = res.data;
        res.data.article_goods.forEach(good => {
          good.forEach(item => {
            goods_list.push(item);
          });
        });
        this.items = goods_list;
      }
    },
    async tocart(id, price) {
      let data = {
        goods_id: id,
        count: 1,
        price: price,
        gsp: "",
        buy_type: "",
        combin_ids: "",
        combin_version: "",
        user_id: "",
        cart_mobile_ids: ""
      };
      let res = await this.$HTTP.add_goods_cart(data)
      if (res.code == -100) {
        localStorage.setItem("Flag", " ");
        this.$router.push({
          path: "/account/login"
        });
      } else if (res.code == 0) {
        this.isspec = false;
        Toast({
          message: "Added to the cart, for payment",
          time: 2000,
          i: 0
        });
        this.$refs.publicHead.getCartNum();
      } else if (res.code == 3) {
        Toast({ message: "Inventory is 0", time: 2000, i: 1 });
      } else {
        Toast({ message: "Add product error", time: 2000, i: 1 });
      }
    },
    details(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    }
  }
};
</script>

<style lang="scss" scoped>
.art_img {
  width: 100%;
  min-height: 2rem;
  img {
    width: 100%;
  }
}
.art_conter {
  width: 100%;
  padding: 0.3rem;
  box-sizing: border-box;

  .art_title {
    width: 6.06rem;
    height: 0.7rem;
    line-height: 0.34rem;
    font-size: 0.32rem;
    font-weight: bold;
    font-family: "Calibri-Bold";
  }
  .art_xinxi {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    font-size: 0.32rem;
    margin: 0.24rem 0 0.3rem 0;
    p:nth-child(1) {
      box-shadow: 2px 2px 5px #e2e2e2;
      width: 0.64rem;
      height: 0.64rem;
      background: #ccc;
      border-radius: 50%;
    }
    p:nth-child(2) {
      font-size: 0.28rem;
      font-weight: bold;
      font-family: "Dutch801BT-Bold";
      margin: 0 0.3rem;
      line-height: 0.64rem;
    }
    p:nth-child(3) {
      font-size: 0.24rem;
      font-weight: 100;
      font-family: "Calibri-Light";
      line-height: 0.64rem;
      color: #999999;
    }
  }
  .art_text {
    margin-top: 0.3rem;
    width: 100%;
    font-size: 0.28rem;
    font-family: "Calibri";
    font-weight: 400;
    width: 100%;
  }
  .art_text ::v-deep img {
    width: 100%;
  }

  .art_wl {
    font-size: 0.32rem;
    width: 100%;
    height: 1.7rem;
    background: #fff;
    margin: 0.3rem 0 0.2rem 0;
    display: flex;
    justify-content: flex-start;
    .imga {
      width: 1.6rem;
      height: 100%;
      margin-right: 0.3rem;
      padding: 0.06rem;
      box-sizing: border-box;
      // text-align: end;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    .cont {
      width: 66%;
      display: flex;
      flex-direction: column;
      .cont_name {
        width: 100%;
        height: 52%;
        line-height: 0.3rem;
        font-size: 0.26rem;
        font-family: "Calibri";
        font-weight: 400;
        color: #333;
        padding-top: 0.3rem;
        box-sizing: border-box;
      }
      p:nth-child(2) {
        height: 50%;
        display: flex;
        justify-content: space-between;
        line-height: 0.8rem;
        span {
          display: inline-block;
        }
        span:nth-child(1) {
          font-size: 0.28rem;
          font-family: "Calibri-Bold";
          font-weight: bold;
          height: 0.22rem;
          line-height: 0.22rem;
          margin-top: 0.4rem;
          span:nth-child(2) {
            font-size: 0.2rem;
          }
        }
        span:nth-child(2) {
          width: 2rem;
          height: 0.4rem;
          border: 1px solid #017ec2;
          border-radius: 0.4rem;
          font-size: 0.22rem;
          color: #017ec2;
          line-height: 0.4rem;
          margin-top: 0.2rem;
          img {
            width: 0.2rem;
            height: 0.2rem;
            margin: 0 0.2rem;
          }
        }
      }
    }
  }
}
.good_price{
  line-height: 0.8rem;
  height: 0.8rem;
  span:nth-child(2){
    line-height: 0.4rem;
    vertical-align: 0.2rem;
    font-size: 0.2rem

  }
}
</style>
