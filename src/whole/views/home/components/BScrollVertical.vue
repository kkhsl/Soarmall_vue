<template>
  <div class="BScrollWrap" ref="BScrollWrap">
    <div class="BScrollList">
      <template v-for="productItem of productInfo">
        <slot :productItem="productItem" name="productItem"></slot>
      </template>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "homeSwipe",
  props: ["productInfo"],
  components: {
    BScroll,
  },
  data() {
    return {
      betterScroll: null,
    };
  },
  mounted() {
    setTimeout(()=>{
      if (!this.betterScroll) {
        this.betterScroll = new BScroll(this.$refs.BScrollWrap, {
          startX: 0,
          click: true,
          scrollX: true,
          scrollY: false,
          eventPassthrough: "vertical",
        });
      } else {
        this.betterScroll.refresh();
      }
      console.log(this.betterScroll)
    },1000)
  }
};
</script>

<style lang="scss" scoped>
.BScrollWrap{
  position: relative;
  overflow: hidden;
  z-index: 2;
}
.BScrollList {
  padding: 0 0.2rem;
  white-space: nowrap;
  display: inline-block;
}
</style>