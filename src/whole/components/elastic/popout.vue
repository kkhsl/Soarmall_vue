<template>
  <div class="popout">
    <div class="popout_box">
      <div class="popout_words">
        <p>{{Cue_title}}</p>
        <p>{{cue_words}}</p>
      </div>
      <div class="popout_btn">
        <p @click="popout_btn(0)">{{$t("common.Cancel")}}</p>
        <p @click.prevent="popout_btn(1)">{{$t("common.Confirm")}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { Cue_title: "", cue_words: "" },
  data() {
    return {};
  },
  methods: {
    popout_btn(id) {
      // console.log(id)
      this.$emit("popout_btn", id);
    }
  }
};
</script>
<style lang='scss' scoped>
.popout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.15);
  z-index: 1000;
}
.popout_box {
  width: 5rem;
  font-size: 0.3rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  background-color: #fff;
  border-radius: 0.4rem;
  padding: 0.3rem;
  margin: 25vh auto 0;
  text-align: center;
}
.popout_words {
  width: 100%;
  line-height: 0.4rem;
  color: #333;
  p {
    padding: 0.2rem 0;
  }
}
.popout_btn {
  margin-top: 0.4rem;
  display: flex;
  justify-content: space-between;
  height: 0.8rem;
  line-height: 0.8rem;
  p {
    width: 2rem;
    border-radius: 0.4rem;
    color: #fff;
  }
  p:nth-child(1) {
    background-color: #ccc;
  }
  p:nth-child(2) {
    background-color: #017ec2;
  }
}
</style>