<template>
  <ul>
    <li class="cou_center" v-if="poointNum">
      <div class="cou_left">
        <div class="money" dir="ltr">
          <p class="fh"></p>
          <p class="txt" :class="{'font':poointNum>1000}">{{poointNum}}</p>
          <p class="Point">Point</p>
        </div>
        <div class="show">
          <p class="Free">Free gift voucher</p>
        </div>
      </div>
      <div class="cou_right" :class="{'rightDot':languages=='sa'}">
        <p class="toye" @click="get_now">Get now</p>
      </div>
    </li>
    <li class="cou_center" v-for="(list,index) in items" :key="index">
      <div class="cou_left" :class="{'f_g':list.store_id}">
        <div class="money">
          <p class="fh">{{GLOBA.money_tag}}</p>
          <p class="txt" :class="{'font':list.Coupon_amount>1000}">{{list.Coupon_amount}}</p>
        </div>
        <div class="show">
          <p class="cou1">{{list.store_name?list.store_name:'Soarmall'}}</p>
          <p class="cou2" v-if="list.Coupon_order_amount > 0">{{list.Coupon_order_amount}} available</p>
          <p class="cou2" v-if="list.Coupon_order_amount ==0">Unlimit</p>
          <p class="cou3">{{list.Coupon_begin_time}}~{{list.Coupon_end_time}}</p>
        </div>
      </div>
      <div class="cou_right" :class="{'get_r':list.store_id,'rightDot':languages=='sa'}">
        <p class="toye" v-if="is_page == 0" @click="goshopping(list)">Use now</p>
        <p class="toye" v-if="is_page == 1">
          <span v-if="list.couponInfoType==0" @click="receive(list)">Grab</span>
          <span class="already" v-if="list.couponInfoType==1">Available</span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import Toast from "@/assets/js/pop_up";
export default {
  props: ["items", "is_page", "poointNum"],
  data() {
    return {
      languages: ""
    };
  },

  created() {
    console.log(this.items);
    console.log(this.$route.query);
    this.languages = this.$route.query.lang;
  },
  methods: {
    goshopping(i) {
      console.log(i);
      if (i.store_id) {
        let store_ = {
          store_id: i.store_id,
          store_name: i.store_name
        };
        let to_data = {
          dianpu: store_,
          id: 1
        };
        this.$router.push({
          path: "/subpages/cate_goods02",
          query: { to_data: to_data }
        });
      } else {
        this.$router.push({ path: "/" });
      }
    },
    async receive(item) {
      let token = this.$store.state.status.token;
      if (!token) {
        this.$router.go(-1);
        setTimeout(() => {
          this.$router.push({
            path: "/account/login"
          });
        }, 100);
      } else {
        let data = {
          coupon_id: item.coupon_id
        };
        let res = await this.$HTTP.get_coupon(data);
        if (res.code == 0) {
          item.couponInfoType = 1;
        } else {
          Toast({ message: "Failure", time: 2000, i: 1 });
        }
      }
    },
    get_now() {
      this.$router.push({
        path: "/home/Entry"
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.cou_center {
  height: 1.6rem;
  padding-top: 0.1rem;
  box-sizing: border-box;
  display: flex;
  box-shadow: 2px 2px 10px #e2e2e2;
  .f_g {
    background: lightgreen !important;
  }
  .cou_left {
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
  .get_r {
    color: lightgreen !important;
  }
  .cou_right {
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
.font {
  font-size: 0.6rem !important;
}
</style>