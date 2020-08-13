<template>
  <div class="specialBox">
    <div class="specialHead">
      <div class="specialHeadL">
        <div class="specHeadImg">
          <imgCache
            src="https://photo.soarmall.com/banner/image/5ea4eb2a78051zosuC1A1Zq1bDCDXwuxl.png"
          ></imgCache>
        </div>
        <div class="specHeadTitle">
          <h6>{{speialTitle.title}}</h6>
          <div class="specHeadLine"></div>
          <div class="homeGayText">{{speialTitle.des}}</div>
        </div>
      </div>
      <div class="specialHeadR">
        <div class="specialMoreWrap" @click="toSecondNav(speialTitle.link,speialTitle.id)">
          <span>{{$t("common.more")}}</span>
        </div>
      </div>
    </div>
    <div class="specialWrap">
      <div class="swiper_di"></div>
      <homeSwipe :swipeItems="productInfo">
        <template v-slot:swipeItem="slotData">
          <div
            class="specialSwipeItem"
            @click="$router.push({ path: '/home/details', query: { id: slotData.swipeItem.goods_id } })"
          >
            <div class="imgWrap">
              <imgCache :src="slotData.swipeItem.goodsimaPath"></imgCache>
            </div>
            <div class="itemsMsg">
              <!-- <h6 class="itemsMsgName">{{slotData.swipeItem.goods_name}}</h6> -->
              <span class="currentPrice">
                <span>{{GLOBA.money_tag}}{{slotData.swipeItem.goods_current_price | integerNum}}</span>
                <span class="smallPrice">.{{slotData.swipeItem.goods_current_price | decimalNum}}</span>
              </span>
            </div>
          </div>
        </template>
      </homeSwipe>
    </div>
  </div>
</template>

<script>
// import vanCountDown from "vant/lib/count-down";
// import "vant/lib/count-down/style";
import imgCache from "@/whole/components/imgCache";
import homeSwipe from "./homeSwipe";
export default {
  props: ["speialTitle"],
  components: {
    // vanCountDown,
    homeSwipe,
    imgCache
  },
  data() {
    return {
      productInfo: []
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    toSecondNav(link, id) {
      this.$router.push({
        path: "/secondPage",
        query: {
          ...this.$route.query,
          type: link.type,
          value: link.value,
          navId: id
        }
      });
    },
    getProduct() {
      try {
        let historySeckill = JSON.parse(
          localStorage.getItem("newArriveList") || "[]"
        );
        this.productInfo = historySeckill;
      } catch (error) {}

      let postData = {
        language:
          (this.$route.query.lang || localStorage.getItem("language_s")) == "sa"
            ? 1
            : 0
      };
      this.$HTTP.index_discount(postData,{showLoading:false}).then(res => {
        if (res.code == 0 && res.data.goods_info) {
          let arr = [];
          res.data.goods_info.forEach((productItem, i) => {
            if (i < 10) {
              arr.push(productItem);
            } else {
              return false;
            }
          });
          this.productInfo = arr;
          try {
            localStorage.setItem("newArriveList", JSON.stringify(arr));
          } catch (error) {}
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.specialWrap {
  position: relative;
  padding: 0.3rem 0;
  .swiper_di {
    position: absolute;
    bottom: 0;
    left: 0.3rem;
    right: 0.3rem;
    height: 100%;
    box-shadow: inset 0px 15px 15px -15px #eee, inset 0px -15px 15px -15px #eee;
    z-index: 0;
  }
}
.specialSwipeItem {
  padding-bottom: 0.2rem;
  width: 2rem;
  display: inline-block;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 16px 8px -12px #eaeaea;
  .imgWrap {
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
.itemsMsg {
  text-align: center;
  span{
    display: inline-block;
  }
  .currentPrice {
    padding-top: 0.2rem;
  }
}
.itemsMsgName {
  font-family: "Calibri-Bold";
  font-weight: bold;
  font-size: 0.26rem;
  line-height: 0.5rem;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 1.6rem;
}
</style>