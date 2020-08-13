<template>
  <div class="specialBox">
    <div class="discountHeadWrap">
      <div class="discountHead">
        <div class="discountHeadText">
          <h4>{{speialTitle.title}}</h4>
          <p class>{{speialTitle.des}}</p>
        </div>
        <div class="specialMoreWrap" @click="toSecondNav(speialTitle.link,speialTitle.id)">
          <span>{{$t("common.more")}}</span>
        </div>
      </div>
    </div>
    <div class="discountBox">
      <div class="discountList">
        <div
          class="discountItem"
          v-for="product of discountList"
          :key="product.goods_id"
          @click="$router.push({ path: '/home/details', query: { id: product.goods_id } })"
        >
          <div class="discountImg">
            <imgCache :src="product.goodsimaPath"></imgCache>
            <p class="ltr" v-if="product.goodsprice > product.goods_current_price">
              {{((product.goodsprice-product.goods_current_price)/product.goodsprice*100) | percentageNum}}%
              <span>off</span>
            </p>
          </div>
          <div class="discountMsg">
            <div class="discountName">{{product.goods_name}}</div>
            <span class="currentPrice">
              <span>{{GLOBA.money_tag}} {{product.goods_current_price | integerNum}}</span>
              <span class="smallPrice">.{{product.goods_current_price | decimalNum}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imgCache from "@/whole/components/imgCache";
export default {
  props: ["speialTitle"],
  components: { imgCache },
  data() {
    return {
      discountList: [],
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    async getProduct() {
      try {
        let historyDiscount = JSON.parse(
          localStorage.getItem("discountlist") || "[]"
        );
        this.discountList = historyDiscount;
      } catch (error) {}
      let postData = {
        orderBy: "goods_discount_rate",
        orderType: "desc",
        currentPage: 1,
        type: '',
        language:
          (this.$route.query.lang || localStorage.getItem("language_s")) == "sa"
            ? 1
            : 0,
      };
      let res = await this.$HTTP.index_discount(postData, {
        showLoading: false,
      });
      if (res.code == 0 && res.data.goods_info) {
        let arr = [];
        res.data.goods_info.forEach((productItem, i) => {
          if (i < 6) {
            arr.push(productItem);
          } else {
            return false;
          }
        });
        this.discountList = arr;
        try {
          localStorage.setItem("discountlist", JSON.stringify(arr));
        } catch (error) {}
      }
      console.log(this.discountList);
    },
    toSecondNav(link, id) {
      this.$router.push({
        path: "/secondPage",
        query: {
          ...this.$route.query,
          type: link.type,
          value: link.value,
          navId: id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.discountHeadWrap {
  height: 1.9rem;
  background: url(~@/assets/img/home/discountBj.png) no-repeat;
  background-size: cover;
}
.discountHead {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: #fff;
  padding: 0.2rem 0.3rem 0;
}
.discountHeadText {
  h4 {
    font-size: 0.36rem;
    line-height: 0.6rem;
    font-family: "Calibri-Bold";
  }
  p {
    font-size: 0.18rem;
    white-space: nowrap;
    max-width: 6rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.specialMoreWrap {
  color: #fff;
}
.discountBox {
  margin-top: -0.5rem;
  padding: 0 0.3rem;
}
.discountList {
  background-color: #fff;
  padding: 0.15rem;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 5px 8px 10px -2px #ccc;
}
.discountItem {
  width: 1.9rem;
  padding: 0.15rem;
}
.discountImg {
  width: 1.9rem;
  height: 1.9rem;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  img {
    max-width: 100%;
  }
  p{
    position: absolute;
    top: 0.48rem;
    left: -0.38rem;
    height: 0.32rem;
    width: 1.26rem;
    text-align: end;
    background: url('~@/assets/img/other/biaoqian.png') no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    color: #fff;
    font-size: 0.24rem;
    font-family: "Calibri";
    font-weight: 400;
    line-height: 0.32rem;
    transform: rotate(-90deg);
    padding-right: 0.04rem;
    box-sizing: border-box;
  }
}
.discountName {
  margin: 0.1rem 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 0.62rem;
  width: 100%;
  line-height: 0.31rem;
  font-size: 0.26rem;
  font-weight: 400;
  font-family: "Calibri";
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #333;
  overflow: hidden;
}
</style>