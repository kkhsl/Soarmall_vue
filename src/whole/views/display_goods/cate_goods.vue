<template>
  <div class="full_page">
    <publicHead :goSearch="true"></publicHead> 
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot paddingTop"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <Goods :items="items"></Goods>
    </mescroll-vue>

    <!-- 筛选弹框 -->
    <div class="tangkuang" v-show="tk_kz" @click.self="z_xs()">
      <div class="sx_content">
        <div class="filter_h">Filter</div>
        <div class="popry">
          <div class="pingpai" v-if="f_gb_list">
            <div class="pp_title">
              <p class="title_l">Brand</p>
              <p class="title_r" @click="brand_yc">
                <span
                  v-for="(brandname,index) in filter.brandname"
                  :key="index"
                >{{brandname.gb_name}}</span>
                <span class="img">
                  <img class="img1" src="@/assets/img/other/login/tx.png" v-if="filter.bd_id===0" />
                  <img class="img2" src="@/assets/img/other/xiangyou3.png" v-if="filter.bd_id===1" />
                </span>
              </p>
            </div>
            <div class="pp_conter" v-show="brand_y">
              <ul>
                <li
                  :class="{pp_xuanze:brand.v}"
                  v-for="(brand,index) in filter.brand"
                  :key="index"
                  @click="brand_bt(brand,index)"
                >{{brand.gb_name}}</li>
              </ul>
            </div>
          </div>
          <div class="pingpai" v-for="(property,index) in filter.propertylist" :key="index">
            <div class="pp_title" @click="prop_yc(property)">
              <p class="title_l">{{property.Property_name}}</p>
              <p class="title_r">
                <span v-for="(name,key) in property.name" :key="key">{{name + ";"}}</span>
                <span class="img">
                  <img class="img1" src="@/assets/img/other/login/tx.png" v-if="property.v" />
                  <img class="img2" src="@/assets/img/other/xiangyou3.png" v-if="!property.v" />
                </span>
              </p>
            </div>
            <div class="pp_conter" v-if="property.v">
              <ul>
                <li
                  :class="{pp_xuanze:v_info.v}"
                  v-for="(v_info, i) in property.v_info_value"
                  :key="i"
                  @click="Propname_bt(property,v_info,i)"
                >{{v_info.v_info}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="floot_button">
          <p class="Clear" @click="sx_quexiao">Clear All</p>
          <p class="floot_sty" @click="sx_queren">Apply</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MescrollVue from "@/plugins/scroll/mescroll";
import publicHead from "@/whole/components/header/publicHead";
import Goods from "@/whole/components/global/goods";
export default {
  components: { MescrollVue, publicHead, Goods },
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
        onScroll: this.onScroll,
        lazyLoad: {}
      },
      tk_kz: false,
      pdType: 0,
      items: [],
      keyworda: "",
      if_filter: false,
      f_gb_list: false,
      filter: {
        bd_id: 0,
        brand: [],
        brandname: [],
        propertylist: []
      },
      properties: "",

      front: []
      // if_mescroll:true
    };
  },
  mounted() {
    if (this.keyworda != this.$route.query.id) {
      this.keyworda = this.$route.query.id;
      this.items = [];
      this.mescroll.resetUpScroll();
    }
  },
  activated() {
    if (this.keyworda != this.$route.query.id) {
      this.keyworda = this.$route.query.id;
      this.items = [];
      this.mescroll.resetUpScroll();
    }
  },
  beforeRouteEnter(to, from, next) {
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
    z_xs() {
      this.tk_kz = false;
    },
    shai_xuan() {
      this.tk_kz = true;
      window.history.pushState(null, null, "#");
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
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
      // setTimeout(() => {
      var listData = [];
      let data = {
        brand_ids: "", //品牌id
        gs_ids: "", //商品规格
        properties: "", //属性
        all_property_status: "",
        detail_property_status: "",
        goods_type: "", //商品类型（自营）
        goods_inventory: "", //库存
        goods_transfee: "", //商品运费承担方式，0为买家承担，1为卖家承担
        goods_cod: "", //是否支持货到付款，默认为0：支持货到付款，-1为不支持货到付款
        gc_id: this.keyworda,
        currentPage: pageNum,
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      switch (pdType) {
        case 0:
          data.orderBy = "";
          data.orderType = "";
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
        case 5:
          data.properties = this.properties;
          break;
      }
      this.$HTTP.goods_list(data).then(res=>{
        if (res.code == 0) {
          if (res.data.goodslist.length > 0) {
            res.data.goodslist.forEach(item => {
              let so_you = {
                goodinventory: "",
                goods_price: item.goods_price,
                goodscurrprice: item.goods_current_price,
                goodsid: item.goodsid,
                goodsname: item.goods_name,
                main_photo_url: item.goods_main_photo,
                photos_url: "",
                store_price: "",
                vo_well_evaluate: item.well_evaluate,
                goods_collect: item.goods_collect
              };
              listData.push(so_you);
            });
            if (
              typeof res.data.gb_list != "undefined" &&
              res.data.gb_list != ""
            ) {
              this.f_gb_list = true;
              res.data.gb_list.forEach(item => {
                let gb_lis = {
                  gb_id: item.gb_id,
                  gb_name: item.gb_name,
                  gb_photo: item.gb_photo,
                  v: false
                };
                this.filter.brand.push(gb_lis);
              });
            }
            if (
              typeof res.data.propertylist != "undefined" &&
              res.data.propertylist != []
            ) {
              res.data.propertylist.forEach(item => {
                let propertylist = {
                  Property_id: item.Property_id,
                  Property_name: item.Property_name,
                  v_info_value: item.v_info_value,
                  name: [],
                  v: false
                };
                this.filter.propertylist.push(propertylist); //尺寸颜色。。。
              });
            }
          }
          if (
            this.filter.brand.length !== 0 &&
            this.filter.propertylist !== 0
          ) {
            this.if_filter = true;
          }
        }
        // 回调
        successCallback(listData);
      });
      // }, 500);
    },

    // 筛选
    brand_bt(brand, i) {
      brand.v = !brand.v;
      if (brand.v) {
        this.filter.brandname.push(brand);
      }
      if (!brand.v) {
        for (let n = 0; n <= this.filter.brandname.length; n++) {
          if (brand.gb_id == this.filter.brandname[n].gb_id) {
            this.filter.brandname.splice(n, 1);
          }
        }
      }
    },
    brand_yc() {
      this.brand_y = !this.brand_y;
      if (this.brand_y == false) {
        this.filter.bd_id = 1;
      }
      if (this.brand_y == true) {
        this.filter.bd_id = 0;
      }
    },
    prop_yc(item) {
      item.v = !item.v;
    },
    Propname_bt(prors, prop, i) {
      this.filter.propertylist.forEach(item => {
        if (item == prors) {
          item.v_info_value[i].v = !item.v_info_value[i].v;
          if (item.v_info_value[i].v) {
            item.name.push(prop.v_info);
          }
          if (!item.v_info_value[i].v) {
            for (let n = 0; n <= item.name.length; n++) {
              if (prop.v_info == item.name[n]) {
                item.name.splice(n, 1);
              }
            }
          }
        }
      });
    },
    // 取消刷选
    sx_quexiao() {
      this.tk_kz = false;
      this.filter.brand = [];
      this.filter.brandname = [];
      this.filter.propertylist = [];
    },
    sx_queren() {
      this.tk_kz = false;
      // 品牌筛选
      let brand_id = [];
      this.filter.brandname.forEach(item => {
        brand_id.push(item.gb_id);
      });
      //其他筛选
      this.properties = "";
      let properties_id = [];
      let properties_name = [];
      let properties_l = "";
      let properties_r = "";
      this.filter.propertylist.forEach(item => {
        if (item.name.length != 0) {
          properties_id.push(item.Property_id);
          properties_name.push(item.name);
          properties_l = "|";
          properties_r = ",";
        }
      });
      this.properties =
        properties_l + properties_id + properties_r + properties_name;
      this.pdType = 5;
      this.items = [];
      mescroll.resetUpScroll();
    }
  }
};
</script>

<style lang="scss" scoped>
.paddingTop {
  box-sizing: border-box;
  padding-top: 0.4rem;
}
.xue_title {
  padding-top: 0.2rem;
  background: #fff;
  margin-bottom: 0.2rem;
  flex-wrap: wrap;
  display: flex;
  box-sizing: border-box;
  .quan_conter {
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 0.4rem;
    margin-bottom: 0.2rem;
    padding: 0px 0.2rem 0.2rem 0.2rem;
    box-sizing: border-box;
    .img1 {
      width: 1rem;
      height: 1rem;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text1 {
      font-size: 0.26rem;
      text-align: center;
      font-weight: 400;
      margin-top: 0.1rem;
      font-family: "Calibri";
    }
  }
}
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
        /* margin-left: 0.1rem; */

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

.tangkuang {
  display: flex;
  justify-content: flex-end;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 3333;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  .sx_content {
    animation: myfirst 0.5s forwards ease;
    width: 6.3rem;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    font-size: 0.32rem;
    position: relative;
    @keyframes myfirst {
      0% {
        left: 7.5rem;
      }
      100% {
        left: 0.4rem;
      }
    }
    .filter_h {
      width: 100%;
      font-size: 0.56rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
      padding: 0 0.6rem;
      height: 1.6rem;
      line-height: 1.6rem;
    }
    .popry {
      width: 100%;
      height: 9rem;
      overflow: hidden;
      overflow-x: hidden;
      overflow-y: scroll;
    }
    .sx_title {
      border-bottom: 1px solid #ebebeb;
      padding: 0 0.6rem 0.4rem;
      box-sizing: border-box;
      p:nth-child(1) {
        font-family: "Calibri-Bold";
        font-weight: bold;
        margin-bottom: 0.36rem;
      }
      p:nth-child(2) {
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
      padding: 0 0.6rem;
      box-sizing: border-box;
      border-bottom: 1px solid #ebebeb;
      .pp_title {
        height: 1rem;
        line-height: 1rem;
        display: flex;
        justify-content: space-between;
        font-family: "Calibri-Bold";
        font-weight: bold;
        font-size: 0.36rem;
        .title_l {
          color: #333;
          width: 4rem;
        }
        .title_r {
          display: flex;
          width: 40%;
          justify-content: flex-end;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span {
            display: inline-block;
          }
          .img {
            margin-left: 0.3rem;
            width: 0.12rem;
            height: 100%;
            .img1 {
              width: 100%;
              margin: 0.44rem 0;
            }
            .img2 {
              width: 0.06rem;
              margin: 0.44rem 0;
            }
          }
        }
      }
      .pp_conter {
        width: 100%;
        padding-bottom: 0.4rem;
        ul {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          color: #333;
        }
        li {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        }
      }
    }

    .floot_button {
      margin-bottom: 0.3rem;
      padding: 0 0.6rem;
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #fff;
      p {
        width: 2.3rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        text-align: center;
        line-height: 0.8rem;
        font-size: 0.36rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        box-sizing: border-box;
      }
      .Clear {
        border: 1px solid #ccc;
        margin-right: 0.5rem;
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
.sales_active {
  background: #ccc;
}
</style>
