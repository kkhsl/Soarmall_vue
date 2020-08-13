<template>
  <div class="load" :class="GLOBA.height_foot">
    <div class="mint_spinner">{{$t("message.Loading")}}</div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {};
  },

  created() {},

  methods: {}
};
</script>
<style lang='scss' scoped>
.load {
  width: 100vw;
  height: 100vh;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
}
.mint_spinner{
  margin: 36vh auto;
  font-size: 0.3rem;
  width: 1.5rem;
  color: #017ec2;
}
</style>