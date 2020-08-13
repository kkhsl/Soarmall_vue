<template>
  <div class="mask" @click="yu_mask">
    <div class="counponsWrap" @click.stop>
      <div class="coupons">
        <p>
          <img src="@/assets/img/accout/yh2.png" alt />Coupons
        </p>
        <p :class="{'close_l':GLOBA.isRotate}" class="close" @click="yu_mask">X</p>
      </div>
      <div class="coupons_box">
        <ul class="centera">
          <li class="cou_center" v-for="(item,index) in coupons_l" :key="index">
            <div class="cou_mj" :class="{'f_g':item.store_id}">
              <p class="fh">{{GLOBA.money_tag}}</p>
              <p class="txt">{{item.Coupon_amount}}</p>
            </div>
            <div class="cou_time" :class="{'f_g':item.store_id}">
              <p class="cou1 line-blok-clamp">{{item.Coupon_name}}</p>
              <p
                class="cou2 line-blok-clamp"
                v-if="item.Coupon_order_amount > 0"
              >{{item.Coupon_order_amount}} available</p>
              <p class="cou2 line-blok-clamp" v-if="item.Coupon_order_amount ==0">Unlimit</p>
              <p class="cou3 line-blok-clamp">{{item.Coupon_begin_time}}~{{item.Coupon_end_time}}</p>
            </div>
            <div
              class="check_box"
              :class="{'get_r':item.store_id,'border_r':GLOBA.isRotate}"
              @click="coupons_selected(item,index)"
            >
              <p
                class="checkb self-centered"
                :class="{'check': ischeck==index}"
                v-if="!item.store_id"
              ></p>
              <p
                class="checkb self-centered"
                :class="{'check1': ischeck==index}"
                v-if="item.store_id"
              ></p>
            </div>
            <div class="if_checkb" v-show="item.show || !item.flag"></div>
          </li>
        </ul>
      </div>
      <div class="confirm_but" @click="confirm_but">Confirm</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["coupons_l"],
  data() {
    return {
      ischeck: -1,
      amount: "",
      index: -1
    };
  },
  created() {
    this.coupons_l.some((item, n) => {
      if (item.flag) {
        this.ischeck = n;
        this.amount = item;
        return true;
      }
    });
  },
  watch: {
    coupons_l() {
      this.coupons_l.some((item, n) => {
        if (item.flag) {
          this.ischeck = n;
          this.amount = item;
          return true;
        }
      });
    }
  },
  methods: {
    coupons_selected(item, i) {
      console.log(item);
      if (this.ischeck === i) {
        this.ischeck = -1;
        this.index = i;
        let data = {
          Coupon_amount: 0,
          Coupon_begin_time: "",
          Coupon_end_time: "",
          Coupon_name: "",
          Coupon_order_amount: "",
          id: "",
          store_id: item.store_id
        };
        this.amount = data;
      } else {
        this.ischeck = i;
        this.amount = item;
      }
    },
    yu_mask() {
      this.ischeck = this.index;
      this.$emit("yu_mask");
    },
    confirm_but() {
      this.$emit("confirm_but_s", this.amount);
    }
  }
};
</script>

<style lang="scss" scoped>
.f_g {
  background: lightgreen !important;
}
.get_r {
  border-left: 2px dotted lightgreen !important;
}
.counponsWrap{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.mask {
  z-index: 333;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .option {
    width: 100%;
    height: 3.2rem;
  }

  .coupons {
    display: flex;
    justify-content: center;
    background-color: #fff;
    height: 0.8rem;
    width: 100vw;
    padding: 0 0.3rem;
    box-sizing: border-box;
    border-bottom: 0.5px solid #f7f7f7;
    border-bottom: 1px solid #ccc;
    position: relative;

    p:nth-child(1) {
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.3rem;
      color: #017ec2;
      line-height: 0.8rem;

      img {
        width: 15%;
        padding: 0 0.2rem;
        margin-top: -2px;
        vertical-align: middle;
      }
    }

    .close {
      font-family: "Calibri";
      font-weight: 400;
      font-size: 0.3rem;
      color: #ccc;
      width: 1rem;
      text-align: center;
      line-height: 0.7rem;
      position: absolute;
      right: 0;
    }
    .close_l {
      position: absolute;
      right: 6.5rem;
    }
  }

  .confirm_but {
    width: 100vw;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    background-color: #008edd;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.34rem;
    color: #fff;
  }

  .coupons_box {
    width: 100vw;
    height: 8rem;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: #f7f7f7;
    padding: 0.3rem;
    padding-top: 0px;
    box-sizing: border-box;
  }

  .centera {
    .cou_center {
      box-shadow: 2px 2px 10px #e2e2e2;
      height: 1.6rem;
      display: flex;
      justify-content: space-between;
      margin-top: 0.1rem;
      position: relative;
      .if_checkb {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
        background: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
      }
      .cou_mj {
        background-color: #008edd;
        width: 2.6rem;
        height: 100%;
        text-align: center;
        font-family: "Calibri-Bold";
        font-weight: bold;
        color: #fff;
        display: flex;
        justify-content: flex-start;
        padding: 0 0.1rem;
        box-sizing: border-box;
        .fh {
          height: 100%;
          font-size: 0.2rem;
          line-height: 1rem;
        }
        .txt {
          font-size: 0.8rem;
          line-height: 1.6rem;
        }
      }
      .cou_ke {
        font-size: 0.2rem;
        text-align: center;
        height: 40%;
        line-height: 0.5rem;
        font-weight: 400;
      }

      .cou_time {
        width: 2.8rem;
        height: 100%;
        font-size: 0.26rem;
        padding: 0.2rem 0;
        box-sizing: border-box;
        color: #fff;
        background-color: #008edd;
        .cou1 {
          font-size: 0.3rem;
          font-weight: bold;
        }
        .cou2 {
          font-size: 0.3rem;
          margin-top: 0.06rem;
        }
        .cou3 {
          color: #fff;
          margin-top: 0.06rem;
          font-size: 0.23rem;
        }
      }
    }
  }
}

.check_box {
  height: 100%;
  width: 1.5rem;
  position: relative;
  border-left: 2px dotted #008edd;
  background: #fff;

  .checkb {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    border: 1px solid #999999;
    box-sizing: border-box;
  }
  .check {
    background-color: #008edd;
    border: none;
  }
  .check1 {
    background-color: #008edd;
    border: none;
  }

  .check::after {
    display: block;
    /* content: "\2714"; */
    font-size: 0.28rem;
    color: #fff;
    font-weight: 600;
    text-align: center;
    line-height: 0.4rem;
  }
}
.border_r {
  border: none;
  border-right: 2px dotted #008edd;
}
</style>
