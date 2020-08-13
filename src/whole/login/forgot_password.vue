<template>
  <div class="mask">
    <div class="psw_xiugai">
      <div class="psw_title">
        <p>{{$t("common.Forgot password?")}}</p>
        <p @click="wj_xiaoshi()">
          <img src="@/assets/img/other/cols.png" />
        </p>
      </div>
      <div class="psw_conter">
        <ul>
          <li>
            <p class="img_icon">
              <img src="@/assets/img/other/dh.png" alt />
            </p>
            <p>
              <input type="number" :placeholder="p_num" v-model="phone1" />
            </p>
          </li>
          <li>
            <p class="img_icon">
              <img src="@/assets/img/other/bz.png" alt />
            </p>
            <p>
              <input type="text" :placeholder="v_cod" v-model="ver_code" />
            </p>
            <p v-if="times === 0" @click="code_btn1">{{$t("common.Send")}}</p>
            <p v-if="times === 1">{{count}}</p>
          </li>
          <li class="password_nc">
            <p>{{$t("common.Username")}}</p>
            <p>
              <input type="text" :placeholder="p_name" v-model="u_name" />
            </p>
          </li>
          <li class="password_nc">
            <p>{{$t("common.New Password")}}</p>
            <p>
              <input type="password" :placeholder="p_name" v-model="p_psw" />
            </p>
          </li>
        </ul>
      </div>
      <div class="button" @click="xiugai_sc">{{$t("common.Comfirm")}}</div>
    </div>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
export default {
  data() {
    return {
      p_num: this.$t("tips.Please fill in your mobile"),
      v_cod: this.$t("tips.Verification code"),
      p_name: this.$t("tips.Please fill in your username"),
      phone1: "",
      ver_code: "",
      times: 0,
      u_name: "",
      p_psw: "",
      count:''
    };
  },
  created() {},
  mounted() {},
  methods: {
    wj_xiaoshi() {
      this.$emit("wj_xiaoshi");
    },
    xiugai_sc() {
      const data = {
        mobile: this.phone1,
        mobile_verify_code: this.ver_code,
        userName: this.u_name,
        password: this.p_psw
      };
      this.$HTTP.forget(data).then(res => {
        switch (res.code) {
          case 0:
            this.$emit("wj_xiaoshi");
            Toast({
              message: this.$t("common.Success"),
              time: 2000
            });
            break;
          case 1:
            Toast({
              message: this.$t("message.Change password failed"),
              time: 2000,
              i: 1
            });
            break;
          case 2:
            Toast({
              message: this.$t("message.The phone number is wrong"),
              time: 2000,
              i: 1
            });
            break;
          case 3:
            Toast({
              message: this.$t("message.The user name inexistence"),
              time: 2000,
              i: 1
            });
            break;
          default:
            Toast({
              message: this.$t("message.Modification failed"),
              time: 2000,
              i: 1
            });
        }
      });
    },
    // 忘记密码发送验证码
    async code_btn1() {
      if (this.phone1 == "") {
        Toast({
          message: this.$t("message.Please fill in your mobile number"),
          time: 2000,
          i: 1
        });
      } else {
        const data = {
          type: "mobile_verify_code",
          mobile: this.GLOBA.phone_tag + this.phone1
        };
        let res = await this.$HTTP.app_verify(data);
        if (res.code == 0) {
          this.times = 1;
            const TIME_COUNT = 59;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0) {
                  this.count--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                  // 跳转的页面写在此处
                  this.times = 0;
                }
              }, 1000);
            }
        } else {
          Toast({
            message: this.$t("message.Server is busy"),
            time: 3000,
            i: 1
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 111;

  .button {
    width: 3.3rem;
    height: 0.8rem;
    margin: 0.4rem auto 0;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    background: linear-gradient(to right, #33b6ff, #017ec2);
    font-size: 0.36rem;
    color: #fff;
    text-align: center;
    line-height: 0.8rem;
    border-radius: 0.4rem;
  }

  .psw_xiugai {
    width: 5.7rem;
    background: #fff;
    margin: 1.5rem auto 0;
    padding-bottom: 0.3rem;

    .psw_title {
      height: 1.5rem;
      line-height: 0.6rem;
      width: 100%;
      padding: 0.6rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      p:nth-child(1) {
        font-size: 0.42rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        color: #333;
      }

      p:nth-child(2) {
        width: 0.24rem;
        height: 0.24rem;
        position: relative;
        margin-top: 0.16rem;

        img {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    }

    .psw_conter {
      font-size: 0.32rem;
      padding: 0 0.6rem;

      input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        border-bottom: 1px solid #d7d7d7;
        font-size: 0.3rem;
      }

      input::-webkit-input-placeholder {
        color: #ccc;
        font-size: 0.26rem;
      }

      ul {
        li {
          margin-bottom: 0.3rem;

          .img_icon {
            margin-right: 0.1rem;

            img {
              margin-top: 0.2rem;
            }
          }
        }

        li:nth-child(1) {
          display: flex;
          justify-content: flex-start;
          font-size: 0.36rem;
          font-family: "Calibri";
          font-weight: 400;
          height: 0.7rem;

          p:nth-child(2) {
            width: 100%;
            margin: 0 0.3rem;
            // border-bottom: 1px solid #D7D7D7;
          }
        }

        li:nth-child(2) {
          display: flex;
          justify-content: flex-start;

          p:nth-child(2) {
            width: 2.2rem;
            border: none;
            margin: 0 0.3rem;

            // border-bottom: 1px solid #D7D7D7;
            input {
              width: 2.2rem;
              // border: none;
            }
          }

          p:nth-child(3) {
            width: 1rem;
            height: 0.48rem;
            border: 1px solid #008edd;
            border-radius: 0.4rem;
            font-size: 0.22rem;
            line-height: 0.48rem;
            text-align: center;
            color: #008edd;
            margin-top: 0.2rem;
          }
        }

        .password_nc {
          width: 100%;
          height: 1rem;
          // border-bottom: 1px solid #EBEBEB;
          font-size: 0.26rem;
          line-height: 0.4rem;

          p {
            width: 100%;
            height: 50%;
          }
        }
      }
    }
  }
}
</style>
