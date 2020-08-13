<template>
  <div>
    <div class="gg_img_box" v-for="(gg,index) in groupList" :key="index">
      <div class="advertising" @click="to_page(gg.linkType,gg.linkValue)">
        <img v-lazy="gg.img" />
      </div>
      <swiper class="barnd_box swiper-wrapper" :options="swiperOption">
        <swiperSlide class="imga_box swiper-slide" v-for="(child,index) in gg.child" :key="index">
          <div class="img_box1">
            <img v-lazy="child[0].img" alt @click="to_page(child[0].linkType,child[0].linkValue)" />
          </div>
          <div class="img_box2">
            <p>
              <img v-lazy="child[1].img" alt @click="to_page(child[1].linkType,child[1].linkValue)" />
            </p>
            <p>
              <img v-lazy="child[2].img" alt @click="to_page(child[2].linkType,child[2].linkValue)" />
            </p>
          </div>
        </swiperSlide>

        <div class="imga_box1">
          <p>That’s the end</p>
        </div>
      </swiper>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      groupList: [],
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 0,
        centeredSlides: true,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      }
    };
  },
  mounted(){
    this.getGroupList()
  },
  methods: {
    async getGroupList() {
      let res = await this.$PHP.banner4();
      if (res.code == 0) {
        let lang = this.$route.query.lang;
        let arr = [];
        if (lang === "en") {
          res.data.forEach(item => {
            let data_list = {
              child: item.child,
              id: item.id,
              height: item.height,
              img: item.img,
              linkType: item.link.type,
              linkValue: item.link.value,
              width: item.width,
              child: []
            };
            item.child.forEach(child => {
              let child_ = [];
              child.forEach(e => {
                let tran_child = {
                  child: e.child,
                  id: e.id,
                  img: e.img,
                  linkType: e.link.type,
                  linkValue: e.link.value,
                };
                child_.push(tran_child);
              });
              data_list.child.push(child_);
            });
            arr.push(data_list);
          });
        } else if (lang === "sa") {
          res.data.forEach(item => {
            let data_list = {
              child: item.child,
              height: item.height,
              img: item.arabic_img ? item.arabic_img : item.img,
              linkType: item.link.type,
              linkValue: item.link.value,
              width: item.width,
              child: []
            };
            item.child.forEach(child => {
              let child_ = [];
              child.forEach(e => {
                let link_ch = e.img ? e.img.split("=") : "";
                let tran_child = {
                  child: e.child,
                  id: e.id,
                  img: e.arabic_img ? e.arabic_img : e.img,
                  linkType: e.link.type,
                  linkValue: e.link.value,
                };
                child_.push(tran_child);
              });
              data_list.child.push(child_);
            });
            arr.push(data_list);
          });
        }
        this.groupList = arr;
      }
    },
    to_page(type, value) {
      //0：搜索关键字，1：品类id，2：店铺id，3：商品id,4：价格区间
      switch (Number(type)) {
        case 0:
          this.$router.push({
            path: "/subpages/search/search_result",
            query: {
              keyword: value
            }
          });
          break;
        case 1:
          this.$router.push({
            path: "/subpages/cate_goods",
            query: {
              id: value
            }
          });
          break;
        case 2:
          this.$router.push({
            path: "/subpages/cate_goods02",
            query: {
              to_data: {
                store_id:value,
                store_name: ''
              },
              id: 1
            }
          });
          break;
        case 3:
          this.$router.push({
            path: "/home/details",
            query: {
              id: value
            }
          });
          break;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.advertising {
  width: 100%;
  height: 1.9rem;

  img {
    width: 100%;
    height: 100%;
  }
}
.barnd_box::-webkit-scrollbar {
  display: none;
}
.barnd_box {
  height: 4.8rem;
  padding: 0.3rem 0.3rem 0.4rem 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  .imga_box {
    display: flex;
    justify-content: space-between;
    width: 6.7rem !important;
    height: 4.1rem !important;

    .img_box1 {
      width: 4.2rem;
      height: 4.1rem;
      box-shadow: 2px 2px 10px rgb(226, 226, 226);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .img_box2 {
      width: 2.4rem;
      height: 4.1rem;
      margin: 0 0.1rem;
      p {
        width: 100%;
        height: 2rem;
        box-shadow: 2px 2px 10px rgb(207, 207, 207);

        img {
          width: 100%;
          height: 100%;
        }
      }

      p:nth-child(1) {
        margin-bottom: 0.1rem;
      }
    }
  }

  .imga_box1 {
    margin: 0 0.34rem;
    min-width: 0.6rem;
    max-width: 0.6rem;
    // margin-right: -0.6rem;
    height: 4.2rem;
    // background-color: #E1E1E1;
    // border-radius: 50% 0 0 50%;
    border-top-left-radius: 0.6rem 2.1rem;
    border-bottom-left-radius: 0.6rem 2.1rem;

    p {
      color: #999;
      font-size: 0.22rem;
      font-family: "Calibri-Light";
      margin-top: 2.4rem;
      // margin-right: 0.6rem;
      transform: rotate(-90deg);
    }
  }
}
</style>