<template>
  <div class="mask">
    <div class="option" @click="yu_mask"></div>
    <div class="coupons" @click="yu_mask">
      <p>
        <img src="@/assets/img/accout/yh2.png" alt />Coupons
      </p>
      <p>X</p>
    </div>
    <div class="coupons_box">
      <div class="centera" v-for="(item,index) in parys" :key="index">
        <ul class="aaa">
          <li v-for="(cou,e) in item.Couponinfo" :key="e" class="cou_center">
            <div class="cou_mj">
              <div class="money">
                <p class="fh">{{GLOBA.money_tag}}</p>
                <p class="txt">{{cou.Coupon_amount}}</p>
              </div>
            </div>
            <div class="cou_time">
              <p class="cou1 line-blok-clamp">{{item.store_name}}</p>
              <p class="cou2 line-blok-clamp" v-if="cou.Coupon_order_amount > 0">{{cou.Coupon_order_amount}} available</p>
              <p class="cou2 line-blok-clamp" v-if="cou.Coupon_order_amount ==0">Unlimit</p>
              <p class="cou3 line-blok-clamp">Time：{{cou.Coupon_begin_time}}~{{cou.Coupon_end_time}}</p>
            </div>
            <div class="check_box" @click="coupons_selected(item,index,cou,e)">
              <p class="checkb self-centered" :class="{'check': cou.checked}"></p>
            </div>
            <div class="if_checkb" v-show="cou.show"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="confirm_but" @click="confirm_but">Confirm</div>
  </div>
</template>

<script>
export default {
  props: ["parys"],
  data() {
    return {
      ifcoupons: true
    };
  },
  methods: {
    if_coupons() {
        let coupons_info = JSON.parse(
          sessionStorage.getItem("coupon_info") || "[]"
        );
        coupons_info.some((item, n) => {
          item.Couponinfo.some((ie, i) => {
            if (ie.checked) {
              this.parys[n].Couponinfo[i].checked = true;
            }else{
              if (typeof this.parys[n].Couponinfo[i].checked == "undefined") {
                this.$set(this.parys[n].Couponinfo[i], "checked", false);
              } else {
                this.parys[n].Couponinfo[i].checked = false;
              }
            }
          });
        });
         console.log(this.parys)
    },
    coupons_selected(item, i, coupon, e) {
      console.log(item, i, coupon, e);
      if (typeof coupon.checked == "undefined") {
        this.$set(coupon, "checked", true);
      } else {
        coupon.checked = !coupon.checked;
      }
      item.Couponinfo.forEach(k => {
        if (k.id != coupon.id) {
          if (typeof k.checked == "undefined") {
            this.$set(k, "checked", false);
          } else {
            k.checked = false;
          }
        }
      });
      //
      let store_price = 0;
      let coupon_amount = 0;
      let coupon_price = 0;
      let all_price = 0;
      this.parys.forEach(it => {
        console.log(it,34)
        if (it.store_id) {
          it.Couponinfo.forEach(im => {
            if (im.checked) {
              store_price += im.Coupon_amount;
            }
          });
        } else {
          all_price = it.order_goods_price;
          it.Couponinfo.forEach(ie => {
            if (ie.checked) {
              coupon_price = ie.Coupon_amount;
            }
          });
        }
        
      });
      console.log(coupon_price)
       console.log(all_price)
      this.parys.forEach(ent => {
        ent.preferential_price = (coupon_price / all_price) * ent.order_goods_price;
        if (ent.store_id) {
          ent.Couponinfo.forEach(ie => {
            if (
              ie.Coupon_order_amount >
              ent.goodall_price - ent.preferential_price
            ) {
              ie.show = true;
            } else {
              ie.show = false;
            }
          });
        } else {
          ent.Couponinfo.forEach(iet => {
            if (iet.Coupon_order_amount > ent.goodall_price - store_price) {
              iet.show = true;
            } else {
              iet.show = false;
            }
          });
        }
      });
      //
      console.log(this.parys);
    },
    confirm_but() {
      let coupons_list = [];
      this.parys.forEach(a => {
        a.Couponinfo.forEach(es => {
          if (es.checked) {
            es.store_id = a.store_id;
            coupons_list.push(es);
          }
        });
      });
      console.log(coupons_list, 22);
      sessionStorage.setItem("coupon_info", JSON.stringify(this.parys));
      this.$emit("confirm_but", coupons_list);
    },
    yu_mask() {
      this.if_coupons();
      this.$emit("yu_mask");
    }
  }
};
</script>

<style lang="scss" scoped>
.mask {
  width: 100%;
  height: 100vh;
  z-index: 333;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;

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
        margin-right: 0.2rem;
        margin-top: -2px;
        vertical-align: middle;
      }
    }

    p:nth-child(2) {
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
    height: calc(100vh - 5rem);
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: scroll;
    background-color: #f7f7f7;
    padding: 0.3rem;
    padding-top: 0px;
    box-sizing: border-box;
  }

  .centera {
    .aaa {
      width: 100%;
      .cou_center {
        box-shadow: 2px 2px 10px #e2e2e2;
        width: 100%;
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
          background-color: #33b6ff;
          width: 30%;
          height: 100%;

          .money {
            width: 100%;
            height: 100%;
            line-height: 1.6rem;
            text-align: center;
            font-size: 0.9rem;
            font-weight: bold;
            color: #fff;
            display: flex;
            justify-content: center;

            .fh {
              font-size: 0.1rem;
              font-weight: bold;
              line-height: 0.82rem;
            }
          }

          .cou_ke {
            font-size: 0.2rem;
            text-align: center;
            height: 40%;
            line-height: 0.5rem;
            font-weight: 400;
          }
        }

        .cou_time {
          width: 50%;
          height: 100%;
          font-size: 0.26rem;
          padding: 0.2rem 0;
          box-sizing: border-box;
          color: #fff;
          background-color: #33b6ff;

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
            font-weight: bold;
            margin-top: 0.06rem;
            font-size: 0.23rem;
          }
        }
      }
    }
  }
}

.check_box {
  height: 100%;
  width: 20%;
  position: relative;
  border-left: 2px dotted #33b6ff;
  background: #fff;

  .checkb {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    border: 1px solid #999999;
    box-sizing: border-box;
  }
  .check {
    background-color: #33b6ff;
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
</style>
