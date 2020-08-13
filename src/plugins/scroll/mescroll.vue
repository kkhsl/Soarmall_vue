<template>
  <div ref="mescroll" class="mescroll">
    <div id="mescrollWrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 引入mescroll.min.js和mescroll.min.css
import MeScroll from "@/plugins/scroll/mescroll.min.js";
import "@/plugins/scroll/mescroll.min.css";

export default {
  name: "MeScrollVue",
  data: function () {
    return {
      mescroll: null,
      lastScrollTop: 0, // 路由切换时滚动条的位置
      lastBounce: null, // 路由切换时是否禁止ios回弹
      language_s: "",
      defaultOptions: null,
    };
  },
  props: {
    up: Object,
    down: Object,
  },
  mounted: function () {
    this.language_s = this.$route.query.lang;
    this.initScroll();
  },
  computed:{
    htmlLoading(){
      return `<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">${this.language_s == "sa"?'تحميل برامج':'Loading...'}</p>`
    },
    textInOffset(){
      return this.language_s == "en" ? "Pull-refresh" : "تحديث القائمة المنسدلة";
    },
    textOutOffset(){
      return this.language_s == "en" ? "Release immediately refresh" : "الإفراج الفوري عن التحديث";
    },
    textLoading(){
      return this.language_s == "en" ? "Loading..." : "اللودينج";
    }
  },
  methods: {
    initScroll() {
      this.defaultOptions = {
        up: {
          noMoreSize: 6,
          htmlLoading: this.htmlLoading,
          toTop: {
            src: require("@/assets/img/other/top.png"),
            offset: 600,
            warpClass: this.language_s == "sa" ? "mescroll-totop1" : "mescroll-totop",
          },
          empty: {
            icon: require("@/assets/img/other/wb.png"),
            tip: this.$t('common.No data'),
            btntext: "SoarMall",
            btnClick: this.backHome,
          },
          lazyLoad: {
            use: true,
          },
          offset: 200,
        },
        down: {
          textInOffset: this.textInOffset,
          textOutOffset: this.textOutOffset,
          textLoading: this.textLoading,
        },
      };
      // 初始化
      this.mescroll = new MeScroll(this.$refs.mescroll, {
        up: this.extend(this.defaultOptions.up, this.up),
        down: this.extend(this.defaultOptions.down, this.down),
      });
      this.$emit("init", this.mescroll); // init回调mescroll对象
    },
    backHome() {
      this.$router.push({ path: "/" });
    },
    extend(FirstOBJ, SecondOBJ) {
      // 深度合并对象
      for (var key in SecondOBJ) {
        FirstOBJ[key] =
          FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]"
            ? this.extend(FirstOBJ[key], SecondOBJ[key])
            : (FirstOBJ[key] = SecondOBJ[key]);
      }
      return FirstOBJ;
    },
    beforeRouteEnter() {
      if (this.mescroll) {
        // 滚动到之前列表的位置
        if (this.lastScrollTop) {
          this.mescroll.setScrollTop(this.lastScrollTop);
          setTimeout(() => {
            // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
            this.mescroll.setTopBtnFadeDuration(0); // 设置回到顶部按钮显示时无渐显动画
          }, 16);
        }
        // 恢复到之前设置的isBounce状态
        if (this.lastBounce != null) this.mescroll.setBounce(this.lastBounce);
      }
    },
    beforeRouteLeave() {
      if (this.mescroll) {
        this.lastScrollTop = this.mescroll.getScrollTop(); // 记录当前滚动条的位置
        this.mescroll.hideTopBtn(0); // 隐藏回到顶部按钮,无渐隐动画
        this.lastBounce = this.mescroll.optUp.isBounce; // 记录当前是否禁止ios回弹
        this.mescroll.setBounce(true); // 允许bounce
      }
    },
  },
  activated() {
    this.language_s = this.$route.query.lang;
    if (this.mescroll) {
      // 滚动到之前列表的位置
      if (this.lastScrollTop) {
        this.mescroll.setScrollTop(this.lastScrollTop);
        setTimeout(() => {
          // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
          this.mescroll.setTopBtnFadeDuration(0); // 设置回到顶部按钮显示时无渐显动画
        }, 16);
      }
      // 恢复到之前设置的isBounce状态
      if (this.lastBounce != null) this.mescroll.setBounce(this.lastBounce);
    }
  },
  deactivated() {
    if (this.mescroll) {
      this.lastScrollTop = this.mescroll.getScrollTop(); // 记录当前滚动条的位置
      this.mescroll.hideTopBtn(0); // 隐藏回到顶部按钮,无渐隐动画
      this.lastBounce = this.mescroll.optUp.isBounce; // 记录当前是否禁止ios回弹
      this.mescroll.setBounce(true); // 允许bounce
    }
  },
};
</script>
<style lang="css">
#mescrollWrap {
  overflow-x: hidden;
}
</style>
