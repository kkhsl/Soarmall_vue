<template>
  <div class="publicHeadWrap" :class="{'position':position}">
    <div class="publicHead">
      <div class="headLeft">
        <slot name="headLeft">
          <div class="goBack" @click="goBack" :class="{'isRotate':GLOBA.isRotate}">
            <!-- <img src="@/assets/img/other/xiangzuo.png" v-if="black_img" /> -->
            <img src="@/assets/img/other/xiangzuo1.png" />
          </div>
        </slot>
      </div>
      <div class="headCenter">
        <slot name="headCenter"></slot>
        <router-link to="/subpages/search/search" v-if="goSearch" class="search_">
          <img src="@/assets/img/other/ss.png" />
          <p>{{$t("common.What are you looking for ?")}}</p>
        </router-link>
      </div>
      <div class="headRight">
        <slot name="headRight">
          <div class="toCart" @click="$router.push({path:'/details/cart'})" v-if="!noHeadRight">
            <div class="cartImgWrap">
              <span class="hb_sz">{{cartCounts}}</span>
              <!-- <img src="@/assets/img/other/baobao1.png" v-if="black_img" /> -->
              <img src="@/assets/img/other/baobao.png" />
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "publicHead",
  props: {
    goSearch: {
      default: false
    },
    noHeadRight: {
      type: Boolean,
      default: false
    },
    position: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cartCounts: 0
    };
  },
  mounted() {
    if(!this.noHeadRight){
      this.getCartNum();
    }
  },
  activated() {
    if(!this.noHeadRight){
      this.getCartNum();
    }
  },
  methods: {
    goBack() {
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
    async getCartNum() {
      let data = {
        language: this.$route.query.lang === "sa" ? 1 : 0
      };
      let res = await this.$HTTP.goods_cart1(data, { showLoading: false });
      if (res.code == 0) {
        this.cartCounts = res.data.cart_num;
      } else if (res.code == -100) {
        this.cartCounts = 0;
        this.$store.commit("Login", {});
        this.$store.dispatch("userLogin", false);
        localStorage.setItem("Flag", " ");
      } else {
        this.cartCounts = 0;
      }
    }
  }
};
</script>
<style lang='scss'>
.publicHeadWrap {
  background-color: #017ec2;
}
.publicHeadWrap.position {
  padding-top: 1rem;
}
.isApp .publicHeadWrap.position {
  padding-top: 1.4rem;
}
.isApp .publicHead {
  height: 1.4rem;
}
.publicHead {
  // background-color: #017ec2;
  height: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
}
.position .publicHead {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
}
.headTitle {
  font-size: 0.36rem;
  font-weight: bold;
  font-family: "Calibri-Bold";
  line-height: 1rem;
}
.goBack {
  -webkit-tap-highlight-color: transparent;
  width: 0.7rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 0.3rem;
  }
}
.headLeft,
.headRight {
  width: 1rem;
  height: 0.9rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.headLeft .searchIcon {
  max-width: 0.36rem;
}
.headCenter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0.9rem;
  h6 {
    font-size: 0.36rem;
    font-weight: bold;
    font-family: "Calibri-Bold";
    color: #fff;
  }
}
.toCart {
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cartImgWrap {
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 0.32rem;
    height: 0.32rem;
  }
  span {
    position: absolute;
    text-align: center;
    top: 0;
    right: 0;
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
  padding: 0 0.2rem;
  display: flex;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.3rem;
  box-sizing: border-box;
  overflow: hidden;
  img {
    width: 0.24rem;
    height: 0.24rem;
    display: flex;
    align-self: center;
  }
  > p {
    width: 4.6rem;
    padding: 0 0.1rem;
    box-sizing: border-box;
    height: 100%;
    line-height: 0.57rem;
    font-size: 0.26rem;
    color: #999;
  }
}
</style>
