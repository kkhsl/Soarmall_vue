<template>
  <div
    :class="GLOBA.content_center"
    id="dataList0"
  >
    <div class="order_all_box">
      <!-- 内容列表 -->
      <div
        class="content"
        v-for="(order,orderIndex) in items"
        :key="orderIndex"
      >
        <div
          class="state_box"
          @click="todianpu(order)"
        >
          <p class="gc1 cs"></p>
          <p class="img">
            <img v-lazy="order.store_logo" />
          </p>
          <p class="name">{{order.store_name}}</p>
        </div>
        <!-- 自营 -->
        <div
          class="order_box_t"
          v-for="(good,goodIndex) in order.goodsinfo_list"
          :key="goodIndex"
        >
          <div class="state">
            <!-- <P>Merchant Processing</P> -->
            <p v-if="good.goods_return_status == 5 ">Merchant Processing</p>
            <p v-else-if="good.goods_return_status == 6 ">Agree to return</p>
            <p v-else-if="good.goods_return_status == 7 ">Address</p>
            <p v-else-if="good.goods_return_status == 8 ">Return to complete</p>
          </div>
          <Ordgood
            :goods="good"
            :total_price="order.total_price"
            :delivery_visibility="false"
          ></Ordgood>
          <!-- <div class="order_box_b"> -->
          <!-- <div class="state_">
              <p class="pric_l">Total</p>
              <p class="pric_r">
                <span>{{GLOBA.money_tag}}{{good.goods_all_price | integerNum}}</span>
                <span class="xiaoshu">.{{good.goods_all_price | decimalNum}}</span>
              </p>
            </div> -->
          <div class="style_th">
            <div class="z_zonghe">
              <div class="yunfei">
                <p>{{$t("common.Delivery")}}:</p>
                <p dir="ltr">
                  <span>{{GLOBA.money_tag}}&nbsp;&nbsp;{{order.order_ship_price}}</span>
                  <span>.00</span>
                </p>
              </div>

              <div class="zongjia">
                <p>{{$t("common.Total")}}:</p>
                <p dir="ltr">
                  <span>{{GLOBA.money_tag}}&nbsp;&nbsp;{{order.total_price | integerNum}}</span>
                  <span class="xiaoshu">.{{order.total_price | decimalNum}}</span>
                </p>
              </div>
            </div>
            <div class="btn_">
              <p
                class="btn_box"
                v-if="typeof good.goods_return_status == 'undefined'"
                @click="after_sale(good,order.id,)"
              >{{$t("common.Apply for return")}}</p>
              <!-- <p class="btn_box" v-if="good.goods_return_status == 5 ">取消退货</p>
						  <p class="btn_box" v-if="good.goods_return_status == 6 " @click="Address">Address</p>-->
            </div>
          </div>

          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Ordgood from "@/whole/components/order_return/orders_goods";
export default {
  components: { Ordgood },
  props: ["items", "ifmore_t", "ifmore_b"],
  data () {
    return {
      datalist: {}
    };
  },
  methods: {
    // 店铺链接
    todianpu (good) {
      let to_data = {
        dianpu: good,
        id: 1
      };
      console.log(good);
      this.$router.push({
        path: "/subpages/cate_goods02",
        query: { to_data: to_data }
      });
    },
    //  申请退货
    async after_sale (good, id) {
      const data = {
        goods_gsp_ids: good.goods_gsp_ids,
        id: good.goods_id,
        oid: id,
      };
      let res = await this.$HTTP.return_apply(data)
      if (res.code == -100) {
        localStorage.setItem("Flag", " ");
        this.$router.push({ path: "/account/login" });
      }
      if (res.code == 0) {
        this.datalist = res.data
        this.$router.push({
          path: "/subpages/Account/returns/return_details",
          query: { good: this.datalist }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.order_all_box {
  width: 100%;
  padding: 0.3rem 0.3rem 0;
  box-sizing: border-box;
  .content {
    width: 6.9rem;
    background-color: #fff;
    box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
    margin-bottom: 0.3rem;
    // .state_box .gcl {
    //   width: 0.08rem;
    //   height: 0.26rem;
    //   background-color: #008edd;
    // }
    .state_box {
      padding: 0 0.3rem;
      box-sizing: border-box;
      position: relative;
      height: 0.72rem;
      line-height: 0.72rem;
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      color: #333;
      display: flex;
      justify-content: flex-start;
      .cs {
        position: absolute;
        top: 0.24rem;
        content: "";
        width: 0.08rem;
        height: 0.26rem;
        background-color: #008edd;
      }
      .img {
        width: 0.32rem;
        height: 0.32rem;
        margin-top: 0.2rem;
        padding: 0 0.1rem;

        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
      .name {
        margin: 0 0.1rem;
        font-size: 0.24rem;
      }
    }
    .order_box_t {
      position: relative;
      width: 100%;
      border-bottom: 1px solid #ebebeb;
      padding: 0 0.3rem;
      box-sizing: border-box;
      .state {
        position: absolute;
        right: 0.3rem;
        top: -0.46rem;
        font-family: "Calibri-Bold";
        font-weight: Bold;
        font-size: 0.22rem;
        color: #fc3a25;
      }
      .order_box_b {
        width: 100%;
        height: 0.64rem;
        padding-bottom: 0.2rem;
        // box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .state_ {
          font-family: "Calibri-Bold";
          font-weight: Bold;
          font-size: 0.3rem;
          width: 60%;
          display: flex;
          justify-content: flex-start;
          line-height: 0.6rem;
          .pric_l {
            color: #999;
            margin-right: 0.3rem;
          }
          .pric_r {
            color: #333;
            .xiaoshu {
              font-size: 0.2rem;
              display: inline-block;
              line-height: 0.4rem;
              height: 100%;
              vertical-align: middle;
            }
          }
        }
      }
      .style_th {
        display: flex;
        justify-content: flex-start;
        border-top: 1px solid #ebebeb;
        .z_zonghe {
          box-sizing: border-box;
          width: 50%;
          height: 1.2rem;
          margin-top: 0.1rem;
          font-size: 0.32rem;

          .yunfei {
            width: 100%;
            height: 0.6rem;
            line-height: 0.6rem;
            display: flex;
            font-family: "Calibri";
            font-weight: 400;
            font-size: 0.25rem;
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
          .zongjia {
            width: 100%;
            height: 0.6rem;
            line-height: 0.6rem;
            display: flex;
            font-family: "Calibri";
            font-weight: 400;
            font-size: 0.27rem;
            p:nth-child(1) {
              font-family: "Calibri";
              font-weight: 400;
              color: #999999;
              font-size: 0.26rem;
            }
            p:nth-child(2) {
              font-family: "Calibri-Bold";
              font-weight: Bold;
              color: #ccc;
              font-size: 0.26rem;
              display: flex;
              justify-content: flex-start;
              span {
                color: black;
              }
              span:nth-child(2) {
                font-size: 0.18rem;
                line-height: 0.4rem;
                vertical-align: middle;
              }
            }
          }
        }
        .btn_ {
          width: 47%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .btn_box {
            text-align: center;
            height: 0.6rem;
            line-height: 0.6rem;
            font-family: "Calibri-Bold";
            font-weight: Bold;
            font-size: 0.21rem;
            border-radius: 0.3rem;
            padding: 0 0.2rem;
            margin-left: 0.3rem;
            border: 1px solid #017ec2;
            color: #017ec2;
          }
        }
      }
    }
  }
}
</style>
