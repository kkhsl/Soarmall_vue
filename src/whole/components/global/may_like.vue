<template>
  <div class="maylike">
    <!-- 猜你喜欢start -->
    <div class="Commodity_box" v-if="likes.length>0">
      <div class="Commodity_title">{{$t("common.All For You")}}</div>
      <Goods :items="likes"></Goods>
    </div>
    <!-- 猜你喜欢end -->
  </div>
</template> 

<script>
import Goods from "@/whole/components/global/goods";
export default {
  components: { Goods },
  data() {
    return {
      Pages: 1,
      likes: []
    };
  },
  methods: {
    async like_goods({currentPage,productId}, callback) {
      if (currentPage == 1) {
        this.likes = [];
      }
      if (this.Pages < currentPage) {
        callback("[]");
      } else {
        let likegood = {
          currentPage: currentPage,
          orderBy: "",
          orderType: "",
          goods_id: productId || '',
          language: this.$route.query.lang === "sa" ? 1 : 0
        };
        let res = await this.$HTTP.likegoods(likegood,{showLoading:false});
        if (res.code == 0) {
          this.Pages = res.data.Pages;
          if (res.data.result.length > 0) {
            res.data.result.forEach(item => {
              //  let img = new Image();
              //   img.src = item.goods_photo;
              let so_you = {
                goodinventory: item.goodinventory,
                goods_price: item.goods_price,
                goodscurrprice: item.goods_current_price,
                goodsid: item.goods_id,
                goodsname: item.goods_name,
                // goods_photo:img, //main_photo_url
                main_photo_url: item.goods_photo,
                photos_url: item.photos_url,
                store_price: item.store_price,
                well_evaluate: item.vo_well_evaluate,
                goods_discount_rate:
                  ((item.goods_price - item.goods_current_price) /
                    item.goods_price) *
                  100,
                goods_type: item.goods_type,
                store_logo: item.store_logo,
                goods_collect: item.goods_collect
              };
              this.likes.push(so_you);
            });
            //  this.checkImgComplete()
            callback(this.likes);
          } else {
            callback("[]");
          }
        }else{
          callback("[]");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Commodity_box {
  width: 100%;
  padding-bottom: 0.3rem;
  box-sizing: border-box;
  .Commodity_title {
    font-size: 0.36rem !important;
    height: 1rem;
    line-height: 1rem;
    width: 100%;
    font-weight: 600;
    padding: 0 0.3rem;
    box-sizing: border-box;
  }
}
</style>
