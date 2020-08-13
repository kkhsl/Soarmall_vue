<template>
  <div class="sj_yanzheng">
    <div class="sj_haoma">
      <img src="@/assets/img/other/dh.png" alt />
      <p :class="GLOBA.marg">
        +{{GLOBA.phone_tag}}
        <input
          type="number"
          :placeholder="pn"
          v-model="phone1"
          pattern="^5\d{9}$"
        />
      </p>
    </div>
    <div class="sj_yzm">
      <img src="@/assets/img/other/hxz.png" alt />
      <p class="p1">
        <input type="text" :placeholder="vc" v-model="code_" @input="input($event.target.value)" />
      </p>
      <p class="p2" v-if="times === 0" v-click="code_btn">{{$t("common.Send")}}</p>
      <p class="p2" v-else-if="times === 1">{{count}}s</p>
      <!-- <p class="overstep" v-if="is_overstep" @click="buy_now"></p> -->
    </div>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
export default {
  props: ["phone", "istimes"],
  model: {
    prop: "code",
    event: "input"
  },
  data() {
    return {
      pn: this.$t("common.Phone number"),
      vc: this.$t("tips.Verification code"),
      times: 0,
      count: 0,
      phone1: this.phone,
      code_: ""
    };
  },
  watch: {
    phone() {
      this.phone1 = this.phone;
      this.code_ = "";
    }
  },
  activated() {
    this.code_ = "";
  },
  methods: {
    input(value) {
      let code_phone = {
        code: value,
        phone: this.phone1
      };
      this.$emit("input", code_phone);
    },
    // 发送验证码
    async code_btn() {
      if (this.phone1 == "") {
        Toast({
          message: this.$t("message.Please fill in your mobile number"),
          time: 2000,
          i: 1
        });
      }
      if (this.phone1 != "") {
        const data = {
          type: "mobile_verify_code",
          mobile: this.GLOBA.phone_tag + this.phone1
        };
        let res = await this.$HTTP.Order_verify(data);
        if (res.code == 0) {
          Toast({
            message: this.$t("message.Valid time of verification code"),
            time: 2000,
            i: 2
          });
          this.times = 1;
          const TIME_COUNT = 59;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                console.log(this.count);
                this.count--;
              } else {
                clearInterval(this.timer);
                this.timer = null;
                // 跳转的页面写在此处
                this.times = 0;
              }
            }, 1000);
          }
        } else if (res.code == 4240) {
          Toast({
            message: "Wrong format of mobile number",
            time: 3000,
            i: 1
          });
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            time: 3000,
            i: 1
          });
        }
      }
    }
  },
  deactivated() {
    if (this.timer) {
      //如果定时器在运行则关闭
      this.times = 0;
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang='scss' scoped>
.sj_yanzheng {
  width: 100%;
  height: 2rem;
  background: #fff;
  margin-top: 0.3rem;
  font-size: 0.28rem;

  .sj_haoma {
    height: 1rem;
    width: 100%;
    padding: 0.1rem 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;

    img {
      width: 0.22rem;
      height: 0.32rem;
      margin-top: 0.3rem;
    }

    p {
      border-bottom: 1px solid #d7d7d7;
      width: 100%;
      height: 0.8rem;
      padding: 0.2rem 0 0 0;
      box-sizing: border-box;
      font-size: 0.26rem;
      font-family: "Calibri";
      font-weight: 400;

      input {
        width: 80%;
        border: none;
        margin-left: 0.2rem;
        line-height: 0.4rem;
        outline: none;
        font-size: 0.2rem;
      }

      input::-webkit-input-placeholder {
        color: #ccc;
        font-size: 0.26rem;
        font-weight: 400;
        font-family: "Calibri";
      }
    }
  }

  .sj_yzm {
    height: 1rem;
    width: 100%;
    padding: 0.1rem 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    position: relative;

    img {
      width: 0.26rem;
      height: 0.32rem;
      margin-top: 0.2rem;
    }

    .p1 {
      width: 3.7rem !important;
      height: 0.7rem;
      margin: 0 0.3rem;
      border-bottom: 1px solid #d7d7d7;
      width: 100%;
      box-sizing: border-box;
      font-size: 0.26rem;
      font-family: "Calibri";
      font-weight: 400;

      input {
        border: none;
        line-height: 0.5rem;
        outline: none;
        font-size: 0.2rem;
      }

      input::-webkit-input-placeholder {
        color: #ccc;
        font-size: 0.26rem;
        font-weight: 400;
        font-family: "Calibri";
      }
    }

    .p2 {
      width: 1.7rem;
      height: 0.6rem;
      line-height: 0.6rem;
      text-align: center;
      border: 1px solid #017ec2;
      border-radius: 0.3rem;
      font-size: 0.28rem;
      font-family: "Calibri";
      font-weight: 400;
      color: #017ec2;
    }

    .overstep {
      position: absolute;
      top: 0.1rem;
      right: 0.3rem;
      width: 1.7rem;
      height: 0.6rem;
      border-radius: 0.3rem;
      z-index: 1;
      border: 1px solid rgba(0, 0, 0, 0.2);
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>