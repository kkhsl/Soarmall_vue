<template>
  <div class="article" @touchstart="down" id="apply">
    <div class="loginHead isIos" :class="{'isIos': GLOBA.isIos}">
      <div class="goback" @click="goback()" :class="{'isRotate':GLOBA.isRotate}">
        <img src="@/assets/img/other/xiangzuo.png" />
      </div>
    </div>
    <!-- <div class="signLogin">
      <div class="loginBox"></div>
      <div class="signBox"></div>
      <div class="btnWrap">
        <div class="btn signBtn active">Sign up</div>
        <div class="btn loginBtn">Login</div>
      </div>
    </div>-->
    <div class="sing_login">
      <div class="su_text" v-if="lg==1">
        <div class="title">{{$t("common.Sign up")}}</div>
        <Country :iflogin="true" :SignUp="true"></Country>
        <div class="lg_conter">
          <div class="input_box">
            <Xinput
              v-model="name"
              :placeholder="use"
              :if_delet="true"
              @blur="user_name"
            ></Xinput>
          </div>
          <div class="input_box">
            <Xinput
              v-model="password"
              :placeholder="pass"
              :type="'password'"
              :if_eye="true"
              @blur="passwordBlur"
              :maxlength="15"
            ></Xinput>
          </div>
          <div class="Phone">
            <p class="marg02 Phone_h">+{{GLOBA.phone_tag}}</p>
            <input
              type="number"
              pattern="^5"
              :placeholder="phon"
              v-model="phone"
              :maxlength="13"
            />
            <p class="send" v-if="times == 0" @click="code_btn">{{$t("common.Send")}}</p>
            <p class="send" v-else-if="times == 1">{{count}}</p>
          </div>
          <div class="input_box">
            <Xinput
              v-model="code"
              :placeholder="v_cod"
              :if_delet="true"
            ></Xinput>
          </div>
          <div class="input_box">
            <Xinput
              v-model="inv_code"
              :placeholder="i_cod"
              :if_delet="true"
            ></Xinput>
          </div>
        </div>
        <div class="gouxuan">
          <input type="checkbox" v-model="demo1"/>
          <span @click="getPolicyHTML();">{{$t("common.zhence")}}</span>
        </div>
        <div class="lg_floor">
          <p class="lg_left1" @click.stop="zhuce1">{{$t("common.Sign up")}}</p>
          <p class="lg_left" @click.stop="denglu1">{{$t("common.Login")}}</p>
        </div>
      </div>

      <div ref="i_input" class="lg_text" id="appld" v-if="lg==2">
        <div class="title">{{$t("common.Login")}}</div>
        <Country :iflogin="true"></Country>
        <div class="lg_conter">
          <div class="input_box">
            <Xinput
              v-model="name"
              :placeholder="use_u"
              :if_delet="true"
            ></Xinput>
          </div>
          <div class="input_box">
            <Xinput
              v-model="password"
              :placeholder="use_p"
              :type="'password'"
              :maxlength="15"
              :if_eye="true"
            ></Xinput>
          </div>
          <div class="flexBox"><p class="tishi wenzi" @click="wj_password">{{$t("common.Forgot password?")}}</p></div>
        </div>

        <div class="lg_floor">
          <p class="lg_left" @click.stop="zhuce">{{$t("common.Sign up")}}</p>
          <p class="lg_left1" @click.stop="denglu">{{$t("common.Login")}}</p>
        </div>
      </div>
      <!-- </transition> -->
    </div>
    <ForgotP v-if="forgetPassWorld" @wj_xiaoshi="wj_xiaoshi"></ForgotP>
    <ToastPo :words="words1" :pop_if="pop_if1"></ToastPo>

    <div id="policyWrap" v-if="showPolicy">
      <div class="policyWrapHeade">
        <div class="goback" @click="colsePolicyTank" :class="{'isRotate': GLOBA.isRotate}">
          <img src="@/assets/img/other/xiangzuo1.png" />
        </div>
        <p class="privacy">{{$t("common.Privacy Policy")}}</p>
        <div class="goback"></div>
      </div>
      <div class="policy" v-html="policyHTML"></div>
    </div>
  </div>
</template>

<script>
import {Toast} from 'vant';
import ToastPo from "@/whole/components/elastic/toast_po";
import Xinput from "@/whole/components/global/x_input";
export default {
  components: {
    ToastPo,
    Xinput,
    Toast,
    Country: () => import("@/whole/components/elastic/country"),
    ForgotP: () => import("@/whole/login/forgot_password")
  },
  data() {
    return {
      demo1: false,
      name: "",
      password: "",
      lg: 2,
      code: "",
      phone: "",
      inv_code: "",
      count: 0,
      times: 0,
      forgetPassWorld: false,
      words1: "",
      pop_if1: false,
      use_u: this.$t("common.Username / Phone number"),
      use_p: this.$t("common.password"),
      use: this.$t("common.Username"),
      pass: this.$t("common.password"),
      phon: this.$t("common.Phone number"),
      v_cod: this.$t("tips.Verification code"),
      i_cod: this.$t("tips.Invitation code"),
      height: "calc(100vh - 10.7rem)",
      showPolicy: false,
      policyHTML: ""
    };
  },
  created() {
    this.lg = localStorage.getItem("SignUp_lg") == 1 ? 1 : 2;
    localStorage.setItem("SignUp_lg", 2);
  },
  activated() {
    this.name = "";
    this.password = "";
    this.times = 0;
    this.code_inv();

    // this.$store.commit("coup_draw", {coupon_amount:30,raffle:1});
  },
  mounted() {
    window.addEventListener(
      "popstate",
      e => {
        if (this.forgetPassWorld) {
          this.forgetPassWorld = false;
        }
        if (this.showPolicy) {
          this.showPolicy = false;
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.forgetPassWorld) {
          this.forgetPassWorld = false;
        }
        if (this.showPolicy) {
          this.showPolicy = false;
        }
      },
      false
    );
  },
  methods: {
    passwordBlur(){
      if (this.password.length < 8) {
        Toast(this.$t("tips.Password length"));
      }
    },
    goback() {
      let _history = this.GLOBA.history;
      if (_history.length <= 1) {
        this.$router.push({ path: "/" });
      } else {
        try {
          for(let i=_history.length-1; i>=0; i--){
            if(_history[i].meta.routeLevel > this.$route.meta.routeLevel || _history[i].name == this.$route.name || !_history[i].name){
              _history.splice(i,1);
            }
          }
        } catch (error) {console.log(error)}
        if (_history.length) {
          this.$router.push({
            name: _history[_history.length - 1].name,
            query: _history[_history.length - 1].query
          });
          this.GLOBA.history = _history.splice(0, _history.length - 1);
        } else {
          this.$router.push({ path: "/" });
        }
      }
    },
    down() {
      let Android_iOS = localStorage.getItem("Android_iOS");
      if (Android_iOS == 0) {
        document.getElementsByClassName("input")[0].blur();
      }
    },
    wj_password() {
      this.forgetPassWorld = true;
      window.history.pushState(null, null, "#");
    },
    wj_xiaoshi() {
      this.forgetPassWorld = false;
      this.$router.go(-1);
    },
    user_name() {
      this.height = "calc(100vh - 10.7rem)";
      if (this.name == "") {
        return false;
      }
      this.$HTTP
        .verify({ userName: this.name.replace(/\s*/g, "") })
        .then(res => {
          if (res.code === 0) {
            Toast(this.$t("message.The user has been registered"));
          }
        });
    },
    zhuce() {
      this.name = this.password = "";
      this.lg = 1;
      this.code_inv();
    },
    zhuce1() {
      if (this.name == "") {
        Toast(this.$t("message.Please enter your name"));
        return false;
      }
      if (this.password == "") {
        Toast(this.$t("message.Please enter your password"));
        return false;
      }
      if (this.password.length < 8) {
        Toast(this.$t("tips.Password length"));
        return false;
      }
      if (!this.demo1) {
        Toast(this.$t("message.Please read the Privacy Policy and check it"));
        return false;
      }
      // Toast({message: this.$t('message.Loading'), time: 3000, i: 1})
      this.lg = 1;

      Toast(this.$t("message.Loading"));
      const dat = {
        mobile_verify_code: this.code,
        mobile: this.GLOBA.phone_tag + this.phone
      };
      this.$HTTP.mobile(dat).then(res => {
        if (res.code === 0) {
          let uuid = JSON.parse(localStorage.getItem("uuid") || 0);
          const data = {
            userName: this.name.replace(/\s*/g, ""),
            password: this.password.replace(/\s*/g, ""),
            email: "",
            code: "", //this.code,
            user_type: "",
            mobile: this.GLOBA.phone_tag + this.phone, //this.GLOBA.phone_tag + this.phone,
            invitation: this.inv_code,
            imei: uuid === 0 ? "" : uuid //手机识别号
          };
          // alert(JSON.stringify(data))
          this.$HTTP.register(data).then(res => {
            // alert(JSON.stringify(res))
            if (res.code === 0) {
              if (window.fbAsyncInit) {
                // 如果FB初始化成功
                var params = {}; //推送注册事件
                params[FB.AppEvents.ParameterNames.REGISTRATION_METHOD] =
                  "mobile";
                FB.AppEvents.logEvent(
                  FB.AppEvents.EventNames.COMPLETED_REGISTRATION,
                  null,
                  params
                );
              }
              this.$store.commit("coup_draw", res.data);
              this.denglu();
            } else {
              Toast(this.$t("message.Fail to register"));
            }
          });
        } else if (res.code === 1) {
          Toast(this.$t("message.Verification code input error"));
        } else if (res.code === 4205) {
          Toast(this.$t("message.Invitation code input error"));
        } else if (res.code === 4215) {
          Toast(this.$t("message.The mobile phone has registered an account"));
        } else {
          Toast(this.$t("message.Server is busy"));
        }
      });
    },
    denglu() {
      // Toast({message: this.$t('message.Loading'), time: 1000})
      this.lg = 2;
      if (this.name == "") {
        Toast(this.$t("message.Please enter your name"));
        return false;
      }
      if (this.password == "") {
        Toast(this.$t("message.Please enter your password"));
        return false;
      }
      const data = {
        userName: this.name.replace(/\s*/g, ""),
        password: this.password.replace(/\s*/g, ""),
        token: ""
      };
      this.$HTTP.token_login(data).then(res => {
        switch (res.code) {
          case 0:
            this.pop_if1 = false;
            let account = res.data;
            // 调用 store 中的 mutations 来将信息传过去
            this.$store.commit("Login", account);
            // 设置Vuex登录标志为true，默认userLogin为false
            this.$store.dispatch("userLogin", true);
            // Vuex在用户刷新的时候userLogin会回到默认值false，所以需要用到HTML5储存
            // 设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
            localStorage.setItem("Flag", "isLogin");
            // 登录成功后跳转页面
            let fullPath = sessionStorage.getItem("fullPath", "");
            this.timer = setTimeout(() => {
              if (fullPath) {
                this.$router.replace({ path: fullPath });
                sessionStorage.setItem("fullPath", "");
              } else {
                let click = this.$route.query.id;
                if (click) {
                  this.$store.commit("click", click);
                }
                this.$router.go(-1);
              }
            }, 200);
            break;
          case -1:
            Toast(this.$t("message.The account does not exist"));
            break;
          case -2:
            Toast(this.$t("message.Username or password error"));
            break;
          case -3:
            Toast(this.$t("message.Login failure"));
            break;
          case -4:
            Toast(this.$t("message.Username or password error"));
            break;
          default:
            Toast(this.$t("message.Server is busy"));
        }
      });
    },
    denglu1() {
      this.name = this.password = "";
      this.lg = 2;
    },
    // 发送验证码
    code_btn() {
      if (this.phone == "") {
        Toast(this.$t("message.Please fill in your mobile number"));
      } else {
        if (
          (this.phone[0] != 5 && this.phone[0] != 0) || this.phone.length > 14
        ) {
          Toast( "Please input the correct mobile number");
          return false;
        }
        const data = {
          type: "mobile_verify_code",
          mobile: this.GLOBA.phone_tag + this.phone
        };
        this.$HTTP.app_verify(data).then(res => {
          if (res.code == 0) {
            Toast(this.$t("message.Valid time of verification code"));
            this.times = 1;
            const TIME_COUNT = 59;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                  // 跳转的页面写在此处
                  this.times = 0;
                }
              }, 1000);
            }
          } else if (res.code == 1) {
            Toast(this.$t("Please fill in the correct mobile"));
          } else {
            Toast(this.$t("message.Server is busy"));
          }
        });
      }
    },

    async Sign_btn() {
      const data = {
        userName: this.name.replace(/\s*/g, ""),
        password: this.password.replace(/\s*/g, "")
      };
      let res = await this.$HTTP.user_login(data);
      if (res.code === 0) {
        let account = {
          token: res.token,
          myname: res.userName,
          verify: res.verify,
          myid: res.user_id,
          user_photo: res.user_photo
          // mysex: res.data.sex
        };
        // 调用 store 中的 mutations 来将信息传过去
        this.$store.commit("Login", account);
        // 登录成功后跳转页面
        this.timer = setTimeout(() => {
          this.$router.go(-1);
        }, 200);
      } else {
        this.tips = "B";
      }
    },
    code_inv() {
      if (this.lg == 1) {
        try {
          let Android_iOS = JSON.parse( localStorage.getItem("Android_iOS") || "[]" );
          if (Android_iOS == 0) {
            var UIPasteboard = plus.ios.importClass("UIPasteboard");
            var generalPasteboard = UIPasteboard.generalPasteboard();
            // generalPasteboard.plusCallMethod({setValue:"testValue", forPasteboardType:"public.utf8-plain-text"});
            var value = generalPasteboard.plusCallMethod({
              valueForPasteboardType: "public.utf8-plain-text"
            });
            if (value.substr(value.length - 1) == "⋙") {
              this.inv_code = value.substr(value.length - 7, 4);
            }
          } else {
            var Context = plus.android.importClass("android.content.Context");
            var main = plus.android.runtimeMainActivity();
            var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
            let str = plus.android.invoke(clip, "getText");
            if (str.substr(str.length - 1) == "⋙") {
              this.inv_code = str.substr(str.length - 7, 4);
            }
          }
        } catch (error) {
          
        }
      }
    },
    async getPolicyHTML() {
      if (!this.policyHTML) {
        let res = await this.$HTTP.document_policy({ mark: "Policy" });
        if (res.code == 0) {
          this.policyHTML = res.data.document_content;
        }
      }
      this.openPolicyTank(); // 打开隐私政策弹框
    },
    openPolicyTank(){
      this.showPolicy = true;
      window.history.pushState(null, null, "#");
    },
    colsePolicyTank(){
      this.showPolicy = false;
      this.$router.go(-1);
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
 
<style lang="scss" scoped>
.btnWrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  .btn {
    width: 2.5rem;
    color: #999;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
  }
  .btn.active {
    background: linear-gradient(to right, #33b6ff, #017ec2);
    width: 3rem;
    color: #fff;
  }
}
.isIos {
  margin-top: 0.6rem;
}
.focusState {
  position: absolute;
}
.article {
  height: 100vh;
  overflow: hidden;
  background: url(../../assets/img/login/bg.png) no-repeat;
  background-size: 100% 100%;
  .blank1 {
    width: 100vw;
    height: 1.8rem;
  }
  .sing_login {
    display: flex;
    justify-content: center;
  }
  .title {
    white-space: nowrap;
    padding: 0 0.88rem;
    font-size: 0.56rem;
    font-weight: Bold;
    font-family: "Dutch801BT-Bold";
    color: #333;
    line-height: 0rem;
    height: 0.6rem;
  }
  .lg_left {
    height: 100%;
    width: 2.5rem;
    color: #999;
  }

  .lg_left1 {
    height: 100%;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #33b6ff, #017ec2);
    width: 3rem;
    color: #fff;
  }

  .lg_text {
    box-shadow: 0.04rem 0.04rem 0.2rem #e2e2e2;
    width: 5.52rem;
    height: 5.92rem;
    background: #fff;
    .lg_conter {
      width: 100%;
      margin-top: 0.3rem;
      padding: 0 0.6rem;
      box-sizing: border-box;
      .tishi {
        font-size: 0.22rem;
        color: #999999;
      }
    }
    .lg_floor {
      font-size: 0.4rem;
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      margin-top: 0.9rem;
      text-align: center;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.28rem;
      display: flex;
      justify-content: space-between;
      white-space: nowrap;
    }
  }

  .su_text {
    box-shadow: 0.04rem 0.04rem 0.2rem #e2e2e2;
    width: 5.52rem;
    height: 7.62rem;
    background: #fff;
  }
}
.lg_conter {
  width: 100%;
  padding: 0 0.6rem;
  box-sizing: border-box;
  .Phone {
    width: 100%;
    height: 0.6rem;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    margin-bottom: 0.3rem;
    input {
      width: 100%;
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border: 1px solid #dcdfe6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: 0.28rem;
      line-height: 0.3rem;
      outline: 0;
      border: none;
      border-bottom: 1px solid #d7d7d7;
      padding: 0.15rem 0.1rem;
    }

    input::-webkit-input-placeholder {
      color: #c0c4cc;
    }

    .Phone_h {
      font-family: "Calibri";
      font-size: 0.26rem;
      color: #000;
      font-weight: 400;
      line-height: 0.6rem;
    }

    .send {
      margin-top: 0.1rem;
      font-family: "Calibri";
      font-size: 0.2rem;
      color: #017ec2;
      font-weight: 400;
      width: 1.2rem;
      height: 0.4rem;
      line-height: 0.34rem;
      border: 1px solid #017ec2;
      box-sizing: border-box;
      border-radius: 0.2rem;
      letter-spacing: -0.01rem;
      text-align: center;
    }
  }
}

.gouxuan {
  height: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.1rem;
  span {
    white-space: nowrap;
    font-size: 0.22rem;
    line-height: 0.58rem;
    margin: 0 0.1rem;
    font-family: "Calibri";
    font-weight: 400;
    color: #ccc;
  }
}

.lg_floor {
  margin-top: 0.2rem;
  font-size: 0.4rem;
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
  display: flex;
  justify-content: space-between;
}
.input_box {
  margin-bottom: 0.3rem;
  position: relative;
  border-bottom: 1px solid #d7d7d7;
}

.login-enter-active,
.login-leave-active,
.sign-enter-active,
.sign-leave-active {
  //定义进入过渡生效时的状态
  // transition: all 500ms linear;
  animation: flipBook1 3s forwards;
}
.login-enter,
.login-leave-to {
  //定义进入过渡的开始状态
  // transform: translateX(100%);
  transform: rotateY(0deg);
}
.login-leave-active {
  //定义离开过渡生效时的状态
  // transform: translateZ(50%);
  transform: rotateY(-160deg);
}
.sign-enter,
.sign-leave-to {
  //定义进入过渡的开始状态
  // transform: translateX(-100%);
  transform: rotateY(-160deg);
}
.ssign-leave-active {
  // transform: translateX(-100%);
  transform: rotateY(0deg);
}
.loginHead {
  padding: 0.5rem 0;
}
.goback {
  width: 0.8rem;
  height: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 0.18rem;
    height: 0.32rem;
  }
}
input[type="checkbox"] {
  width: 0.34rem;
  height: 0.34rem;
  text-align: center;
}
input[type="checkbox"]:after {
  width: 100%;
  height: 100%;
  content: "";
  background-color: #fff;
  display: inline-block;
  border: 1px solid #999;
  border-radius: 0.06rem;
}
input[type="checkbox"]:checked:after {
  content: "\2713"; /*UNICODE中对号*/
  font-size: 0.24rem;
  font-weight: bold;
  color: #fff;
  background-color: #017ec2;
}

#policyWrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}
.policyWrapHeade {
  padding-top: 0.3rem;
  height: 1.1rem;
  background-color: #017ec2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.privacy {
  font-size: 0.36rem;
  font-weight: bold;
  font-family: "Calibri-Bold";
  line-height: 0.8rem;
  color: #fff;
}
.policy {
  height: calc(100vh - 2rem);
  font-size: 0.26rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  line-height: 0.36rem;
  padding: 0.2rem 0.3rem;
}
</style>
