<template>
  <div class="accouint_number">
    <div class="gouwuc" :class="GLOBA.padding_hear">
      <p @click="tocart">
        <span>{{amounts.goodsCarts || 0}}</span>
        <img class="self-centered" src="@/assets/img/other/baobao.png" />
      </p>
    </div>
    <div class="accouint_number_sing">
      <div class="my_log" :class="GLOBA.may_lo"  @click="jump">
        <img v-lazy="yonghu.user_photo" />
      </div>
      <div class="my_name"  @click="jump">
        <p class="name">{{yonghu.userName || $t("common.Log in/sign in")}}</p>
      </div>
    </div>
    <div class="accouint_number_data">
      <div class="my_aggregate" @click="to_wis_wef(0)">
        <p class="cont">{{amounts.favorite || 0}}</p>
        <p class="name">{{$t("common.Wishlist")}}</p>
      </div>
      <div class="zhonj"></div>
      <div class="my_aggregate" @click="to_wis_wef(1)">
        <p class="cont">{{amounts.footPoint || 0}}</p>
        <p class="name">{{$t("common.Footprint")}}</p>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  props:["amounts"],
  data() {
    return {
      yonghu: [],
    };
  },
  created() {
    this.yonghu = this.$store.state.status;
  },
  activated(){
    this.yonghu = this.$store.state.status;
  },
  methods: {
    tocart() {
      this.$router.push({ path: "/details/cart" });
    },
    to_wis_wef(i){
      if(i==0){
          this.$router.push({ path: "/subpages/collection/wishlist" });
      }else if(i==1){
          this.$router.push({ path: "/subpages/collection/wef" });
      }
    },
    jump() {
      if (this.$store.state.status.userName) {
        this.$router.push({ path: "/subpages/Account/profile" });
      } else {
        this.$emit("login_btn", 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.accouint_number {
  background: url(../../../assets/img/accout/toubu.png) no-repeat;
  background-size: cover;
  width: 100%;
  height: 5.2rem;
  border-radius: 0 0 1.2rem 1.2rem;
  .gouwuc {
    justify-content: flex-end;
    width: 100vw;
    height: 1.58rem;
    box-sizing: border-box;
    display: flex;
    p {
      position: relative;
      width: 1rem;
      height: 0.8rem;
    }
    img {
      width: 0.32rem;
      height: 0.32rem;
    }
    span {
      position: absolute;
      text-align: center;
      top: 0.12rem;
      right: 0.3rem;
      display: inline-block;
      background-color: #f00;
      border-radius: 50%;
      min-width: 0.2rem;
      min-height: 0.2rem;
      max-width: 0.4rem;
      max-height: 0.4rem;
      font-size: 0.18rem;
      color: #fff;
      line-height: 0.2rem;
      z-index: 100;
    }
  }
  .accouint_number_sing {
    padding: 0 0.3rem;
    box-sizing: border-box;
    width: 100%;
    height: 0.88rem;
    line-height: 0.88rem;
    display: flex;
    justify-content: flex-start;
    .my_log {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 50%;
      background-color: #fff;
      padding: 0.04rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .my_name {
      margin:0 0.3rem; 
      line-height: 0.44rem;
      display: flex;
      align-items: center;
      .name {
        font-family: "Calibri-Bold";
        font-size: 0.36rem;
        font-weight: 600;
        color: #fff;
      }
      .id_ {
        font-family: "Calibri";
        font-size: 0.24rem;
        font-weight: 400;
        color: #b0d9f7;
      }
    }
    .Login_in {
      position: absolute;
      top: 0;
      right: 0;
      width: 1.96rem;
      height: 100%;
      background-color: #4db7f3;
      border-top-left-radius: 0.44rem;
      border-bottom-left-radius: 0.44rem;
      display: flex;
      justify-content: flex-start;
      .img {
        width: 0.3rem;
        height: 0.3rem;
        margin-left: 0.3rem;
        margin-top: 0.29rem;
        background: url(../../../assets/img/other/shezhi.png) no-repeat;
        background-size: cover;
      }
      .set {
        margin-left: 0.2rem;
        font-family: "Calibri";
        font-size: 0.28rem;
        font-weight: 400;
        color: #fff;
      }
    }
  }
  .accouint_number_data {
    width: 4.6rem;
    height: 1.1rem;
    background-color: #53bbf6;
    display: flex;
    justify-content: center;
    border-radius: 0.56rem 0.56rem 0 0;
    margin: 0.54rem auto 0;
    .my_aggregate {
      width: 2.29rem;
      margin-top: 0.24rem;
      text-align: center;
      .cont {
        font-size: 0.28rem;
        color: #fff;
        font-family: "Amaranth-Bold";
        font-weight: Bold;
      }
      .name {
        color: #b0d9f7;
        font-family: "Calibri-Bold";
        font-weight: Bold;
        font-size: 0.28rem;
      }
    }
    .zhonj {
      width: 0.02rem;
      height: 0.6rem;
      background-color: #0d95e1;
      margin-top: 0.24rem;
    }
  }
}
</style>
