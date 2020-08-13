<template>
  <div class="gu_mask">
    <!-- 点击图片放大 -->
    <div class="swiper-container enlargement_box" v-if="isenla_" @click="to_retraction">
      <div class="swiper-pagination pagination"></div>
      <swiper class="swiper-wrapper enlargement_img" :options="swiperOption_">
        <swiperSlide
          class="swiper-slide swiper_box swiper-zoom-container"
          v-for="(photo,index) in goods_photo1"
          :key="index"
        >
          <img v-lazy="photo" />
        </swiperSlide>
        <!-- <swiperSlide class="swiper-slide swiper_box">
        </swiperSlide>-->
      </swiper>
    </div>

    <div class="inventory" v-if="good_pr_co.goods_inventory === 0">{{$t("common.Out of stock")}}</div>
    <div class="gu_piece">
      <swiper class="swiper-wrapper banner_img" :options="swiperOption" v-if="if_photo">
        <swiperSlide
          class="swiper-slide swiper_con_box"
          v-for="(photo,index) in goods_photo"
          :key="index"
        >
          <img v-lazy="photo" @click="to_enlarge(index)" />
        </swiperSlide>
        <template v-slot:pagination>
          <div class="lubob swiper-pagination tietl"></div>
        </template>
      </swiper>
    </div>
    <div class="gu_content">
      <div class="gu_ge">
        <div class="gu_img">
          <img class="imga" src="@/assets/img/other/size.png" alt />
          <div class="gu_price _price">
            <p
              class="price_discount"
            >{{GLOBA.money_tag}} {{good_pr_co.goods_current_price | keeptwoNum}}</p>
            <p
              class="price_original"
              v-if="good_pr_co.goods_price > good_pr_co.goods_current_price"
            >{{GLOBA.money_tag}} {{good_pr_co.goods_price | keeptwoNum}}</p>
          </div>
          <div
            class="goods_Price_count"
            v-if="good_pr_co.goods_price > good_pr_co.goods_current_price"
          >
            <span
              class="wcs"
            >{{((good_pr_co.goods_price-good_pr_co.goods_current_price)/good_pr_co.goods_price*100) | percentageNum}}%</span>
            <span class="wcsm">off</span>
          </div>
        </div>
        <div class="gu_parameter" @click="closeSelect">
          <img src="@/assets/img/other/cols.png" alt />
        </div>
      </div>

      <div class="content_wra">
        <div class="color_box" v-if="color_l">
          <p class="spec_title">Color</p>
          <ul class="color_select">
            <li
              :class="{'active':color_value === color.value}"
              v-for="(color,i) in items.color"
              :key="i"
              @click="select_color(color.value)"
            >{{color.value}}</li>
          </ul>
        </div>
        <div class="gu_chima" v-for="(gsp_list,n) in items.spec_info" :key="n">
          <div>
            <p class="spec_title">{{gsp_list.spec_name}}</p>
            <ul class="gu_size">
              <li
                :class="{'active':subIndex[n] == index}"
                v-for="(specfo,index) in gsp_list.gsp_list"
                :key="index"
                @click="spec_a(specfo,n,$event,index)"
              >{{specfo.gsp_value}}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="shul_btn">
        <div>{{$t("common.Count")}}:</div>
        <div :class="{'ae':language_s=='sa'}" class="ae">
          <Xnumber
            v-model="c_count"
            :min="1"
            :max="good_pr_co.goods_inventory"
            @change="price_number"
          ></Xnumber>
        </div>
        <div
          :style="language_s=='sa'?'margin-right: 0.4rem;':' margin-left: 0.4rem;'"
          class="gu_price"
        >
          <p
            class="price_discount"
          >{{GLOBA.money_tag}} {{good_pr_co.goods_current_price*c_count | keeptwoNum}}</p>
          <!-- <p class="price_original">{{GLOBA.money_tag}} {{good_pr_co.goods_price | keeptwoNum}}</p> -->
        </div>
      </div>
      <div class="gu_shu">
        <div class="spec_btn" v-if="to_guc===0 || to_guc===3">
          <!-- <p @click="closeSelectBox">{{$t("common.Cancel")}}</p> -->
          <p @click="queding">{{$t("common.Confirm")}}</p>
        </div>
        <div class="spec_btn1" v-if="to_guc===1">
          <p @click="queding_to">{{$t("common.Apply")}}</p>
        </div>
        <!-- 购物车 -->
        <div class="spec_btn1" v-if="to_guc===2">
          <p @click="qued_to">{{$t("common.Apply")}}</p>
        </div>
        <div class="spec_btn1" v-if="to_guc===4">
          <p @click="queding_to('1')">{{$t("common.Buy now")}}</p>
        </div>
        <div class="spec_btn1" v-if="to_guc===999">
          <p @click="queding_to('999')">{{$t("common.Buy now")}}</p>
        </div>
        <div class="bear" v-if="good_pr_co.goods_inventory===0"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Xnumber from "@/whole/components/global/x_number";
export default {
  props: [
    "closeSelectBox",
    "items",
    "queding",
    "count",
    "id",
    "to_guc",
    "queding_to",
    "qued_to",
    "specs_word",
    "good_spec",
  ],
  components: { swiper, swiperSlide, Xnumber },
  data() {
    return {
      swiperOption: {
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 20,
        longSwipesRatio: 0.1,
        preventClicks: false,
        preventClicksPropagation: true,
        freeModeSticky: true,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      },
      swiperOption_: {
        zoom: true,
        initialSlid: 0,
        preventClicksPropagation: false,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction",
        },
      },
      isenla_: false,
      c_count: 1,
      language_s: "",
      selectArr: [], //存放被选中的值
      subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断
      good_pr_co: {},
      guige: [],
      if_photo: false,
      goods_photo1: [],
      goods_photo: [],
      result_sel: [],
      color_value: "",
      color_l: false,
    };
  },
  created() {
    this.language_s = this.$route.query.lang;
    let self = this;
    if (self.specs_word == "1") {
      if (self.items.spec_info.length !== 0) {
        for (let i in self.items.spec_info) {
          self.subIndex[i] = 0;
        }
      } else {
        self.items.spec_info = [];
      }
      if (self.items.color.length !== 0) {
        self.color_value = self.items.color[0].value;
        this.color_l = true;
      } else {
        this.color_value = "";
        this.color_l = false;
      }
      self.check_Item();

      self.items.spec_info.some((item, e) => {
        self.good_spec.forEach((i) => {
          if (item.spec_name == i[0]) {
            item.gsp_list.some((it, f) => {
              if (it.gsp_value == i[1]) {
                this.spec_a(it, e, f, f);
              }
            });
          }
        });
      });
    }
  },
  activated() {
    console.log(this.items);
    let self = this;
    if (self.specs_word.length == 0) {
      self.c_count = 1;
      if (self.items.spec_info.length !== 0) {
        for (let i in self.items.spec_info) {
          self.subIndex[i] = 0;
        }
      } else {
        self.items.spec_info = [];
      }
      if (self.items.color.length !== 0) {
        self.color_value = self.items.color[0].value;
        this.color_l = true;
      } else {
        this.color_value = "";
        this.color_l = false;
      }
      self.check_Item(self.subIndex);
    }
  },
  methods: {
    closeSelect() {
      this.$router.go(-1);
    },
    select_color(value) {
      this.color_value = value;
      this.goods_gsps();
    },
    to_enlarge(i) {
      this.isenla_ = true;
      this.swiperOption_.initialSlide = i;
    },
    to_retraction() {
      this.isenla_ = false;
    },
    spec_a(item, n, event, index) {
      console.log(item);
      console.log(this.selectArr);
      let that = this;
      if (that.selectArr[n] != item) {
        that.selectArr[n] = item;
        that.subIndex[n] = index;
      } else {
        that.selectArr[n] = "";
        that.subIndex[n] = -1; //去掉选中的颜色
      }
      that.check_Item(that.subIndex);
    },
    check_Item(n) {
      let that = this;
      let option_s = that.items.spec_info;
      let result_s = []; //定义数组存储被选中的值
      for (let i in option_s) {
        result_s[i] = that.selectArr[i]
          ? that.selectArr[i]
          : option_s[i].gsp_list[0];
      }
      for (let i in option_s) {
        let last = result_s[i]; //把选中的值存放到字符串last去
        for (let k in option_s[i].gsp_list) {
          result_s[i] = option_s[i].gsp_list[k]; //赋值，存在直接覆盖，不存在往里面添加name值
          option_s[i].gsp_list[k].isShow = that.is_May(result_s); //在数据里面添加字段isShow来判断是否可以选择
          result_s[i].spec_name = option_s[i].spec_name;
        }
        result_s[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
      }
      this.guige = [];
      result_s.forEach((i) => {
        if (i !== "") {
          this.guige.push(i.gsp_id);
        }
      });
      // console.log(result_s)
      this.result_sel = result_s;
      this.goods_gsps(n);
      let spa = {
        result: result_s,
        spec_name: option_s.spec_name,
      };
      that.$forceUpdate(); //重绘
    },
    is_May(result_s) {
      for (let i in result_s) {
        if (result_s[i] == "") {
          return true; //如果数组里有为空的值，那直接返回true
        }
      }
    },

    async goods_gsps(n) {
      let noguige;
      if (this.guige.length == 0) {
        noguige = "";
      } else {
        noguige = this.guige;
      }
      this.if_photo = false;
      const data = {
        id: this.id,
        gsp: noguige.toString(),
        color: this.color_value,
      };
      let res = await this.$HTTP.goods_gsps(data);
      if (res.code == 0) {
        if (res.data.spec_map) {
          this.good_pr_co = res.data.spec_map;
          this.goods_photo = [];
          this.goods_photo1 = [];
          if (res.data.spec_map.hasOwnProperty("goods_photo")) {
            res.data.spec_map.goods_photo.forEach((item) => {
              this.goods_photo.push(
                item.photo.replace(/jpeg_middle.jpeg/, "jpeg")
              );
              this.goods_photo1.push(
                item.photo.replace(/jpeg_middle.jpeg/, "jpeg")
              );
            });
          } else if (res.data.spec_map.goods_mian_photo) {
            this.goods_photo.push(
              res.data.spec_map.goods_mian_photo.replace(
                /jpeg_middle.jpeg/,
                "jpeg"
              )
            );
            this.goods_photo1.push(
              res.data.spec_map.goods_mian_photo.replace(
                /jpeg_middle.jpeg/,
                "jpeg"
              )
            );
          } else {
            this.goods_photo = [require("@/assets/img/loader.png")];
            this.goods_photo1 = [require("@/assets/img/loader.png")];
          }

          let _value = [];
          if (this.color_value) {
            _value.push({
              gsp_value: this.color_value,
              spec_name: "Color",
            });
          }

          let ns = 0;
          if (n) {
            n.forEach((item) => {
              if (item === -1) {
                ns = -1;
              }
            });
          }
          let specification = {
            result: this.result_sel,
            price: res.data.spec_map,
            count: this.c_count,
            _value: _value,
            n: ns,
          };
          console.log(specification);
          this.$emit("lists_pec", specification);
          this.if_photo = true;
        }
      }
    },
    // 调整数量显示价格
    price_number() {
      this.$emit("price_number", this.c_count);
    },

    // 加入购物车
    to_cart() {
      this.to_q_cart();
    },
    async to_q_cart() {
      let data = {
        id: this.id,
        count: this.c_count,
        price: this.good_pr_co.price,
        gsp: this.guige,
        buy_type: "",
        combin_ids: "",
        combin_version: "",
      };
      let res = await this.$HTTP.add_goods_cart(data);
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped>
.gu_mask {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.15);
  z-index: 7;
}
.gu_piece {
  height: 50%;
  background-color: #f7f7f7;
}

.gu_content {
  position: relative;
  width: 100%;
  height: calc(100vh - 100vw);
  background: #fff;
  height: 50%;
  box-sizing: border-box;
}
.gu_ge {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f7f7f7;
  .gu_img {
    display: flex;
    align-items: center;
    position: relative;
    width: 80%;
  }
}
.imga {
  width: 0.32rem;
  height: 0.32rem;
}
._price {
  height: 1rem;
  padding: 0 0.2rem;
}
.goods_Price_count {
  color: #fff;
  font-size: 0.24rem;
  line-height: 0.32rem;
  font-family: "Calibri";
  width: 1.28rem;
  height: 0.32rem;
  text-align: center;
  background: url("~@/assets/img/other/biaoqian.png") no-repeat;
  background-size: cover;
  .wcs {
    padding: 0 0.08rem;
  }
}
.gu_parameter {
  width: 0.24rem;
  height: 0.24rem;
  position: relative;
  margin-top: 0.36rem;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.content_wra {
  width: 100%;
  height: calc(100% - 3rem);
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.spec_title {
  padding: 0 0.3rem;
  box-sizing: border-box;
}
.gu_chima {
  width: 100%;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
  color: #333;

  p {
    width: 100%;
    height: 0.6rem;
    line-height: 0.6rem;
  }
}
.gu_size {
  margin: 0.1rem 0.3rem 0 0.3rem;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  li {
    height: 0.6rem;
    padding: 0 0.3rem;
    // background: #ccc;
    text-align: center;
    line-height: 0.6rem;
    margin: 0 0.3rem 0.2rem 0;
    border-radius: 0.3rem;
    border: 1px solid #d7d7d7;
  }
  li.active {
    border: 1px solid #017ec2;
    background-color: #017ec2;
    color: #fff;
  }
}
.gu_shu {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.36rem;
  .spec_btn {
    height: 1rem;
    padding: 0 0.3rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    p {
      width: 3rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 0.4rem;
      background-color: #017ec2;
      color: #fff;
    }
  }
}
.spec_btn1 {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  p {
    width: 3rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    background-color: #017ec2;
    color: #fff;
  }
}
.bear {
  position: fixed;
  bottom: 0.24rem;
  right: 0.3rem;
  z-index: 100;
  width: 3.4rem;
  height: 0.9rem;
  border-radius: 0.4rem;
  background-color: rgba(250, 250, 250, 0.5);
}
.swiper_con_box {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    display: block;
  }
}
.banner_img {
  box-shadow: 0 0 10px 2px #ccc;
}
.tietl {
  position: absolute;
  left: 0;
  bottom: 0;
  margin-left: calc(100vw - 1rem);
  background-color: #d1cfd2;
  width: 1rem;
  height: 0.48rem;
  line-height: 0.48rem;
  color: #fff;
  font-family: "Calibri";
  font-size: 0.24rem;
}
.shul_btn {
  font-size: 0.3rem;
  padding: 0 0.3rem;
  height: 1rem;
  display: flex;
  align-items: center;
  border-top: 1px solid #f7f7f7;
  background-color: #fff;
}
.gu_price {
  .price_discount {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    color: #333;
    line-height: 0.6rem;
    height: 0.6rem;
  }
  .price_original {
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.24rem;
    color: #999;
    text-decoration: line-through;
    line-height: 0.1rem;
    height: 0.2rem;
  }
}
// 图片放大
.enlargement_box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1000;
  .pagination {
    position: absolute;
    top: 10%;
    left: 0;
    width: 100%;
    height: 0.8rem;
    line-height: 0.8rem;
    color: #333;
    font-size: 0.3rem;
    font-family: "Calibri-Bold";
    font-weight: Bold;
  }
}
.enlargement_img {
  width: 100%;
  height: 70%;
  margin-top: 17%;
  .swiper_box {
    width: 100%;
    height: 100%;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.inventory {
  position: fixed;
  top: 2.5rem;
  left: 2.5rem;
  width: 2.5rem;
  height: 1rem;
  border: 2px solid #017ec2;
  border-radius: 50%;
  z-index: 100;
  font-size: 0.4rem;
  font-weight: Bold;
  color: #017ec2;
  text-align: center;
  line-height: 1rem;
  transform: rotate(-15deg);
}
.color_box {
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.28rem;
  color: #333;
}
.color_select {
  padding: 0.1rem 0.3rem 0 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  li {
    height: 0.6rem;
    padding: 0 0.3rem;
    // background: #ccc;
    text-align: center;
    line-height: 0.6rem;
    margin: 0 0.3rem 0.2rem 0;
    border-radius: 0.3rem;
    border: 1px solid #d7d7d7;
  }
  li.active {
    border: 1px solid #017ec2;
    background-color: #017ec2;
    color: #fff;
  }
}
</style>
