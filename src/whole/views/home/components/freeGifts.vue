<template>
  <div class="specialBox">
    <div class="specialHead">
      <div class="specialHeadL">
        <img :src="require('@/assets/img/FreeGit/free_gifts.png')" class="specialHeadLImg"/>
      </div>
      <div class="specialMoreWrap" @click="$router.push({path: '/home/Entry'})">
        <span>{{$t("common.more")}}</span>
      </div>
    </div>
    <homeSwipe :swipeItems="freeGiftsList">
      <template v-slot:swipeItem="slotData">
        <div class="freeGiftsListClass"  @click="toDetail(slotData.swipeItem.goodsid)">
          <div class="giftsImg">
            <imgCache :src="slotData.swipeItem.goodsimg"></imgCache>
          </div>
          <div class="giftsMsgWrap">
            <span class="currentPrice">
              <span>{{GLOBA.money_tag}}{{slotData.swipeItem.goods_current_price | integerNum}}</span>
              <span class="smallPrice">.{{slotData.swipeItem.goods_current_price | decimalNum}}</span>
            </span>
            <div class="giftStats">
              <div
                class="statsLine ltr"
                :class="{'red':slotData.swipeItem.user_pointNum/slotData.swipeItem.goodspointNum>1}"
              >
                <div
                  class="activeLine"
                  :style="{'width':((slotData.swipeItem.user_pointNum/slotData.swipeItem.goodspointNum>=1?1:slotData.swipeItem.user_pointNum/slotData.swipeItem.goodspointNum) * 100)+'%'}"
                >
                  <div
                    class="point_num"
                  >{{slotData.swipeItem.user_pointNum}}/{{slotData.swipeItem.goodspointNum}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </homeSwipe>
  </div>
</template>

<script>
import homeSwipe from "./homeSwipe";
import imgCache from '@/whole/components/imgCache'
export default {
  components: { homeSwipe,imgCache},
  data() {
    return {
      freeGiftsList: []
    };
  },
  mounted() {
    this.getFreeGiftsList();
  },
  methods: {
    async getFreeGiftsList() {
      try {
        let historyFreeGifts = JSON.parse(localStorage.getItem('freegiftslist') || '[]')
        this.freeGiftsList = historyFreeGifts
      } catch (error) {
      }
      let token = this.$store.state.status.token || "";
      let res = await this.$PHP.good_invite({ token: token })
      let list = [];
      if (res.code == 0) {
        if (res.data.goods.length > 0) {
          res.data.goods.forEach(et => {
            if (list.length < 10) {
              list.push(et);
            } else {
              return false;
            }
          });
          this.$store.commit("hover_btn", true);
        } else {
          list = [];
          this.$store.commit("hover_btn", false);
        }
        this.freeGiftsList = list;
        try {
          localStorage.setItem("freegiftslist", JSON.stringify(list));
        } catch (error) {}
      }
    },
    toDetail(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    }
  }
};
</script>

<style lang="scss" scoped>
.freeGiftsListClass {
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  width: 2rem;
  padding-bottom: 0.2rem;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .giftsImg {
    display: flex;
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    align-self: center;
    img {
      width: 100%;
    }
  }
}
.giftsMsgWrap {
  padding: 0.1rem;
}
.specialHead{
  padding-bottom: 0.2rem;
}
.specialHeadLImg{
  margin: 0 0.3rem;
}
.giftStats {
  padding: 0.5rem 0.2rem 0;
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
  padding: 0 0.1rem;
  font-size: 0.18rem;
}

</style>