<template>
  <div class="Returns">
    <Header ref="child" :iffanhui="true" :cart="true" :search="true"></Header>
    <div class="content">
      <p class="ordern">Order Number:{{adersid.order}}</p>
      <Ordgood :goods="adersid.good"></Ordgood>
      <div class="number_box">
        <p>Quantity:</p>
        <XNumber :min="1" :max="adersid.good.goods_count" v-model="count"></XNumber>
      </div>
    </div>
    <!-- 退换选项 -->
    <div class="replacement_box">
      <div class="replacement" @click="retreat(adersid)">
        <p>
          <i class="iconfont iconsalesreturn"></i>
          <span>Returns</span>
        </p>
        <i class="iconfont iconxiangyou"></i>
      </div>
      <div class="replacement" @click="retreat">
        <p>
          <i class="iconfont iconhuanhuoguanli"></i>
          <span>Barter</span>
        </p>
        <i class="iconfont iconxiangyou"></i>
      </div>
    </div>
    <div></div>
    <!-- 退换原因 -->
    <div class="reason_box" v-show="reason_show">
      <div class="opacity" @click="reviews_show"></div>
      <div class="reviews_cont">
        <div class="reason_hear">
          <p>申请原因</p>
          <i class="iconfont iconguanbi" @click="reviews_show"></i>
        </div>
        <ul>
          <li>
            <p>质量问题</p>
            <input type="radio" @click="reviews_show" />
          </li>
          <li>
            <p>发错货</p>
            <input type="radio" @click="reviews_show" />
          </li>
          <li>
            <p>商品降价</p>
            <input type="radio" @click="reviews_show" />
          </li>
          <li>
            <p>其他</p>
            <input type="radio" @click="reviews_show" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/whole/components/header/header_A";
import { XNumber } from "vux";
import Ordgood from "@/whole/components/order_return/orders_goods";
export default {
  components: { Header, XNumber, Ordgood },
  data() {
    return {
      name: "Choose After Sale Type",
      h_imga: {
        f_imga: require("@/assets/img/other/xiangzuo.png")
      },
      reason_show: false,
      adersid: {},
      count: 1
    };
  },
  created() {
    // this.adersid = this.$route.query;
    this.adersid = this.$store.state.gwcjs;
    console.log(this.adersid);
  },
  methods: {
    async retreat(item) {
      console.log(item);
      // this.reason_show=true
      const data = {
        id: item.id,
        oid: item.oid,
        goods_gsp_ids: item.goods_gsp_ids
      };
      let res = await this.$HTTP.return_apply(data)
      if (res.code == -100) {
        localStorage.setItem("Flag", " ");
        this.$router.push({ path: "/account/login" });
      }
      if (res.code == 0) {
        this.$router.push({
          path: "/subpages/Account/returns/return_details",
          query: { good: res.data }
        });
      }
    },
    reviews_show() {
      this.$router.push({ path: "/subpages/Account/returns/return_details" });
      //  this.reason_show=false
    }
  }
};
</script>

<style lang="scss" scoped>
.Returns {
  width: 100%;
}
.content {
  margin-top: 1.3rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  .ordern {
    line-height: 0.4rem;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.24rem;
    color: #333;
    margin-bottom: 2px;
  }

  .number_box {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
    height: 1rem;
    line-height: 1rem;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #333;
  }
}
.replacement_box {
  margin: 0.3rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 0.1rem;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  .replacement {
    display: flex;
    justify-content: space-between;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #f5f5f5;
    font-size: 0.3rem;
    font-family: "Calibri";
    font-weight: 400;
    color: #333;

    p {
      i {
        font-size: 20px;
        color: #f90;
      }
    }
  }
}
.reason_box {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 2%;
  box-sizing: border-box;
  //   background-color: #f3f;
  .opacity {
    width: 100%;
    height: 50%;
    background-color: #ccc;
    opacity: 0.3;
  }
  .reviews_cont {
    width: 100%;
    height: 50%;
    background-color: #fff;
    padding: 1% 2%;
    // border-top: 1px solid #f60;
    box-shadow: 0px 0px 5px #ccc;
    box-sizing: border-box;
    .reason_hear {
      height: 40px;
      line-height: 40px;
      font-weight: 600;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      i {
        position: absolute;
        top: 0;
        right: 0;
        color: #f90;
        font-size: 20px;
        line-height: 30px;
      }
    }
    ul {
      height: 40px;
      line-height: 40px;
      li {
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        justify-content: space-between;
        input {
          width: 20px;
          height: 20px;
          margin-top: 10px;
          color: #f90;
        }
      }
    }
  }
}
</style>
