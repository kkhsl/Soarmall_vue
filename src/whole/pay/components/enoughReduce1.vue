<template>
  <div class="box" @click="$emit('ertagmap_btn',1)">
    <div class="er_box">
      <ul>
        <li v-for="(er,i) of enoughReduce1.er_json" :key="i">
          <span>Full {{GLOBA.money_tag}} {{i| percentageNum}} minus {{ er| percentageNum}}</span>
        </li>
      </ul>
    </div>
    <div class="confirm_but">Confirm</div>
  </div>
</template>

<script>
export default {
  props: ["enoughReduce1"],
  data() {
    return {};
  }
};
</script>
<style lang='scss' scoped>
.box {
  width: 100%;
  height: 100vh;
  z-index: 333;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
}
.er_box {
  margin-top: 35vh;
  width: 100%;
  height: calc(65vh - 1rem);
  background-color: #fff;
  ul {
    padding-top: 0.2rem;
    width: 7rem;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    span {
      // letter-spacing:-0.01rem;
      display: inline-block;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.22rem;
      color: #fff;
      padding: 0 0.2rem;
      box-sizing: border-box;
      margin-top: 0.1rem;
      margin-left: 0.1rem;
      text-align: center;
      width: 3.3rem;
      height: 0.9rem;
      line-height: 0.9rem;
      background: url(../../../assets/img/store/discount.png) no-repeat;
      background-size: 100%;
    }
  }
}
.confirm_but {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background-color: #008edd;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.34rem;
  color: #fff;
}
</style>