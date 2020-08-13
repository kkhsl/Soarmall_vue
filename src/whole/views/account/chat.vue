<template>
  <div class="full_page" id="apply" :class="{'isApp': isApp}">
    <input type="text" class="iosDebugHideInput" ref="iosDebugHideInput" />
    <Header ref="publicHead">
      <div slot="headCenter" class="headTitle">{{$t("common.SoarMall")}}</div>
    </Header>
    <mescroll-vue
      class="centerWrap"
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div class="lt_bj" id="chat_mess">
        <ul>
          <li class="history" v-if="!exist">No more history</li>
          <li v-for="(item,index) in items" :key="index">
            <p class="time">{{item.time}}</p>
            <div class="message" :class="item.is_self == 1?'right':'left'">
              <p class="imga" v-if="item.is_self != 1" @click="to_login">
                <img v-lazy="item.avatar" />
              </p>
              <p class="read" v-if="item.status === 0 && item.is_self == 1">{{$t("common.Read")}}</p>
              <p class="failed" v-if="item.font_s">!</p>
              <p class="content">{{item.content}}</p>
              <p class="imga" v-if="item.is_self == 1" @click="to_login">
                <img :src="user_photo" />
              </p>
            </div>
          </li>
        </ul>
      </div>
    </mescroll-vue>
    <div class="lt_button">
      <input type="text" id="input" v-model="inputText" @blur="inputOnBlur" @focus="inputOnFocus" />
      <p class="sendBtn" :class="{'bgc':inputText.length}" @click="sendMsg()">{{$t("common.Send")}}</p>
    </div>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
import Header from "@/whole/components/header/publicHead";
export default {
  components: {
    Header,
    MescrollVue: () => import("@/plugins/scroll/mescroll")
  },
  data() {
    return {
      isApp: localStorage.getItem("web_app") == 0,
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        auto: true,
        callback: this.downCallback
      },
      mescrollUp: {
        toTop: {
          showClass: "mescroll-fade-ins",
          hideClass: "mescroll-fade-outs"
        },
        empty: {},
        lazyLoad: {}
      },
      page: 1, //下拉页码
      size: 20, //每次下拉读取消息条数
      exist: true, //是否继续加载

      path: "", //type 2 阿联酋 3 沙特
      socket: "",
      lockReconnect: false, //是否真正建立连接
      timeout: 60 * 1000, //心跳时间
      timeoutObj: null, //心跳心跳倒计时
      timeoutnum: null, //断开 重连倒计时

      inputText: "",
      items: [],
      serviceData: {},
      countryUid: 2, //2阿联酋 3沙特
      user_photo: require("@/assets/img/accout/guangtou.png")
    };
  },
  created() {
    this.countryUid = Number(this.$store.state.country_i) + 1;
    let service_ = JSON.parse(localStorage.getItem("service_") || "[]");
    this.path = `wss://adm.soarmall.com/ws?type=${this.countryUid}&access_token=${this.$store.state.status.token}&visitor_uid=${service_.uid}`;
  },
  mounted() {
    this.init();
    this.user_photo =
      this.$store.state.status.user_photo ||
      require("@/assets/img/accout/guangtou.png");
  },
  methods: {
    inputOnFocus() {
      this.mescroll.scrollTo(9999999, 0);
    },
    inputOnBlur() {
      if (this.GLOBA.isIos) {
        this.$refs.iosDebugHideInput.focus();
        this.$refs.iosDebugHideInput.blur();
      }
    },
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
      this.mescroll.scrollTo(9999999, 0);
    },
    // 下拉刷新
    downCallback(mescroll) {
      this.chat_mess(); // 获取聊天记录
      setTimeout(() => {
        mescroll.endSuccess();
        mescroll.endErr();
      }, 500);
    },
    to_login() {
      if (!this.$store.state.status.token) {
        this.$router.push({ path: "/account/login" });
      }
    },
    async chat_mess() {
      // 获取聊天记录
      if (this.exist) {
        let service_ = JSON.parse(localStorage.getItem("service_") || "[]");
        let data = {
          page: this.page,
          access_token: this.$store.state.status.token || service_.uid,
          type: this.countryUid,
          size: this.size
        };
        let res = await this.$PHP.chat_log(data);
        if (res.code == 1) {
          if (res.data.length < this.size) {
            this.exist = false;
          }
          let chart_message = [];
          let chart_message1 = [];
          res.data.forEach(item => {
            chart_message.unshift(item);
          });
          chart_message.forEach(ie => {
            let add_time = Number(ie.created_at.replace(/[^0-9]/gi, ""));
            let times = Number(sessionStorage.getItem("addTime") || "");
            if (add_time - times > 300 || add_time - times < 0) {
              //100表示1分钟
              ie.time = ie.created_at;
            }
            sessionStorage.setItem("addTime", add_time);
            chart_message1.push(ie);
          });
          this.items = chart_message1.concat(this.items);
          this.page++;
        }
      }
    },
    init() {
      if (typeof WebSocket === "undefined") {
        Toast({ message: "Connecting Miss", time: 2000, i: 2 });
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500);
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.start;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    error() {
      this.reconnect();
      Toast({ message: "The reconnection", time: 2000, i: 2 });
    },
    getMessage(msg) {
      this.reset();
      const data = JSON.parse(msg.data);
      console.log(data);
      if (typeof data.code !== "undefined" && data.code == 1) {
        if (data.data.is_self == 1) {
          this.inputText = "";
        }
        let add_time = Number(data.time.replace(/[^0-9]/gi, ""));
        let times = Number(
          sessionStorage.getItem("addTime")
            ? sessionStorage.getItem("addTime")
            : ""
        );
        if (add_time - times > 300 || add_time - times < 0) {
          //100表示1分钟
          data.timea = data.time;
        }
        sessionStorage.setItem("addTime", add_time);

        this.items.some((item, i) => {
          if (item.id == data.data.id) {
            this.items.splice(i, 1);
            return true;
          }
        });
        let mages = {
          name: "服务器",
          is_self: data.data.is_self,
          time: data.timea,
          times: data.time,
          content: data.data.content,
          avatar: data.data.avatar,
          status: data.data.status,
          id: data.data.id
        };
        this.items.push(mages);
      } else if (data.code && data.code == 2) {
        this.serviceData = data.data;
      } else if (data.code === 401) {
        Toast({ message: "Visitors account", time: 2000, i: 2 }); //未登录
        localStorage.setItem("service_", JSON.stringify(data.data));
      }
      setTimeout(() => {
        this.mescroll.scrollTo(9999999, 0);
      }, 100);

      console.log(msg.data, this.timeout, this.timeoutObj, this.timeoutnum);
    },
    sendMsg() {
      if (this.inputText.length <= 0) {
        return false;
      }
      let service_ = JSON.parse(localStorage.getItem("service_") || "[]");
      let status = this.$store.state.status;
      const params = {
        type: 1, //发送给客服标识
        uid: this.serviceData.uid, //发给客服id
        method: "chatMsg", //发送的方法
        content: this.inputText, //发送的内容
        mid: status.user_id || service_.uid, //我的id
        avatar: status.user_photo, //我的头像
        username: status.userName ? status.userName : service_.username, //我的名字
        site_type: this.countryUid //2阿联酋 3沙特
      };
      console.log(params, this.$store.state.status);
      if (this.socket.readyState === 1) {
        this.socket.send(JSON.stringify(params));
        document.getElementById("input").focus();
      } else {
        this.reconnect();
      }
    },
    close() {
      console.log("socket已经关闭");
    },
    reconnect() {
      //重新连接
      let that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(() => {
        //新连接
        that.init();
        that.lockReconnect = true;
      }, 5000);
    },
    reset() {
      //重置心跳
      let that = this;
      //清除时间
      that.timeoutObj && clearInterval(that.timeoutObj);
      //重启心跳
      that.start();
    },
    start() {
      //开启心跳
      var self = this;
      self.timeoutObj && clearInterval(self.timeoutObj);
      self.timeoutObj = setInterval(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.socket.readyState === 1) {
          //如果连接正常
          self.socket.send(JSON.stringify({ method: "ping" }));
        } else {
          //否则重连
          self.reconnect();
        }
      }, self.timeout);
    }
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  }
};
</script>

<style lang="scss" scoped>
.headTitle {
  font-size: 0.36rem;
  font-weight: bold;
  font-family: "Calibri-Bold";
  color: #fff;
}
.mescroll::-webkit-scrollbar {
  display: none;
}
.mescroll-fade-ins {
  height: 0;
}
.mescroll-fade-outs {
  height: 0;
}
.lt_bj {
  height: 100%;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  font-size: 0.3rem;
  padding: 0.1rem 0.3rem;
  box-sizing: border-box;
  font-family: "Calibri";
  .history {
    margin: 0 0.1rem 0.1rem;
  }
  .history,
  .time {
    text-align: center;
    color: #999;
    font-size: 0.2rem;
    line-height: 0.24rem;
    font-weight: 100;
  }
  .right {
    justify-content: flex-end;
    .content {
      margin: 0 0.25rem 0 3px;
      background: #33b6ff;
    }
    .content::after {
      right: -0.15rem;
      border-left: 0.15rem solid #33b6ff;
    }
  }
  .left {
    justify-content: flex-start;
    .content {
      margin: 0 3px 0 0.25rem;
      background: #fff;
    }
    .content::after {
      left: -0.15rem;
      border-right: 0.15rem solid #fff;
    }
  }
  .message {
    display: flex;
    width: 100%;
    line-height: 0.4rem;
    margin: 0.15rem 0;
    word-break: break-all;
    .imga {
      min-width: 0.6rem;
      max-width: 0.6rem;
      min-height: 0.6rem;
      max-height: 0.6rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.04rem;
      }
    }
    .content::after {
      content: "";
      position: absolute;
      top: 0.15rem;
      width: 0;
      height: 0;
      border-top: 0.1rem solid transparent;
      border-bottom: 0.1rem solid transparent;
    }
    .content {
      max-width: 5.2rem;
      padding: 0.1rem;
      font-weight: 400;
      font-size: 0.28rem;
      border-radius: 0.1rem;
      position: relative;
    }
    .failed {
      color: #f00;
      font-weight: 400;
    }
    .read {
      font-weight: 100;
      color: #ccc;
      font-size: 0.2rem;
    }
  }
}

.lt_button {
  height: 1rem;
  background: #f1f1f1;
  text-align: center;
  line-height: 0.56rem;
  display: flex;
  justify-content: space-between;
  padding: 0.15rem 0.2rem;
  box-sizing: border-box;
  border-top: 1px solid #ededed;
  input {
    height: 0.6rem;
    width: 5.2rem;
    background: white;
    box-sizing: border-box;
    padding: 0.15rem;
    border-radius: 0.1rem;
    margin: 0 0.1rem;
  }
  .bgc {
    background: #017ec2 !important;
  }

  .sendBtn {
    width: 1.4rem;
    height: 0.6rem;
    background: #ccc;
    margin: 0 0.1rem;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.3rem;
    line-height: 0.6rem;
    color: #fff;
    border-radius: 0.1rem;
  }
}

.focusState {
  position: absolute;
}
</style>
