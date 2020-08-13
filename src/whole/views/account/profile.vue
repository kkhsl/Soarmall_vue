<template>
  <div class="full_page">
    <publicHead :noHeadRight="true">
      <h6 slot="headCenter">{{$t('common.Information')}}</h6>
    </publicHead>
    <ul class="conter">
      <li>
        <p class="title_name">{{$t("common.Head Portrait")}}</p>
        <p>
          <span class="use">
            <img :src="inform.user_photo" />
          </span>
          <span class="off_frame" :class="{'isRotate':GLOBA.isRotate}"></span>
        </p>
      </li>
      <li>
        <p class="title_name">{{$t("common.Name")}}</p>
        <p class="marg1 title_xz">{{inform.userName}}</p>
      </li>
      <li @click="unfold(1)">
        <p class="title_name">{{$t("common.Phone number")}}</p>
        <p class="title_xz">
          <span class="use">{{accout.Phone}}</span>
          <span class="off_frame" :class="{'isRotate':GLOBA.isRotate}"></span>
        </p>
      </li>
      <li @click="unfold(2)">
        <p class="title_name">{{$t("common.Mailbox")}}</p>
        <p class="title_xz">
          <span class="use">{{accout.mailbox}}</span>
          <span class="off_frame" :class="{'isRotate':GLOBA.isRotate}"></span>
        </p>
      </li>
      <li @click="unfold(3)">
        <p class="title_name">{{$t("common.Gender")}}</p>
        <p class="title_xz">
          <span class="use" v-if="accout.sexid===1">
            <img src="@/assets/img/other/boy.png" alt />
            {{$t("common.Male")}}
          </span>
          <span class="use" v-else-if="accout.sexid===0">
            <img src="@/assets/img/other/gr.png" alt />
            {{$t("common.Female")}}
          </span>
          <span class="off_frame" :class="{'isRotate':GLOBA.isRotate}"></span>
        </p>
      </li>
      <li @click="unfold(4)">
        <p class="title_name">{{$t("common.Birthday")}}</p>
        <p class="title_xz">
          <span class="use">{{accout.datatime}}</span>
          <span class="off_frame" :class="{'isRotate':GLOBA.isRotate}"></span>
        </p>
      </li>
    </ul>
    <div class="psw">
      <p class="title_name">{{$t("common.password")}}</p>
      <p @click="unfold(5)" class="wz_st">{{$t("common.Change password")}}</p>
    </div>

    <!-- 生日 -->
    <div class="sj_day self-centered" v-if="pop_up==4">
      <p class="closeBoxWrap" :class="GLOBA.tck" @click="yingcan(1)">
        <img class src="@/assets/img/other/closeBtn.png" />
      </p>
      <div class="boxTitle">{{$t("common.Birthday")}}</div>
      <div class="sj_tian">
        <p class="sjt">{{$t("common.Year")}}</p>
        <p class="sjt_">{{$t("common.Month")}}</p>
        <p class="sjts">{{$t("common.Day")}}</p>
      </div>
      <div class="sj_chaj">
        <DatetimeView
          end-date="2020-01-01"
          start-date="1930-01-01"
          ref="datetime"
          v-model="accout.datatime"
          :format="format"
        ></DatetimeView>
      </div>
      <div class="button" @click="Comfirm_hp()">{{$t("common.Comfirm")}}</div>
    </div>
    <!-- 电子邮箱 -->
    <div class="yx_xiugai self-centered" v-if="pop_up==2">
      <p class="closeBoxWrap" @click="yingcan(2)">
        <img class src="@/assets/img/other/closeBtn.png" />
      </p>
      <div class="boxTitle">{{$t("common.Mailbox")}}</div>
      <div class="dq_yx" v-if="accout.mailbox!==''">
        <p>{{$t("common.E-mail")}}:</p>
        <p>{{accout.mailbox}}</p>
      </div>
      <input
        class="yx_shuru"
        type="text"
        :placeholder="$t('message.Please enter your password')"
        v-model="yx_psw"
      />
      <input
        class="yx_shuru"
        type="email"
        :placeholder="$t('tips.Enter your mailbox')"
        v-model="entering.mailbox"
      />
      <div class="button" @click="yx_queren">{{$t("common.Comfirm")}}</div>
    </div>
    <!--性别 -->
    <div class="sex_xuanze self-centered" v-if="pop_up==3">
      <p class="closeBoxWrap" @click="yingcan(2)">
        <img class src="@/assets/img/other/closeBtn.png" />
      </p>
      <div class="boxTitle">{{$t("common.Gender")}}</div>
      <div class="sex_zhong">
        <p class="sex_select" :class="{'check':checked}" @click="Comfirm_sex(1)">
          <img src="@/assets/img/other/boy.png" alt />
          {{$t("common.Male")}}
        </p>
        <p class="sex_select" :class="{'check':!checked}" @click="Comfirm_sex(0)">
          <img src="@/assets/img/other/gr.png" alt />
          {{$t("common.Female")}}
        </p>
      </div>
      <div class="button" @click="Comfirm_sex(3)">{{$t("common.Comfirm")}}</div>
    </div>
    <!-- 修改密码 -->
    <div class="psw_xiugai self-centered" v-if="pop_up==5">
      <p class="closeBoxWrap" @click="yingcan(2)">
        <img class src="@/assets/img/other/closeBtn.png" />
      </p>
      <div class="boxTitle">{{$t("common.Change password")}}</div>
      <div class="psw_conter">
        <ul>
          <li class="password_nc">
            <p>{{$t("common.Original password")}}</p>
            <p>
              <input
                type="password"
                :placeholder="$t('common.Original password')"
                v-model="entering.password_ys"
              />
            </p>
          </li>
          <li class="password_nc">
            <p>{{$t("common.New password")}}</p>
            <p>
              <input
                type="password"
                :placeholder="$t('tips.Set the New password')"
                v-model="entering.password_n"
              />
            </p>
          </li>
          <li class="password_nc">
            <p>{{$t("common.Confirm password")}}</p>
            <p>
              <input
                type="password"
                :placeholder="$t('tips.Confirm the  Password')"
                v-model="entering.password_c"
              />
            </p>
          </li>
        </ul>
      </div>
      <div class="button" @click="Comfirm_pas">{{$t("common.Comfirm")}}</div>
    </div>


    <!-- 添加/修改电话号码 -->
    <div class="phone_xiugai self-centered" v-if="pop_up==1">
      <p class="closeBoxWrap" @click="yingcan(2)">
        <img class src="@/assets/img/other/closeBtn.png" />
      </p>
      <div class="boxTitle">{{$t("common.Modify phone number")}}</div>
      <div class="phone_conter">
        <div class="box">
          <div v-if="accout.Phone!==''" class="specialBox">
            <p>{{$t("common.Bundled")}}:</p>
            <p>{{accout.Phone}}</p>
          </div>
          <div class="mobile">
            <p>
              <img src="@/assets/img/other/dh.png" alt />
            </p>
            <p>
             <span> +{{GLOBA.phone_tag}}</span>
              <input
                type="number"
                :placeholder="$t('common.Modify phone number')"
                v-model="entering.phone"
              />
            </p>
          </div>
          <div class="tj_code">
            <p>
              <img src="@/assets/img/other/bz.png" alt />
            </p>
            <p>
              <input
                type="text"
                :placeholder="$t('tips.Verification code')"
                v-model="entering.code1"
              />
            </p>
            <p v-if="times === 0" @click="code_btn">{{$t("common.Send")}}</p>
            <p v-if="times === 1">{{count}}</p>
          </div>
        </div>
      </div>
      <div class="button" @click="Comfirm_phone">{{$t("common.Comfirm")}}</div>
    </div>
    <div class="mask" v-show="pop_up"></div>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
import publicHead from "@/whole/components/header/publicHead"
import { Datetime, DatetimeView } from "vux";
export default {
  components: {
    Datetime,
    DatetimeView,
    publicHead
  },
  data() {
    return {
      inform: "",
      accout: {
        name: "",
        Phone: "",
        mailbox: "",
        sexid: "",
        datatime: "2000-01-01"
      },
      entering: {
        mailbox: "", // 邮箱
        sex_id: 0, // 性别
        // datatime: "2000-01-01", // 生日
        code: "", // 验证码
        password_ys: "", // 原始密码
        password_n: "", // 新密码
        password_c: "", // 确认密码
        code1: "", // 添加手机号的验证码
        phone: "" // 添加手机号码
      },
      pop_up: 0,
      yx_psw: "", //修改邮箱输入密码

      format: "YYYY-MM-DD",
      count: "",
      times: 0,

      checked: false
    };
  },
  created() {
    this.inform = this.$store.state.status;
  },
  activated() {
    this.inform = this.$store.state.status;
    this.account_deta();
    console.log(this.inform);
  },
  mounted() {
    window.addEventListener(
      "popstate",
      e => {
        if (this.pop_up !== 0) {
          this.pop_up = 0;
        }
      },
      false
    );
  },

  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.pop_up !== 0) {
          this.pop_up = 0;
        }
      },
      false
    );
  },

  methods: {
    async account_deta() {
      let res = await this.$HTTP.buyer_account()
      if (res.code == 0) {
        this.accout.name = res.data.userMap.TrueName;
        this.accout.Phone = res.data.userMap.Mobile; //电话
        this.accout.sexid = res.data.userMap.Sex; //性别
        this.accout.datatime =
          res.data.userMap.Birthday.slice(0, 10) || "2000-01-01"; //生日
        this.accout.mailbox = res.data.userMap.Email; //邮箱
      }
    },
    confirmPicker(value) {// 格式化选择器日期
      console.log(value)
    },
    // 显示盒子
    unfold(id) {
      this.pop_up = id;
    },
    // 隐藏盒子
    yingcan(id) {
      this.pop_up = 0;
    },
    //  手机号码
    async Comfirm_phone() {
      if (this.entering.phone == "") {
        Toast({
          message: "Please enter your mobile",
          time: 2000,
          i: 2
        });
        return false;
      }
      if (this.entering.code1 == "") {
        Toast({
          message: "Please Enter Verify Code",
          time: 2000,
          i: 2
        });
        return false;
      }
      const data = {
        mobile_verify_code: this.entering.code1,
        mobile: this.GLOBA.phone_tag + this.entering.phone
      };
      let res = this.$HTTP.mobile_save(data)
      if (res.code == 0) {
        this.accout.Phone = this.entering.phone;
        this.pop_up = 0;
      } else {
        Toast({
          message: "Verification code input error",
          time: 2000,
          i: 1
        });
      }
    },
    //   邮箱
    async yx_queren() {
      if (this.yx_psw == "") {
        Toast({
          message: "Please enter your password",
          time: 2000,
          i: 2
        });
        return false;
      }
      if (this.entering.mailbox == "") {
        Toast({
          message: "Please enter your mailbox",
          time: 2000,
          i: 2
        });
        return false;
      }
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(this.entering.mailbox)) {
        const data = {
          password: this.yx_psw,
          email: this.entering.mailbox
        };
        let res = this.$HTTP.email_save(data)
        if (res.code == 0) {
          Toast({
            message: "Email has been changed",
            time: 2000
          });
          this.accout.mailbox = this.entering.mailbox;
          this.pop_up = 0;
        } else {
          Toast({
            message: "Password input error, please enter again",
            time: 2000,
            i: 1
          });
        }
      } else {
        Toast({
          message: "The email format is incorrect",
          time: 2000,
          i: 1
        });
        return false;
      }
    },
    //   性别
    Comfirm_sex(id) {
      if (id === 1) {
        this.entering.sex_id = 1;
        this.checked = true;
      } else if (id === 0) {
        this.entering.sex_id = 0;
        this.checked = false;
      } else if (id === 3) {
        this.accout.sexid = this.entering.sex_id;
        this.pop_up = 0;
        const data = {
          trueName: this.accout.name,
          birthday: this.accout.datatime,
          sex: this.accout.sexid,
          card: "", // 身份证号
          month_income: "", // 月收入
          area1: "",
          address: ""
        };
        this.$HTTP.account_save(data).then(res=>{
          console.log(res)
        })
      }
    },
    // 生日
    Comfirm_hp() {
      this.pop_up = 0;
      const data = {
        trueName: this.accout.name,
        birthday: this.accout.datatime,
        sex: this.accout.sexid,
        card: "", // 身份证号
        month_income: "", // 月收入
        area1: "",
        address: ""
      };
      this.$HTTP.account_save(data).then(res=>{
        console.log(res)
      })
    },

    // 修改密码
    async Comfirm_pas() {
      if (this.entering.password_ys == "") {
        Toast({
          message: "Please fill in the original password",
          time: 2000,
          i: 2
        });
        return false;
      }
      if (this.entering.password_n == "") {
        Toast({
          message: "Please enter your password",
          time: 2000,
          i: 2
        });
        return false;
      }
      if (this.entering.password_n !== this.entering.password_c) {
        Toast({
          message: "Password inconformity",
          time: 2000,
          i: 1
        });
        return false;
      }
      const data = {
        old_password: this.entering.password_ys,
        new_password: this.entering.password_n
      };
      let res = await this.$HTTP.password_save(data)
      if (res.code == 0) {
        let accountout = {};
        this.$store.commit("logout", accountout);
        localStorage.setItem("Flag", "");
        this.$router.push({
          path: "/account/login"
        });
      }
      if (res.code == 1) {
        Toast({
          message: "Change failed",
          time: 2000,
          i: 1
        });
      }
    },
    // 发送验证码
    async code_btn() {
      if (this.entering.phone == "") {
        Toast({
          message: "Please fill in your mobile number",
          time: 2000,
          i: 2
        });
      }
      if (this.entering.phone !== "") {
        const data = {
          type: "mobile_verify_code",
          mobile: this.GLOBA.phone_tag + this.entering.phone
        };
        let res = await this.$HTTP.app_verify(data);
        if (res.code == 0) {
          this.times = 1;
          const TIME_COUNT = 59;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                // 跳转的页面写在此处
                this.times = 0;
              }
            }, 1000);
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.self-centered {
  z-index: 4;
}
.boxTitle {
  line-height: 0.6rem;
  padding-bottom: 0.2rem;
  text-align: center;
  font-size: 0.4rem;
  font-family: "Calibri-Bold";
  font-weight: bold;
  color: #333;
}
.closeBoxWrap {
  padding: 0.3rem 0.3rem 0.2rem;
  display: flex;
  justify-content: flex-end;
  img {
    width: 0.53rem;
    height: 0.53rem;
  }
}
.mask {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.button {
  width: 3.3rem;
  height: 0.8rem;
  margin: 0.4rem auto 0;
  background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
  /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #33b6ff, #017ec2);
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #33b6ff, #017ec2);
  /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #33b6ff, #017ec2);
  font-size: 0.36rem;
  color: #fff;
  text-align: center;
  line-height: 0.8rem;
  border-radius: 0.4rem;
}
.psw_xiugai {
  height: 7.5rem;
  width: 5.7rem;
  background: #fff;
}
.psw_conter {
  font-size: 0.32rem;
  padding: 0 0.6rem;
  input {
    outline: none;
    border: none;
    font-size: 0.4rem;
    height: 0.7rem;
    width: 100%;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
    font-size: 0.26rem;
  }
  ul {
    li {
      margin-bottom: 0.3rem;
    }
    .password_nc {
      width: 100%;
      border-bottom: 1px solid #ebebeb;
      font-size: 0.26rem;
      line-height: 0.4rem;
    }
  }
}
.phone_xiugai {
  height: 5.5rem;
  width: 5.7rem;
  background: #fff;
  // margin: 0rem auto 0;

  .phone_conter {
    font-size: 0.32rem;
    padding: 0 0.6rem;

    input {
      outline: none;
      border: none;
    }

    input::-webkit-input-placeholder {
      color: #ccc;
      font-size: 0.26rem;
    }

    .box {
      div {
        margin-bottom: 0.3rem;
      }

      .specialBox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        font-family: "Calibri-Bold";
        font-weight: bold;
        font-size: 0.32rem;

        p:nth-child(1) {
          color: black;
          font-weight: bold;
          font-family: "Calibri-Bold";
          font-size: 0.24rem;
        }

        p:nth-child(2) {
          display: flex;
          margin-left: 0.15rem;
          font-size: 0.28rem;
          color: red;
          font-weight: 400;
        }
      }

      .mobile {
        display: flex;
        justify-content: flex-start;
        font-size: 0.3rem;
        font-family: "Calibri";
        font-weight: 400;
        p:nth-child(1) {
          width: 0.3rem;
          height: 0.4rem;
          margin-top: 0.2rem;
          img {
            width: 100%;
            height: 100%;
          }
        }

        p:nth-child(2) {
          margin: 0 0.3rem;
          border-bottom: 1px solid #d7d7d7;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          line-height: 0.55rem;
          input {
            margin: 0 0.1rem;
            height: 0.5rem;
            width: 2.5rem;
          }
        }
      }

      .tj_code {
        display: flex;
        justify-content: flex-start;

        p:nth-child(1) {
          width: 0.32rem;
          height: 0.4rem;
          margin-top: 0.2rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        p:nth-child(2) {
          width: 2.2rem;
          border: none;
          margin: 0 0.3rem;
          border-bottom: 1px solid #d7d7d7;

          input {
            font-size: 0.4rem;
            height: 0.5rem;
            width: 100%;
            border: none;
          }
        }

        p:nth-child(3) {
          width: 1.22rem;
          height: 0.48rem;
          border: 1px solid #008edd !important;
          border-radius: 0.4rem;
          font-size: 0.22rem;
          line-height: 0.48rem;
          text-align: center;
          color: #008edd;
          
        }
      }
    }
  }
}

.sex_xuanze {
  .sex_zhong {
    height: 1.06rem;
    display: flex;
    justify-content: space-around;
    font-size: 0.28rem;
    text-align: center;
    line-height: 1.06rem;
    font-family: "Calibri-Bold";
    font-weight: bold;

    .sex_select {
      width: 2rem;
      height: 1.06rem;
      box-shadow: 0rem 0.04rem 0.1rem rgba(51, 51, 51, 0.15);
      img {
        vertical-align: middle;
      }
    }

    .check {
      background: #ccc;
    }
  }
}
.yx_xiugai,
.sex_xuanze {
  width: 5.7rem;
  height: 6.5rem;
  background: #fff;
  // margin: 0rem auto 0;
}

.sex_xuanze {
  height: 4.54rem;
}

.yx_xiugai {
  .dq_yx {
    font-size: 0.32rem;
    display: flex;
    justify-content: flex-start;
    height: 0.4rem;
    line-height: 0.4rem;
    justify-content: center;
    font-family: "Calibri-Bold";
    font-weight: bold;
    font-size: 0.32rem;

    p:nth-child(1) {
      color: black;
      font-weight: bold;
      font-family: "Calibri-Bold";
      font-size: 0.24rem;
    }

    p:nth-child(2) {
      margin-left: 0.15rem;
      font-size: 0.28rem;
      color: red;
      font-weight: 400;
    }
  }

  .yx_shuru {
    width: 3.3rem;
    height: 0.6rem;
    border: none;
    border-bottom: 1px solid #d7d7d7;
    font-size: 0.26rem;
    font-weight: 400;
    font-family: "Calibri-Bold";
    outline: none;
    margin: 0 1.2rem;
  }

  .yx_shuru::-webkit-input-placeholder {
    color: #ccc;
    font-size: 0.24rem;
  }
}

.sj_day {
  width: 5.7rem;
  height: 5.1rem;
  background: #fff;
  // margin: 0rem auto 0;

  .sj_chaj {
    margin-top: 0.2rem;
  }

  .sj_tian {
    width: 100%;
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #999999;
    display: flex;
    margin-top: 0.2rem;
    flex-direction: row;
    padding: 0 0.6rem;
    box-sizing: border-box;
    justify-content: space-between;
  }
}

.conter {
  width: 100%;
  height: 6.44rem;
  padding: 0 0.3rem;
  // margin-top: 1.7rem;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0.02rem 0.02rem 0.6rem rgba(51, 51, 51, 0.08);
  .title_name {
    font-size: 0.28rem;
    font-family: "Calibri";
    font-weight: 400;
    color: #333333;
  }

  li {
    padding: 0 0.3rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
    height: 1rem;
    line-height: 1rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.28rem;
    font-weight: 400;

    .title_xz {
      font-family: "Calibri-Bold";
      font-size: 0.28rem;
      font-weight: bold;
      color: #999999;
      display: flex;
      justify-content: flex-end;

      span {
        display: inline-block;
      }
    }

    /* .Peter {
          margin-right: 0.3rem;
        } */
    .use {
      margin: 0 0.2rem;
    }
    .off_frame {
      display: inline-block;
      margin: auto;
      width: 0.06rem;
      height: 0.12rem;
      background: url(../../../assets/img/other/xiangyou3.png) no-repeat;
      background-size: cover;
    }
  }

  li:nth-child(1) {
    height: 1.5rem;
    line-height: 1.5rem;

    p:nth-child(2) {
      display: flex;
      justify-content: flex-end;

      span {
        display: inline-block;
      }

      span:nth-child(1) {
        width: 0.88rem;
        height: 0.88rem;
        border-radius: 50%;
        margin-top: 0.3rem;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.psw {
  background: #fff;
  width: 100%;
  height: 1rem;
  box-shadow: 0.02rem 0.02rem 0.4rem rgba(51, 51, 51, 0.1);
  margin-top: 0.3rem;
  line-height: 1rem;
  display: flex;
  justify-content: space-between;
  font-family: "Calibri";
  font-size: 0.28rem;
  font-weight: 400;
  color: #999999;
  padding: 0 0.3rem;
  box-sizing: border-box;

  .wz_st {
    color: #ccc;
    font-family: "Calibri";
    font-size: 0.28rem;
    font-weight: 400;
  }
}
</style>
