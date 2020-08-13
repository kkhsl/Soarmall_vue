<template>
  <div class="huodon_box">
    <div class="huodon">
      <div class="jd">
        <!-- :class="item.ratio==1?'shul1':'shul2'" -->
        <div class="point_num" v-if="goodsdeta.ratio<0.6">
          <p
            class="shul"
            :class="goodsdeta.goods_pointNum - goodsdeta.user_pointNum<6?'shul1':'shul2'"
            :style="'left:calc(' + goodsdeta.ratio*100 +'% - 0.28rem);'"
          >{{goodsdeta.user_pointNum}}/{{goodsdeta.goods_pointNum}}</p>
        </div>

        <div class="point_num" v-else>
          <p
            class="shul3"
            :class="goodsdeta.ratio==1?'shul4':'shul5'"
            :style="'right:calc(' + (1 - goodsdeta.ratio)*100 +'% - 0.28rem);'"
          >{{goodsdeta.user_pointNum}}/{{goodsdeta.goods_pointNum}}</p>
        </div>
        <div class="line">
          <p
            class="xs"
            :class="goodsdeta.goods_pointNum - goodsdeta.user_pointNum<5?'xs1':'xs2'"
            :style="'width:'+ goodsdeta.ratio*100 +'%;'"
          ></p>
        </div>
      </div>
      <div
        class="huoq huoq2"
        @click="to_entry"
        v-if="get_f ==0"
      >Get free remain: {{goodsdeta.goods_pointNum-goodsdeta.user_pointNum}}</div>
      <div class="huoq huoq3" v-if="get_f==1" @click="exchange(goodsdeta.goodsid)">Get free</div>
      <!-- <div class="huoq huoq4" @click="Login" v-if="get_f==2">
          Login
      </div>-->
    </div>
    <Popout :cue_words="cue_words" @popout_btn="popout_btn" v-if="if_cue"></Popout>
  </div>
</template>

<script>
export default {
  components: {
    Popout: () => import("@/whole/components/elastic/popout")
  },
  props: ["goodsdeta"],
  data() {
    return {
      cue_words: "Please add address",
      if_cue: false,
      get_f: 0
    };
  },
  created() {
    this.remain_();
  },
  methods: {
    remain_() {
      let goods_get = this.goodsdeta;
      let remain = goods_get.goods_pointNum - goods_get.user_pointNum;
      if (remain <= 0) {
        this.get_f = 1;
      } else {
        this.get_f = 0;
      }
    },
    async exchange(id) {
      let data = {
        id: id,
        gsp: "",
        color: "",
        count: 1,
        type: "get",
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.buy_now(data);
      if (res.code == 0) {
        this.$store.commit("submitBuyNow", res.data);
        this.$router.push({ path: "/whole/pay/payment_now" });
      } else if (res.code == 4205) {
        this.$router.push({ path: "/address" });
      } else if (res.code == 4220) {
        Toast({
          message: this.$t("common.Off shelf"),
          time: 2000,
          i: 1
        });
      } else if (res.code == -100) {
        this.$router.push({ path: "/account/login" });
      } else {
        Toast({
          message: this.$t("message.Server is busy"),
          time: 2000,
          i: 1
        });
      }
    },
    to_entry() {
      this.$router.push({
        path: "/home/Entry"
      });
    },
    popout_btn(id) {
      if (id == 0) {
        this.if_cue = false;
      }
      if (id == 1) {
        this.if_cue = false;
        this.$router.push({ path: "/address" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .huodon_box{
//   box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
// }
.huodon {
  width: 100%;
  height: 1.5rem;
  background: url(../../assets/img/FreeGit/di.png);
  // background: #33B6FF;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  box-sizing: border-box;
  .jd {
    width: 3.3rem;
    margin-top: 0.4rem;
    height: 1rem;
    .point_num {
      // width: 100%;
      margin-bottom: 0.1rem;
      height: 0.5rem;
      font-size: 0.3rem;
      font-family: "Calibri";
      line-height: 0.5rem;
      // display: flex;
      position: relative;
      .shul {
        top: 0;
        width: 1.4rem;
        height: 100%;
        color: #fff;
        border-radius: 0.15rem;
        text-align: center;
        padding: 0 0.1rem;
        position: absolute;
      }
      .shul::after {
        content: "";
        position: absolute;
        bottom: -0.1rem;
        left: 0.2rem;
        width: 0;
        height: 0;
        border-right: 0.08rem solid transparent;
        border-left: 0.08rem solid transparent;
      }
      .shul1 {
        background-color: #ff4c40;
      }
      .shul2 {
        background-color: #017ec2;
      }
      .shul2::after {
        border-top: 0.1rem solid #017ec2;
      }
      .shul1::after {
        border-top: 0.1rem solid #ff4c40;
      }
      .shul3 {
        top: 0;
        width: 1.4rem;
        height: 100%;
        color: #fff;
        border-radius: 0.15rem;
        text-align: center;
        padding: 0 0.1rem;
        // position: relative;
        position: absolute;
      }
      .shul3::after {
        content: "";
        position: absolute;
        bottom: -0.1rem;
        right: 0.2rem;
        width: 0;
        height: 0;
        border-right: 0.08rem solid transparent;
        border-left: 0.08rem solid transparent;
      }
      .shul4 {
        background-color: #ff4c40;
      }
      .shul5 {
        background-color: #017ec2;
      }
      .shul5::after {
        border-top: 0.1rem solid #017ec2;
      }
      .shul4::after {
        border-top: 0.1rem solid #ff4c40;
      }
    }
    .line {
      width: 100%;
      height: 0.06rem;
      background: #ebebeb;
      border-radius: 0.03rem;
      .xs {
        height: 100%;
        border-radius: 0.2rem;
      }
      .xs1 {
        background: #ff4c40;
      }
      .xs2 {
        background: #017ec2;
      }
    }
  }
  .huoq {
    margin-top: 0.45rem;
    height: 0.6rem;
    width: 2.6rem;
    padding: 0 0.05rem;
    box-sizing: border-box;
    border-radius: 0.3rem;
    font-size: 0.22rem;
    line-height: 0.6rem;
    font-family: "Calibri";
    font-weight: 400;
    color: #fff;
    overflow: hidden;
    text-align: center;
  }
  .huoq2 {
    background: #017ec2;
  }
  .huoq1,
  .huoq3,
  .huoq4 {
    background-color: #017ec2;
  }
}
</style>
