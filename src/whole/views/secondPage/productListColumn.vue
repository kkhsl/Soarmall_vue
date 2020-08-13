<template>
  <div class="full_page">
    <publicHead ref="publicHead">
      <h6 slot="headCenter" v-if="dataInfo">{{dataInfo.title}}</h6>
    </publicHead>
    <MescrollVue
      class="centerWrapNoFoot"
      ref="mescrollRef"
      :down="mescrollDownOptions"
      :up="mescrollUpOptions"
      @init="mescrollInit"
      id="mescrollId"
    >
      <div class="productsWrap">
        <div class="productListItem" v-for="(product, index) of productList" :key="index" @click="toProductDetail(product.id)">
          <div class="productImg">
            <img :src="product.image" alt />
          </div>
          <div class="productInfo">
            <div class="productName">{{product.name}}</div>
            <div class="productPrice">
              <div class="originalPrice">
                <span>{{GLOBA.money_tag}} {{product.goods_price | integerNum}}</span>
                <span>.{{product.goods_price | decimalNum}}</span>
              </div>
              <div class="currentPrice">
                <span>{{GLOBA.money_tag}} {{product.goods_current_price | integerNum}}</span>
                <span>.{{product.goods_current_price | decimalNum}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MescrollVue>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: { publicHead, MescrollVue },
  data() {
    return {
      lang: 'en',
      queryId: null, // 商品类别id
      dataInfo: null, //接口返回的所有数据
      productList: [], // 接口返回的商品列表
      mescroll: null, // mescroll实例对象
      mescrollDownOptions: {
        callback:this.downCallback
      },
      mescrollUpOptions: {
        noMoreSize: 5,
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20, // 每页数据的数量
        },
        empty: {
          warpId: 'mescrollId', // 父布局的id;
        }
      },
    };
  },
  activated(){
    this.lang = this.$route.query.lang == 'sa'? 1 : 0;
    if(this.queryId != this.$route.query.id){
      this.productList = []; // 清空列表
      this.queryId = this.$route.query.id;
      this.mescroll.resetUpScroll();// 刷新会调用下拉加载列表
    }
  },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 下拉刷新
    downCallback(mescroll) {
      mescroll.resetUpScroll();
    },
    upCallback(pageData, mescroll) {
      this.getProductList(
        pageData.num,
        successData => {
          this.dataInfo = successData;
          // 如果是第一页需手动制空列表
          if (pageData.num === 1) this.productList = [];
          // 把请求到的数据添加到列表
          this.productList = this.productList.concat(successData.goods_list);
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(successData.goods_list.length);
          });
        },
        () => {
          mescroll.endErr();
          // 联网异常,隐藏上拉和下拉的加载进度
        }
      );
    },
    async getProductList(currentPage, successCallback, errorCallback) {
      let res = await this.$PHP.get_goods(this.queryId);
      res.code == 0 ? successCallback(res.data) : successCallback([])
    },
    toProductDetail(id){
      this.$router.push({path: "/home/details",query: { id: id}})
    }
  },
};
</script>

<style lang="scss" scoped>
.productsWrap {
  padding: 0.2rem 0.2rem 0;
}
.productListItem {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.2rem;
  background-color: #fff;
  border-radius: 0.15rem;
}
.productName {
  font-size: 0.28rem;
  line-height: 0.3rem;
  color: #333;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.productPrice {
  display: flex;
  justify-content: space-between;
}
.productImg {
  height: 2.4rem;
  img {
    display: block;
    height: 100%;
  }
}
.productInfo {
  border-bottom: 1px solid #f1f1f1;
  padding: 0.1rem 0.2rem;
  width: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.originalPrice {
  text-decoration: line-through;
  color: #ccc;
}
</style>
