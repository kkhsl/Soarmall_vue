<template>
  <div id="app" :class="GLOBA.isApp?'isApp':'isWeb'" :dir="$route.query.lang === 'sa' ? 'rtl' : 'ltr'">
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <transition :name="transitionName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <HoverButton v-show="drag"></HoverButton>
    <chatBtn v-show="chatBtnShow"></chatBtn>
    <CouponDraw></CouponDraw>
    <ViewOrder></ViewOrder>
  </div>
</template>

<script>
import FastClick from "fastclick";
export default {
  components: {
    HoverButton: () => import("@/module/invite/HoverButton"),
    chatBtn: () => import("@/whole/views/account/chatButton"),
    CouponDraw: () => import("@/whole/components/elastic/coupon_draw"),
    ViewOrder: () => import("@/whole/components/elastic/View_order")
  },
  data() {
    return {
      istop: false,
      transitionName: "",
      inmgaa: "",
      scroll: "",
      drag: true,
      chatBtnShow: true,
      backbuttonFastClick: false
    };
  },
  mounted() {
    FastClick.attach(document.body);
    FastClick.prototype.focus = function(targetElement) {
      targetElement.focus();
    };
    this.codeStatist(); // php代码统计
    setTimeout(() => {
      this.appBackBtn(); // APP返回按钮
      this.skip();
    }, 1500);
  },

  watch: {
    $route(to, from) {
      try {
        if (to.name == "Details" || to.name == "Login") {
          //参数：dark - 黑色; light - 白色
          plus.navigator.setStatusBarStyle("dark");
        } else {
          plus.navigator.setStatusBarStyle("light");
        }
      } catch (error) {}
      if (window._soarmall) {
        const contentUrl = location.hash; //自定义当前url，可带上路由以此区分每个页面
        window._soarmall.send(contentUrl);
      }
      if (
        to.name == "Chat" ||
        to.name == "Payment" ||
        to.name == "PayNow" ||
        to.name == "Address" ||
        to.name == "Newaddress"
      ) {
        this.chatBtnShow = false;
      } else {
        this.chatBtnShow = true;
      }
      // plus.statistic.eventTrig("10000", {"name":"17726"});
      // plus.statistic.eventTrig("test", {"name":to.name});
      //  const start = new Date();
      // const end = new Date();
      // let d = end.getTime() - start.getTime();
      // plus.statistic.eventDuration("test", d,{"name":to.name});
      // plus.statistic.eventDuration("10000", d,{"name":to.name});

      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      let queryLang = this.$route.query.lang;
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        if (queryLang === "en") {
          this.transitionName = "slide-left";
        } else if (queryLang === "sa") {
          this.transitionName = "slide-right";
        }
      } else if (to.meta.index < from.meta.index) {
        if (queryLang === "en") {
          this.transitionName = "slide-right";
        } else if (queryLang === "sa") {
          this.transitionName = "slide-left";
        }
      } else {
        this.transitionName = "";
      }
      console.log(to.name);
      if (
        to.name == "Entry" ||
        to.name == "Login" ||
        to.name == "Address" ||
        to.name == "Newaddress" ||
        to.name == "Payment" ||
        to.name == "Evaluate" ||
        to.name == "RoundTurntable" ||
        to.name == "PayNow"
      ) {
        this.drag = false;
      } else {
        this.drag = true;
      }
    }
  },
  methods: {
    skip() {
      // 判断启动方式
      function checkArguments() {
        let args = plus.runtime.arguments;
        if (args) {
          args = JSON.parse(args);
          console.log(args);
          // 处理args参数，如直达到某新页面等
          // alert(args)
          // alert(localStorage.getItem("args"))
          let substring1 = "^uae";
          let substring2 = "^saudi";
          let url_str = "";
          let ua_sa = "";
          if (args.uae) {
            let strs1 = [];
            strs1 = args.uae.split("#");
            strs1 = strs1[1].split("^");
            url_str = strs1[0];
            ua_sa = "ua";
          } else if (args.saudi) {
            let strs1 = [];
            strs1 = args.uae.split("#");
            strs1 = strs1[1].split("^");
            url_str = strs1[0];
            ua_sa = "sa";
          } else {
            // let strs = [];
            // strs = args.split("#");
            // url_str = strs[1];
            window.location.hash = "#/home";
          }
          alert(url_str);
          alert(ua_sa);
          window.location.hash = url_str;
          let tag = this.$store.state.country_i;
          if (
            args != localStorage.getItem("args") ||
            tag != localStorage.getItem("banner_i")
          ) {
            // alert("不相同")
            localStorage.setItem("args", args);
            if (args.includes("m.soarmall.com/ua") || ua_sa == "ua") {
              localStorage.setItem("country_i", 1);
              localStorage.setItem("banner_i", 1);
              setTimeout(() => {
                location.reload();
              }, 10);
            } else if (args.includes("m.soarmall.com/sa") || ua_sa == "sa") {
              localStorage.setItem("country_i", 2);
              localStorage.setItem("banner_i", 2);
              setTimeout(() => {
                location.reload();
              }, 10);
            }
          } else {
            // alert("相同")
          }
        }
      }
      // 处理从后台恢复
      document.addEventListener(
        "newintent",
        function() {
          checkArguments();
        },
        false
      );
    },
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
    plusRuntimeBack(){
      // this.backbuttonFastClick 记录点击时间戳 处理物理返回按钮退出
      if (!this.backbuttonFastClick) {
        this.backbuttonFastClick = new Date().getTime();
        plus.nativeUI.toast("Press exit again!");// 系统自带ui提示
        setTimeout(()=> {
          this.backbuttonFastClick = false;
        }, 1500);
      } else {
        if (new Date().getTime() - this.backbuttonFastClick < 1500) {
          //连按两次退出程序 两次按键的时间间隔在1.5秒内就退出应用
          plus.runtime.quit();
        }
      }
    },
    appBackBtn() {
      // 安卓系统物理返回
      let thatThis = this;
      try {
        plus.key.addEventListener(
          "backbutton",
          function() {
            if (thatThis.$route.name == "HomeCont" || thatThis.$route.name == "Categories" || thatThis.$route.name == "Discovery" || thatThis.$route.name == "mycont") {
              // 如果是首页以及tab页面 则提示双击退出APP
              thatThis.GLOBA.history = []; // 清空自定义路由
              thatThis.plusRuntimeBack() // 双击返回退出
            } else {
              if(window.location.hash){
              /* 正常页面都会携带hash lang语言参数
                非正常页面  如页面触发弹窗 进行window.history.pushState(null, null, "#")
                此时location.hash==''  此时返回则是关闭弹窗 
              */
                thatThis.goBack(); // 正常页面 返回
              }else{
                window.history.back(-1); // 无hash非正常情况 返回关闭弹窗
              }
            }
          },
          false
        );
      } catch (error) {}
    },
    codeStatist() {
      const country_i = this.$store.state.country_i
      let url_ = "ua";
      if (country_i == 1) {
        url_ = "ua";
      } else {
        url_ = "sa";
      }
      const web_app = JSON.parse(localStorage.getItem("web_app") || 0);
      let isapp = "app";
      if (web_app == 0) {
        isapp = "app";
      } else {
        isapp = "web";
      }
      const script = document.createElement("script");
      script.src =
        "https://analysis.soarmall.com/pageview?type=" +
        isapp +
        "&site=" +
        url_ +
        "&num=" +
        Math.round(Math.random() * 1000); //友盟中的代码
      script.language = "JavaScript";
      document.body.appendChild(script);
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f7f7f7;
  font-size: 0.26rem;
  font-family: "Calibri";
  font-weight: 400;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
  min-height: 100%;
  // overflow-x: hidden;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  //定义进入过渡生效时的状态
  // will-change: transform;
  transition: all 300ms linear;
  // backface-visibility: hidden;
  // perspective: 1000;
  // -webkit-perspective: 1000;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.slide-right-enter,
.slide-right-leave-to {
  //定义进入过渡的开始状态
  // transition-delay: 2000ms; //延时60ms执行
  transform: translateX(-100%);
  transition-timing-function: linear;
  z-index: 10;
}
.slide-right-leave-active {
  //定义离开过渡生效时的状态
  // transition-delay: 2000ms;//延时60ms执行
  transform: translateX(40%);
  z-index: -1;
  // opacity: 0;
}
.slide-left-enter,
.slide-left-leave-to {
  //定义进入过渡的开始状态
  // transition-delay: 2000ms;//延时60ms执行
  transform: translateX(100%);
  transition-timing-function: linear;
  z-index: 10;
}
.slide-left-leave-active {
  // opacity: 0;
  // transition-delay: 2000ms;//延时60ms执行

  transform: translateX(-40%);
  z-index: -1;
}
</style>
