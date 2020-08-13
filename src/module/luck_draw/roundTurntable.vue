<template>
  <div class="round_box">
    <publicHead style="background:none;">
      <h6 slot="headCenter">Luck draw</h6>
    </publicHead>
    <div class="luck_text">
      <i>You have {{num_rule.num}} Raffles left</i>
    </div>
    <div class="round">
      <!-- <div class="text">
        <span>You have</span>
        <span> {{num_rule.num}} </span>
        <span>Raffles left</span>
      </div>-->
      <div class="wheel_bg">
        <div class="bg">
          <img v-show="bg" class="bg1" src="@/assets/image/bg1.png" alt />
          <img v-show="!bg" class="bg2" src="@/assets/image/bg2.png" alt />
        </div>
        <canvas
          id="wheelCanvas"
          width="400px"
          height="400px"
          class="lottery_bg"
          :style="`transform: rotate(${wheelDeg}deg)`"
        ></canvas>
        <img @click="lottery" class="center" src="@/assets/image/center.png" alt />
      </div>
    </div>
    <!-- 中奖滚动数据 -->
    <div class="general">
      <div class="general_box ltr" v-if="if_general">
        <ul
          :style="`animation: ${time}s change linear infinite normal;-webkit-animation: ${time}s change linear infinite normal;`"
        >
          <li v-for="(general,index) in general_list" :key="index">
            <div class="rank">i</div>
            <div class="roster">
              <p>{{general.user_name}}</p>
              <p>{{general.coupon_amount}}</p>
              <p>{{general.time}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--  -->
    <div class="center_box" v-show="showResult">
      <div class="center_info">
        <div class="imge">
          <img v-if="result" :src="result.lucky_image" />
          <!-- <img v-else src="@/assets/image/wei.png" alt /> -->
        </div>
        <div class="text">Additional raffle opportunity after placing order</div>
        <div class="btn">
          <p @click="close">Once more</p>
          <p @click="to_buy">To use</p>
        </div>
      </div>
    </div>

    <div class="rule_luck" v-show="showrule">
      <p class="c_x" @click="rules_btn(1)">×</p>
      <p>{{num_rule.rule}}</p>
    </div>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Toast from "@/assets/js/pop_up";
export default {
  components: { publicHead },
  data() {
    return {
      bg: true,
      wheelDeg: 0,
      rolling: false,
      showResult: false,
      showrule: false,
      result: null,
      list: [],
      general_list: [],
      time: 5,
      num_rule: {
        rule: "",
        num: 0
      },
      if_general: false
    };
  },
  activated() {
    this.cur_num();
  },
  mounted() {
    let i = 0;
    setInterval(() => {
      this.bg = !this.bg;
    }, 1000);
    this.getLottery();

    window.addEventListener(
      "popstate",
      e => {
        if (this.showResult) {
          this.showResult = !this.showResult;
        }
      },
      false
    );
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.showResult) {
          this.showResult = !this.showResult;
        }
      },
      false
    );
  },
  methods: {
    cur_num() {
      let data = this.$store.state.status.token
        ? this.$store.state.status.token
        : "";
      this.$PHP.draw_cur_num({ token: data }).then(res=>{
        if (res.code == 0) {
          this.num_rule.num = res.data.total;
        }
      });
      let dat = {
        offset: 0,
        limit: 100
      };
      this.$PHP.draw_get_log(dat).then(res => {
        res.data.list.list.forEach(item => {
          item.coupon_amount = item.coupon_amount.replace(/Coupon/g, "");
          item.time = item.time.replace(/-/g, "/");
        });
        this.general_list = res.data.list.list;
        //let start = this.general_list[i]
        // this.general_list.push(start)
        this.time = (res.data.list.list.length - 4) * 4;
        let num = (res.data.list.list.length - 4) * 0.6;
        let style = document.styleSheets[0];
        style.deleteRule(0); //清除之前写入的动画样式,6代表动画所在的数组位置
        style.insertRule(
          " @-webkit-keyframes change { from { -webkit-transform: translateY(0); transform: translateY(0);} to { -webkit-transform: translateY(-" +
            num +
            "rem); transform: translateY(-" +
            num +
            "rem);}}"
        );
        this.if_general = true;
      });

      setTimeout(() => {
        this.if_general = true;
      }, 8000);
    },
    getLottery() {
      this.list = [];

      let tag = this.$store.state.country_i
      this.$PHP.draw_get_list().then(res => {
        if (res.code == 0) {
          this.num_rule.rule =
            tag == 1 ? res.data.list.data.en_rule : res.data.list.data.sa_rule;
          if (res.data.list.list) {
            res.data.list.list.forEach(ite => {
              let list = {
                id: ite.id,
                name: "",
                ratio: ite.ratio,
                img: {
                  resource_url: ite.image,
                  horizontal_resolution: 300, //水平分辨率
                  vertical_resolution: 300 //垂直分辨率
                },
                lucky_image: ite.lucky_image
              };
              this.list.push(list);
            });
          }
          // 循环一下，将图片渲染到页面上
          this.list.forEach(function(item) {
            if (item.img) {
              var img = new Image();
              img.src = item.img.resource_url;
              item.imgEl = img;
            }
          });
        } else {
          Toast({ message: res.msg, time: 2000, i: 1 });
        }
        // 请求会数据后，就可以开始将奖品之类的，画到转盘上了
        this.draw();
      });
    },
    checkImgComplete() {
      let complete = true;
      this.list.forEach(function(item) {
        if (item.imgEl && !item.imgEl.complete) {
          complete = false;
        }
      });
      return complete;
    },
    draw() {
      const _this = this;
      // 先判断，图片是否加载完成
      if (!_this.checkImgComplete()) {
        setTimeout(function() {
          _this.draw();
        }, 50);
        return;
      }
      //获取canvas画布
      // this.list 是通过后台获取回来的奖品列表
      let len = this.list.length;
      let canvas = document.getElementById("wheelCanvas");
      let ctx = canvas.getContext("2d");
      let canvasW = canvas.width; // 画板的高度
      let canvasH = canvas.height; // 画板的宽度
      //计算每个奖项所占角度数
      let baseAngle = (Math.PI * 2) / len;
      // ctx.clearRect(0, 0, canvasW, canvasH); //去掉背景默认的黑色
      ctx.strokeStyle = "#FEA801"; //设置画图线的颜色
      // 开始循环绘制每个奖品
      for (let i = 0; i < len; i++) {
        // 每个扇形的起始角度
        let angle = i * baseAngle;
        ctx.font = "16px Microsoft YaHei"; //设置字号字体
        let bgc = i % 2 === 0 ? "#FEA801" : "#FBDF74"; //设置每个扇形区域的颜色
        let bgc1 = i % 2 === 0 ? "#FBDF74" : "#FEA801";
        let grd = ctx.createRadialGradient(
          canvasW * 0.5,
          canvasW * 0.5,
          100,
          canvasW * 0.5,
          canvasW * 0.5,
          200
        );
        grd.addColorStop(0.83, bgc);
        grd.addColorStop(0.84, bgc1);
        grd.addColorStop(0.97, bgc1);
        grd.addColorStop(1, "#F2BB41");
        ctx.fillStyle = grd;
        ctx.beginPath(); //开始绘制
        ctx.arc(
          canvasW * 0.5,
          canvasH * 0.5,
          200,
          angle,
          angle + baseAngle,
          false
        );
        // 中心点的小圆，这样会形成一个环形图案
        ctx.arc(
          canvasW * 0.5,
          canvasH * 0.5,
          10,
          angle + baseAngle,
          angle,
          true
        );
        ctx.stroke(); //开始链线
        ctx.fill(); //填充颜色
        ctx.save(); //保存当前环境的状态
        ctx.fillStyle = "#017ec2"; // 设置文字颜色
        let item = this.list[i];
        // 计算文字的偏移量
        let translateX = canvasW * 0.5 + Math.cos(angle + baseAngle / 2) * 260;
        let translateY = canvasH * 0.5 + Math.sin(angle + baseAngle / 2) * 260;
        // 如果奖品无图，则文字相应改大，并且偏移变小
        if (!item.img) {
          ctx.font = "20px Microsoft YaHei"; //设置字号字体
          translateX = canvasW * 0.5 + Math.cos(angle + baseAngle / 2) * 220;
          translateY = canvasH * 0.5 + Math.sin(angle + baseAngle / 2) * 220;
        }
        ctx.translate(translateX, translateY);
        // rotate方法旋转当前的绘图，因为文字适合当前扇形中心线垂直的！
        // angle，当前扇形自身旋转的角度 +  baseAngle / 2 中心线多旋转的角度  + 垂直的角度90°
        ctx.rotate(angle + baseAngle / 2 + Math.PI / 2);
        //设置文本位置，居中显示
        ctx.fillText(item.name, -ctx.measureText(item.name).width / 2, 100);
        //添加对应缩略图
        let triangleEdge = canvasH * 0.25;
        // 根据角度不同，计算图片最大宽度
        let imgMaxWidth = Math.sqrt(
          2 * triangleEdge * triangleEdge * (1 - Math.cos(baseAngle))
        );
        if (item.imgEl) {
          ctx.drawImage(
            item.imgEl,
            -imgMaxWidth * 0.5,
            canvasH * 0.23,
            imgMaxWidth,
            (item.img.vertical_resolution * imgMaxWidth) /
              item.img.horizontal_resolution
          );
        }
        ctx.restore(); //很关键，还原画板的状态到上一个save()状态之前
      }
    },
    lottery() {
      if (this.showResult) {
        this.showResult = false;
        this.$router.go(-1);
        return;
      }
      if (this.rolling) {
        return;
      }
      this.rolling = true;

      if (!this.$store.state.status.token) {
        this.rolling = false;
        this.$router.push({ path: "/account/login" });
        return true;
      }
      let data = this.$store.state.status.token
        ? this.$store.state.status.token
        : "";

      this.$PHP.lucky_draw({ token: data }).then(res => {
        if (res.code == 0) {
          this.lucky_d(res.data.id);
        } else if (res.code == 202) {
          this.rolling = false;
          Toast({ message: res.msg, time: 2000, i: 1 });
        } else if (res.code == 203) {
          this.rolling = false;
          Toast({ message: res.msg, time: 2000, i: 1 });
        } else if (res.code == 204) {
          this.rolling = false;
          Toast({ message: res.msg, time: 2000, i: 1 });
        } else if (res.code == 401) {
          this.rolling = false;
          Toast({ message: res.msg, time: 2000, i: 1 });
        } else if (res.code == 104) {
          this.rolling = false;
          Toast({ message: res.msg, time: 2000, i: 1 });
        } else {
          this.rolling = false;
        }
      });

      // if(this.num_rule.num<1){
      //   Toast({  message: 'No more times', time: 2000, i: 1 });
      //    return false;
      // }
      // this.num_rule.num--
    },
    lucky_d(id) {
      if (this.num_rule.num > 0) {
        this.num_rule.num--;
      }
      // 这里应该从后台获取中奖结果，我们随便模拟一下中奖结果
      // let rand = Math.random();
      let winIndex = 0;
      // this.list.some((item, i) => {
      //   console.log(item);
      //   if (rand < item.ratio) {
      //     this.result = item;
      //     winIndex = i;
      //     return true;
      //   }
      // });
      this.list.some((item, i) => {
        // console.log(item);
        if (item.id == id) {
          this.result = item;
          winIndex = i;
          return true;
        }
      });
      console.log(winIndex, this.result);
      // var winIndex = parseInt(Math.random() * (this.list.length + 1), 10);
      // this.result = this.list[winIndex];
      // if (this.result.name === "谢谢参与") {
      //   this.result = null;
      // }
      let prize_angle = 360 - (360 / this.list.length) * winIndex; //转动到每个奖项的偏移的角度
      let area_angle = 180 - 360 / this.list.length; //初始指针角度
      // 计算中奖的旋转角度
      this.wheelDeg =
        this.wheelDeg - (this.wheelDeg % 360) + 3600 + prize_angle - area_angle;
      // 关闭中奖结果
      setTimeout(() => {
        this.showResult = true;
        this.rolling = false;
        window.history.pushState(null, null, "#");
      }, 5500);
    },
    close() {
      this.showResult = false;
      this.$router.go(-1);
    },
    rules_btn(i) {
      if (i == 0) this.showrule = true;
      else this.showrule = false;
    },
    to_buy() {
      this.showResult = false;
      this.$router.go(-1);
      setTimeout(() => {
        this.$router.push({ path: "/" });
      }, 30);
    }
  }
};
</script>
<style lang='scss' scoped>
.round_box {
  height: 100vh;
  background: url(../../assets/image/bk.png);
}

.luck_text {
  background: url(../../assets/image/tiao.png) no-repeat;
  background-size: 100% 100%;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.3rem;
  color: #fff;
  margin: 0 0.9rem 0.2rem;
  height: 0.6rem;
  line-height: 0.6rem;
  text-align: center;
}

.rules {
  position: absolute;
  top: 1.8rem;
  right: 0;
  width: 1rem;
  height: 1rem;
  line-height: 0.5rem;
  font-family: "Calibri";
  font-weight: 600;
  font-size: 0.26rem;
  color: #017ec2;
  text-align: end;
  padding: 0 0.3rem;
  z-index: 10;
}
.round {
  height: 7rem;
  width: 7rem;
  margin: 0 auto;
  position: relative;
  .wheel_bg {
    position: absolute;
    top: 0rem;
    left: 0%;
    width: 100%;
    height: 100%;
    background-color: #fbdf74;
    border-radius: 50%;
    overflow: hidden;
    // transform: translate(-50%, -10%);
    transition: transform 8s ease-in-out;
    z-index: 1;
    border: 2px solid #ffeea5;
    box-sizing: border-box;
  }
  .lottery_bg {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    width: calc(100% - 0.8rem);
    height: calc(100% - 0.8rem);
    background-color: #fea801;
    // background-color: rgba(51, 182, 255, 1);
    border-radius: 50%;
    overflow: hidden;
    transition: transform 5s ease-in-out;
    z-index: 2;
  }
  .center {
    position: absolute;
    top: 51%;
    left: 50%;
    width: 1.4rem;
    transform: translate(-50%, -50%);
    margin-top: -0.2rem;
    z-index: 4;
    // cursor: pointer;
  }
  .bg {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    // calc(100% + 0.1rem)
    height: 100%;
    z-index: 3;
    .bg1,
    .bg2 {
      width: 100%;
      height: 100%;
    }
  }
}
.center_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}
.center_info {
  width: 6.5rem;
  z-index: 10;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.24rem;
  color: #333;
  background: linear-gradient(to right, #fff4e0, #feedc1);
  border-radius: 0.3rem;
  margin: 35vh auto;
  padding: 0.3rem;
  box-sizing: border-box;
  text-align: center;
  .imge {
    width: 100%;
    min-height: 1rem;
    img {
      width: 100%;
    }
  }
  .text {
    width: 100%;
    line-height: 0.6rem;
    color: #999;
    text-align: start;
  }
  .btn {
    width: 100%;
    color: #fff;
    font-size: 0.3rem;
    display: flex;
    justify-content: space-between;
    p {
      border: 1px solid #eddbb3;
      line-height: 0.8rem;
      padding: 0 0.2rem;
      width: 2rem;
      border-radius: 0.1rem;
    }
    p:nth-child(1) {
      color: #999;
    }
    p:nth-child(2) {
      background-color: #ffa01e;
    }
  }
}
.general {
  width: 100%;
  padding: 1.3rem 0.5rem 0.3rem;
  box-sizing: border-box;
  font-family: "Calibri";
  font-weight: 600;
  font-size: 0.24rem;
  color: #333;
  height: calc(100vh - 8.6rem);
  min-height: 4rem;
  margin-top: -0.6rem;
  background: url(../../assets/image/yellow1.png) no-repeat;
  background-size: 100%;
  .general_box {
    height: 100%;
    overflow: hidden;
  }
  ul {
    li {
      height: 0.6rem;
      line-height: 0.6rem;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      margin: 0.2rem 0;
      .rank {
        width: 0.6rem;
        background: url(../../assets/image/yuan.png);
        background-size: contain;
        text-align: center;
        color: #fff;
      }
      .roster {
        width: 5.6rem;
        display: flex;
        justify-content: space-between;
        background: url(../../assets/image/di.png) no-repeat;
        background-size: contain;
        padding: 0 0.3rem;
        box-sizing: border-box;
        p:nth-child(2) {
          width: 1rem;
          text-align: center;
        }
        p:nth-child(3) {
          font-weight: normal;
          width: 2.4rem;
          font-size: 0.22rem;
        }
      }
    }
  }
}
.rule_luck {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 40vh;
  background: #f7f7f7;
  z-index: 100;
  border-radius: 0.1rem;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.3rem;
  color: #333;
  padding: 0 0.3rem 0.3rem;
  box-sizing: border-box;
  .c_x {
    line-height: 0.8rem;
    width: 100%;
    text-align: end;
    color: #000;
    font-size: 0.4rem;
  }
}

.round_box ::v-deep .di_v {
  background: none;
}
</style>