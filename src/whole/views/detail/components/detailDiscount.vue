<template>
  <div class="detailDiscount">
    <div class="discountList" v-if="getErJson">
      <div class="flexBox flexBoxRow">
        <div class="flexBox couponList">
          <div class="flexRowImg"><img :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/FreeGit/manjian.png" alt /></div>
          <div>
            <span class="couponItem" v-for="(fullTag,index) of getErJson" :key="index">Full {{GLOBA.money_tag}} {{fullTag.key | percentageNum}} minus {{fullTag.val}}</span>
          </div>
        </div>
        <!-- <div class="flexRowRight"><img src="@/assets/img/other/xiangyou3.png" class="rightIconRow" :class="[{'isRotate':GLOBA.isRotate},{'active':showDownBox}]"/></div> -->
      </div>
      <!-- <div class="hideDownWrap" v-show="showDownBox">
        <vant-tag color="#ff4c40" class="fullDiscountItem" plain v-for="(fullTag,index) of getErJson" :key="index">
          Full {{GLOBA.money_tag}} {{fullTag.key | percentageNum}} minus {{fullTag.val}}
        </vant-tag>
      </div> -->
    </div>
    <div class="discountList" v-if="goodsInfo.coupon.length">
      <div class="flexBox flexBoxRow" @click="showCouponTankFn">
        <div class="flexBox couponList">
          <div class="flexRowImg"><img :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/FreeGit/zhekou.png"/></div>
          <div>
            <span class="couponItem" v-for="(coupon, index) of goodsInfo.coupon" :key="index" v-show="index < 2">Minus {{GLOBA.money_tag}} {{coupon.Coupon_amount}}</span>
          </div>
        </div>
        <div class="flexRowRight"><img src="@/assets/img/other/xiangyou3.png" class="rightIconRow" :class="[{'isRotate':GLOBA.isRotate}]"/></div>
      </div>
    </div>
    <vantPopup
      v-model="showCouponTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      @click-overlay ="closeCouponTankFn"
    >
    <div class="couponTankTitle">
      <div class="titleName"><img src="@/assets/img/accout/yh2.png" alt /><span>Coupons</span></div>
      <div class="closeImg" @click="closeCouponTankFn" :class="{'style_sa':lang == 'sa'}"><img src="@/assets/img/other/closeBtn.png"/></div>
    </div>
    <div class="couponTankListWrap">
      <div class="coupListItem" v-for="(couponListItem,index) in goodsInfo.coupon" :key="index">
        <div class="couLeft" :class="{'greenStyle':couponListItem.store_id}">
          <div class="money">
            <p class="fh">{{GLOBA.money_tag}}</p>
            <p class="txt" :class="{'font':couponListItem.Coupon_amount>1000}">{{couponListItem.Coupon_amount}}</p>
          </div>
          <div class="show">
            <p class="cou1">{{couponListItem.store_name || 'Soarmall'}}</p>
            <p class="cou2" v-if="couponListItem.Coupon_order_amount > 0">{{couponListItem.Coupon_order_amount}} available</p>
            <p class="cou2" v-if="couponListItem.Coupon_order_amount ==0">Unlimit</p>
            <p class="cou3">{{couponListItem.Coupon_begin_time}}~{{couponListItem.Coupon_end_time}}</p>
          </div>
        </div>
        <div class="couRight" :class="{'greenColor':couponListItem.store_id,'rightDot':lang=='sa'}">
          <!-- <p class="toye" v-if="is_page == 0" @click="goshopping(couponListItem)">Use now</p> -->
          <p class="toye">
            <span v-if="couponListItem.couponInfoType==0" @click="getCoupons(couponListItem)">Grab</span>
            <span class="already" v-if="couponListItem.couponInfoType==1">Available</span>
          </p>
        </div>
      </div>
    </div>
    </vantPopup>
  </div>
</template>

<script>
import { Tag,Popup,Toast  } from 'vant';
export default {
  props:['goodsInfo'],
  components:{
    vantTag: Tag,
    vantPopup:Popup
  },
  data() {
    return {
      lang: this.$route.query.lang || 'en',
      showDownBox: false,
      showCouponTank: false
    };
  },
  mounted(){
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.showCouponTank) {
          this.showCouponTank = false;
        }
      },
      false
    );
  },
  methods: {
    showCouponTankFn(){
      this.showCouponTank = true;
      window.history.pushState(null, null, "#");
    },
    closeCouponTankFn(){
      if(window.location.hash.length == 0 || !window.location.hash){
        this.$router.go(-1);
      }
      this.showCouponTank = false;
    },
    async getCoupons(item) {
      let token = this.$store.state.status.token;
      if (!token) {
        this.closeCouponTankFn();
        setTimeout(() => {
          this.$router.push({
            path: "/account/login"
          });
        }, 400);
      } else {
        let res = await this.$HTTP.get_coupon({coupon_id: item.coupon_id});
        if (res.code == 0) {
          item.couponInfoType = 1;
          Toast({
            message: 'successful',
            icon: require('@/assets/img/other/zhenque.png')
          });
        } else {
          Toast.fail('Failure');
        }
      }
    }
  },
  computed:{
    getErJson (){
      try {
        if(this.goodsInfo.er_json){
          let object = this.goodsInfo.er_json
          let arr = []
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              arr.push({
                key: key,
                val: object[key]
              })
            }
          }
          return arr
        }
      } catch (error) {
        return null
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.showCouponTank) {this.showCouponTank = false;}
      },
      false
    );
  }
};
</script>
<style lang='scss' scoped>
.detailDiscount{
  font-size: 0.24rem;
  color: #ff4c40;
  .discountList{
    background-color: #fff;
    margin-top: 0.2rem;
  }
}
.flexBoxRow{
  padding: 0.3rem 0.2rem;
}
.flexRowImg{
  width: 0.3rem;
  img{
    display: block;
  }
}
.hideDownWrap{
  padding:0 0.2rem 0.2rem;
}
.rightIconRow{
  transition: all 0.2s ease-in-out;
}
.fullDiscountItem{
  margin-left: 0.08rem;
  margin-bottom:0.08rem;
}
.rightIconRow.active{
  transform: rotate(90deg);
}
.couponItem{
  padding:0 0.1rem;
}

.couponTankTitle{
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  color: #017ec2;
  line-height: 0.8rem;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.titleName{
  img{
    width: 0.4rem;
    padding: 0 0.2rem;
    vertical-align: sub;
  }
}
.style_sa.closeImg{
  left: 0;
  right: auto;
}
.closeImg{
  width: 0.7rem;
  height: 0.7rem;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
  img{
    max-width: 100%;
  }
}
.couponTankListWrap{
  height: 7rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f7f7f7;
  padding: 0 0.3rem 0.3rem;
}
.coupListItem {
  height: 1.6rem;
  padding-top: 0.1rem;
  box-sizing: border-box;
  display: flex;
  box-shadow: 2px 2px 10px #e2e2e2;
  .greenStyle {
    background: lightgreen !important;
  }
  .couLeft {
    height: 100%;
    background: #33b6ff;
    display: flex;
    justify-content: flex-start;
    .money {
      width: 2.6rem;
      height: 100%;
      line-height: 1.6rem;
      text-align: center;
      font-size: 0.9rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
      color: #fff;
      display: flex;
      padding: 0 0.1rem;
      box-sizing: border-box;

      .fh {
        font-size: 0.1rem;
        font-weight: bold;
        line-height: 1rem;
      }
      .Point {
        font-size: 0.1rem;
        font-weight: bold;
        width: 0.4rem;
        line-height: 1rem;
      }
    }

    .show {
      width: 2.8rem;
      height: 100%;
      font-size: 0.26rem;
      padding: 0.2rem 0;
      box-sizing: border-box;
      color: #fff;
      .Free {
        font-size: 0.3rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        line-height: 1.2rem;
      }
      .cou1 {
        font-size: 0.3rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        line-height: 0.5rem;
      }
      .cou2 {
        font-family: "Calibri";
        font-weight: 400;
        font-size: 0.3rem;
        line-height: 0.4rem;
      }

      .cou3 {
        font-family: "Calibri";
        font-weight: 200;
        color: #fff;
        font-size: 0.22rem;
        line-height: 0.3rem;
      }
    }
  }
  .greenColor {
    color: lightgreen !important;
  }
  .couRight {
    box-shadow: 2px 2px 10px #e2e2e2;
    width: 1.5rem;
    height: 100%;
    background: #fff;
    font-size: 0.28rem;
    text-align: center;
    line-height: 1.5rem;
    font-weight: bold;
    color: #33b6ff;
    display: flex;
    align-items: center;
    border-left: 2px dotted;
    .toye {
      width: 100%;
      height: 100%;
      word-wrap: break-word;
      span {
        width: 100%;
        height: 100%;
        display: block;
      }
      .already {
        color: #c24343;
      }
    }
  }
  .rightDot {
    border-left: none;
    border-right: 2px dotted;
  }
}
</style>