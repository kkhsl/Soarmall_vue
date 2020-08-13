<template>
  <div class="full_page">
    <publicHead :noHeadRight="true">
      <h6 slot="headCenter">{{$t("title.My Coupon")}}</h6>
    </publicHead>
    <mescroll-vue
      ref="mescroll"
      class="centerWrapNoFoot"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div class="coupon">
        <CouponStyle id="couponWrap" :items="lists" :poointNum="poointNum" :is_page="0"></CouponStyle>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: {
    MescrollVue,
    publicHead: () => import("@/whole/components/header/publicHead"),
    CouponStyle: () => import("@/module/coupon/coupon_style")
  },
  data() {
    return {
      lists: [],
      poointNum: 0,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        // use:false,
        callback: this.downCallback
      },
      mescrollUp: {
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 12 // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: "couponWrap", // 父布局的id;
          // icon: require('@/assets/img/other/wb.png'),
          btnClick: this.upBtnClick,
          btntext: "Go Back"
        },
        lazyLoad: {}
      }
    };
  },
  activated() {
    this.lists = [];
    this.mescroll.resetUpScroll();
  },
  methods: {
    upBtnClick() {
      this.$router.go(-1);
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    downCallback(mescroll) {
      this.lists = [];
      mescroll.resetUpScroll();
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.lists = [];
          // 把请求到的数据添加到列表
          console.log(arr);
          this.lists = this.lists.concat(arr);
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
      let listData_cou = [];
      let data = {
        currentPage: pageNum
      };
      this.$HTTP.buyer_coupon(data).then(res=>{
        if (res.code == 0) {
          this.poointNum = res.data.poointNum;
          if (res.data.couponList.length > 0) {
            listData_cou = res.data.couponList;
          }
        }
        successCallback(listData_cou);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon {
  padding: 0 0.3rem;
  box-sizing: border-box;
}
</style>
