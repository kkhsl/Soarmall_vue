<template>
  <div class="my_location yuyan">
    <div class="my_location_box dixian" @click="Transport">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/ship.png" alt />
        </p>
        <p class="title_">{{$t("common.Ship to")}}</p>
      </div>
      <div class="xuanzhe_box">
        <img src="@/assets/img/uae.gif" v-if="url_ == 1" class="nation" />
        <img src="@/assets/img/sandi.jpg" v-else-if="url_ == 2" class="nation" />
        <p class="you_img" :class="GLOBA.rotateY"></p>
      </div>
    </div>

    <div class="my_location_box" @click="$emit('language')">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/language.png" alt />
        </p>
        <p class="title_">{{$t("common.Language")}}</p>
      </div>
      <div class="xuanzhe_box">
        <span class="title_" v-if="if_a==='en'">English</span>
        <span class="title_" v-else-if="if_a==='sa'">عربية</span>
        <p class="you_img" :class="GLOBA.rotateY"></p>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  // props: ["Langu"],
  data() {
    return {
      if_a: this.$route.query.lang,
      url_: this.$store.state.country_i
    };
  },

  mounted() {},
  methods: {
    Transport() {
      this.$emit("Transport");
    }
  }
};
</script>

<style lang="scss" scoped>
.my_location {
  width: 100%;
  background-color: #fff;
  box-shadow: 0.02rem 0.02rem 0.3rem rgba(51, 51, 51, 0.15);
  .dixian {
    border-bottom: 1px solid #ebebeb;
  }
  .my_location_box {
    display: flex;
    justify-content: space-between;
    line-height: 0.93rem;
    height: 0.93rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    .my_location_title {
      margin: 0 8px;
      color: #333;
      display: flex;
      justify-content: flex-start;
      .zuo_img {
        width: 0.32rem;
        height: 0.32rem;
        position: relative;
        img {
          position: absolute;
          height: 100%;
          margin-top: 0.3rem;
        }
      }
    }
    .you_img {
      background: url(../../../assets/img/other/xiangyou3.png) no-repeat;
      background-size: cover;
      height: 0.12rem;
      width: 0.06rem;
      margin-top: 0.4rem;
    }
  }

  .title_ {
    margin: 0 0.3rem;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.28rem;
    color: #333;
  }
  .xuanzhe_box {
    display: flex;
    justify-content: space-between;
    .nation {
      height: 0.6rem;
      width: 1rem;
      margin: 0.17rem 0.3rem 0 0.3rem;
    }
    // img {
    //   width: 0.52rem;
    //   height: 0.36rem;
    // }
  }
}
.yuyan {
  margin-top: 0.3rem;
}
</style>
