<template>
  <div class="delivers_box flexBox">
    <div class="log_">
      <img :class="{'isRotate':GLOBA.isRotate}" src="@/assets/img/other/shipto.png" alt />
    </div>
    <div class="postage_box">
      <div class="ship_box flexBox">
        <div class="ship_">{{$t("common.Ship to")}}</div>
        <div class="xuanz_" @click="showCitySelectTankFn">
          <p>{{currentCity}}</p>
          <img
            class="rightIconRow"
            :class="{'isRotate':GLOBA.isRotate}"
            src="@/assets/img/other/xiangyou3.png"
          />
        </div>
      </div>
      <div class="jia_rq">
        <div
          class="shipRow"
          v-if="transPrice!==0"
        >{{$t("common.Freight")}}:<span style="padding:0 0.1rem;color:#c24343;">{{GLOBA.money_tag}} {{transPrice | keeptwoNum}}</span></div>
        <div class="shipRow" v-else>
          <span>Free shipping</span>
          <img src="@/assets/img/biaoshi.png" />
        </div>
        <div class="shipRow">Return within 14 days of receipt</div>
        <div class="shipRow">
          <span>Cash on delivery</span>
          <img src="@/assets/img/biaoshi.png" />
        </div>
        <div class="shipRow">E.T.A:8-15 days</div>
      </div>
    </div>
    <vantPopup
      v-model="showCitySelectTank"
      position="bottom"
      :safe-area-inset-bottom="true"
      get-container="#app"
      :close-on-click-overlay="false"
      @click-overlay ="closeCitySelectTankFn"
    >
      <div class="xz_conter">
        <div class="xz_title">
          <div class="countryImg" v-if="$store.state.country_i==1">
            <img src="@/assets/img/uae.gif" alt />
          </div>
          <div class="countryImg" v-if="$store.state.country_i==2">
            <img src="@/assets/img/sandi.jpg" alt />
          </div>
          <h6>{{goodsInfo.area_info[0].areaname}}</h6>
          <div class="closeCitySelect" @click="closeCitySelectTankFn">
            <img src="@/assets/img/other/closeBtn.png" alt />
          </div>
        </div>
        <div class="xz_piece">
          <div class="cityItem" v-for="(city,index) in cityList" :key="index" @click="changeCity(city.areaName)">{{city.areaName}}</div>
        </div>
      </div>
    </vantPopup>
  </div>
</template>

<script>
import { Popup } from "vant";
export default {
  props: ["goodsInfo",'selectSpec'],
  components: { vantPopup: Popup },
  data() {
    return {
      cityList: [],
      currentCity: "",
      freightPostData:{
        goods_id: this.goodsInfo.goods.goodsid,
        type: "express",
        volume: "",
        city_name: '',
        number: 1,
        gsp: "", // 规格
        color: "",
      },
      transPrice: 0,
      showCitySelectTank: false,
    };
  },
  activated(){
    this.loadArea();
  },
  mounted() {
    this.loadArea();
    window.addEventListener(
      "popstate",
      e => {
        if (this.showCitySelectTank) {
          this.showCitySelectTank = false;
        }
      },
      false
    );
  },
  methods: {
    async loadArea() {
      let res = await this.$HTTP.load_area(
        { pid: this.goodsInfo.area_info[0].areaid },
        { showLoading: false }
      );
      if (res.code == 0) {
        this.currentCity = this.freightPostData.city_name = res.data[0].areaName;
        this.cityList = res.data;
        this.countTrans();// 获取运费
      }
    },
    async countTrans() { // 获取运费
      if(this.selectSpec.color && this.selectSpec.color.value){
        this.freightPostData.color = this.selectSpec.color.value;
      }
      if(this.selectSpec.otherSpec.length){
        let gspArr = [];
        this.selectSpec.otherSpec.forEach(otherSpec=>{
          gspArr.push(otherSpec.gsp_id)
        })
        this.freightPostData.gsp = gspArr.join(',');
      }
      this.freightPostData.number = this.selectSpec.count;
      let res = await this.$HTTP.fee_info(this.freightPostData);
      if (res.code == 4200) this.transPrice = res.data;
    },
    changeCity(city){
      if(city != this.currentCity){
        this.currentCity = this.freightPostData.city_name = city
        this.countTrans();// 获取运费
      }
      this.closeCitySelectTankFn()
    },
    showCitySelectTankFn(){
      this.showCitySelectTank = true;
      window.history.pushState(null, null, "#");
    },
    closeCitySelectTankFn(){
      if(window.location.hash.length == 0 || !window.location.hash){
        this.$router.go(-1);
      }
      this.showCitySelectTank = false;
    }
  },
  watch:{
    selectSpec: { // 监听规格选择 重新请求运费
      handler: function () {
        this.countTrans();
      },
      deep: true,
    }
  },
  beforeDestroy(){
    window.removeEventListener(
      "popstate",
      e => {
        if (this.showCitySelectTank) {
          this.showCitySelectTank = false;
        }
      },
      false
    );
  }
};
</script>
<style lang='scss' scoped>
//运费
.delivers_box {
  margin-top: 0.2rem;
  padding: 0 0.1rem;
  background-color: #fff;
  box-shadow: 0 0.3rem 0.8rem 0 rgba(51, 51, 51, 0.15);
  .log_ {
    width: 0.36rem;
    height: 0.36rem;
    padding: 0 0.1rem;
    position: relative;
    img {
      max-width: 100%;
    }
  }
  .xuanz_ {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.28rem;
    color: #333;
  }
  .ship_box {
    border-bottom: 1px solid #ebebeb;
    font-weight: Bold;
    font-size: 0.28rem;
    color: #333;
    padding: 0.2rem 0;
  }

  .jia_rq {
    padding: 0.12rem 0;
    font-size: 0.25rem;
    color: #999;
    display: flex;
    position: relative;
    flex-wrap: wrap;
  }
}
.shipRow {
  display: flex;
  align-items: center;
  width: 42%;
  span {
    width: 75%;
  }
  img {
    width: 0.18rem;
    height: 0.18rem;
  }
}
.jia_rq>div:nth-child(2n) {
  width: 58%;
}

.xz_conter {
  background: #fff;
}
.xz_title {
  height: 1.36rem;
  padding: 0 0.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .countryImg {
    width: 0.7rem;
    height: 0.52rem;
    img {
      height: 100%;
      width: 100%;
    }
  }

  h6 {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.36rem;
    color: #333;
    height: 100%;
    width: 5.36rem;
    line-height: 1.36rem;
  }

  .closeCitySelect {
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
  height: 7rem;
  padding: 0 0.3rem 0 1rem;
  box-sizing: border-box;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  .cityItem {
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
</style>