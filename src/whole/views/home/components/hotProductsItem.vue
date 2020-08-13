<template>
  <div class="specialBox">
    <div class="hot" v-for="(hotc,index) in hotcs" :key="index">
      <div class="specialHead">
        <div class="specialHeadL">
          <div class="specHeadImg">
            <imgCache :src="hotc.img"></imgCache>
          </div>
          <div class="specHeadTitle">
            <h6>{{hotc.title}}</h6>
            <div class="specHeadLine"></div>
            <div class="homeGayText">{{hotc.des}}</div>
          </div>
        </div>
        <!-- <div class="specialHeadR">
          <div class="specialMoreWrap">
            <span>{{$t("common.more")}}</span>
          </div>
        </div>-->
      </div>
      <div class="swipeBox">
        <div class="swiper_di"></div>
        <homeSwipe :swipeItems="hotc.child">
          <template #swipeItem="slotData">
            <div class="swipeItemWrap">
              <div class="swiper_con_h"></div>
              <div class="swiper_con" @click="more_all(slotData.swipeItem.link)">
                <div class="img_">
                  <imgCache :src="slotData.swipeItem.img"></imgCache>
                </div>
                <div class="title_">
                  <span class="title_name line-clamp">{{slotData.swipeItem.title}}</span>
                </div>
              </div>
            </div>
          </template>
        </homeSwipe>
      </div>
    </div>
  </div>
</template>

<script>
import homeSwipe from "./homeSwipe";
import imgCache from "@/whole/components/imgCache";
export default {
  components: { homeSwipe, imgCache },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
      },
      hotcs: [], // this.$store.state.hotcs,
    };
  },
  mounted() {
    this.hotcs_home();
  },
  methods: {
    async hotcs_home() {
      try {
        let historyHotList = JSON.parse(
          localStorage.getItem("hotcslist") || "[]"
        );
        this.hotcs = historyHotList;
      } catch (error) {}

      let res = await this.$PHP.banner3();
      if (res.code == 0) {
        let resArr = [];
        let lang = this.$route.query.lang;
        res.data.forEach((item) => {
          if (lang == "sa") {
            let links = item.arabic_link || item.link;
            let tran = {
              des: item.arabic_des || item.des,
              id: item.id,
              img: item.arabic_img || item.img,
              title: item.arabic_title || item.title,
              link: item.arabic_link,
              child: [],
            };
            item.child.forEach((child) => {
              let tran_child = {
                des: child.arabic_des || child.des,
                id: child.id,
                img: child.arabic_img || child.img,
                title: child.arabic_title || child.title,
                link: child.arabic_link,
                child: child.child,
              };
              tran.child.push(tran_child);
            });
            resArr.push(tran);
          } else {
            let tran = {
              des: item.des,
              id: item.id,
              img: item.img,
              title: item.title,
              link: item.link,
              child: [],
            };
            item.child.forEach((child) => {
              let tran_child = {
                des: child.des,
                id: child.id,
                img: child.img,
                title: child.title,
                link: child.link,
                child: child.child,
              };
              tran.child.push(tran_child);
            });
            resArr.push(tran);
          }
        });
        this.hotcs = resArr;
        try {
          localStorage.setItem("hotcslist", JSON.stringify(resArr));
        } catch (error) {}
      }
    },

    more_all(link) {
      let i = Number(link.type);
      let id = link.value;
      //0：搜索关键字，1：品类id，2：店铺id，3：商品id
      switch (i) {
        case 0:
          this.$router.push({
            path: "/subpages/search/search_result",
            query: { keyword: id },
          });
          break;
        case 1:
          this.$router.push({
            path: "/subpages/cate_goods",
            query: { id: id },
          });
          break;
        case 2:
          let dianpu = {};
          dianpu.store_id = id;
          dianpu.store_name = "";
          let to_data = {
            dianpu: dianpu,
            id: 1,
          };
          this.$router.push({
            path: "/subpages/cate_goods02",
            query: { to_data: to_data },
          });
          break;
        case 3:
          this.$router.push({ path: "/home/details", query: { id: id } });
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.hot {
  width: 100%;
  height: 4rem;
  background-color: #f7f7f7;
}
.swipeBox {
  position: relative;
  padding-top: 0.48rem;
  .swiper_di {
    position: absolute;
    width: 100%;
    top: 0.7rem;
    height: 1.2rem;
    background-color: #e3eff7;
    z-index: 0;
  }
}
.swiper-slide:nth-child(even) {
  .swiper_con_h {
    background-color: #f9e1e4;
  }
}
.swiper-slide:nth-child(odd) {
  .swiper_con_h {
    background-color: #ebeaea;
  }
}
.swipeItemWrap {
  width: 2rem;
  height: 1.6rem;
  background-color: #fff;
  box-shadow: 0.04rem 0.04rem 0.2rem #e2e2e2;
  position: relative;
}
.swiper_con_h {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 0.5rem;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
  z-index: 0;
}
.swiper_con {
  text-align: center;
  position: relative;
  z-index: 1;
}
.img_ {
  max-height: 1.3rem;
  text-align: center;
  img {
    height: 1rem;
    width: auto;
    margin-top: -0.2rem;
  }
}
.title_ {
  height: 0.6rem;
  padding: 0 0.1rem;
  box-sizing: border-box;
  .title_name {
    font-size: 0.26rem;
    line-height: 0.6rem;
    color: #333;
    font-weight: Bold;
    font-family: "Calibri-Bold";
  }
}
.price_ {
  font-size: 0.2rem;
  color: #999;
  font-family: "Calibri";
}
</style>
