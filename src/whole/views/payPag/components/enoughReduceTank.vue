<template>
  <div class="er_box">
    <ul>
      <li v-for="(er,i) of enoughReduceData.er_json" :key="i">
        <span>Full {{GLOBA.money_tag}} {{i| percentageNum}} minus {{ er| percentageNum}}</span>
      </li>
    </ul>
    <div class="confirm_but" @click="$emit('closeEnoughTank')">Confirm</div>
  </div>
</template>

<script>
export default {
  props: ["enoughReduceData"],
  data() {
    return {};
  },
};
</script>
<style lang='scss' scoped>
.er_box {
  width: 100%;
  height: calc(8rem);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ul {
    padding: 0.2rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-height: 7rem;
    overflow-y: scroll;
    li{
      padding: 0.1rem;
    }
    span {
      display: inline-block;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.22rem;
      color: #fff;
      padding: 0 0.2rem;
      box-sizing: border-box;
      text-align: center;
      width: 3.3rem;
      height: 0.9rem;
      line-height: 0.9rem;
      background: url(~@/assets/img/store/discount.png) no-repeat;
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