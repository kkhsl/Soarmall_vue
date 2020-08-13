<template>
    <div class="mask">
      <div class="xz_head" @click="wancheng()"></div>
      <div class="xz_conter">
        <div class="cs_title">{{$t("common.Details")}}</div>
        <div class="cs_piece">
          <ul>
            <li v-if="goodsdeta.goods_brand_name">
              <p>Brand</p>
              <p>{{goodsdeta.goods_brand_name}}</p>
            </li>
            <li v-for="parameter in goodsdeta.goods_property" :key="parameter.id">
              <p>{{parameter.name}}</p>
              <p>{{parameter.val}}</p>
            </li>
          </ul>
        </div>
        <div class="cs_foot">
          <div class="cs_bottom" @click="wancheng()">{{$t("common.Done")}}</div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: ["goodsdeta"],
  data() {
    return {
    };
  },

  methods: {
      wancheng(){
          this.$emit('wancheng')
      }
  }
};
</script>
<style lang='scss' scoped>
.mask {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.15);
  z-index: 222;
  .xz_head {
    width: 100%;
    height: 3.64rem;
  }
  .xz_conter {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .xz_title {
    height: 1.36rem;
    width: 100%;
    display: flex;
    justify-content: flex-start;

    p:nth-child(1) {
      width: 0.7rem;
      height: 0.52rem;
      margin: 0 0.3rem;

      img {
        height: 100%;
        width: 100%;
      }
    }

    p:nth-child(2) {
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.36rem;
      color: #333;
      height: 100%;
      width: 5.36rem;
      line-height: 1.36rem;
    }

    p:nth-child(3) {
      width: 0.24rem;
      height: 0.24rem;
      margin-top: 0.44rem;
      margin-left: 0.3rem;
      position: relative;

      img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.cs_title {
  font-size: 0.32rem;
  text-align: center;
  height: 1.36rem;
  line-height: 1.36rem;
  width: 100%;
  font-family: "Calibri-Bold";
  font-weight: bold;
}
.cs_piece {
  width: 100%;
  height: calc(100vh - 6rem);
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;

  ul {
    width: 100%;

    li {
      width: 100%;
      font-size: 0.28rem;
      font-family: "Calibri";
      font-weight: 400;
      color: #333;
      border: 1px solid #ccc;
      border: none;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      justify-content: flex-start;
      padding: 0.3rem;
      box-sizing: border-box;

      p:nth-child(1) {
        width: 1.4rem;
        font-size: 0.28rem;
        margin-right: 0.6rem;
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
.cs_foot {
  width: 90%;
  height: 1rem;
  padding: 0.1rem 0px;
  box-sizing: border-box;
  margin: auto;

  .cs_bottom {
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    width: 100%;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #33b6ff, #017ec2);
    font-size: 0.32rem;
    font-family: "Calibri-Bold";
    font-weight: bold;
    color: #fff;
    border-radius: 0.6rem;
  }
}
</style>