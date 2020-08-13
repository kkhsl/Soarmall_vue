<template>
  <div>
    <div class="nation_home" v-if="ifhome" @click="Transport">
      <img src="@/assets/img/uae.gif" v-if="url_==1" class="nation" />
      <img src="@/assets/img/sandi.jpg" v-if="url_==2" class="nation" />
    </div>

    <div class="nation_account" v-if="ifaccount" @click="Transport">
      <img src="@/assets/img/uae.gif" v-if="url_ == 1" class="nation" />
      <img src="@/assets/img/sandi.jpg" v-if="url_ == 2" class="nation" />
    </div>

    <div class="nation_login" v-if="iflogin">
      <p>{{$t("common.Country")}}</p>
      <p class="country" @click="Transport">
        <img src="@/assets/img/uae.gif" v-if="url_==1" class="nation" />
        <img src="@/assets/img/sandi.jpg" v-if="url_==2" class="nation" />
      </p>
      <p class="select" @click="Transport">
        <img src="@/assets/img/other/tx.png" />
      </p>
    </div>

    <!-- 弹出选择框 -->
    <div class="Mask" v-show="ship" @click.self="guo_mask()" @touchmove.prevent="move">
      <div class="option">
        <div class="flag" @click="choice_guo(1)">
          <img src="@/assets/img/uae.gif" alt />
        </div>
        <div class="flag" @click="choice_guo(2)">
          <img src="@/assets/img/sandi.jpg" alt />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iflogin: false,
    ifhome: false,
    ifaccount: false,
  },
  data() {
    return {
      ship: false,
      url_: 1,
    };
  },
  created() {
    let web_app = localStorage.getItem("web_app");
    if (web_app == 1) {
      this.url_ = 1;
      this.$store.commit("country_id", 1);
    } else if (web_app == 2) {
      this.url_ = 2;
      this.$store.commit("country_id", 2);
    } else {
      this.url_ = this.$store.state.country_i;
    }
  },
  mounted() {
    window.addEventListener(
      "popstate",
      (e) => {
        if (this.ship) {
          this.ship = !this.ship;
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      (e) => {
        if (this.ship) {
          this.ship = !this.ship;
        }
      },
      false
    );
  },
  methods: {
    move() {},
    guo_mask() {
      this.ship = false;
      this.$router.go(-1);
    },
    Transport() {
      if (this.GLOBA.isApp) {
        this.ship = true;
        window.history.pushState(null, null, "#");
      }
    },
    choice_guo(id) {
      this.ship = false;
      this.$router.go(-1);
      if (this.url_ != id) {
        this.$store.commit("country_id", id);
        localStorage.setItem("Flag", " ");
        this.$store.commit("logout", {});

        this.$store.commit("removeHomeData");
        setTimeout(() => {
          location.reload();
        }, 10);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.nation_login {
  height: 1rem;
  line-height: 1rem;
  display: flex;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.28rem;
  color: #606266;
  padding: 0 0.6rem;
  box-sizing: border-box;
  .country {
    padding: 0 0.1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .nation {
      height: 0.6rem;
      width: 1rem;
    }
  }
  .select {
    height: 100%;
    width: 0.3rem;
    margin-top: 0.05rem;
    img {
      width: 100%;
    }
  }
}
.nation_home {
  width: 0.8rem;
  height: 0.8rem;
  position: relative;
  z-index: 2;
  .nation {
    position: absolute;
    width: 0.7rem;
    height: 0.48rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
}
.nation_account {
  height: 0.9rem;
  width: 4rem;
  position: relative;
  .nation {
    position: absolute;
    height: 0.6rem;
    width: 1rem;
    right: 0.3rem;
    bottom: 0.1rem;
  }
}
.Mask {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  .option {
    margin-top: calc(100vh - 3.4rem);
    padding: 0.3rem;
    box-sizing: border-box;
    width: 100%;
    height: 3.4rem;
    background: #fff;
    .flag {
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