<template>
  <div class="load" :class="GLOBA.height_foot">
    <div class="mint_spinner"></div>
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
  margin: 35vh auto;
  height: 1rem;
  width: 1rem;
  border:0.1rem dotted;
  border-top-color:#bfe3f7;
  border-right-color:#017ec2;
  border-bottom-color:#33b6ff;
  border-left-color:#83cdf5;
  border-radius: 50%;
  animation:circle 1s infinite linear;
  -webkit-animation:circle 1s infinite linear;/* Safari 和 Chrome */
}
@-webkit-keyframes circle{
  0%{
    transform:rotate(0deg)
  }
  100%{
    transform: rotate(360deg)
  }
}
</style>