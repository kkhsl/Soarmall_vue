<template>
  <!-- 选择地区 -->
  <div class="mask">
    <div class="xz_head" @click="xz_close()"></div>
    <div class="xz_conter">
      <div class="xz_title">
        <p v-if="ym==1">
          <img src="@/assets/img/uae.gif" alt />
        </p>
        <p v-if="ym==2">
          <img src="@/assets/img/sandi.jpg" alt />
        </p>
        <p>{{area_info.area_name}}</p>
        <p @click="xz_close()">
          <img src="@/assets/img/other/closeBtn.png" alt />
        </p>
      </div>
      <div class="xz_piece">
        <ul>
          <li
            v-for="(city,index) in area_info.citys"
            :key="index"
            @click="city_qd(city)"
          >{{city.areaName}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["area_info"],
  data() {
    return {
      ym: this.$store.state.country_i
    };
  },

  methods: {
    xz_close() {
      this.$emit("xz_close");
    },
    city_qd(city) {
      this.$emit("city_qd", city);
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
  z-index: 2222;
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
    padding: 0 0.3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p:nth-child(1) {
      width: 0.7rem;
      height: 0.52rem;
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
      width: 0.53rem;
      height: 0.53rem;
      position: relative;
      img {
        position: absolute;
        width: 0.53rem;
        height: 0.53rem;
      }
    }
  }

  .xz_piece {
    width: 100%;
    height: calc(100vh - 5.5rem);
    padding: 0 0.3rem 0 1.3rem;
    box-sizing: border-box;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: scroll;

    ul {
      width: 100%;

      li {
        width: 100%;
        font-size: 0.36rem;
        font-family: "Calibri";
        font-weight: 400;
        color: #333;
        height: 1rem;
        border: 1px solid #ccc;
        line-height: 1rem;
        border: none;
        border-bottom: 1px solid #ebebeb;
      }
    }
  }
}
</style>