<template>
  <div class="specialBox">
    <homeSwipe :swipeItems="secondNavList">
      <template #swipeItem="slotData">
        <div class="navList" @click="toSecondNav(slotData.swipeItem.link,slotData.swipeItem.id)">
          <!-- <div class="num">2</div> -->
          <div class="navImg">
            <imgCache :src="slotData.swipeItem.img"></imgCache>
          </div>
          <p class="navName">{{slotData.swipeItem.title}}</p>
        </div>
      </template>
    </homeSwipe>
  </div>
</template>

<script>
import homeSwipe from "./homeSwipe";
import imgCache from '@/whole/components/imgCache'
export default {
  components: { homeSwipe ,imgCache},
  data() {
    return {
      secondNavList: []
    };
  },
  mounted() {
    this.secondNavInit();
  },
  methods: {
    async secondNavInit() {
      try {
        let historyNav = JSON.parse(
          localStorage.getItem("secondnavlist") || "[]"
        );
        this.secondNavList = historyNav;
      } catch (error) {}
      let lang = this.$route.query.lang;
      let res = await this.$PHP.banner2();
      if (res.code == 0) {
        let arr = [];
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          if (i < 10) {
            let data_n = {};
            if (lang === "en") {
              data_n = {
                img: data[i].img,
                title: data[i].title,
                link: data[i].link,
                id: data[i].id
              };
            }
            if (lang === "sa") {
              data_n = {
                img: data[i].arabic_img || data[i].img,
                title: data[i].arabic_title || data[i].title,
                link: data[i].arabic_link || data[i].link,
                id: data[i].id
              };
            }
            arr.push(data_n);
          }
        }
        this.secondNavList = arr;
        try {
          localStorage.setItem("secondnavlist", JSON.stringify(arr));
        } catch (error) {}
      }
    },
    toSecondNav(link, id) {
      if (link.value == "Luck draw") {
        this.$router.push({
          path: "/luck_draw/roundTurntable"
        });
        return false;
      }
      this.$router.push({
        path: "/secondPage",
        query: {
          ...this.$route.query,
          type: link.type,
          value: link.value,
          navId: id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.specialBox {
  background-color: #fff;
}
.navList {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 0.1rem 0;
  .num {
    position: absolute;
    top: 0rem;
    right: 0.1rem;
    background-color: #ee0a24;
    color: #fff;
    font-size: 0.2rem;
    width: 0.3rem;
    line-height: 0.3rem;
    text-align: center;
    display: block;
    height: 0.3rem;
    border-radius: 50%;
  }
  .navImg {
    width: 1rem;
    height: 1rem;
    overflow: hidden;
    img {
      max-width: 100%;
    }
  }
  .navName {
    font-family: "Calibri-Bold";
    font-weight: bold;
    font-size: 0.22rem;
    line-height: 0.4rem;
    padding-top: 0.1rem;
    width: 1.4rem;
    white-space: nowrap;
    color: #333;
  }
}
</style>