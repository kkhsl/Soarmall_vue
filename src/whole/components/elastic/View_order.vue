<template>
  <!-- v-if="if_view" -->
  <div class="view_box" v-if="if_view">
    <div class="view_order">
      <div class="name_pass">
        <div class="topPicture">
          <img src="@/assets/img/soarmall.png" alt />
        </div>

        <div class="wraper">
          <div class="hear">View order information</div>
          <div class="account">Your Soarmall account</div>
          <ul :class="{'magr':this.$route.query.lang=='sa'}">
            <li>
              <img src="@/assets/img/name.png" />
             <span> Username:{{inform.userName}}</span>
            </li>
            <li>
              <img src="@/assets/img/password.png" />
              Password:{{inform.password}}
            </li>
          </ul>
        </div>
        <div class="surprises">You can get more surprises in the app</div>
        <div class="btn">
          <p class="later" @click="later_now(0)">View later</p>
          <p class="now" @click="later_now(1)">View now</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inform: this.$store.state.status,
      if_view: false
    };
  },

  created() {
    
  },
  watch: {
    $route(to, from) {
      if (from.name == "PayNow" || from.name == "Payment") {
        let web_app = localStorage.getItem("web_app");
        // if (web_app !== 0) {
        if (to.name == "Orders" && web_app != 0) {
          this.inform = this.$store.state.status;
          console.log(web_app);
          this.if_view = true;
        }
        // }
      }
    }
  },

  methods: {
    later_now(i) {
      this.if_view = false;
      if (i == 1) {
        let Android_iOS = JSON.parse(
          localStorage.getItem("Android_iOS") || "[]"
        );
        if (Android_iOS == 0) {
          window.location.href =
            "https://apps.apple.com/cn/app/soarmall/id1487094859";
        } else {
          window.location.href =
            "https://play.google.com/store/apps/details?id=plus.H5ED64880";
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.view_box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}
.view_order {
  width: 5.7rem;
  height: 6.86rem;
  background-color: white;
}
.wraper {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.topPicture {
  width: 100%;
  height: 1.31rem;
  background-color: #0380c4;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  position: relative;
}
.topPicture img {
  width: 1.25rem;
  height: 1.29rem;
  position: absolute;
  top: 0.5rem;
  left: 2.23rem;
  display: block;
  border-radius: 25%;
}
.hear {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  color: #333333;
  //
  padding: 0.4rem 0 0.2rem;
  text-align: center;
}
.name_pass {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 0.6rem;
  // height: 6.86rem;
  // img {
  //   width: 1.25rem;
  //   height: 1.29rem;
  //   // margin-right: 0.3rem;
  //   margin: -0.8rem auto 0;
  //   display: block;
  //   border-radius: 25%;
  // }
  ul {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.26rem;
    color: #333;
    margin-top: 0.4rem;
    line-height: 0.6rem;
    height: 1.27rem;
    background: #f3f3f3;
    letter-spacing: 0.01rem;

    // box-shadow: 0 0 0.03rem #050303 inset;
    li {
      img {
        width: 0.18rem;
        height: 0.2rem;
        margin-left: 0.67rem;
        display: inline-block;
      }
    }
    
    // .account {
    //   margin-left: 0.3rem;
    // }
  }
  .magr li img{
  margin-right: 0.67rem;
  margin-left: 0rem

}
}

.account {
  text-align: center;
  font-size: 0.2rem;
  color: #333;
}
.surprises {
  font-family: "Calibri-Bold";
  font-weight: bold;
  font-size: 0.26rem;
  color: #0380c4;
  line-height: 0.8rem;
  text-align: center;
}
.btn {
  height: 1rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.2rem;
  p {
    width: 2.36rem;
    height: 0.73rem;
    border: 1px solid #0380c4;
    line-height: 0.73rem;
    border-radius: 0.37rem;
    text-align: center;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.24rem;
  }
  .later {
    color: #0380c4;
  }
  .now {
    color: #fff;
    background: linear-gradient(to right, #33b6ff, #017ec2);
    box-shadow: 0rem 0.06rem 0.2rem rgba(1, 126, 194, 0.4);
  }
}

</style>