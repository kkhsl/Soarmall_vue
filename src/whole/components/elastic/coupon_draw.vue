<template>
  <div class="tofree_box"  v-if="iffree" @touchmove.prevent="move">
    <div class="tofree_x">
      <div class="tofree">
        <img v-if="coup_draw.coupon_amount" src="@/assets/img/FreeGit/coup_darw.png" />
        <img v-else src="@/assets/img/FreeGit/darw.png" />
        <p class="coupon" v-if="coup_draw.coupon_amount" @click="free_c(1)">{{coup_draw.coupon_amount}}</p>
        <p class="draw" :class="{'draw1': !coup_draw.coupon_amount}" @click="free_c(2)" dir="ltr">{{coup_draw.raffle}}</p>
      </div>
      <p class="x" @click="free_c(0)">×</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iffree: false,
      coup_draw: {}
    };
  },
  created() {},
  watch: {
    "$store.state.coup_draw": function() {
      if(this.GLOBA.isApp){
        this.iffree = true;
        this.coup_draw = this.$store.state.coup_draw;
      }
    }
  },
  methods: {
    free_c(i) {
      this.iffree = false;
        if (i == 1) {
          this.$router.push({
            path: "/home"
          });
        } else if (i == 2) {
          this.$router.push({
            path: "/luck_draw/roundTurntable"
          });
        }
    },
    move() {}
  }
};
</script>

<style lang='scss' scoped>
.tofree_box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9;
  .tofree_x {
    width: 7rem;
    // height: 9rem;
    margin: auto;
    margin-top: 26vh;
  }
  .x {
    margin-top: 0.6rem;
    width: 100%;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.6rem;
    color: #fff;
    text-align: center;
    line-height: 1rem;
  }
  .tofree {
    width: 100%;
    // height: 4.7rem;
    // height: 5.2rem;
    // background: url(../../../assets/img/FreeGit/coup_darw.png) no-repeat;
    // background-size: 100%;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.28rem;
    color: #017ec2;
    padding-top: 0.7rem;
    box-sizing: border-box;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: -1;
      //   height: 100%;
    }
    .coupon {
      width: 100%;
      height: 2.9rem;
      line-height: 3.22rem;
      padding-left: 2.9rem;
      box-sizing: border-box;
    }
    .draw {
      width: 100%;
      height:2.9rem;
      line-height: 3.2rem;
      padding-left: 3.9rem;
      box-sizing: border-box;
       font-family: "Calibri-Bold";
      font-weight: Bold;
    }
    .draw1{
      line-height: 3.56rem !important;
    }
  }
}
</style>