<template>
  <div class="full_page">
    <publicHead>
      <h6 slot="headCenter">{{$t("title.Wishlist")}}</h6>
    </publicHead>
    <div class="wishlist_box centerWrapNoFoot">
      <div class="wishlist_hear">
        <div :class="coms===0?'hear':'hear1'" @click="changeTab(0)">
          <p>{{$t("common.Products")}}</p>
        </div>
        <div :class="coms===1?'hear':'hear1'" @click="changeTab(1)">
          <p>{{$t("common.Shops")}}</p>
        </div>
      </div>

      <mescroll-vue
        ref="mescroll"
        :class="GLOBA.content_center"
        :down="mescrollDown"
        :up="mescrollUp"
        @init="mescrollInit"
      >
        <div id="dataList">
          <div class="wishlist_com_box" v-if="coms===0" ref="ccc">
            <div class="cont_box" v-for="(good,index) in goodsl" :key="index">
              <div class="wishlist_cont">
                <div class="imga" @click="toCardDetail(good.Goods_id)">
                  <img :imgurl="good.Goods_photo" src="@/assets/img/loader.png" />
                </div>
                <div class="marg cont">
                  <p
                    class="name line-clamp"
                    :class="{'ltr':GLOBA.isRotate}"
                    @click="toCardDetail(good.Goods_id)"
                  >{{good.Goods_name}}</p>
                  <p :class="GLOBA.florat_r" dir="ltr" class="pirc">
                    <span>{{GLOBA.money_tag}} {{good.Goods_current_price | integerNum}}</span>
                    <span class="decimal">.{{good.Goods_current_price | decimalNum}}</span>
                    <span
                      class="price"
                      v-if="good.Goods_price>good.Goods_current_price"
                    >{{GLOBA.money_tag}} {{good.Goods_price | integerNum}}.{{good.Goods_price | decimalNum}}</span>
                  </p>
                  <p class="wishlist">
                    <img src="@/assets/img/other/login/ax2.png" />
                    <span>{{good.Goods_collect}}</span>
                  </p>
                  <!-- <div class="tocart" @click="tabbar_btn(good)">
                <p class="bjtu"></p>
                <p>Add to cart</p>
                  </div>-->
                </div>
                <div class="chanchu wis_sc" @click="wishlist_delete(good.Goods_id,index)">
                  <img src="@/assets/img/other/shanchu.png" alt />
                </div>
              </div>
              <div class="lower" v-if="good.status">
                <p>{{$t("common.Off shelf")}}</p>
              </div>
            </div>
            <!-- <Noorder v-if="goodsl.length==0" :tishi="tsxx"></Noorder> -->
          </div>

          <div class="wishlist_sho_box" v-if="coms===1">
            <!-- 内容列表 -->
            <div class="cont_box shops" ref="del" v-for="(item,index) in goodsl" :key="index">
              <div class="shops_box" @click="store1(item.Store_id,item.Store_name)">
                <p class="img">
                  <img :imgurl="item.Store_photo" src="@/assets/img/loader.png" />
                </p>
                <p class="marg5 name line-blok-clamp">{{item.Store_name}}</p>
                
                <p class="chanchu sh_sc" @click.stop="sc_dianpu(item.Store_id,index)">
                  <img src="@/assets/img/other/shanchu.png" alt />
                </p>
              </div>
              <div class="lower" v-if="item.store_status != 15">
                <p>{{$t("common.Off shelf")}}</p>
              </div>
            </div>
            <!-- <Noorder v-if="goodsl.length==0" :tishi="tsxe"></Noorder> -->
          </div>
        </div>

        <!-- <maylike :likes = like></maylike> -->
      </mescroll-vue>
    </div>
    <Popout :cue_words="cue_words" @popout_btn="popout_btn" v-if="if_cue"></Popout>
    <Popout :cue_words="cue_words1" @popout_btn="popout_btn1" v-if="if_cue1"></Popout>
  </div>
</template>

<script>
import Noorder from "@/whole/components/order_return/Noorder";
import Popout from "@/whole/components/elastic/popout";
import maylike from "@/whole/components/global/may_like";
import publicHead from "@/whole/components/header/publicHead";
import MescrollVue from "@/plugins/scroll/mescroll";
import Toast from "@/assets/js/pop_up";
export default {
  components: { maylike, Popout, publicHead, MescrollVue, Noorder },
  data() {
    return {
      tocart_: false,
      goodsl: [],
      coms: 0,
      if_cue: false,
      if_cue1: false,
      cue_words: this.$t("message.You sure to cancel wishlist"),
      cue_words1: this.$t("message.You sure to cancel wishlist"),
      goodsid: "",
      stindex: "",
      storeid: "",
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
      }
    };
  },
  activated() {
    if (this.$route.meta.isBack) {
      this.goodsl = [];
      this.mescroll.resetUpScroll();
    }
    this.$route.meta.isBack = false;
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
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 切换菜单
    changeTab(type) {
      this.coms = type;
      this.goodsl = []; // 在这里手动置空列表,可显示加载中的请求进度
      this.mescroll.resetUpScroll(); // 刷新列表数据
      this.mescroll.scrollTo(0, 0);
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback(page, mescroll) {
      // 模拟联网
      this.getListDataFromNet(
        this.coms,
        page.num,
        page.size,
        arr => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.goodsl = [];
          // 把请求到的数据添加到列表
          this.goodsl = this.goodsl.concat(arr);
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
      let listData = [];
      if (pdType === 0) {
        // 商品收藏
        let data = {
          currentPage: pageNum,
          orderBy: "addTime",
          orderType: "desc",
          language: this.$route.query.lang === "sa" ? 1 : 0
        };
        this.$HTTP.favorite_goods(data).then(res=>{
          if (res.code == 0) {
            res.data.favoriteList.forEach(item => {
              if (item.Goods_status != 0) {
                item.status = true;
              } else if (item.Store_status != 15) {
                item.status = true;
              } else {
                item.status = false;
              }
              listData.push(item);
            });
          }
          // 回调
          successCallback(listData);
        });
      } else if (pdType === 1) {
        // 店铺收藏
        this.$HTTP.favorite_store().then(res=>{
          console.log(res);
          if (res.code == 0) {
            listData = res.data.favoriteMap;
          }
          // 回调
          successCallback(listData);
        });
      }
    },
    upBtnClick() {
      this.$router.push({ path: "/home" });
    },

    store1(id, name) {
      let dianpu = {};
      dianpu.store_id = id;
      dianpu.store_name = name;
      let to_data = {
        dianpu: dianpu,
        id: 1
      };
      this.$router.push({
        path: "/subpages/cate_goods02",
        query: { to_data: to_data }
      });
    },

    // 店铺删除
    async popout_btn1(id) {
      if (id == 0) {
        this.if_cue1 = false;
      }
      if (id == 1) {
        this.if_cue1 = false;
        let stindex = this.stindex;
        const data = {
          goods_id: "",
          store_id: this.storeid
        };
        let res = await this.$HTTP.favorite_store_d(data)
        if(res.code == 0){
          setTimeout(()=>{
            Toast({ message: "Success", time: 2000 });
          },500)
          this.changeTab(1);
          this.$refs.del[stindex].scrollLeft = 0;
        }
      }
    },
    sc_dianpu(id, index) {
      this.storeid = id;
      this.stindex = index;
      this.if_cue1 = true;
    },
    async popout_btn(id) {
      if (id == 0) {
        this.if_cue = false;
      }
      if (id == 1) {
        this.if_cue = false;
        const data = {
          goods_id: this.goodsid,
          store_id: ""
        };
        let res = await this.$HTTP.favorite_store_d(data)
        if(res.code == 0){
          setTimeout(()=>{
            Toast({ message: "Success", time: 2000 });
          },500)
          this.changeTab(0);
        }
      }
    },
    wishlist_delete(id, i) {
      this.if_cue = true;
      this.goodsid = id;
    },
    async toCardDetail(id) {
      const data = {
        id: id,
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.goods(data)
      if (res.code == 0) {
        this.$router.push({ path: "/home/details", query: { id: id } });
      }
    },
    // 加入购物车
    async tabbar_btn(good) {
      let data = {
        id: good.Goods_id,
        count: 1,
        price: good.Goods_current_price,
        gsp: "",
        buy_type: "",
        combin_ids: "",
        combin_version: ""
      };
      let res = await this.$HTTP.add_goods_cart(data)
      if (res.code == 0) {
        this.tocart_ = true;
        setTimeout(() => {
          this.tocart_ = false;
        }, 2000);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wishlist_box {
  // margin-top: 1.3rem;
  .wishlist_hear {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.3rem;
    box-sizing: border-box;
    .hear,
    .hear1 {
      width: 50%;
      line-height: 1rem;
      text-align: center;
      font-size: 0.3rem;
      color: #333;
      position: relative;
    }
    .hear1 {
      font-family: "Calibri";
      font-weight: 400;
      background-color: #f7f7f7;
    }
    .hear::after {
      position: absolute;
      bottom: 0;
      left: calc(50% - 0.2rem);
      content: "";
      width: 0.4rem;
      height: 0.02rem;
      background-color: #333;
    }
    .hear {
      background-color: #fff;
      font-family: "Calibri-Bold";
      font-weight: Bold;
    }
  }
}

.cont_box::-webkit-scrollbar {
  display: none;
}

.cont_box {
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;
  overflow-y: hidden;
  border-bottom: 1px solid #ebebeb;
  box-sizing: border-box;
  position: relative;
  .chanchu {
    width: 0.72rem;
    height: 100%;
    line-height: 2.2rem;
  
    img {
      width: 58%;
      vertical-align: middle
    }
  }
}
#dataList {
  padding: 0 0.3rem
 
  // width: calc(100% - 0.6rem);
}
.wishlist_com_box {
  .wishlist_cont {
    height: 2.2rem;
    width: 8.12rem;
    padding: 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;

    .imga {
      width: 1.6rem;
      height: 1.6rem;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    .cont {
      padding:0 0.3rem;
      width: 4.7rem;
      .name {
        font-family: "Calibri";
        font-size: 0.26rem;
        color: #333;
        font-weight: 400;
        overflow: hidden;
        line-height: 0.35rem;
        height: 0.7rem;
      }
      .pirc {
        font-family: "Calibri-Bold";
        font-size: 0.28rem;
        color: #333;
        font-weight: Bold;
        line-height: 0.4rem;
        display: flex;
        justify-content: flex-start;
        span {
          display: inline-block;
        }
        .price {
          font-size: 0.22rem;
          text-decoration: line-through;
          color: #999999;
          font-family: "Calibri";
          margin-left: 0.1rem;
        }
        .decimal {
          line-height: 0.3rem;
          font-size: 0.2rem;
        }
      }
      .tocart {
        margin-top: 0.1rem;
        font-family: "Calibri";
        font-size: 0.22rem;
        color: #017ec2;
        font-weight: 400;
        width: 2rem;
        height: 0.4rem;
        border-radius: 0.2rem;
        line-height: 0.38rem;
        border: 1px solid #017ec2;
        display: flex;
        justify-content: space-between;
        padding: 0 0.18rem;
        box-sizing: border-box;
        .bjtu {
          width: 0.22rem;
          height: 0.22rem;
          margin-top: 0.08rem;
          background: url(../../../../assets/img/other/addtocart.png) no-repeat;
          background-size: cover;
        }
      }
    }
  }
}
.wishlist {
  width: 1rem;
  height: 0.32rem;
  display: flex;
  justify-content: flex-start;
  img {
    height: 0.32rem;
    width: 0.32rem;
  }
  span {
    font-family: "Calibri";
    font-size: 0.24rem;
    display: block;
    line-height: 0.32rem;
    margin-left: 0.1rem;
  }
}
.wishlist_sho_box {
  .shops {
    
    box-sizing: border-box;
  }
  .shops_box {
    width: 100%;
    height: 2.2rem;
    line-height: 2.2rem;
    display: flex;
    justify-content: space-between;
    font-weight: Bold;
    line-height: 1.8rem;
    font-family: "Calibri-Bold";
    //  position: relative;
    .img {
      
      width: 1.2rem;
      height: 2.2rem;
      line-height: 2.2rem;
      box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
     
      position: relative;
      img {
        width: 100%;
        height: 1.2rem;
     
   
         vertical-align: middle;
      }
    }
    .name {
     
      font-size: 0.36rem;
      color: #333;
      display: flex;
      align-items: center;
    }
    // .new {
    //   margin-right: 0.5rem;
    //   margin-left: 0.3rem;
    //   font-size: 0.24rem;
    //   width: 0.6rem;
    //   color: rgba(51, 51, 51, 0.5);
    // }
  }
}

.lower {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(51, 51, 51, 0.6);
  z-index: 1;
  p {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    border: 1px solid #fff;
    width: 2rem;
    height: 1rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1rem;
    color: #fff;
    margin-top: 0.6rem;
    margin-left: 2.6rem;
  }
}
</style>
