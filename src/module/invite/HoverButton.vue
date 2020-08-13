<template>
  <div v-if="this.$store.state.hover_btn">
    <div
      v-if="Android_iOS==0"
      id="moveDiv"
      class="Suspension"
      :class="{'left':GLOBA.isRotate}"
      :style="hw"
      @click.stop="to_free"
      @touchstart.prevent="down"
      @touchmove.prevent="move"
      @touchend.prevent="end"
    >
      <!-- <p class="self-centered">Free Gifts</p> -->
    </div>
    <div
      v-if="Android_iOS==1"
      id="moveDiv"
      class="Suspension"
      :class="{'left':GLOBA.isRotate}"
      :style="hw"
      @click="to_free"
      @touchstart="down"
      @touchmove="move"
      @touchend="end"
    >
      <!-- <p class="self-centered">Free Gifts</p> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flags: false,
      position: { x: 0, y: 0 },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      hw: {
        width: "0.9rem",
        height: "0.9rem"
      },
      Android_iOS: 1
    };
  },
  created() {
    this.Android_iOS = JSON.parse(localStorage.getItem("Android_iOS") || "[]");
  },
  methods: {
    to_free() {
      this.$router.push({
        path: "/home/Entry"
      });
    },
    // 实现移动端拖拽
    down() {
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = moveDiv.offsetLeft;
      this.dy = moveDiv.offsetTop;
      this.hw.width = this.hw.height = "1.5rem";
    },
    move() {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        let bannerWidth =
          document.documentElement.clientWidth || window.innerWidth;
        let bannerHeight =
          document.documentElement.clientHeight || window.innerHeight;
        if (this.xPum < 0) {
          this.xPum = 0;
        } else if (this.xPum > bannerWidth - 50) {
          this.xPum = bannerWidth - 50;
        }
        if (this.yPum < 80) {
          this.yPum = 80;
        } else if (this.yPum > bannerHeight - 100) {
          this.yPum = bannerHeight - 100;
        }
        moveDiv.style.left = this.xPum + "px";
        moveDiv.style.top = this.yPum + "px";
        //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener(
          "touchmove",
          function(e) {
            e.preventDefault();
          },
          false
        );
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
      this.hw.width = this.hw.height = "1rem";
    },

    darg() {
      /*拖拽操作--drag*/
      var div = document.querySelector("#darg_ac");
      var startX, startY, moveX, moveY, distanceX, distanceY;
      /*开始触摸*/
      div.addEventListener("touchstart", function(e) {
        startX = e.targetTouches[0].clientX;
        startY = e.targetTouches[0].clientY;
        console.log(startX + ":" + startY);
      });
      /*触摸滑动:持续触发*/
      div.addEventListener("touchmove", function(e) {
        /*记录手指滑动过程中的坐标值*/
        moveX = e.targetTouches[0].clientX;
        moveY = e.targetTouches[0].clientY;
        console.log(moveX + ":" + moveY);
        /*计算与上一次坐标的差异*/
        distanceX = moveX - startX;
        distanceY = moveY - startY;
        console.log(distanceX + ":" + distanceY);
        /*设置偏移*/
        div.style.transform =
          "translate(" + distanceX + "px," + distanceY + "px)";
      });
      /*触摸结束*/
      div.addEventListener("touchend", function(e) {});
    }
  }
};
</script>

<style  lang="scss" scoped>
.Suspension {
  background: url(../../assets/img/FreeGit/floating.png);
  background-size: contain;
  position: fixed;
  right: 0;
  top: 60vh;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.24rem;
  color: #fff;
  text-align: center;
  z-index: 6;
}
.left{
  left: 0;
}
</style>