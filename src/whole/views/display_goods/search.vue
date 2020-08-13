<template>
  <div class="full_page">
    <publicHead>
      <div slot="headCenter" class="search_">
        <img src="@/assets/img/other/ss.png" @click="search_result(searchs,0)" />
        <form class="search_block" @submit.prevent="formSubmit" action="javascript:return true">
          <Xinput
            class="input_"
            :placeholder="way"
            v-model="searchs"
            @input="search_key"
            @keydown="search_resul2"
            :if_delet="true"
          ></Xinput>
        </form>
      </div>
      <p class="s_sou" slot="headRight" @click="search_result(searchs,0)"></p>
    </publicHead>

    <div class="se_conter" :class="GLOBA.top_search" @touchstart="down">
      <div class="hot_box" v-if="restaurants.length<1">
        <div class="huore" v-if="hot_sea">
          <p>{{$t("common.Hot search")}}</p>
          <p>
            <span v-for="hot in hot_search" :key="hot" @click="search_result(hot,1)">{{hot}}</span>
          </p>

          <span class="hr" :class="{'smallPicture':this.$route.query.lang=='sa'}">
            <img src="@/assets/img/other/huo.png" alt />
          </span>
        </div>

        <div class="jilu" v-if="history_sea">
          <p>{{$t("common.Record")}}</p>
          <span class="re" :class="{'smallTip':this.$route.query.lang=='sa'}">
            <img src="@/assets/img/other/jl.png" alt />
          </span>
          <div class="content_wrapper">
            <ul class="huadong">
              <li v-for="(hist,index) in history" :key="hist">
                <span @click="search_result(hist,1)">{{hist}}</span>
                <img src="@/assets/image/icon/inputDeleteIcon.png" @click="delete_(index)" />
              </li>
            </ul>
          </div>
        </div>
        <div class="se_delete" v-if="history.length>1">
          <img src="@/assets/img/other/sc.png" @click="deletes" />
        </div>
      </div>

      <div class="Key_word font_style2" v-if="restaurants.length>0">
        <!--:dir="rtl_" -->
        <ul>
          <li v-for="(res,i) in restaurants" :key="i" @click="search_result(res.value,1)">
            <img src="@/assets/img/other/ss.png" />
            <p>{{res.value}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
import publicHead from "@/whole/components/header/publicHead";
import Xinput from "@/whole/components/global/x_input";
export default {
  components: { Xinput, publicHead },
  props: {},
  data() {
    return {
      searchs: "",
      history: [],
      hot_search: [],
      hot_sea: false,
      history_sea: false,
      way: "", //this.$t("tips.What are you looking for")
      restaurants: []
      // rtl_: "ltr"
    };
  },
  created() {
    this.search_hr();
    this.searchs = this.$store.state.searchs;
    this.$store.commit("searchs", "");
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementsByClassName("input")[0].focus();
    });
  },
  methods: {
    down() {
      let Android_iOS = localStorage.getItem("Android_iOS");
      if (Android_iOS == 0) {
        document.getElementsByClassName("input")[0].blur();
      }
    },
    async search_hr() {
      this.history = JSON.parse(localStorage.getItem("this.history") || "[]");
      if (this.history.length > 0) {
        this.history_sea = true;
      }
      let res = await this.$HTTP.hot_search()
        if (res.code == 0) {
        this.hot_search = res.data;
        // this.restaurants = res.data
        if (res.data != []) {
          this.hot_sea = true;
          this.way = res.data[0];
          // if (this.history.length == 0) {
          //   this.searchs = res.data[0];
          // }
        }
      }
      if (this.$route.query.keyword) {
        this.way = this.$route.query.keyword;
      } else {
        // if (this.history.length > 0) {
        //   this.searchs = this.history[0];
        // }
      }
    },

    search_result(hot, i) {
      this.$store.commit("searchs", hot);
      let arregex = /[\u0600-\u06FF]/; //阿拉伯语
      if (hot != "") {
        if (i == 0) {
          this.$PHP.search_w({ word: hot }).then(res=>{
            if (res.code == 0) {
              console.log(res.data.word, 3);
              if (res.data.word && arregex.test(hot)) {
                this.to_goods(res.data.word, hot);
              } else {
                this.to_goods(hot);
              }
            } else {
              this.to_goods(hot);
            }
          });
        } else {
          this.to_goods(hot);
        }
      } else {
        this.to_goods(this.way);
      }
    },
    to_goods(hot, e) {
      let hot_e = hot;
      if (e) {
        hot_e = e;
      }
      if (this.history != null && this.history.length > 0) {
        if (this.history.indexOf(hot_e) == -1) {
          this.history.unshift(hot_e);
          this.history.splice(10, 1);
        } else {
          this.history.some((item, i) => {
            if (item == hot_e) {
              this.history.splice(i, 1);
              this.history.unshift(hot_e);
              return true;
            }
          });
        }
      } else {
        this.history = [];
        this.history.push(hot_e);
      }
      localStorage.setItem("this.history", JSON.stringify(this.history));
      this.$router.replace({
        path: "/subpages/search/search_result",
        query: { keyword: hot, an: e }
      });
    },
    async search_key(queryString) {
      // let arregex = /[\u0600-\u06FF]/; //阿拉伯语
      // if (arregex.test(queryString)) {
      //   this.rtl_ = "rtl";
      // } else {
      //   this.rtl_ = "ltr";
      // }
      let len = queryString.length;
      if (len >= 2) {
        let res = await this.$PHP.search({ word: queryString });
        this.restaurants = [];
        if (res.code == 0) {
          res.data.list.forEach(item => {
            let langua = {};
            if (res.data.language == "en") {
              langua = {
                value: item.word,
                goodsclass_id: item.goodsclass_id
              };
            } else if (res.data.language == "sa") {
              langua = {
                value: item.arabic_word,
                goodsclass_id: item.goodsclass_id
              };
            } else {
              langua = {
                value: "",
                goodsclass_id: ""
              };
            }
            this.restaurants.push(langua);
          });
        }
      } else {
        this.restaurants = [];
      }
    },
    search_resul3(i) {
      this.search_result();
    },
    search_resul2(ev) {
      if (ev.keyCode == 13) {
        //键盘回车的编码是13
        this.search_result(this.searchs, 0);
      }
    },
    delete_(i) {
      this.history.splice(i, 1);
      localStorage.setItem("this.history", JSON.stringify(this.history));
    },
    deletes() {
      this.history = [];
      localStorage.setItem("this.history", JSON.stringify(this.history));
    }
  }
};
</script>

<style lang="scss" scoped>
.search_block {
  width: 4.6rem;
}
.se_sou {
  height: 0.76rem;
  font-size: 0.26rem;
  background: #fff;
  margin: 0 0.74rem;
  margin-top: 0.32rem;
  box-shadow: 2px 2px 10px #e2e2e2;
  padding: 0.04rem 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  p {
    width: 0.6rem;
    height: 0.6rem;
    img {
      margin-top: 0.2rem;
      width: 0.32rem;
      height: 0.32rem;
    }
  }

  .shur {
    border-radius: 0rem;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
  }
  input::-webkit-input-placeholder {
    color: rgba(51, 51, 51, 0.2);
  }
}
.se_conter {
  padding: 0.3rem 0.3rem 0;
  min-height: 40vh;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #fff;
  .hot_box {
    padding: 0 0.44rem;
    width: 100%;
    box-sizing: border-box;
  }
  .huore {
    position: relative;
    width: 100%;
    font-size: 0.4rem;

    .hr {
      position: absolute;
      top: 0px;
      left: -0.44rem;
      // img {
      //   width: 100%;
      //   height: 100%;
      // }
    }
    .smallPicture{
      position: absolute;
      left: 0rem;
      right: -0.44rem;
      
     
    }

    p:nth-child(1) {
      font-weight: 600;
      font-size: 0.36rem;
    }
    p:nth-child(2) {
      width: 100%;
      margin-top: 0.34rem;

      span {
        display: inline-block;
        height: 0.5rem;
        line-height: 0.26rem;
        color: #666666;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        text-align: center;
        border: 1px solid #d7d7d7;
        border-radius: 0.4rem;
        padding: 0.1rem 0.2rem;
        box-sizing: border-box;
        font-size: 0.26rem;
      }
    }
  }
  .jilu {
    width: 100%;
    font-size: 0.4rem;
    position: relative;
    .re {
      position: absolute;
      top: 0px;
      left: -0.44rem;
      // img {
      //   width: 100%;
      //   height: 100%;
      // }
    }
    .smallTip{
      right: -0.44rem
    }
    p:nth-child(1) {
      font-weight: 600;
      font-size: 0.36rem;
    }
    .huadong {
      width: 100%;
      li {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.26rem;
        border-bottom: 1px solid #ebebeb;
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          width: 5.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        img {
          width: 0.3rem;
        }
      }
    }
  }
  .se_delete {
    height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 0.3rem;
      height: 0.32rem;
    }
  }
}
.content_wrapper::-webkit-scrollbar {
  display: none;
}
.content_wrapper {
  width: 100%;
  max-height: 7rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}

.s_sou {
  width: 0.6rem;
  height: 0.6rem;
  background: url(../../../assets/img/other/sousuo.png) no-repeat center;
  background-size: 0.32rem;
}

.Key_word {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  z-index: 10;
  li {
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    border-bottom: 1px solid #f7f7f7;
    display: flex;
    justify-content: flex-start;
    img {
      width: 0.32rem;
      height: 0.32rem;
      margin-top: 0.24rem;
    }
    p {
      padding: 0 0.2rem;
      box-sizing: border-box;
    }
  }
}
.search_block1 ::v-deep .el-input__suffix {
  right: 4.1rem !important;
}
</style>
