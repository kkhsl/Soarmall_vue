<template>
  <div
    id="chatBtn"
    class="Suspension"
    @click.stop="toChatPage"
    @touchstart="down"
    @touchmove.prevent="move"
    @touchend="end"
  ></div>
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
      yPum: ""
    };
  },
  methods: {
    toChatPage() {
      this.$router.push({
        path: "/subpages/Account/chat"
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
      this.dx = chatBtn.offsetLeft;
      this.dy = chatBtn.offsetTop;
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
        } else if (this.xPum > bannerWidth - 46) {
          this.xPum = bannerWidth - 46;
        }
        if (this.yPum < 80) {
          this.yPum = 80;
        } else if (this.yPum > bannerHeight - 100) {
          this.yPum = bannerHeight - 100;
        }
        chatBtn.style.left = this.xPum + "px";
        chatBtn.style.top = this.yPum + "px";
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

<style  lang="css">
#chatBtn {
  width: 0.8rem;
  height: 0.8rem;
  position: fixed;
  bottom: 2rem;
  right: 0;
  z-index: 6;
  background: url(../../../assets/img/chat.png) no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}
</style>