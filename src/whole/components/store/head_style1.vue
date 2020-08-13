<template>
  <div class="store_h">
    <div>
      <ul class="store_image">
        <li class="store_log">
          <img v-lazy="store.store_logo" alt />
        </li>
        <li class="name_in">
          <p class="name">{{store.store_name}}</p>
          <p class="introduction"></p>
        </li>
        <li class="collect" @click="$emit('collect_btn')">
          <div>
            <p class="img">
              <img v-if="conll==1" src="@/assets/img/store/xing1.png" />
              <img v-else src="@/assets/img/store/xing.png" />
            </p>
            <p v-if="conll==1">Collected</p>
            <p v-else>Collect</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="float"></div>
  </div>
</template>

<script>
export default {
  props: ["store", "conll"],
  data() {
    return {};
  },

  created() {},

  methods: {}
};
</script>
<style lang='scss' scoped>
.store_h {
  margin-top: 0.2rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.store_image {
  display: flex;
  justify-content: space-between;
  .store_log {
    width: 1.2rem;
    height: 1.2rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name_in {
    width: 3.6rem;
    .name {
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size: 0.3rem;
      color: #333;
      line-height: 0.5rem;
    }
    .introduction {
      font-family: "Calibri";
      font-weight: 200;
      font-size: 0.2rem;
      color: #333;
      line-height: 0.26rem;
    }
  }

  .collect {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.22rem;
    color: #fff;
    background: linear-gradient(to right, #33b6ff, #008edd);
    height: 0.7rem;
    width: 1.8rem;
    border-radius: 0.35rem;
    line-height: 0.7rem;
    display: flex;
    div{
      margin:auto;
      display: flex;
      justify-content: flex-start
    }
    .img {
      width: 0.22rem;
      margin-right: 0.1rem;
      img {
        width: 100%;
      }
    }
  }
}
.float {
  margin-top: 0.3rem;
  width: 100%;
  background-color: #f00;
  max-height: 3rem;
}
</style>