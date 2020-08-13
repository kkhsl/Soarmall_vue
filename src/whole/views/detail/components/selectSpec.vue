<template>
  <div class="specWrap">
    <swiper :options="swiperOption_" class="swiperWrapSpec" ref="mySwiper">
      <swiperSlide
        v-for="(photo,index) in countProductInfo.goods_photo"
        :key="index"
        class="swiperItemSpec"
      >
        <img v-lazy="photo.photo" />
      </swiperSlide>
      <template v-slot:pagination>
        <div class="paginationSwiper"></div>
      </template>
    </swiper>
    <div class="specMain">
      <div class="specTitle">
        <div class="specTitleLeft">
          <img class="imga" src="@/assets/img/other/size.png" alt />
          <div class="gu_price">
            <p
              class="blodPrice"
            >{{GLOBA.money_tag}} {{countProductInfo.goods_current_price | keeptwoNum}}</p>
            <p
              class="smallPrice"
              v-if="countProductInfo.goods_price > countProductInfo.goods_current_price"
            >{{GLOBA.money_tag}} {{countProductInfo.goods_price | keeptwoNum}}</p>
          </div>
          <div
            class="goods_Price_count"
            v-if="countProductInfo.goods_price > countProductInfo.goods_current_price"
          >
            <span
              class="wcs"
            >{{((countProductInfo.goods_price-countProductInfo.goods_current_price)/countProductInfo.goods_price*100) | percentageNum}}%</span>
            <span class="wcsm">off</span>
          </div>
        </div>
        <div class="closeSpecBtn" @click="closeSelectSpecFn">
          <img src="@/assets/img/other/cols.png" alt />
        </div>
      </div>
      <div class="specListWrap" v-if="productSpec">
        <!-- 颜色规格 -->
        <div class="specList" v-if="productSpec.color.length">
          <div class="specListTitle">Color：</div>
          <div class="specListItem">
            <div
              class="specItem"
              v-for="(colorItem, index) of productSpec.color"
              :key="index"
              :class="{'active':currentSpec.color.selectIndex == index}"
              @click="changeColorSpecFn(colorItem,index)"
            >{{colorItem.value}}</div>
          </div>
        </div>
        <!-- 其他规格遍历 -->
        <template v-if="productSpec.spec_info.length">
          <div class="specList" v-for="(specType, index) of productSpec.spec_info" :key="index">
            <div class="specListTitle">{{specType.spec_name}}</div>
            <div class="specListItem">
              <div
                class="specItem"
                v-for="(specItem, i) of specType.gsp_list"
                :key="i"
                :class="{'active':currentSpec.otherSpec[index] && currentSpec.otherSpec[index].selectIndex == i}"
                @click="changeOtherSpecFn(specType,index,i)"
              >{{specItem.gsp_value}}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="countWrap">
        <div>Count：</div>
        <Stepper v-model="currentSpec.count" :max="currentSpec.maxCount" disable-input class="vantCount"></Stepper>
        <div
          class="blodPrice"
        >{{GLOBA.money_tag}} {{countProductInfo.goods_current_price*currentSpec.count | keeptwoNum}}</div>
      </div>
      <div class="specBtnWrap">
        <div class="confirmBtn" v-click="specConfirmFn">{{$t("common.Confirm")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Stepper, Toast, ImagePreview } from "vant";
export default {
  props: ["goodsInfo", "detaultSpec"],
  components: { swiper, swiperSlide, Stepper, Toast },
  data() {
    return {
      countProductInfo: {}, // // 计算规格之后的返回对象
      currentSpec: {
        // 当前选择的规格下标
        color: {
          // selectIndex:0
        },
        otherSpec: [],
      },
      swiperOption_: {
        zoom: true,
        initialSlid: 0,
        preventClicksPropagation: false,
        pagination: {
          el: ".paginationSwiper",
          type: "fraction",
        },
        on: {
          click: (e) => {
            let currentIndex = this.$refs.mySwiper.swiper.realIndex;
            let images = [];
            this.countProductInfo.goods_photo.forEach((item) => {
              images.push(item.photo);
            });
            this.openImgView(images, currentIndex);
          },
        },
      },
      selectImgViewInstance: null,
    };
  },
  activated() {
    this.currentSpec = JSON.parse(JSON.stringify(this.detaultSpec)); // 每次进来都拿父组件传过来的下标索引
    this.getProductSpec();
  },
  mounted() {
    this.currentSpec = JSON.parse(JSON.stringify(this.detaultSpec)); // 每次进来都拿父组件传过来的下标索引
    this.getProductSpec();
  },
  methods: {
    async getProductSpec() {
      let specStr = [];
      this.currentSpec.otherSpec.forEach((item, index) => {
        // 获取默认选择规格的id
        specStr.push(
          this.productSpec.spec_info[index].gsp_list[item.selectIndex].gsp_id
        );
      });
      let postInfo = {
        id: this.productId,
        gsp: specStr.join(","),
        color: this.productSpec.color.length?this.productSpec.color[this.currentSpec.color.selectIndex].value : '',
      };
      let res = await this.$HTTP.goods_gsps(postInfo);
      if (res.code == 0) {
        this.countProductInfo = res.data.spec_map; // 计算规格之后的价格属性
      }
    },
    changeColorSpecFn(specItem, index) {
      // 颜色规格选择
      if (index == this.currentSpec.color.selectIndex) return;
      this.currentSpec.color.selectIndex = index;
      this.currentSpec.color.value = specItem.value;
      console.log(specItem, this.currentSpec)
      this.getProductSpec();
    },
    changeOtherSpecFn(specItem, index, i){
      // 其他规格选择
      if (i == this.currentSpec.otherSpec[index].selectIndex) return;
      this.currentSpec.otherSpec[index].selectIndex = i;
      this.currentSpec.otherSpec[index].spec_name = specItem.spec_name;
      this.currentSpec.otherSpec[index].gsp_value = specItem.gsp_list[i].gsp_value;
      this.currentSpec.otherSpec[index].gsp_id = specItem.gsp_list[i].gsp_id;
      console.log(specItem, this.currentSpec)
      this.getProductSpec();
    },
    specConfirmFn() {
      this.$emit("specConfirm", this.currentSpec); // 父组件触发关闭 赋值

      if (this.currentSpec.btnType == "toCart") {
        this.$emit("addToCart", this.addCartPostData); // 加入购物车
      }
      if (this.currentSpec.btnType == "buyNow") {
        this.$emit("buyNow", this.buyNowPostData); // 确认规格立即购买
      }
      if (this.currentSpec.btnType == "webBuyNow") {
        this.$emit("webBuyNowSpec", this.buyNowPostData); // 确认规格立即购买
      }
    },
    closeSelectSpecFn() {
      this.$emit("closeSelectSpecFn");
    },
    openImgView(arr, i) {
      this.selectImgViewInstance = ImagePreview({
        closeOnPopstate: true,
        images: arr,
        startPosition: i,
        onClose: () => {},
      });
    },
  },
  computed: {
    productId() {
      return this.goodsInfo.goods.goodsid;
    },
    productSpec() {
      return this.goodsInfo.spec;
    },
    addCartPostData() {
      let orderArr = [];
      this.currentSpec.otherSpec.forEach((specItem, index) => {
        //当前选择的规格项遍历
        // this.productSpec.spec_info[index].gsp_list 当前选择规格项的下标个list
        orderArr.push(
          this.productSpec.spec_info[index].gsp_list[specItem.selectIndex]
            .gsp_id
        );
      });
      let colorVal = this.productSpec.color.length?this.productSpec.color[this.currentSpec.color.selectIndex]
        .value : '';
      return {
        goods_id: this.productId,
        count: this.currentSpec.count,
        price: this.countProductInfo.goods_current_price,
        gsp: orderArr.join(","),
        buy_type: "",
        combin_ids: "",
        combin_version: "",
        user_id: "",
        cart_mobile_ids: "",
        color: colorVal,
      };
    },
    buyNowPostData() {
      let orderArr = [];
      this.currentSpec.otherSpec.forEach((specItem, index) => {
        //当前选择的规格项遍历
        // this.productSpec.spec_info[index].gsp_list 当前选择规格项的下标个list
        orderArr.push(
          this.productSpec.spec_info[index].gsp_list[specItem.selectIndex]
            .gsp_id
        );
      });
      let colorVal = this.productSpec.color.length?this.productSpec.color[this.currentSpec.color.selectIndex]
        .value : '';
      return {
        id: this.productId,
        gsp: orderArr.join(","),
        color: colorVal,
        count: this.currentSpec.count,
        type: this.currentSpec.isGetFree?'get':'', // 判断是否为兑换
        language: this.$route.query.lang === "sa" ? 1 : 0,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.specWrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 9;
}
.swiperWrapSpec {
  height: 50%;
  box-shadow: 0 0 10px 2px #ccc;
}
.swiperItemSpec {
  img {
    width: 100%;
    display: block;
  }
}
.paginationSwiper {
  position: absolute;
  left: auto;
  right: 0;
  bottom: 0;
  background-color: #d1cfd2;
  width: 1rem;
  height: 0.48rem;
  line-height: 0.48rem;
  color: #fff;
  font-family: "Calibri";
  font-size: 0.24rem;
  z-index: 1;
  text-align: center;
}

.specMain {
  height: 50%;
}
.specTitle {
  height: 1rem;
  padding: 0 0.2rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f7f7f7;
  box-sizing: border-box;
}
.specTitleLeft {
  display: flex;
  align-items: center;
  .imga {
    width: 0.33rem;
  }
}
.gu_price {
  padding: 0 0.2rem;
}
.blodPrice {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  color: #333;
  line-height: 0.6rem;
}
.smallPrice {
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.24rem;
  color: #999;
  text-decoration: line-through;
  line-height: 0.1rem;
  height: 0.2rem;
}
.goods_Price_count {
  color: #fff;
  font-size: 0.24rem;
  line-height: 0.32rem;
  font-family: "Calibri";
  width: 1.28rem;
  height: 0.32rem;
  text-align: center;
  background: url("~@/assets/img/other/biaoqian.png") no-repeat;
  background-size: cover;
  .wcs {
    padding: 0 0.08rem;
  }
}
.closeSpecBtn {
  padding: 0.2rem;
  display: flex;
  align-items: center;
  img {
    width: 0.24rem;
    display: block;
  }
}
.specListWrap {
  width: 100%;
  height: calc(100% - 3rem);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.specList {
  padding: 0.1rem;
}
.specListTitle {
  line-height: 0.6rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
  color: #333;
}
.specListItem {
  padding: 0 0.2rem;
}
.specItem {
  display: inline-block;
  height: 0.5rem;
  padding: 0 0.3rem;
  text-align: center;
  line-height: 0.5rem;
  margin: 0 0.2rem 0.2rem 0;
  border-radius: 0.3rem;
  border: 1px solid #d7d7d7;
}
.specItem.active {
  border: 1px solid #017ec2;
  background-color: #017ec2;
  color: #fff;
}
.countWrap {
  height: 1rem;
  display: flex;
  align-items: center;
  padding: 0 0.3rem;
  border-top: 1px solid #f7f7f7;
  .blodPrice {
    padding: 0 0.2rem;
  }
}
.specBtnWrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.3rem;
}
.confirmBtn {
  width: 3rem;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  background-color: #017ec2;
  color: #fff;
  font-size: 0.36rem;
}
</style>
