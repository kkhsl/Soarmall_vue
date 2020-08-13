<template>
  <div class="commodity_pro_rev">
    <div class="pro_rev">
      <div v-for="(titleItem,index) of titleArr" :key="index" @click="currentTitle = index">
        <p :class="index==currentTitle?'hear1':'hear'">{{titleItem}}</p>
        <p class="dixian" v-if="index==currentTitle"></p>
      </div>
    </div>
    <!-- 商品详情 -->
    <div class="commodity_pro" v-show="currentTitle===0">
      <div class="detailText" :class="{'hideMore': hasMoreDetails}">
        <div class="textWrap" ref="textWrap" v-html="productDetailText" :class="[{'ltr':goodsInfoGoods.goods_character_detail.substr(0,1) !== '^'},{'showMore':!moreDetailsCheck}]"></div>
        <div class="moreDetails" v-show="hasMoreDetails"><span @click="moreDetailFn">{{moreDetailsCheck?$t('title.Unfold') : $t('title.Put away')}}<img :class="{'pullUp':!moreDetailsCheck}" src="@/assets/img/other/xiangzuo.png"/></span></div>
      </div>
      <div class="detailImg" v-html="productDetailImg"></div>
    </div>
    <!-- 好评率 -->
    <div class="commodity_rev" v-show="currentTitle===1">
      <div class="no_data" v-if="goodsInfoGoods.eva_all_count === 0">{{$t("common.No data")}}</div>
      <div class="rev_her" v-if="goodsInfoGoods.eva_all_count !== 0">
        <div class="rev_her_t" @click="rev_p(goodsInfoGoods.goodsid)">
          <div class="rev_her_t_l">
            <span>{{goodsInfoGoods.eva_all_count}}</span>
            <span>{{$t("common.Reviews")}}</span>
          </div>
          <div class="rev_her_t_r">
            <p class="points">Favorable rate:</p>
            <p class="well_eva">{{goodsInfoGoods.well_evaluate*100}}%</p>
            <p class="datb rightIconRow"></p>
          </div>
        </div>
      </div>
      <div class="pj_conter">
        <div class="pj_xh" v-for="(item,index) in productEvalist" :key="index" v-show="index<2">
          <div class="pj_xx">
            <div class="uses">
              <p class="imga">
                <img v-lazy="item.user_photo" />
              </p>
              <div class="eva_username">
                <p>{{item.eva_userName}}</p>
                <p class="feedback">
                  <span :style="{width:item.eva_buyer_val/5*100 + '%' }"></span>
                </p>
              </div>
            </div>
            <p class="ev_time">{{item.evaaddtime}}</p>
          </div>
          <div class="pj_text eva_info">{{item.eva_info}}</div>
          <div class="pj_img">
            <img
              v-for="(img,index) in item.eva_photo"
              :key="index"
              v-lazy="img.Evaluate_photos"
              @click="review_image(item.eva_photo,index)"
            />
          </div>
          <div class="time">add review{{item.eva_addTime}}</div>
          <div class="pj_text">{{item.eva_add_info}}</div>
          <div class="pj_img">
            <img
              v-for="(img,e) in item.eva_add_photo"
              :key="e"
              v-lazy="img.Evaluate_photos"
              @click="review_image(item.eva_add_photo,e)"
            />
          </div>
        </div>
      </div>
      <div class="pj_more" @click="rev_p(goodsInfoGoods.goodsid)" v-if="goodsInfoGoods.eva_all_count">
        {{$t("common.View More")}}(
        <span>{{goodsInfoGoods.eva_all_count}}</span>
        {{$t("common.Reviews")}})
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["goodsInfoGoods",'productEvalist'],
  data() {
    return {
      titleArr:[this.$t("common.DESCRIPTION"),this.$t("common.REVIEW")],
      currentTitle: 0,
      hasMoreDetails: false,
      moreDetailsCheck: false,
      currentGoodsId: null
    };
  },
  computed: {
    productDetailText() {
      if(this.currentGoodsId != this.goodsInfoGoods.goodsid){ // 写在计算属性里面 只要是父组件数据变化都会跟新视图
        this.currentGoodsId = this.goodsInfoGoods.goodsid
        this.moreDetailsCheck = true;
        this.hasMoreDetails = false;
        this.$nextTick(()=>{
          setTimeout(()=>{
            if(this.$refs.textWrap&&this.$refs.textWrap.clientHeight>70){
              this.hasMoreDetails = true
            }
          },600)
        })
      }
      return this.goodsInfoGoods.goods_character_detail.substr(0, 1) == "^"
        ? this.goodsInfoGoods.goods_character_detail.substr(1)
        : this.goodsInfoGoods.goods_character_detail;
    },
    productDetailImg() {
      if (typeof this.goodsInfoGoods.goods_photo_detail != "undefined" && this.goodsInfoGoods.goods_photo_detail) {
        let url_ = this.$store.state.country_i == 1? "https://photo.soarmall.com/":"https://photo1.soarmall.com/";
        const reg = /<img(.*?)src="((?!http).*?)"(.*?)>/g;
        let result = this.goodsInfoGoods.goods_photo_detail.replace(reg,'<img$1src="' + url_ + '$2"$3>');
        return result;
      }
    }
  },
  methods: {
    moreDetailFn(){
      this.moreDetailsCheck = !this.moreDetailsCheck
    },
    rev_p(id) {
      this.$router.push({
        path: "/subpages/Reviews",
        query: {
          id: id
        }
      });
    },
    review_image(child, i) {
      child.forEach(element => {
        element.photo = element.Evaluate_photos;
      });
      let image = {
        big: 1,
        child: child,
        i: i
      };
      this.$emit("review_image", image);
    }
  }
};
</script>
<style lang='scss'>
.detailText {
  padding: 0 0.2rem;
  position: relative;
}
.hideMore .textWrap{
  height: 1.2rem;
  overflow: hidden;
}
.hideMore .showMore{
  height: auto;
  overflow: auto;
}
.textWrap{
  line-height: 0.4rem;
}
.moreDetails {
  position: absolute;
  left:0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  border-radius: 0.2rem;
  color: #017ec2;
  display: flex;
  justify-content: center;
  span{
    padding: 0 0.2rem;
  }
  img{
    height: 0.2rem;
    margin: 0 0.2rem;
    transform: rotate(270deg);
    transition: all 0.2s;
  }
  img.pullUp{
    transform: rotate(90deg);
  }
}
// 详情/评价

.pro_rev {
  display: flex;
  justify-content: space-between;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
  text-align: center;
  line-height: 0.8rem;
  border-bottom: 1px solid #ebebeb;
  box-sizing: border-box;
  >div {
    width: 50%;
    .hear {
      color: #131212;
    }
    .hear1 {
      color: #017ec2;
    }
    .dixian {
      width: 0.56rem;
      height: 0.06rem;
      background-color: #017ec2;
      margin: auto;
    }
  }
}
.commodity_pro {
  padding: 0.2rem 0;
  padding-bottom: 0.1rem;
  box-sizing: border-box;
  font-size: 0.28rem;
  overflow: hidden;
  white-space: pre-wrap;
}

.detailImg img {
  width: 100% !important;
  height: auto !important;
  display: block;
}

.detailText table {
  width: 100% !important;
}

.detailText p {
  line-height: 0.4rem !important;
}

.detailText ::v-deep span {
  width: 100% !important;
}
.commodity_pro_rev {
  width: 100%;
  background-color: #fff;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  margin-top: 0.2rem;
}
.commodity_rev {
  padding: 0 0.3rem 0 0.3rem;
  box-sizing: border-box;
}
.no_data {
  width: 100%;
  font-size: 0.28rem;
  color: #333;
  height: 0.9rem;
  line-height: 0.9rem;
}

.rev_her {
  width: 100%;
  height: 1rem;
  border-bottom: 1px solid #ebebeb;
  box-sizing: border-box;
}
.rev_her_t {
  display: flex;
  justify-content: space-between;
  height: 1rem;
  line-height: 1rem;

  .rev_her_t_l {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.28rem;
    color: #333;
  }
}
.rev_her_t_r {
  display: flex;
  justify-content: flex-end;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.26rem;
  .well_eva {
    color: #f00;
  }
  .points {
    color: #333;
  }
}
.rev_her_b {
  display: flex;
  justify-content: space-between;
  height: 0.9rem;
}
.rev_her_b_l {
  margin: auto 0;
  display: flex;
  justify-content: space-between;

  li {
    border: 1px solid #d7d7d7;
    border-radius: 0.24rem;
    height: 0.48rem;
    line-height: 0.48rem;
    padding: 0 0.2rem;
    margin-right: 0.1rem;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    .rev_d {
      margin-top: 0.14rem;
      margin-left: -0.4rem;
      width: 1.4rem;
      height: 0.2rem;
      background: url(~@/assets/img/other/z2.png) no-repeat 0 0px;
      background-size: 1.4rem 0.2rem;
    }
  }
}
.rev_d1 {
  margin-top: 0.14rem;
  margin-left: -0.1rem;
  width: 1.4rem;
  height: 0.2rem;
  background: url(~@/assets/img/other/z2.png) no-repeat 0 0px;
  background-size: 1.4rem 0.2rem;
}

.shul {
  margin-left: 0.1rem;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.26rem;
  color: #999;
}
.rev_her_b_r {
  margin: auto 0;
  color: #333;
  text-align: end;

  p:nth-child(1) {
    text-align: center;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.32rem;
  }

  p:nth-child(2) {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.22rem;
  }
}
.feedback {
  margin-top: 0.2rem;
  width: 1.7rem;
  height: 0.32rem;
  float: left;
  background: url(~@/assets/img/other/z1.png) no-repeat 0 0px;
  background-size: 1.6rem 0.2rem;
  span {
    height: 0.32rem;
    float: left;
    background: url(~@/assets/img/other/z2.png) no-repeat 0px 0px;
    background-size: 1.6rem 0.2rem;
  }
}
.pj_conter {
  border-bottom: 1px solid #ebebeb;
  box-sizing: border-box;
  .pj_xh {
    font-size: 0.4rem;
    padding-top: 0.3rem;
    display: flex;
    flex-direction: column;
  }
}
.pj_xx {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 0.72rem;
}
.uses {
  display: flex;
  justify-content: flex-start;

  .imga {
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;

    img {
      width: 0.72rem;
      height: 0.72rem;
    }
  }

  .eva_username {
    margin: 0 0.2rem;
    font-size: 0.24rem;
    max-width: 2.5rem;
    font-weight: bold;
    font-family: "Calibri-Bold";
  }
}
.ev_time {
  line-height: 0.72rem;
  font-size: 0.2rem;
  font-family: "Calibri";
  color: #999999;
  text-align: end;
}
.time {
  height: 0.6rem;
  padding-left: 0.92rem;
  line-height: 0.72rem;
  font-size: 0.2rem;
  font-family: "Calibri";
  color: #999;
}
.eva_info {
  margin-top: 0.2rem;
}
.pj_text {
  padding-left: 0.92rem;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  box-sizing: border-box;
  height: 0.56rem;
  width: 80%;
  line-height: 0.28rem;
  overflow: hidden;
  font-size: 0.26rem;
  font-family: "Calibri";
}
.pj_img {
  padding-left: 0.92rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  img {
    width: 1.66rem;
    max-height: 2.6rem;
    vertical-align: middle;
  }
}
.pj_more {
  width: 100%;
  height: 0.8rem;
  font-size: 0.24rem;
  color: #999999;
  font-family: "Calibri";
  font-weight: 400;
  text-align: center;
  line-height: 0.8rem;
}
</style>