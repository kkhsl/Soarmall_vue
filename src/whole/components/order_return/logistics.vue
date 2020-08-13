<template>
  <div class="mask">
    <div class="xz_head" @click="wancheng()"></div>
    <div class="xz_conter">
      <div class="cs_title">
        {{$t("common.Logistics status")}}
        <p class="colse" @click="wancheng()">
          <img src="@/assets/img/other/cols.png" alt />
        </p>
      </div>
      <div class="zhuantai" v-if="list.length==0">{{$t("common.No data")}}</div>

      <div class="cs_piece">
        <flow orientation="vertical">
          <flow-state v-if="list.length!==0" :state="list.length+1" is-done></flow-state>
          <template v-for="(lists,i) in list">
            <flow-line is-done :line-span="100"></flow-line>
            <flow-state :state="lis.length-i" is-done></flow-state>
          </template>
        </flow>
        <ul>
          <li v-for="(lists,i) in list" :key="i">
            <p>{{lists.details}}</p>
            <p>{{lists.date}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Flow } from "vux";
export default {
  components: { Flow },
  props: ['list'],
  data() {
    return {
    };
  },
  methods: {
      wancheng(){
          this.$emit("wancheng")
      }
  }
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.15);
  z-index: 2222;
}
.xz_head {
  width: 100%;
  height: 3.64rem;
}
.xz_conter {
  width: 100%;
  height: 100%;
  background: #fff;
}
.cs_title {
  position: relative;
  font-size: 0.32rem;
  text-align: center;
  height: 1.36rem;
  line-height: 1.36rem;
  width: 100%;
  font-family: "Calibri-Bold";
  font-weight: bold;

  .colse {
    position: absolute;
    right: 0.4rem;
    top: -0.2rem;
  }
}
.zhuantai {
  width: 3rem;
  height: 1.4rem;
  line-height: 1.4rem;
  color: #017ec2;
  font-size: 0.36rem;
  margin: 2rem auto;
  text-align: center;
}
.cs_piece {
  display: flex;
  height: calc(100vh - 6rem);
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  ul {
    font-size: 0.3rem;

    li {
      display: flex;
      flex-wrap: wrap;
      width: 95%;
      height: 2rem;
      font-size: 0.28rem;
      font-family: "Calibri";
      font-weight: 400;
      color: #333;
      border: 1px solid #ccc;
      border: none;
      border-bottom: 1px solid #ebebeb;
      box-sizing: border-box;

      p:nth-child(1) {
        font-size: 0.28rem;

        display: flex;
        align-items: center;
      }

      p:nth-child(2) {
        width: 4.6rem;
        display: flex;
        align-items: center;
        color: #ccc;
      }
    }
  }
}
</style>
