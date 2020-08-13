<template>
  <div
    class="record"
    id="dataList1"
  >
    <!-- 内容列表 -->
    <ul>
      <li
        class="record_box"
        v-for="(item, index) in items"
        :key="index"
      >
        <div class="order_number" :class="{'smallBar':$route.query.lang=='sa'}">
          <p><span>Order ID：</span><span>{{item.return_service_id}}</span></p>
          <p
            class="state"
            v-if="item.goods_return_status === 5"
          >{{$t("common.Merchant processing")}}</p>
          <p
            class="state"
            v-else-if="item.goods_return_status === 6"
          >{{$t("common.Agree to return")}}</p>
          <p
            class="state"
            v-else-if="item.goods_return_status === 7"
          >{{$t("common.Wait for businesses receiving")}}</p>
          <p
            class="state"
            v-else-if="item.goods_return_status === 8"
          >{{$t("common.Refunded")}}</p>
          <p
            class="state"
            v-else-if="item.goods_return_status === -1"
          >{{$t("common.Unable to return")}}</p>
        </div>
        <div class="conter_good">
          <div class="img">
            <img
              v-lazy="item.goods_info.goods_photo"
              alt
            />
          </div>
          <div class="goods_cont">
            <p
              class="line-clamp goods_n"
              :class="{'ltr':item.goods_info.goods_name.substr(0, 1) !== '^'}"
            >
              {{item.goods_info.goods_name.substr(0, 1) === '^' ? item.goods_info.goods_name.substr(1) : item.goods_info.goods_name}}
            </p>
            <div class="goods_s">
              <p class="size_"></p>
              <p class="item_">x{{item.return_goods_count}}</p>
            </div>
          </div>
        </div>

        <div class="style_th">
          <div class="z_zonghe">
            <div class="zongjia">
              <p>{{$t("common.Total")}}：</p>
              <p dir="ltr">
                <span>{{GLOBA.money_tag}} {{item.return_goods_all_price | integerNum}}</span>
                <span class="xiaoshu">.{{item.return_goods_all_price | decimalNum}}</span>
              </p>
            </div>
          </div>
          <div class="btn_">
            <!-- <p class="btn_box" v-if="item.goods_return_status == 5">取消退货</p> -->
            <!-- <p class="btn_box" v-if="item.goods_return_status == 6" @click="Address(item.return_id)">填写地址</p> -->
            <!-- <p class="btn_box" v-if="item.goods_return_status == 8">评价</p> -->
          </div>
        </div>
      </li>
    </ul>

    <!-- <div class="address_box" v-if="addressbox">
      <div class="number">
        <p>快递单号：</p>
        <input type="text" v-model="exp_number" />
      </div>
      <div class="btn">
        <p class="btn_f" @click="retur">返回</p>
        <p class="btn_q" @click="commit">确定</p>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  props: ["items", "ifmore_ts", "ifmore_bs"],
  data () {
    return {
      addressbox: false,
      exp_number: "",
      ship_save: {}
    };
  },
  created () {
    console.log(this.$route);
  },
  methods: {
    async Address (id) {
      let data = {
        id: id
      };
      let res = this.$HTTP.returnlog_view(data)
      if (res.code == 0) {
        this.addressbox = true;
        this.ship_save = res.data;
      }
    },
    retur () {
      this.addressbox = false;
    },
    async commit () {
      let dat = {
        id: this.ship_save.order_id,
        express_id: this.ship_save.exp_list[0].exp_id,
        express_code: this.exp_number
      };
      let res = await this.$HTTP.return_ship_save(dat)
      console.log(res);
    }
  }
};
</script>

<style lang="scss" scoped>
.record {
  width: 100%;
  //   height: calc(100vh - 2.2rem);
  background-color: #f7f7f7;
}
.record_box {
  width: 100%;
  background-color: #fff;
  // box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  margin-top: 0.3rem;
  font-family: "Calibri";
  font-weight: 400;
  color: #333;
  .order_number::before {
    position: absolute;
    top: 0.25rem;
    left: 0.3rem;
    content: "";
    width: 0.08rem;
    height: 0.26rem;
    background-color: #008edd;
  }
  .smallBar::before{
    right: 0.3rem
  }
  .order_number {
    background: #e9e9e9;
    margin-bottom: 0.1rem;
    padding: 0 0.5rem 0 0.5rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 0.72rem;
    line-height: 0.72rem;
    font-size: 0.26rem;
    position: relative;
    .state {
      color: #fc3a25;
      font-size: 0.3rem;
    }
  }
  .conter_good {
    display: flex;
    justify-content: flex-start;
    font-size: 0.3rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    .img {
      width: 1.76rem;
      height: 1.76rem;
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
    .goods_cont {
      width: calc(100% - 2.06rem);
      .goods_n {
        font-family: "Calibri";
        font-weight: 400;
        font-size: 0.26rem;
        color: #333;
        height: 0.7rem;
        line-height: 0.35rem;
      }
      .goods_s {
        display: flex;
        justify-content: space-between;
        margin-top: 0.1rem;
        height: 0.6rem;
        line-height: 0.6rem;
        .size_ {
          font-family: "Calibri-Bold";
          font-weight: Bold;
          font-size: 0.24rem;
          color: #b3b3b3;
        }
        .item_ {
          font-family: "Calibri";
          font-weight: 400;
          font-size: 0.3rem;
          color: #999;
        }
      }
      .goods_p {
        display: flex;
        justify-content: space-between;
        height: 0.6rem;
        line-height: 0.9rem;
        font-size: 0.26rem;
        font-family: "Calibri-Bold";
        font-weight: Bold;
        color: #333;
        .pric_r {
          height: 100%;
          .xiaoshu {
            font-size: 0.18rem;
            display: inline-block;
            line-height: 0.4rem;
            height: 100%;
            vertical-align: middle;
          }
        }
        .delivery {
          font-family: "Calibri";
          font-weight: 400;
          color: #999;
        }
      }
    }
  }
  .style_th {
    display: flex;
    justify-content: flex-start;
    border-top: 1px solid #ebebeb;
    padding: 0 0.3rem;
    box-sizing: border-box;
    .z_zonghe {
      box-sizing: border-box;
      width: 50%;
      height: 0.7rem;
      margin-top: 0.1rem;
      font-size: 0.3rem;
      .zongjia {
        width: 100%;
        height: 100%;
        line-height: 0.7rem;
        display: flex;
        font-family: "Calibri";
        font-weight: 400;
        p:nth-child(1) {
          font-family: "Calibri";
          font-weight: 400;
          color: #999999;
          font-size: 0.28rem;
        }
        p:nth-child(2) {
          font-family: "Calibri-Bold";
          font-weight: Bold;
          color: #ccc;
          font-size: 0.28rem;
          display: flex;
          justify-content: flex-start;
          span {
            color: black;
          }
          span:nth-child(2) {
            font-size: 0.18rem;
            line-height: 0.56rem;
          }
        }
      }
    }
    .btn_ {
      width: 47%;
      display: flex;
      .btn_box {
        margin-top: 0.44rem;
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
.address_box {
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 0.3rem;
  color: #333;
  height: calc(100vh - 1.5rem);
  width: 100%;
  background-color: #f7f7f7;
  padding: 0.3rem;
  box-sizing: border-box;
  .number {
    margin-top: 1rem;
    width: 100%;
    line-height: 0.6rem;
    input {
      outline: none;
      border: 1px solid #ccc;
      width: 100%;
      height: 0.6rem;
      padding: 0 0.3rem;
      box-sizing: border-box;
    }
  }
  .btn {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 0.32rem;
    line-height: 0.6rem;
    padding: 0 0.5rem;
    box-sizing: border-box;
    p {
      width: 2rem;
      text-align: center;
      border-radius: 0.3rem;
      color: #fff;
    }
    .btn_f {
      background-color: #ccc;
    }
    .btn_q {
      background-color: #0f99e7;
    }
  }
}
</style>
