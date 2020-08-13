<template>
  <div class="x_inputBox" :class="{'reversal': GLOBA.isRotate}">
    <!-- v-model="data" -->
    <input
      class="input"
      :type="type_va"
      :value="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
      @keydown="keydown($event)"
      @input="input($event.target.value)"
      @focus="focus"
      @blur="blur"
    />
    <p class="hideRightIcon x" v-if="if_delet" v-show="is_delet" @touchstart.prevent="delet"></p>
    <p class="hideRightIcon eye" v-if="if_eye" v-show="is_eye" @touchstart.prevent="eye"></p>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "input"
  },
  props: ["value", "if_delet", "if_eye", "type", "placeholder", "maxlength"],
  data() {
    return {
      is_delet: false,
      type_va: this.type ? this.type : "text",
      is_eye: false
    };
  },

  methods: {
    input(value) {
      this.$emit("input", value);
      if (this.value.length < 1) {
        this.is_delet = false;
        this.is_eye = false;
      } else {
        this.is_eye = true;
        this.is_delet = true;
      }
    },
    focus() {
      if (this.value.length > 0) {
        this.is_delet = true;
      }
      this.$emit("focus");
    },
    blur() {
      setTimeout(() => {
        this.is_delet = false;
      }, 20);
      this.$emit("blur");
    },
    delet() {
      this.$emit("input", "");
      setTimeout(() => {
        this.is_delet = false;
      }, 10);
    },
    eye() {
      if (this.type_va === "text") {
        this.type_va = "password";
      } else {
        this.type_va = "text";
      }
    },
    keydown(ev) {
      this.$emit("keydown", ev);
    }
  }
};
</script>
<style lang='scss' scoped>
.reversal.x_inputBox .hideRightIcon{
  left: 0.1rem;
  right: auto;
}
.x_inputBox {
  position: relative;
  height: 0.6rem;
  font-size: 0.3rem;
  .input {
    width: 100%;
    color: #333;
    padding: 0.15rem 0.1rem;
    height: 0.3rem;
    line-height: 0.3rem;
  }
  .hideRightIcon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    z-index: 10;
  }
  .x {
    width: 0.32rem;
    height: 0.32rem;
    font-size: 0.3rem;
    background: url(~@/assets/image/icon/inputDeleteIcon.png) no-repeat;
    background-size: 100%;
  }
  .eye {
    width: 0.32rem;
    height: 0.32rem;
    font-size: 0.3rem;
    top: 60%;
    background: url(~@/assets/image/icon/lookPassWorld.png) no-repeat;
    background-size: 100%;
  }
}
</style>