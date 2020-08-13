<template>
  <div class="couponWrap" @click.stop :class="{'green':couponProps.type == 'store'}">
    <div class="couponTitle">
      <h6>
        <img src="@/assets/img/accout/yh2.png" alt />Coupons
      </h6>
      <div class="close" :class="{'smallClose':GLOBA.isRotate}" @click="closeTank">
        <img src="@/assets/img/other/closeBtn.png" />
      </div>
    </div>
    <div class="couponList">
      <div class="couponItem" v-for="(item, i) of couponProps.list" :key="i" @click="changeCoupon(i)">
        <div class="coupTag">
          <div class="tag">{{GLOBA.money_tag}}</div>
          <div class="value">{{item.Coupon_amount}}</div>
        </div>
        <div class="coupMsg">
          <div class="row1 line-blok-clamp">{{item.Coupon_name}}</div>
          <div
            class="row2 line-blok-clamp"
          >{{item.Coupon_order_amount ==0 ? 'Unlimit' : item.Coupon_order_amount + 'available'}}</div>
          <div class="row3 line-blok-clamp">{{item.Coupon_begin_time}}~{{item.Coupon_end_time}}</div>
        </div>
        <div class="coupSelect" :class="{'rightBot':$route.query.lang=='sa'}">
          <div class="coupCheck" :class="{'select':(couponProps.type=='store'? storeSelect === i:generalSelect === i) && item.flag}"></div>
        </div>
        <div class="unSelectCoup" v-show="item.show || !item.flag"></div>
      </div>
    </div>
    <div class="coupConfimBtn" v-click="confirmCouponSelect">Confirm</div>
  </div>
</template>

<script>
export default {
  props: ["couponProps"],
  data() {
    return {
      storeSelect: '',
      generalSelect: ''
    };
  },
  mounted(){
    this.storeSelect = this.couponProps.storeSelect;
    this.generalSelect = this.couponProps.generalSelect;
  },
  methods: {
    changeCoupon(index) {
      if(this.couponProps.type == 'store') {
        this.storeSelect === index ? (this.storeSelect = '') : (this.storeSelect = index);
      }else{
        this.generalSelect === index ? (this.generalSelect = '') : (this.generalSelect = index);
      };
    },
    confirmCouponSelect(){
      if(this.couponProps.type == 'store') {
        this.$emit('confirm', {type:'store', index: this.storeSelect})
      }else{
        this.$emit('confirm', {type:'general', index: this.generalSelect})
      };
      this.closeTank();
    },
    closeTank(){
      this.storeSelect = this.couponProps.storeSelect,
      this.generalSelect = this.couponProps.generalSelect
      this.$emit('close');
    }
  },
};
</script>
<style lang='scss' scoped>
.green .couponItem {
  background-color: lightgreen;
}
.green .coupSelect {
  border-color: lightgreen;
}
.green .coupSelect .coupCheck.select {
  background-color: lightgreen;
}
.couponTitle {
  display: flex;
  justify-content: center;
  background-color: #fff;
  height: 0.8rem;
  padding: 0 0.3rem;
  border-bottom: 1px solid #ccc;
  position: relative;
  .close {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.3rem;
    color: #ccc;
    height: 0.8rem;
    line-height: 0.7rem;
    width: 1rem;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    img {
      width: 0.53rem;
      height: 0.53rem;
      vertical-align: middle;
    }
  }
  .smallClose {
    right: 6.5rem;
  }
  h6 {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #017ec2;
    line-height: 0.8rem;
    img {
      width: 0.3rem;
      padding: 0 0.2rem;
      vertical-align: middle;
    }
  }
}
.couponList {
  height: 7rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f7f7f7;
  padding: 0.3rem;
  padding-top: 0px;
}
.couponItem {
  background-color: #33b6ff;
  box-shadow: 2px 2px 10px #e2e2e2;
  height: 1.6rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.1rem;
  position: relative;
  .coupTag {
    width: 2.6rem;
    height: 100%;
    text-align: center;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #fff;
    display: flex;
    -webkit-box-pack: start;
    padding: 0 0.1rem;
    box-sizing: border-box;
    .tag {
      font-size: 0.2rem;
      line-height: 1rem;
    }
    .value {
      font-size: 0.8rem;
      line-height: 1.6rem;
    }
  }
  .coupMsg {
    width: 2.8rem;
    height: 100%;
    font-size: 0.26rem;
    padding: 0.2rem 0;
    box-sizing: border-box;
    color: #fff;
    .row1 {
      font-size: 0.3rem;
      font-weight: bold;
    }
    .row2 {
      font-size: 0.3rem;
      margin-top: 0.06rem;
    }
    .row3 {
      font-size: 0.23rem;
    }
  }
  .coupSelect {
    height: 100%;
    width: 1.5rem;
    position: relative;
    border-left: 2px dotted #33b6ff;
    background: #fff;
  }
  .rightBot {
    border-left: none;
    border-right: 2px dotted lightgreen;
  }
}
.coupSelect {
  display: flex;
  justify-content: center;
  align-items: center;
  .coupCheck {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    border: 1px solid #999999;
  }
  .coupCheck.select {
    background-color: #33b6ff;
    border: none;
  }
}
.coupConfimBtn {
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background-color: #008edd;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.34rem;
  color: #fff;
}
.unSelectCoup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}
</style>