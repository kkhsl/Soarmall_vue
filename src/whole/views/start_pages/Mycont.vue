<template>
  <div class="full_page">
    <div class="accouint_content" :class="GLOBA.padd_bot">
      <!-- 个人卡片 -->
      <Mycard :amounts="amounts" @login_btn="login_btn"></Mycard>
      <!-- 订单 -->
      <Myorder :amounts="amounts"></Myorder>
      <!-- 个人信息 -->
      <div class="inform_">
      <h3>{{$t("common.Informations")}}</h3>
      <Myinfo></Myinfo>
      <!-- 国家/语言设置 -->
      <MyCountry @Transport="Transport" @language="language"></MyCountry>
      <!-- 客服中心 -->
        <Myabout></Myabout>
      </div>
      <!-- 登录按钮 -->
      <div class="bt_login">
        <p v-if="login==1" @click="login_btn(1)">{{$t("common.Log in/sign in")}}</p>
        <p v-if="login==2" @click="login_btn(0)">{{$t("common.Log out")}}</p>
      </div>
    </div>
    <publicTabbar tabbarIndex="3"></publicTabbar>

    <div class="Mask" v-if="showChangeLang" @click.self="yu_mask()">
      <div class="option">
        <div class="flag1" @click="choice_yu('en')">English</div>
        <div class="flag2" @click="choice_yu('sa')">عربية</div>
      </div>
    </div>
    <Country ref="country"></Country>
    <Popout :cue_words="cue_words" @popout_btn="popout_btn" v-if="if_cue"></Popout>
  </div>
</template>

<script>
export default {
  components: {
    publicTabbar: () => import("@/whole/components/publicBottom/tabbar"),
    Popout: () => import("@/whole/components/elastic/popout"),
    Mycard: () => import("@/whole/components/account/my_card"),
    Myorder: () => import("@/whole/components/account/my_order"),
    Myinfo: () => import("@/whole/components/account/my_info"),
    Myabout: () => import("@/whole/components/account/my_about"),
    MyCountry: () => import("@/whole/components/account/my_country"),
    Country: () => import("@/whole/components/elastic/country")
  },
  data() { 
    return {
      cue_words: this.$t("message.Do you want to log out?"),
      if_cue: false,
      prompt: false,
      login: 1,
      showChangeLang: false,
      amounts:{},
    };
  },
  activated() {
    this.amount()
    let use = this.$store.state.status;
    if (use.token) {
      this.login = 2;
    } else {
      this.login = 1;
    }
  },
  methods: {
    async amount(){
      let res = await this.$HTTP.account({},{showLoading: false})
      if(res.code == 0){
        this.amounts = res.data
      }else{
        this.amounts = {}
      }
    },
    language() {
      this.showChangeLang = true;
    },
    yu_mask() {
      this.showChangeLang = false;
    },
    choice_yu(id) {
      this.showChangeLang = false;
      if (this.$route.query.lang != id) {
        localStorage.setItem('language_s', id)
        this.$router.push({
          path:'/home',
          query:{
            lang:id
          }
        })
        location.reload();
      }
    },

    logout() {
      this.prompt = true;
    },
    login_btn(i) {
      if (i === 1) {
        this.$router.push({ path: "/account/login" });
      } else {
        this.if_cue = true;
      }
    },
    popout_btn(id) {
      if (id == 0) {
        this.if_cue = false;
      }
      if (id == 1) {
        let accountout = {};
        this.$store.commit("logout", accountout);
        localStorage.setItem("Flag", "");
        this.if_cue = false;
        this.$router.push({ path: "/account/login" });
      }
    },
    Transport(){
      this.$refs.country.Transport()
    },

    web_href() {
      let u = navigator.userAgent;
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isiOS) {
        window.location.href =
          "https://apps.apple.com/cn/app/soarmall/id1487094859";
      } else {
        window.location.href =
          "https://play.google.com/store/apps/details?id=plus.H5ED64880";
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.accouint_content::-webkit-scrollbar {
  display: none;
}
.accouint_content {
  height: calc(100vh - 1rem);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}

.bt_login {
  width: 80%;
  height: 0.8rem;
  line-height: 0.8rem;
  border-radius: 20px;
  margin: 0.3rem auto;
  background: -webkit-linear-gradient(
    left,
    #33b6ff,
    #017ec2
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #33b6ff,
    #017ec2
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #33b6ff,
    #017ec2
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #33b6ff, #017ec2);
  font-size: 0.36rem;
  font-weight: Bold;
  font-family: Calibri-Bold;
  text-align: center;
  color: #fff;
}

.log_btn {
  width: 92%;
  height: 0.9rem;
  line-height: 0.9rem;
  margin: 0.2rem auto;
  background-color: #eec900;
  color: #fff;
  text-align: center;
  border-radius: 0.1rem;
  letter-spacing: 1px;
}
.prompt_box {
  position: fixed;
  top: 40%;
  left: 10%;
  width: 80%;
  height: 2.2rem;
  background-color: #eec900;
  border-radius: 0.18rem;
  padding: 0.2rem;
  box-sizing: border-box;
  text-align: center;
  z-index: 10;
  p {
    margin: 0;
    height: 1rem;
    line-height: 0.8rem;
  }
  .btn {
    padding: 0 0.4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    p {
      width: 1.4rem;
      height: 0.8rem;
      border-radius: 0.1rem;
      background-color: blue;
      color: #fff;
    }
  }
}

.inform_ {
  padding: 0.1rem 0.3rem 0;
  box-sizing: border-box;
  background: #f7f7f7;
  h3 {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.36rem;
    color: #333;
    line-height: 0.84rem;
  }
}


.Mask {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  .option {
    margin-top: calc(100vh - 3.4rem);
    padding: 0.3rem;
    box-sizing: border-box;
    width: 100%;
    height: 3.4rem;
    background: #fff;
    .flag1,.flag2 {
      font-size: 0.4rem;
      height: 1.4rem;
      line-height: 1.4rem;
      box-sizing: border-box;
      text-align: center;
      width: 100%;
      img {
        height: 90%;
        margin-top: 0.06rem;
        width: 30%;
      }
    }
  } 
}
</style>
