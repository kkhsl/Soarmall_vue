<template>
  <vantPopup class="tofree_x" v-model="iffree" :close-on-click-overlay="false">
    <p class="tofree" @click="$router.push({path: link});iffree = false;">
      <img :src="img" />
    </p>
    <p class="x" @click="iffree = false">×</p>
  </vantPopup>
</template>

<script>
import { Popup } from "vant";
export default {
  components: {
    vantPopup: Popup,
  },
  data() {
    return {
      iffree: false,
      img: "",
      link: "",
    };
  },
  created() {
    this.$PHP.app_start1().then((res) => {
      if (res.code === 0) {
        const language_s =
          this.$route.query.lang || localStorage.getItem("lang") || "en";
        if (res.data[0]) {
          if (language_s == "en") {
            this.img = res.data[0].image;
            this.link = res.data[0].link;
          } else {
            this.img = res.data[0].arabic_image || res.data[0].image;
            this.link = res.data[0].arabic_link || res.data[0].link;
          }
          this.iffree = true;
        }
      }
    });
  },
};
</script>

<style lang='scss' scoped>
.tofree_x {
  width: 5rem;
  background: none;
}
.x {
  width: 100%;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.6rem;
  color: #fff;
  text-align: center;
  line-height: 1rem;
}
.tofree {
  img {
    width: 100%;
    display: block;
  }
}
</style>