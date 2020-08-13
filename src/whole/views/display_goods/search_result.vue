<template>
  <div class="full_page">
    <publicHead>
      <router-link to="/subpages/search/search" slot="headCenter" class="search_">
        <img src="@/assets/img/other/ss.png" />
        <p style="color:red;">{{key_worda}}</p>
      </router-link>
    </publicHead>
    <!-- <div class="so_conter">
      <ul class="so_xuanze">
        <li @click="changeTab(0)">
          <p>{{$t("common.General")}}</p>
          <p class="marg001 mark_img">
            <img src="@/assets/img/other/login/tx.png" alt />
          </p>
        </li>
        <li class="sales_line">
          <p>{{$t("common.Sales")}}</p>
          <p class="marg001 mark_img">
            <img src="@/assets/img/other/login/tx.png" alt />
          </p>
          <p class="sales_btn" v-if="sales_if === 0" @click="changeTab(1)"></p>
          <p class="sales_btn" v-else-if="sales_if === 1" @click="changeTab(2)"></p>
        </li>
        <li>
          <p>{{$t("common.Price")}}</p>
          <p class="marg001 mark_img">
            <img src="@/assets/img/other/login/tx.png" alt />
          </p>
          <p class="sales_btn" v-if="price_if === 0" @click="changeTab(3)"></p>
          <p class="sales_btn" v-else-if="price_if === 1" @click="changeTab(4)"></p>
        </li>
      </ul>
    </div> -->

    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    > 
      <Goods :items='items'></Goods>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "@/plugins/scroll/mescroll";
import publicHead from "@/whole/components/header/publicHead";
import Goods from "@/whole/components/global/goods";
export default {
  components: { MescrollVue, publicHead,Goods },
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
          tip:"The search is empty",
          btntext:"GO →",
          btnClick: this.upBtnClick
        },
        lazyLoad: {}
      },
      pdType: 0,
      sales_if: 0,
      price_if: 0,
      items: [],
      keyworda: "",
      key_worda:"",
      rtl_:"ltr",
    };
  },
  created() {
  },
  activated() {
    
   this.key_worda = this.$route.query.keyword;
    if(this.$route.query.an){
      this.key_worda = this.$route.query.an
    }
    let arregex = /[\u0600-\u06FF]/;//阿拉伯语
      if(arregex.test(this.key_worda)){
        this.rtl_ = "rtl"
      }else{
        this.rtl_ = "ltr"
      }
    if (this.$route.meta.isBack &&  this.keyworda != this.$route.query.keyword) {
        this.keyworda = this.$route.query.keyword;
        this.items = [];
        this.mescroll.resetUpScroll();
    }
    // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    this.$route.meta.isBack = false;
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === "Search" || from.name === "HomeCont") {
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
      setTimeout(() => {
        var listData = [];
        let data = {
          orderBy: "",
          orderType: "",
          goods_type: "",
          goods_inventory: "",
          goods_transfee: "",
          goods_cod: "",
          searchType: "",
          keyword: this.keyworda, //关键字查询
          currentPage: pageNum,
          gc_id: ""
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
        this.$HTTP.search(data).then(res=>{
          if (res.code == 0) {
            if (typeof res.data.lucen != "undefined") {
              res.data.lucen.forEach(item => {
                let so_you = {
                  goodinventory: item.goodinventory,
                  goods_price: item.goods_price,
                  goodscurrprice: item.goodscurrprice,
                  goodsid: item.goodsid,
                  goodsname: item.goodsname,
                  main_photo_url: item.main_photo_url,
                  photos_url: item.photos_url,
                  store_price: item.store_price,
                  vo_well_evaluate: item.vo_well_evaluate,
                   goods_collect:item.goods_collect
                };
                listData.push(so_you);
              });
            }
          }
          // 回调
          successCallback(listData);
        });
      }, 500);
    },

    upBtnClick() {
      this.$router.push({ path: "/home" });
    }
  }
};
</script>

<style lang="scss" scoped>
.centerWrapNoFoot{
  padding-top: 0.2rem;
  box-sizing: border-box;
}
</style>
