<template>
  <div class="order_all" id="dataList">
    <div class="order_all_box">
      <!-- 内容列表 -->
      <div class="order_box" v-for="(item,index) in items" :key="index">
        <!-- 自营 -->
        <div class="autarky">
          <div class="state_ state_box" @click="todianpu(item)">
            <div class="category">
              <p class="img">
                <img v-lazy="item.store_logo" />
              </p>
              <p class="name">{{item.store_name}}</p>
            </div>
            <div class="state">
              <p v-if="item.order_status == 0 ">{{$t("common.Canceled")}}</p>
              <p v-if="item.order_status == 10">{{$t("common.Unpaid")}}</p>
              <p v-if="item.order_status == 20 || item.order_status == 16">{{$t("common.Pending")}}</p>
              <p v-if="item.order_status == 30">{{$t("common.Shipped")}}</p>
              <p v-if="item.order_status == 40">{{$t("common.Reviews")}}</p>
              <p v-if="item.order_status == 50 || item.order_status == 65">{{$t("common.Finish")}}</p>
              <p v-if="item.order_status == 70">{{$t("common.Ap")}}</p>
              <p v-if="item.order_status == 75">{{$t("common.fat")}}</p>
              <p v-if="item.order_status == 80">{{$t("common.Success")}}</p>
              <p v-if="item.order_status == 85">{{$t("common.Refund failure")}}</p>
            </div>
          </div>
          <div class="order_box_t" v-for="(goodsinfo,i) in item.goodsinfo" :key="i">
            <Ordgood :goods="goodsinfo" :order_id="item.order_id" :shipprice="item.shipprice"></Ordgood>
          </div>
          <div class="hebin">
            <div class="zongjia">
              <p>{{$t("common.Total")}}:</p>
              <p class="ltr">
                <span>{{GLOBA.money_tag}} {{item.total_price | integerNum}}</span>
                <span class="xiaoshu">.{{item.total_price | decimalNum}}</span>
              </p>
            </div>
            <div class="order_box_b">
              <div class="btn_">
                <p
                  class="btn_box"
                  @click="details_or(item.order_id,item.order_status)"
                >{{$t("common.Order details")}}</p>
                <p
                  class="btn_box"
                  v-if="item.order_status == 30"
                  @click="Sign_for(item.order_id,index)"
                >{{$t("common.Receive")}}</p>
                <p
                  class="btn_box1"
                  v-if="item.order_status == 10 || item.order_status == 16 || item.order_status == 20"
                  @click="cancel(item.order_id,index)"
                >{{$t("common.Cancel")}}</p>
                <!-- <p
                  class="btn_box"
                  v-if="item.order_status == 40 || item.order_status == 35 && item.order_status != 65"
                  @click="evalua(item.order_id,index)"
                >{{$t("common.Review")}}</p>-->
                <p
                  class="btn_box1"
                  v-if="item.order_status == 0"
                  @click="delete_(item.order_id,index)"
                >{{$t("common.Delete")}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 取消订单 -->
    <div class="cancel_box" v-show="iscancel">
      <div class="kong" @click="cancel_c"></div>
      <div class="select_box">
        <ul>
          <li :class="sta_css == 1?'check':'checks'" @click="stat_(1)">{{state_.state_a}}</li>
          <li :class="sta_css == 2?'check':'checks'" @click="stat_(2)">{{state_.state_b}}</li>
          <li :class="sta_css == 3?'check':'checks'" @click="stat_(3)">{{state_.state_c}}</li>
        </ul>
        <p class="tijiao_btn" v-click="st_submit">{{$t("common.Submit")}}</p>
      </div>
    </div>
    <!-- 确认收货 -->
    <div class="Sign_box" v-show="Sign_bo">
      <div class="Sign_fo">
        <div class="sign_con">
          <p>{{$t("common.core")}}</p>
          <p>{{$t("common.Order No")}}.{{orderid.order_id}}</p>
        </div>
        <div class="btn_">
          <p class="btn2_" v-click="btn_ca">{{$t("common.Cancel")}}</p>
          <p class="btn1_" v-click="btn_co">{{$t("common.Confirm")}}</p>
        </div>
      </div>
    </div>
    <Popout :cue_words="cue_words" @popout_btn="popout_btn" v-if="if_cue"></Popout>
  </div>
</template>

<script>
import Popout from "@/whole/components/elastic/popout";
import Ordgood from "@/whole/components/order_return/orders_goods";
import Toast from "@/assets/js/pop_up";

export default {
  components: {
    Ordgood,
    Popout,
  },
  props: ["items"],
  data() {
    return {
      a: {},
      evaluate: true,
      if_cue: false,
      cue_words: this.$t("message.You sure to delete this order"),
      state_: {
        state_a: this.$t("common.Change to buy other goods"),
        state_b: this.$t("common.Buy from other stores"),
        state_c: this.$t("common.Other"),
      },
      words: "",
      sta_css: "1",
      stat_st: "",
      ordeid: "",
      iscancel: false,
      orderid: {},
      Sign_bo: false,
      index: "",
    };
  },
  methods: {
    // 店铺链接
    todianpu(good) {
      let to_data = {
        dianpu: good,
        id: 1,
      };
      this.$router.push({
        path: "/subpages/cate_goods02",
        query: { to_data: to_data },
      });
    },

    details_or(id, status) {
      let good = {
        id: id,
        Order_status: status,
      };
      this.$router.push({
        path: "/subpages/Account/order_evaluate/details_order",
        query: {
          good: good,
        },
      });
    },
    evalua(id, i) {
      this.$router.push({
        path: "/subpages/Account/order_evaluate/evaluate_page",
        query: { id: id },
      });
      this.$emit("order_cont");
    },
    async popout_btn(id) {
      if (id == 0) {
        this.if_cue = false;
      }
      if (id == 1) {
        this.if_cue = false;
        this.index = this.a.index;
        let data = {
          id: this.a.id,
        };
        let res = await this.$HTTP.order_delete(data);
        if (res.code == 0) {
          this.$emit("order_cont");
        }
      }
    },

    delete_(id, i) {
      this.if_cue = true;
      this.a = {
        id: id,
        index: i,
      };
    },

    async cancel(id, i) {
      this.ordeid = id;
      this.index = i;
      let data = {
        id: id,
      };
      let res = await this.$HTTP.order_cancel(data);
      if (res.code == 0) {
        this.iscancel = true;
      }
    },
    stat_(i) {
      this.sta_css = i;
      switch (i) {
        case 1:
          this.stat_st = this.state_.state_a;
          break;
        case 2:
          this.stat_st = this.state_.state_b;
          break;
        case 3:
          this.stat_st = this.state_.state_c;
          break;
      }
    },
    cancel_c() {
      this.iscancel = false;
    },
    async st_submit() {
      let i = this.index;
      let data = {
        id: this.ordeid,
        state_info: this.stat_st,
        other_state_info: "",
      };
      let res = await this.$HTTP.order_cancel_save(data);
      if (res.code == 0) {
        this.$emit("order_cont");
        this.iscancel = false;
        Toast({ message: "Success", time: 2000 });
      }
    },
    async Sign_for(id, i) {
      this.index = i;
      let data = {
        id: id,
      };
      let res = await this.$HTTP.order_cofirm(data);
      if (res.code == 0) {
        this.orderid = res.data;
        this.Sign_bo = true;
      }
    },
    btn_ca() {
      this.Sign_bo = false;
    },
    async btn_co() {
      let i = this.index;
      let data = {
        id: this.orderid.id,
      };
      let res = await this.$HTTP.order_cofirm_save(data);
      if (res.code == 0) {
        this.$emit("toReview");
        this.Sign_bo = false;
        this.items.splice(i, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order_all_box {
  padding-top: 0.3rem;
  // padding: 0.3rem 0.3rem 0;
  box-sizing: border-box;
}
.order_box {
  width: 100%;
}
.autarky {
  background-color: #fff;
  // box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 0.3rem;
}
.category::before {
  content: "";
  width: 0.08rem;
  height: 0.26rem;
  background-color: #008edd;
}
.state_box {
  padding: 0 0.3rem;
  box-sizing: border-box;
  background-color: #e9e9e9;
  .category {
    display: flex;
    justify-content: flex-start;
    font-family: "Calibri";
    align-items: center;
    font-weight: 400;
    .img {
      width: 0.32rem;
      height: 0.32rem;
      position: relative;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0 0.1rem;
      }
    }
    .name {
      padding: 0 0.2rem;
      font-size: 0.24rem;
      color: #333;
    }
  }
}
.state {
  font-size: 0.22rem;
  color: #fc3a25;
}
.store {
  margin: 0.3rem 0;
  background-color: #fff;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
}
.order_box_t {
  position: relative;
  width: 100%;
  margin-top: 0.1rem;
  border-bottom: 1px solid #ebebeb;
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.hebin {
  display: flex;
  justify-content: space-between;
  height: 0.8rem;
  line-height: 0.8rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.zongjia {
  width: 42%;
  display: flex;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.28rem;
  p:nth-child(1) {
    font-family: "Calibri";
    font-weight: 400;
    color: #999999;
  }
  p:nth-child(2) {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    color: #ccc;
    display: flex;
    justify-content: flex-start;
    span {
      color: black;
    }
    span:nth-child(2) {
      font-size: 0.18rem;
      line-height: 0.6rem;
      vertical-align: middle;
    }
  }
}
.state_ {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 0.72rem;
  line-height: 0.72rem;
  font-size: 0.3rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  color: #333;
}
.order_box_b {
  display: flex;
  justify-content: flex-end;
  .btn_ {
    display: flex;
    justify-content: flex-end;
    p {
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.24rem;
      padding: 0 0.1rem;
      margin-left: 0.2rem;
    }
    .btn_box {
      // border: 1px solid #017ec2;
      color: #017ec2;
    }
    .btn_box1 {
      // border: 1px solid #ebebeb;
      color: #999;
    }
  }
}
// 取消订单
.cancel_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  font-family: "Calibri-Bold";
  font-weight: Bold;
  .kong {
    width: 100%;
    height: 50vh;
  }
  .select_box {
    width: 100%;
    background-color: #fff;
    padding: 0.3rem 0.6rem;
    box-sizing: border-box;
    font-size: 0.3rem;
    color: #333;
    height: 50vh;
    .checks,
    .check {
      height: 0.8rem;
      line-height: 0.8rem;
      border: 1px solid #ccc;
      border-radius: 0.4rem;
      padding: 0 0.4rem;
      margin: 0.3rem 0;
      text-align: center;
    }
    .check {
      background-color: #33b6ff;
      font-size: 0.38rem;
    }
  }
  .tijiao_btn {
    box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
    border-radius: 0.2rem;
    width: 6rem;
    line-height: 1rem;
    text-align: center;
    margin: 1rem auto 0;
    background-color: #008edd;
    color: #fff;
    font-size: 0.4rem;
  }
}
// 确认收货
.Sign_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  .Sign_fo {
    background-color: #fff;
    width: 80%;
    margin: 30vh auto 0;
    border-radius: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    .sign_con {
      padding: 0.3rem;
      p {
        line-height: 0.5rem;
        text-align: center;
        font-family: "Calibri-Bold";
        font-weight: Bold;
        font-size: 0.3rem;
        color: #333;
      }
    }
    .btn_ {
      display: flex;
      justify-content: space-between;
      padding: 0.3rem;
      font-size: 0.28rem;
      p {
        width: 2rem;
        line-height: 0.8rem;
        border-radius: 0.4rem;
        text-align: center;
      }
      .btn1_ {
        background-color: #017ec2;
        color: #fff;
      }
      .btn2_ {
        background-color: #ccc;
        color: #999;
      }
    }
  }
}
</style>
