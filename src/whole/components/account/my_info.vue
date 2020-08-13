<template>
  <div class="my_location">
    <div class="my_location_box dixian" @click="Coupon">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/yh1.png" alt />
        </p>
        <p class="title_">{{$t("common.Coupon")}}</p>
      </div>
      <p class="you_img" :class="GLOBA.rotateY"></p>
    </div>

    <div class="my_location_box dixian" @click="adderss">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/address.png" alt />
        </p>
        <p class="title_">{{$t("common.Address")}}</p>
      </div>
      <p class="you_img" :class="GLOBA.rotateY"></p>
    </div>
    <div class="my_location_box dixian" @click="Profile">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/profile.png" alt />
        </p>
        <p class="title_">{{$t("common.Profile")}}</p>
      </div>
      <p class="you_img" :class="GLOBA.rotateY"></p>
    </div>
    <div class="my_location_box dixian" @click="Returns(0)">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/returns.png" alt />
        </p>
        <p class="title_">{{$t("common.Returns")}}</p>
      </div>
      <p class="you_img" :class="GLOBA.rotateY"></p>
    </div>

    <div class="my_location_box" @click="Review">
      <div class="my_location_title">
        <p class="zuo_img">
          <img src="@/assets/img/accout/reviewed.png" alt />
        </p>
        <p class="title_">{{$t("common.Review")}}</p>
      </div>
      <p class="you_img" :class="GLOBA.rotateY"></p>
    </div>

  </div>
</template>
 
<script>
export default {
  // props: ["Langu"],
  data() {
    return {
    };
  },
  created() {
  },

  mounted() {},
  methods: {
    Coupon() {
      this.$router.push({ path: "/coupon/Coupon" });
    },
    adderss() {
      this.$router.push({ path: "/address" });
    },
    Profile() {
      this.$router.push({ path: "/subpages/Account/profile" });
    },
    Returns(id) {
      this.$router.push({
        path: "/subpages/Account/returns/returns",
        query: { toPage: id }
      });
    },
    Review(){
      this.$router.push({path: "/whole/views/order_return/review"});
    },
    about(id) {
      this.$router.push({
        path: "/subpages/Account/about_us",
        query: { id: id }
      });
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
    img {
      width: 0.52rem;
      height: 0.36rem;
      margin-top: 0.29rem;
    }
  }
}
.yuyan {
  margin-top: 0.3rem;
}
</style>
