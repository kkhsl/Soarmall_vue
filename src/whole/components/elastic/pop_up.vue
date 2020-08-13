<template>

  <div
    class="toastMessageBox"
    v-show="show"
    v-cloak
  >
    <p v-if="ifSuccess === 0"><img src="@/assets/img/other/zhenque.png" /></p>
    <p v-if="ifSuccess === 1"><img src="@/assets/img/other/error.png" /></p>
    {{message}}
  </div>
</template>

<script>

export default {
  name: 'toastMessage',
  data () {
    return {
      message: '',
      show: false,
      ifSuccess: 0
    };
  },
}

</script>
<style lang='scss' scoped>
.toastMessageBox {
  width: 2.4rem;
  font-family: "Calibri";
  font-weight: 400;
  font-size: 0.3rem;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 20000;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  padding: 0.3rem;
  p {
    margin: 0.4rem auto 0.16rem;
  }
}
</style>
