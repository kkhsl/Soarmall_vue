<template>
  <div class="specialBox">
    <div class="specialHead">
      <div class="specialHeadL">
        <div class="specHeadImg">
          <imgCache src="https://photo.soarmall.com/banner/image/5ea4eb2a78051zosuC1A1Zq1bDCDXwuxl.png"></imgCache>
        </div>
        <div class="specHeadTitle">
          <h6>{{speialTitle.title}}</h6>
          <div class="specHeadLine"></div>
          <div class="homeGayText">{{speialTitle.des}}</div>
        </div>
      </div>
      <!-- <div class="specialHeadC">
        <van-count-down time="10000000" class="timeWrap">
          <template v-slot="timeData">
            <span class="countTimeBlock">{{ 10 > timeData.hours ?'0'+timeData.hours:timeData.hours }}</span>
            <span class="countTimeColon">:</span>
            <span class="countTimeBlock">{{ timeData.minutes }}</span>
            <span class="countTimeColon">:</span>
            <span class="countTimeBlock">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>-->
      <div class="specialHeadR">
        <div class="specialMoreWrap" @click="toSecondNav(speialTitle.link,speialTitle.id)">
          <span>{{$t("common.more")}}</span>
        </div>
      </div>
    </div>
    <div class="specialWrap">
      <div class="swiper_di"></div>
      <homeSwipe :swipeItems="productInfo">
        <template #swipeItem="slotData">
          <div
            class="specialSwipeItem"
            @click="$router.push({ path: '/home/details', query: { id: slotData.swipeItem.goods_id } })"
          >
            <div class="imgWrap">
              <imgCache :src="slotData.swipeItem.goodsimaPath"></imgCache>
            </div>
            <div class="itemsMsg">
              <h6 class="itemsMsgName">{{slotData.swipeItem.goods_name}}</h6>
              <!-- <p class="homeGayText">没有商品描叙</p> -->
              <div class="giftStats">
                <div
                  class="statsLine ltr"
                  :class="{'red':slotData.swipeItem.goods_inventory/slotData.swipeItem.store_deals_inventory<0.5}"
                >
                  <div
                    class="activeLine"
                    :style="{'width':((slotData.swipeItem.goods_inventory/slotData.swipeItem.store_deals_inventory>1?1:slotData.swipeItem.goods_inventory/slotData.swipeItem.store_deals_inventory) * 100)+'%'}"
                  >
                    <div
                      class="point_num"
                    >{{slotData.swipeItem.goods_inventory}}/{{slotData.swipeItem.store_deals_inventory}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </homeSwipe>
    </div>
  </div>
</template>

<script>
// import vanCountDown from "vant/lib/count-down";
// import "vant/lib/count-down/style";
import imgCache from '@/whole/components/imgCache'
import homeSwipe from "./homeSwipe";
export default {
  props:['speialTitle'],
  components: {
    // vanCountDown,
    homeSwipe,
    imgCache
  },
  data() {
    return {
      productInfo: []
    };
  },
  mounted() {
    this.getProduct();
  },
  methods: {
    async getProduct() {
      try {
        let historySeckill = JSON.parse(localStorage.getItem('seckilllist') || '[]')
        this.productInfo = historySeckill
      } catch (error) {}
        
      let postData = {
        type: "store_deals",
        currentPage: 2,
        language: (this.$route.query.lang || localStorage.getItem("language_s")) == "sa" ? 1 : 0
      };
      let res = await this.$HTTP.index_discount(postData,{showLoading:false});
      if(res.code == 0 && res.data.goods_info){
        let arr = [];
        res.data.goods_info.forEach((productItem, i) => {
          if (i < 10) {
            arr.push(productItem);
          } else {
            return false;
          }
        });
        this.productInfo = arr;
        try {
          localStorage.setItem('seckilllist', JSON.stringify(arr))
        } catch (error) {}
      }
    },
    toSecondNav(link, id){
      this.$router.push({
        path: "/secondPage",
        query: {
          ...this.$route.query,
          type: link.type,
          value: link.value,
          navId: id
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.timeWrap {
  line-height: 0.5rem;
}
.countTimeBlock {
  display: inline-block;
  width: 0.5rem;
  color: #fff;
  font-size: 0.2rem;
  text-align: center;
  background-color: #000;
}
.countTimeColon {
  display: inline-block;
  margin: 0 0.06rem;
  color: #000;
}
.specialWrap {
  position: relative;
  padding: 0.3rem 0;
  .swiper_di {
    position: absolute;
    bottom: 0;
    left: 0.3rem;
    right: 0.3rem;
    height: 100%;
    box-shadow: inset 0px 15px 15px -15px #eee, inset 0px -15px 15px -15px #eee;
    z-index: 0;
  }
}
.specialSwipeItem {
  padding-bottom: 0.2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 16px 8px -12px #eaeaea;
  .imgWrap {
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
}
.itemsMsgName {
  font-family: "Calibri-Bold";
  font-weight: bold;
  font-size: 0.26rem;
  line-height: 0.5rem;
  color: #333;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 1.6rem;
}

.giftStats {
  padding: 0.5rem 0.16rem 0;
}
.statsLine {
  background-color: #dedede;
  height: 0.06rem;
  border-radius: 0.1rem;
  width: 100%;
}
.red .activeLine,
.red .point_num {
  background: #ff4c40;
}
.red .activeLine ::before {
  border-top: 0.1rem solid #ff4c40;
}
.activeLine {
  background: #017ec2;
  height: 0.06rem;
  width: 0%;
  position: relative;
  ::before {
    content: "";
    border-top: 0.1rem solid #017ec2;
    position: absolute;
    bottom: -0.08rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-right: 0.08rem solid transparent;
    border-left: 0.08rem solid transparent;
  }
}
.point_num {
  right: 0;
  transform: translateX(50%);
  position: absolute;
  bottom: 0.16rem;
  background-color: #017ec2;
  height: 0.3rem;
  color: #fff;
  line-height: 0.3rem;
  border-radius: 0.15rem;
  padding: 0 0.06rem;
  font-size: 0.18rem;
}
</style>