<template>
  <div class="full_page">
    <publicHead :noHeadRight="true">
      <h6 slot="headCenter">{{$t("title.Free gifts")}}</h6>
    </publicHead>
    <div class="free centerWrapNoFoot">
      <div class="ac">
        <div class="rule" v-if="rules.length">
          <ul class="Rules_box">
            <li v-for="(rule,index) in rules" :key="index">
              <span class="r_title" v-html="rule.USA"></span>
            </li>
          </ul>
          <div class="code_box">
            <ul>
              <li class="invitation_code">
                <span class="invitation">Invitation code:</span>
                <span class="code">{{code}}</span>
              </li>
              <li class="invited_number">
                <span class="invited">Exchange value:</span>
                <span class="number">{{numbers}}</span>
              </li>
            </ul>
            <p
              class="copy_btn"
              v-if="lg==0"
              v-clipboard:copy="copylink"
              v-clipboard:success="copy"
              v-clipboard:error="onError"
            >{{$t("message.Copy and share")}}</p>
            <p class="copy_btn" v-else-if="lg==1" @click="popout_btn(1)">Sign in</p>
          </div>
        </div>
      </div>
      <Goods :items="list"></Goods>
    </div>
    <div class="popout" v-if="copy_">
      <div class="popout_box">
        <div class="popout_words">
          <div class="top_h">
            <p class="copy_c">{{$t("message.Copy content")}}</p>
            <p class="x" @click="copy_btn"><img src="@/assets/img/other/close.png"></p>
          </div>

          <p class="copy_link">{{links.Android}}</p>
          <p class="copy_link">Invitation code：{{code}}</p>
        </div>
        <div class="popout_btn" @click="copy_btn">{{$t("message.Go to paste or share")}}</div>
      </div>
    </div>
    <Popout :cue_words="cue_words" @popout_btn="popout_btn" v-if="if_cue"></Popout>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Popout from "@/whole/components/elastic/popout";
import Goods from "@/whole/components/global/goods";
export default {
  components: {
    publicHead,
    Popout,
    Goods
  },
  data() {
    return {
      code: "",
      links: "",
      list: [],
      rules: [],
      lg: 1,
      copylink: "",
      cue_words: "Please login!",
      if_cue: false,
      copy_: false,
      numbers: 0
    };
  },
  activated() {
    console.log(this.$store.state.isLogin)
    this.care();
  },
  methods: {
    copy() {
      this.copy_ = true;
    },
    onError() {
      let Android_iOS = JSON.parse(localStorage.getItem("Android_iOS") || "[]");
      if (Android_iOS == 0) {
        var UIPasteboard = plus.ios.importClass("UIPasteboard");
        var generalPasteboard = UIPasteboard.generalPasteboard();
        generalPasteboard.plusCallMethod({
          setValue: this.copylink,
          forPasteboardType: "public.utf8-plain-text"
        });
        this.copy_ = true;
      }
    },
    copy_btn() {
      this.copy_ = false;
       //分享
        const country_i = JSON.parse(localStorage.getItem('country_i') || 1)
        const ct = country_i==1?'/ua':'/sa'
        // let url = "https://m.soarmall.com" + ct + '/#/home/Entry'
        let message ={
          type:"web",
          thumbs: ["../../../assets/img/loader.png"],
          title: "Soarmall",//微信支持
          content: this.copylink,  
          // href: url,  
        }
        plus.share.sendWithSystem(message, function(){
            // alert('分享成功');
        }, function(e){
            // alert('分享失败：'+JSON.stringify(e));
        });
    
    },
    popout_btn(id) {
      this.if_cue = false;
      if (id == 1) {
        this.$router.push({ path: "/account/login" });
      }
    },
    toCardDetail(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    },

    care() {
      this.copylink = localStorage.getItem("copy_link");
      this.$HTTP.invitation().then(res=>{
        if (res.code == 0) {
          this.code = res.data.code;
          this.lg = 0;
        }
        if (res.code == -100) {
          this.lg = 1;
          this.if_cue = true;
        }
      });
      const data = {
        count: -1
      };
      this.$HTTP.point_goods(data).then(res=>{
        if (res.code == 0) {
          this.links = res.data.link[0];
          if (res.data.rules.length) {
            this.rules = res.data.rules;
          }
          this.copylink =
            this.links.Android +
            "\n" +
            "Invitation code:" +
            this.code +
            "\xa0\xa0⋙";
          localStorage.setItem("copy_link", this.copylink);
        }
      });
      let token = this.$store.state.status.token
        ? this.$store.state.status.token
        : "";
      let lists = [];
      this.$PHP.good_invite({ token: token }).then(res=>{
        if (res.code == 0) {
          this.numbers = res.data.goods[0].user_pointNum;
          res.data.goods.forEach(et => {
            // et.goods_pointNum = et.goodspointNum;
            let item = {
              main_photo_url: et.goodsimg,
              goodsname: et.goodsname,
              goodscurrprice:et.goods_current_price,//goods_current_price
              goods_price:0,//goods_price
              goodsid: et.goodsid,
              goods_inventory: et.goods_inventory,
              // goods_pointNum:et.goods_pointNum,
              goods_store_id: et.goods_store_id,
              goodspointNum: et.goodspointNum,
              user_pointNum: et.user_pointNum,
              ratio:et.user_pointNum / et.goodspointNum < 1 ? et.user_pointNum / et.goodspointNum : 1,
              point: 1
            };
            lists.push(item);
          });
          this.list = lists;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.free {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.ac {
  overflow: hidden;
  overflow-y: auto;
  padding: 0.3rem;
  box-sizing: border-box;
}
.rule {
  background: url(../../assets/img/FreeGit/banner.png);
  width: 100%;
  padding: 0.3rem 0.3rem 0.2rem;
  box-sizing: border-box;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  color: #fff;
  font-weight: Bold;
  font-family: "Calibri-Bold";
  font-size: 0.22rem;
  line-height: 0.4rem;
  .Rules_box {
    border: 1px solid #00b4ff;
    padding: 0.14rem;
    li {
      padding: 0.2rem 0.3rem;
      box-sizing: border-box;
      background-color: rgb(0, 180, 255, 0.5);
    }
  }
  .r_title {
    font-family: "Calibri";
    font-weight: 400;
    white-space: pre-line;
    font-size: 0.26rem;
  }
  .code_box {
    margin-top: 0.2rem;
    display: flex;
    justify-content: space-between;
    height: 0.8rem;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.24rem;
    .invitation_code {
      height: 0.5rem;
      line-height: 0.5rem;
      .code {
        font-weight: 600;
      }
    }
    .invited_number {
      height: 0.3rem;
      line-height: 0.2rem;
      .number {
        font-weight: 600;
      }
    }

    .copy_btn {
      width: 2.5rem;
      height: 0.8rem;
      line-height: 0.8rem;
      background: linear-gradient(to bottom, #fff, #8bb2c1);
      color: #333;
      text-align: center;
      border-radius: 0.4rem;
      font-family: "Calibri-Bold";
      font-weight: Bold;
    }
  }
}
.link {
  text-align: center;
  width: 100%;
  margin-top: 0.2rem;
  background: #fff;
  font-size: 0.3rem;
  display: flex;
  justify-content: flex-start;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  .ln {
    width: 4.9rem;
    color: #333;
    font-weight: Bold;
    font-family: "Calibri-Bold";
    text-align: left;
    font-size: 0.24rem;
    padding: 0.2rem 0.3rem;
    li {
      margin-bottom: 0.1rem;
      .l_c {
        font-family: "Calibri";
        font-weight: 400;
        word-break: break-all;
      }
    }
  }
  .ma {
    width: 2rem;
    background-color: #017ec2;
    padding: 0.6rem 0.2rem;
    box-sizing: border-box;
    text-align: center;
    font-weight: Bold;
    color: #fff;
    font-family: "Calibri-Bold";
    line-height: 1rem;
    box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
    li {
      line-height: 0.4rem;
    }
  }
}

.popout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.15);
  z-index: 1000;
}
.popout_box {
  width: 5.7rem;
  font-size: 0.3rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  background-color: #fff;
  // border-radius: 0.4rem;
  padding: 0.5rem 0.5rem 0.4rem;
  margin: 30vh auto 0;
  text-align: center;
  box-sizing: border-box;
  .popout_words {
    width: 100%;
    line-height: 0.3rem;
    color: #333;
    .top_h {
      display: flex;
      justify-content: space-between;
      .copy_c {
        font-size: 0.4rem;
        margin-bottom: 0.5rem;
        line-height: 0.5rem;
      }
      .x {
        color: #999;
        width: 0.8rem;
        text-align: end;
          margin-bottom: 0.5rem;
        line-height: 0.5rem;
        img{
          width: 0.5rem;
          height: 0.5rem;
          vertical-align: middle
        }
      }
    }

    .copy_link {
      width: 100%;
      font-size: 0.24rem;
      font-family: "Calibri";
      font-weight: 400;
      color: #999;
      // word-break: break-all;
      text-align: left;
      padding-bottom: 0.1rem;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
  .popout_btn {
    width: 3.6rem;
   margin: 0 auto;
    height: 0.8rem;
    line-height: 0.8rem;
    border-radius: 0.4rem;
    background: linear-gradient(to right, #7ed0fe, #017ec2);
    color: #fff;
    text-align: center;
  }
}
.free ::v-deep .goods{
  height: 5.46rem !important;
}
</style>
