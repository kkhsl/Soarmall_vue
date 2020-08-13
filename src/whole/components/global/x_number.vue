<template>
  <div class="number">
    <p class="Adjust" :class="{'Adjust1':if_max==1}" @click="subtract">-</p>
    <p class="numb">
      {{num}}
      <!-- <input type="number" :value="numb" @change="$emit('change', $event.target.num)" readonly> -->
    </p>
    <p class="Adjust" :class="{'Adjust1':if_max==2}" @click="add">+</p>
  </div>
</template>

<script>
export default {
  model: {
    prop: "num",
    event: "change"
  },
  props: ["num", "min", "max", "disabled"],
  data() {
    return {
      numb: this.num,
      if_max: 0
    };
  },
  watch: {
    num() {
      this.numb = this.num;
    }
  },
  methods: {
    add() {
      if (this.disabled) {
        return true;
      }
      if (this.max) {
        if (this.numb < this.max) {
          if (this.if_max !== 0) {
            this.if_max = 0;
          }
          this.numb++;
          this.$emit("change", this.numb);
        }
        if (this.numb >= this.max) {
          this.if_max = 2;
        }
      } else {
        this.numb++;
        this.$emit("change", this.numb);
      }
    },
    subtract() {
      if (this.disabled) {
        return true;
      }
      if (this.min) {
        if (this.numb > this.min) {
          if (this.if_max !== 0) {
            this.if_max = 0;
          }
          this.numb--;
          this.$emit("change", this.numb);
        }
        if (this.numb <= this.min) {
          this.if_max = 1;
        }
      } else {
        this.numb--;
        this.$emit("change", this.numb);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.number {
  width: 1.6rem;
  height: 0.5rem;
  padding: 0 0.2rem;
  display: flex;
  justify-content: space-between;
  font-family: "Calibri";
  font-weight: 400;
  line-height: 0.5rem;
  // border: 1px solid #e9e9e9;
  .Adjust {
    border-radius: 0.02rem;
    background-color: #f7f7f7;
    width: 0.5rem;
    height: 100%;
    font-size: 0.5rem;
    font-weight: 100;
    color: #333;
    box-shadow: 1px 1px 4px #e2e2e2;
    text-align: center;
  }
  .Adjust1 {
    color: #ccc !important;
  }
  .numb {
    width: 0.6rem;
    text-align: center;
    color: #333;
    font-size: 0.24rem;
    input {
      width: 0.5rem !important;
      text-align: center;
      color: #333;
    }
  }
}
</style>