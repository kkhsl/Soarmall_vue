<template>
  <div class="full_page">
    <publicHead>
      <h6 slot="headCenter">{{$t("title.Order")}}</h6>
    </publicHead>
    <div class="order_details centerWrapNoFoot">
      <div class="details_hea">
        <p class="status_name" v-if="goodsinfo.Order_status == 10 || goodsinfo.Order_status == 16">
          <img src="@/assets/img/other/pending.png" alt />
          {{$t("common.Pending")}}
        </p>
        <p class="status_name" v-if="goodsinfo.Order_status == 30">
          <img src="@/assets/img/other/Shipping.png" alt />
          {{$t("common.Shipped")}}
        </p>
        <p
          class="status_name"
          v-if="goodsinfo.Order_status == 40 || goodsinfo.Order_status == 35 && goodsinfo.Order_status != 65"
        >
          <img src="@/assets/img/other/Unreviewed.png" alt />
          {{$t("common.Review")}}
        </p>
        <p class="status_name" v-if="goodsinfo.Order_status == 0">
          <img src alt />
          {{$t("common.Canceled")}}
        </p>
        <p class="status_name" v-if="goodsinfo.Order_status == 50">
          <img src alt />
          {{$t("common.Finish")}}
        </p>

        <p
          @click="chakan(goodsinfo.Order_id)"
          class="logistics"
          v-if="goodsinfo.Order_status >30"
        >{{$t("common.Express tracking")}}</p>
      </div>

      <div class="details_box">
        <div class="xinxi">
          <p class="img" :class="{'mrg_l':this.$route.query.lang=='sa'}">
            <img src="@/assets/img/other/rt.png" alt />
          </p>
          <p>{{goodsinfo.Receiver_Name}}</p>
        </div>
        <div class="xinxi">
          <p class="img" :class="{'mrg_l':this.$route.query.lang=='sa'}">
            <img src="@/assets/img/other/dh.png" alt />
          </p>
          <p>+{{GLOBA.phone_tag}} {{goodsinfo.Receiver_telephone}}</p>
        </div>
        <div class="dizhi">
          <p>
            <img
              :class="{'mrg_l':this.$route.query.lang=='sa'}"
              src="@/assets/img/other/dw.png"
              alt
            />
          </p>
          <p>{{goodsinfo.Receiver_area}},{{goodsinfo.Receiver_area_info}}</p>
        </div>
      </div>

      <div class="goods_box">
        <div class="shop_box" :class="{'smallBar':this.$route.query.lang=='sa'}">
          <p class="shop_name">
            <img v-lazy="goodsinfo.store.store_logo" alt />
            <span>{{goodsinfo.store.store_name}}</span>
          </p>
        </div>
        <div class="shop_content" v-for="(good, index_) in goodsinfo.goodsinfo" :key="index_">
          <div class="shop_xx" @click="commodity(good.goods_id)">
            <div class="shop_img">
              <img v-lazy="good.goods_mainphoto_path" alt />
            </div>
            <div class="shop_text">
              <div
                class="productName"
                :class="[{'ltr':good.goods_name.substr(0, 1) !== '^'}]"
              >{{good.goods_name.substr(0, 1) === '^' ? good.goods_name.substr(1) : good.goods_name}}</div>
              <div class="productSize">
                <p>{{good.good_specs?good.good_specs:good.goods_gsp_val}} <span v-if="good.goods_color">color：{{good.goods_color}}</span></p>
                <p>x{{good.goods_count}}</p>
              </div>
              <div class="productModel">
                <p>
                  <img :class="GLOBA.marg01" src="@/assets/img/other/snapchat.png" alt />
                  {{$t("common.Snapshot")}}
                </p>
                <p dir="ltr">
                  <span>{{GLOBA.money_tag}} {{(good.goods_current_price||good.goods_price) | integerNum}}</span>
                  <span>.{{(good.goods_current_price||good.goods_price) | decimalNum}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="z_zonghe">
          <div class="yunfei">
            <div class="free">
              <p v-if="goodsinfo.free">free shipping</p>
            </div>
            <div class="deliv">
              <p>{{$t("common.Delivery")}}:</p>
              <p dir="ltr">
                <span>{{GLOBA.money_tag}} {{goodsinfo.Ship_price | integerNum}}</span>
                <span>.{{goodsinfo.Ship_price | decimalNum}}</span>
              </p>
            </div>
          </div>

          <div class="zongjia">
            <div class="coupon">
              <p
                v-if="goodsinfo.store_coupon_price"
              >Store coupon - {{GLOBA.money_tag}} {{goodsinfo.store_coupon_price}}</p>
              <p
                v-if="goodsinfo.general_counpon_info"
              >Soamall coupon - {{GLOBA.money_tag}} {{goodsinfo.general_counpon_info}}</p>
            </div>
            <div class="total">
              <p>{{$t("common.Total")}}:</p>
              <p dir="ltr">
                <span>{{GLOBA.money_tag}} {{goodsinfo.TotalPrice | integerNum}}</span>
                <span class="xiaoshu">.{{goodsinfo.TotalPrice | decimalNum}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="de_foot">
        <div
          class="fo_title"
          :class="{'r_bar':this.$route.query.lang=='sa'}"
        >{{$t("common.Informations")}}</div>
        <div class="ul_center">
          <ul>
            <li>
              <p>{{$t("common.Order number")}}：</p>
              <p>{{goodsinfo.Order_id}}</p>
            </li>
            <li>
              <p>{{$t("common.Time")}}：</p>
              <p>{{goodsinfo.PayTime}}</p>
            </li>
            <li>
              <p>{{$t("common.Methods")}}：</p>
              <p>{{goodsinfo.PayType}}</p>
            </li>
            <li>
              <p>{{$t("common.Mode of distribution")}}：</p>
              <p>{{goodsinfo.Transport}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Logistics v-if="cs_region" :list="list" @wancheng="wancheng"></Logistics>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Logistics from "@/whole/components/order_return/logistics";
export default {
  components: { publicHead, Logistics },

  data() {
    return {
      statu_or: {},
      goodsinfo: {},
      cs_region: false,
      list: [],
    };
  },
  mounted() {
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.cs_region) {
          this.cs_region = !this.cs_region;
        } else {
          //  this.$router.go(-1)
        }
      },
      false
    );
  },
  created() {
    this.list.reverse();
  },
  activated() {
    if (this.$route.meta.isBack) {
      this.statu_or = this.$route.query.good;
      this.details_orde();
    }
  },
  beforeRouteEnter(to, from, next) {
    window.removeEventListener(
      "popstate",
      (e) => {
        if (this.cs_region) {
          this.cs_region = !this.cs_region;
        } else {
          //  this.$router.go(-1)
        }
      },
      false
    );
    if (from.name === "Orders") {
      to.meta.isBack = true;
    }
    next();
  },
  methods: {
    wancheng() {
      this.cs_region = false;
      this.$router.go(-1);
    },
    async chakan(shipCode) {
      let res = await this.$PHP.logistics(shipCode);
      if (res.code == 0) {
        let len = res.data.list.length;
        this.list = [];
        res.data.list.forEach((item, index) => {
          let obj = item;
          this.list.push(obj);
        });
      }
      this.cs_region = true;
      window.history.pushState(null, null, "#");
    },
    snapshot() {
      this.$router.push({ path: "/home/snapshot" });
    },
    commodity(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    },
    async details_orde() {
      let data = {
        id: this.statu_or.id,
        language: this.$route.query.lang === "sa" ? 1 : 0,
      };
      let res = await this.$HTTP.order_view(data);
      if (res.code == 0) {
        if (typeof res.data.goodsinfo !== "undefined") {
          res.data.goodsinfo.forEach((e) => {
            let goods_specs = e.goods_gsp_val.split("<br>").join(",");
            e.good_specs = goods_specs.substring(
              0,
              goods_specs.lastIndexOf(",")
            ); //删除最后一个，号
          });
          if (res.data.store_enough_free_price) {
            if (res.data.store_enough_free_price - res.data.TotalPrice < 0) {
              res.data.free = true;
            }
          }
        }
        this.goodsinfo = res.data;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.order_details::-webkit-scrollbar {
  display: none;
}
.order_details {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background: #f7f7f7;
  .details_hea {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 0.3rem;
    box-sizing: border-box;
    height: 0.8rem;
    line-height: 0.8rem;
    .status_name {
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.3rem;
      color: #333;
      img {
        width: 0.25rem;
        height: 0.25rem;
      }
    }
    .logistics {
      font-family: "Calibri";
      font-weight: 400;
      font-size: 0.24rem;
      color: #017ec2;
    }
  }
  .details_box {
    background-color: #fff;
    margin: 0.1rem 0;
    font-size: 0.24rem;
    padding: 0.3rem;
    box-sizing: border-box;
    font-family: "Calibri";
    font-weight: 400;
    .xinxi {
      align-items: center;
      font-size: 0.3rem;
      display: flex;
      justify-content: flex-start;
      line-height: 0.36rem;
      margin-bottom: 0.1rem;
      .img {
        padding-right: 0.2rem;
        img {
          width: 0.24rem;
        }
      }
      .mrg_l {
        padding-left: 0.2rem;
        padding-right: 0;
      }
    }
    .dizhi {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 0.24rem;
        padding-right: 0.2rem;
      }
      .mrg_l {
        padding-left: 0.2rem;
        padding-right: 0rem;
      }
      p:nth-child(2) {
        font-size: 0.26rem;
        font-family: "Calibri";
        font-weight: 400;
        word-break: break-all;
      }
    }
  }
  .goods_box {
    background-color: #fff;
  }
  .shop_box::before {
    content: "";
    width: 0.08rem;
    height: 0.26rem;
    position: absolute;
    top: 0.03rem;
    left: 0;
    background-color: #008edd;
  }
  .smallBar::before {
    right: 0;
  }
  .shop_box {
    position: relative;
    display: flex;
    justify-content: space-between;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.24rem;
    width: calc(100vw - 0.6rem);
    color: #333;
    margin: 0 0.3rem;
    .shop_name {
      display: flex;
      align-items: center;
      height: 0.32rem;
      line-height: 0.32rem;
      padding: 0 0.2rem;
      img {
        width: 0.32rem;
        height: 0.32rem;
      }
    }
  }
  .shop_content {
    width: 100%;
    padding: 0 0.3rem;
    box-sizing: border-box;
    .shop_xx {
      height: 1.76rem;
      margin-top: 0.2rem;
      border-bottom: 1px solid #ebebeb;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      .shop_img {
        width: 1.76rem;
        height: 1.7rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .shop_text {
        display: flex;
        flex-direction: column;
        padding: 0 0.3rem;
      }
    }
  }

  .z_zonghe {
    padding: 0 0.3rem;
    box-sizing: border-box;
    width: 100%;
    height: 1.2rem;
    font-size: 0.32rem;
    background: #fff;

    .yunfei {
      width: 100%;
      height: 0.5rem;
      line-height: 0.6rem;
      display: flex;
      justify-content: space-between;
      font-family: "Calibri";
      font-weight: 400;
      font-size: 0.25rem;
      .free {
        font-family: "Calibri";
        font-weight: 400;
        color: #999999;
      }
      .deliv {
        display: flex;
        justify-content: flex-end;
        p:nth-child(1) {
          font-family: "Calibri";
          font-weight: 400;
          color: #999999;
          font-size: 0.25rem;
        }
        p:nth-child(2) {
          font-family: "Calibri";
          font-weight: 400;
          color: #999999;
          font-size: 0.25rem;
          display: flex;
          justify-content: flex-start;

          span:nth-child(2) {
            font-size: 0.18rem;
            line-height: 0.45rem;
            vertical-align: middle;
          }
        }
      }
    }
    .zongjia {
      width: 100%;
      height: 0.6rem;
      line-height: 0.6rem;
      display: flex;
      justify-content: space-between;
      .coupon {
        font-family: "Calibri";
        font-weight: 400;
        color: #999;
        font-size: 0.22rem;
        p {
          line-height: 0.26rem;
        }
      }
      .total {
        display: flex;
        justify-content: flex-end;
        font-size: 0.26rem;
        p:nth-child(1) {
          font-family: "Calibri";
          font-weight: 400;
          color: #999999;
        }
        p:nth-child(2) {
          font-family: "Calibri-Bold";
          font-weight: Bold;
          color: #333;
          display: flex;
          justify-content: flex-start;
          span:nth-child(2) {
            font-size: 0.18rem;
            line-height: 0.4rem;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .de_foot {
    margin-top: 0.3rem;
    width: 100%;
    background: #fff;
    padding: 0.1rem 0.3rem 0.2rem;
    box-sizing: border-box;
    .fo_title::before {
      content: "";
      width: 0.08rem;
      height: 0.26rem;
      position: absolute;
      top: 0.17rem;
      left: 0;
      background-color: #008edd;
    }
    .fo_title {
      position: relative;
      width: 100%;
      height: 0.6rem;
      line-height: 0.6rem;
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
      color: #333;
      padding: 0 0.2rem;
      box-sizing: border-box;
    }
    .r_bar::before {
      right: 0;
    }
    .ul_center {
      ul {
        li {
          display: flex;
          padding: 0 0.3rem;
          font-size: 0.24rem;
          height: 0.5rem;
          line-height: 0.5rem;
          font-family: "Calibri";
          font-weight: 400;
          color: #333;
          p:nth-child(2) {
            padding: 0 0.2rem;
          }
        }
      }
    }
  }
  .shop_foot {
    // box-shadow: 2px 7px 10px #e2e2e2;
    font-size: 0.32rem;
    display: flex;
    justify-content: space-between;
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.6rem;
    border-top: 1px solid #ebebeb;
    p:nth-child(1) {
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
      color: #999999;
    }
    p:nth-child(2) {
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
      span:nth-child(2) {
        font-size: 0.18rem;
        line-height: 0.5rem;
        vertical-align: middle;
      }
    }
  }
}

.cs_foot {
  width: 90%;
  height: 1rem;
  padding: 0.1rem 0px;
  box-sizing: border-box;
  margin: auto;

  .cs_bottom {
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    width: 100%;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #33b6ff, #017ec2);
    font-size: 0.32rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #fff;
    border-radius: 0.6rem;
  }
}
.productModel {
  font-size: 0.24rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
  p:nth-child(1) {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.26rem;
    color: #008edd;
    img {
      width: 0.18rem;
      height: 0.18rem;
    }
  }
  p:nth-child(2) {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.26rem;
    display: flex;
    justify-content: flex-start;
    span:nth-child(2) {
      font-size: 0.18rem;
      line-height: 0.2rem;
      vertical-align: middle;
    }
  }
  p:nth-child(3) {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.26rem;
    color: #999999;
  }
}
.productName {
  width: 4.6rem;
  height: 0.54rem;
  line-height: 0.26rem;
  font-size: 0.26rem;
  font-family: "Calibri";
  font-weight: 400;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.productSize {
  font-size: 0.32rem;
  display: flex;
  justify-content: space-between;
  margin-top: 0.26rem;
  height: 0.2rem;
  line-height: 0.2rem;

  p:nth-child(1) {
    width: 3.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.24rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #b3b3b3;
  }
  p:nth-child(2) {
    font-size: 0.3rem;
    font-family: "Calibri";
    font-weight: 400;
    color: #999999;
  }
}
.xz_title {
  height: 1.36rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;

  p:nth-child(1) {
    width: 0.7rem;
    height: 0.52rem;
    margin: 0 0.3rem;

    img {
      height: 100%;
      width: 100%;
    }
  }

  p:nth-child(2) {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.36rem;
    color: #333;
    height: 100%;
    width: 5.36rem;
    line-height: 1.36rem;
  }

  p:nth-child(3) {
    width: 0.24rem;
    height: 0.24rem;
    margin-top: 0.44rem;
    margin-left: 0.3rem;
    position: relative;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}

.xz_piece {
  width: 100%;
  height: calc(100vh - 5.5rem);
  padding: 0 0.3rem 0 1.3rem;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;

  ul {
    width: 100%;

    li {
      width: 100%;
      font-size: 0.36rem;
      font-family: "Calibri";
      font-weight: 400;
      color: #333;
      height: 1rem;
      border: 1px solid #ccc;
      line-height: 1rem;
      border: none;
      border-bottom: 1px solid #ebebeb;
    }
  }
}
</style>
