<template>
  <div class="di_v" :class="[GLOBA.height_hear,GLOBA.padding_hear]">
    <div class="header">
      <div class="goback" v-if="ifnation">
        <Country :ifhome="true"></Country>
      </div>
      <div class="goback" v-if="iffanhui" @click="goback">
        <p class="fanhui" :class="GLOBA.rotateY">
          <img class="img" src="@/assets/img/other/xiangzuo1.png" />
        </p>
      </div>

      <slot name="header_c"></slot>

      <div class="search_" v-if="search" :dir="rtl_">
        <router-link to="/subpages/search/search">
          <img src="@/assets/img/other/ss.png" />
          <!-- <input type="text" placeholder="What are you looking for?" readonly="readonly"/> -->
          <p v-if="gjc==undefined">{{$t("common.What are you looking for ?")}}</p>
          <p v-else style="color:red;">{{gjc}}</p>
        </router-link>
      </div>
      <div class="gouwuc" @click="to_cart" v-if="cart">
        <span class="hb_sz">{{counts}}</span>
        <img class="hb_i1" src="@/assets/img/other/baobao.png" />
      </div>
    </div>
  </div>
</template>
 
<script>
import Country from "@/whole/components/elastic/country";
export default {
  props: {
    cart: true,
    iffanhui: true,
    search: true,
    gjc: "",
    rtl_: "",
    ifnation: false
  },
  components: { Country },
  data() {
    return {
      counts: 0
    };
  },
  mounted() {
    this.cart_number();
  },
  activated() {
    this.cart_number();
  },
  methods: {
    async cart_number(i) {
      let data = {
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.goods_cart1(data, { showLoading: false });
      if (res.code == 0) {
        this.counts = res.data.cart_num;
      } else if (res.code == -100) {
        this.counts = 0;
        this.$store.commit("Login", {});
        this.$store.dispatch("userLogin", false);
        localStorage.setItem("Flag", " ");
      } else {
        this.counts = 0;
      }
    },
    //返回上一页
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
    to_cart() {
      this.$router.push({ path: "/details/cart" });
    }
  }
};
</script>
<style lang='scss' scoped>
.di_v {
  width: 100vw;
  background-color: #017ec2;
  box-sizing: border-box;
}
.header {
  height: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.1rem;
}
.goback {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  width: 0.8rem;
  height: 0.8rem;
  .fanhui {
    width: 0.8rem;
    height: 0.8rem;
    position: relative;
    .img {
      position: absolute;
      width: 0.18rem;
      height: 0.32rem;
      top: 50%;
      left: 40%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }
}
.gouwuc {
  width: 0.6rem;
  height: 0.8rem;
  position: relative;
  z-index: 2;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.32rem;
    height: 0.32rem;
  }
  span {
    position: absolute;
    text-align: center;
    top: 0.14rem;
    right: 0.1rem;
    display: inline-block;
    background-color: #f00;
    border-radius: 50%;
    min-width: 0.2rem;
    min-height: 0.2rem;
    max-width: 0.4rem;
    max-height: 0.4rem;
    font-size: 0.18rem;
    color: #fff;
    z-index: 1;
    line-height: 0.2rem;
  }
}

.search_ {
  height: 0.6rem;
  width: 76%;
  display: flex;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.3rem;
  box-sizing: border-box;
  overflow: hidden;
  a {
    display: flex;
    justify-content: flex-start;
  }
  img {
    //  position: absolute;
    margin: 0.18rem 0.3rem 0;
    width: 0.24rem;
    height: 0.24rem;
  }
  p {
    width: 4.1rem;
    height: 100%;
    line-height: 0.57rem;
    font-size: 0.26rem;
    color: #999;
  }
  input {
    // position: absolute;
    // margin-left: 0.84rem;
    width: 4.1rem;
    border: none;
    height: 0.6rem;
    outline: none;
    font-size: 0.3rem;
  }
  input::-webkit-input-placeholder {
    color: rgba(51, 51, 51, 0.3);
    line-height: 0.6rem;
  }
}
</style>
