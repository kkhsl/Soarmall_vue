<template>
  <div class="specialBox">
    <div v-for="(recommendList,index) of recommendInfo" :key="index">
      <div class="specialHead">
        <div class="specialHeadL">
          <div class="specHeadImg">
            <imgCache :src="recommendList.img"></imgCache>
          </div>
          <div class="specHeadTitle">
            <h6>{{recommendList.title}}</h6>
            <div class="specHeadLine"></div>
            <div class="homeGayText">{{recommendList.des}}</div>
          </div>
        </div>
        <!-- <div class="specialHeadR">
          <div class="specialMoreWrap">
            <span>{{$t("common.more")}}</span>
          </div>
        </div> -->
      </div>
      <div class="head_img">
        <div class="bigStyle" @click="moreDetail(recommendList.head_img[0])">
          <p class="title_ line-blok-clamp">{{recommendList.head_img[0].title}}</p>
          <!-- <p class="des line-clamp">{{recommendList.head_img[0].des}}</p> -->
          <div class="flex-end">
            <imgCache :src="recommendList.head_img[0].img"></imgCache>
          </div>
        </div>
        <div class="middleStyle">
          <div class="title_des" @click="moreDetail(recommendList.head_img[1])" v-if="recommendList.head_img[1]">
            <div>
              <p class="title_ line-blok-clamp">{{recommendList.head_img[1].title}}</p>
              <!-- <p class="des line-clamp">{{recommendList.head_img[1].des}}</p> -->
            </div>
            <imgCache :src="recommendList.head_img[1].img"></imgCache>
          </div>
          <div class="title_des" @click="moreDetail(recommendList.head_img[2])" v-if="recommendList.head_img[2]">
            <div>
              <p class="title_ line-blok-clamp">{{recommendList.head_img[2].title}}</p>
              <!-- <p class="des line-clamp">{{recommendList.head_img[2].des}}</p> -->
            </div>
            <imgCache :src="recommendList.head_img[2].img" ></imgCache>
          </div>
        </div>
      </div>
      <div class="swiper_img">
        <swiper class="swiper-wrapper swiper_box" :options="swiperOption">
          <swiperSlide
            class="swiper-slide swiper_con_box"
            v-for="(child,index) in recommendList.child_img"
            :key="index"
          >
            <div class="swiper_con" @click="moreDetail(child)">
              <p class="img_">
                <imgCache :src="child.img"></imgCache>
              </p>
              <p class="title_ line-blok-clamp">{{child.title}}</p>
              <!-- <p class="des line-blok-clamp">{{child.des}}</p> -->
            </div>
          </swiperSlide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import imgCache from '@/whole/components/imgCache'
export default {
  components: { swiper, swiperSlide, imgCache},
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true //修改swiper的父元素时，自动初始化swiper
      },
      recommendInfo: []
    };
  },
  mounted() {
    this.recom();
  },
  methods: {
    async recom() {
      try {
        let historyRecommend = JSON.parse(localStorage.getItem('recommendlist') || '[]')
        this.recommendInfo = historyRecommend
      } catch (error) {}

      let res = await this.$PHP.recommend();
      if (res.code == 0) {
        let lang = this.$route.query.lang;
        let resArr = [];
        res.data.forEach(item => {
          if (lang === "sa") {
            let tran = {
              des: item.arabic_des || item.des,
              id: item.id,
              img: item.arabic_img || item.img,
              title: item.arabic_title || item.title,
              link:item.arabic_link,
              head_img: [],
              child_img: []
            };
            item.child.forEach(child => {
              let tran_child = {
                des: child.arabic_des || child.des,
                id: child.id,
                img: child.arabic_img || child.img,
                title: child.arabic_title || child.title,
                link:child.arabic_link,
                child: child.child
              };
              if (tran.head_img.length < 3) {
                tran.head_img.push(tran_child);
              } else {
                tran.child_img.push(tran_child);
              }
            });
            resArr.push(tran);
          } else {
            let tran = {
              des: item.des,
              id: item.id,
              img: item.img,
              link:item.link,
              title: item.title,
              head_img: [],
              child_img: []
            };
            item.child.forEach(child => {
              let tran_child = {
                des: child.des,
                id: child.id,
                img: child.img,
                title: child.title,
                link:child.link,
                child: child.child
              };
              if (tran.head_img.length < 3) {
                tran.head_img.push(tran_child);
              } else {
                tran.child_img.push(tran_child);
              }
            });
            resArr.push(tran);
          }
        });
        this.recommendInfo = resArr;
        console.log(resArr)
        try {
          localStorage.setItem("recommendlist", JSON.stringify(resArr));
        } catch (error) {}
      }
    },
    moreDetail(clickItem) {
      const type = Number(clickItem.link.type)
      const value = clickItem.link.value
      //0：搜索关键字，1：品类id，2：店铺id，3：商品id
      switch (Number(type)) {
        case 0:
          this.$router.push({
            path: "/subpages/search/search_result",
            query: { keyword: value }
          });
          break;
        case 1:
          this.$router.push({
            path: "/subpages/cate_goods",
            query: { id: value }
          });
          break;
        case 2:
          this.$router.push({
            path: "/subpages/cate_goods02",
            query: {
              to_data:{
                dianpu: {
                  store_id:value,
                  store_name:''
                },
                id: 1
              }
            }
          });
          break;
        case 3:
          if(value.length == 1){
            this.$router.push({ path: "/home/details", query: { id: value[0] } });
          }
          if(value.length >1 ){
            this.$router.push({ path: "/columnList", query: { id: clickItem.id }});
          }
          break;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.head_img {
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  box-sizing: border-box;
  .bigStyle {
    width: 3.3rem;
    height: 3.3rem;
    padding: 0.2rem;
    box-sizing: border-box;
    background-color: rgba(51, 51, 51, 0.15);
    p {
      width: 100%;
    }
    img {
      margin-top: 0.1rem;
      max-width: 2.4rem;
      min-width: 2rem;
      max-height: 2.2rem;
      min-height: 2rem;
    }
  }
  .middleStyle {
    width: 3.3rem;
    .title_des {
      padding: 0.2rem;
      box-sizing: border-box;
      height: 1.5rem;
      background-color: rgba(51, 51, 51, 0.15);
      display: flex;
      justify-content: space-between;
      div {
        margin-top: 0.3rem;
        width: 1.5rem;
      }
      img {
        max-width: 1.3rem;
        max-height: 1.1rem;
      }
    }
    div:nth-child(1) {
      margin-bottom: 0.3rem;
    }
  }
}
.swiper_box {
  padding: 0 0.3rem;
  width: auto;
}
.swiper_con_box {
  margin: 0.3rem 0 0 0.3rem;
  width: 2rem;
  background-color: rgba(51, 51, 51, 0.15);
  box-shadow: 0.04rem 0.04rem 0.2rem rgb(226, 226, 226);
  .swiper_con {
    text-align: center;
    width: 100%;
    padding-bottom: 0.1rem;
    .img_ {
      padding: 0.2rem;
      height: 1.6rem;
      overflow: hidden;
      padding-bottom: 0;
      img {
        width: 100%;
      }
    }
  }
}
.swiper_con_box:first-child {
  margin-left: 0;
}
.title_ {
  height: 0.3rem;
  padding: 0 0.1rem;
  box-sizing: border-box;
  font-size: 0.26rem;
  line-height: 0.3rem;
  color: #333;
  font-weight: Bold;
  font-family: "Calibri-Bold";
}
.des {
  height: 0.3rem;
  line-height: 0.3rem;
  padding: 0 0.1rem;
  box-sizing: border-box;
  font-family: "Calibri";
  color: #999;
  font-size: 0.2rem;
}
</style>