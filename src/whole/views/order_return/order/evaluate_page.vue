<template>
  <div class="full_page">
    <publicHead :goSearch="true" ref="publicHeadRef"></publicHead>
    <div class="article_cont" :class="GLOBA.top_search">
      <div class="cp_title">
        <div class="cp_conter">
          <div class="cp_ge">
            <p class="shop_name">{{goods_eva.store_name}}</p>
            <p class="rotateY all"></p>
          </div>
          <div class="gm_xx">
            <div class="marg1 sp_img">
              <img v-lazy="goods_eva.goods_photo" alt />
            </div>
            <div class="sp_xx">
              <p>{{goods_eva.goods_name}}</p>
              <p>
                <!-- <span>{{goods_eva.eva_goods_gsp_val}}</span> -->
                <span>{{GLOBA.money_tag}} {{goods_eva.eva_goods_price | keeptwoNum}}</span>
                <span>x{{goods_eva.eva_goods_count}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="sp_text">
        <div class="sp_scoring">
          <p>{{$t("common.Scoring")}}</p>
          <div class="rater_">
            <Grade :grades="5" @grades_rater="grades_rater"></Grade>
          </div>
        </div>
        <div class="sp_textarea">
          <textarea
            cols="30"
            rows="5"
            placeholder="Please state your comment about the commodity"
            v-model="evaluate.info"
          ></textarea>
        </div>
        <!-- v-if="Android_iOS == 0" -->
        <div class="sc_tp" >
          <ul>
            <li class="lf_im" v-for="(image,index) in fb_image" :key="index">
              <img :src="image" />
              <div class="circle self-centered" v-if="progress>0 && progress<100">
                <XCircle :percent="progress" :trail-width="5" :stroke-width="5" v-if="fb_image.length-1 == index"></XCircle>
              </div>
              <p @click="img_sc(index)">
                <img src="@/assets/img/other/shanchu.png">
              </p>
            </li>
            <li class="sc_tupian" @change="logoImg">
              <input type="file" id="fileimg" accept="image/*" />
              <p class="img"><img src="@/assets/img/other/tup.png"></p>
              <p class="name">{{$t("common.upload image")}}</P>
            </li>
          </ul>
        </div>
      </div>
      <div class="xz_pingjia">
        <div class="foot_pj">
          <p>{{$t("common.Commodity similarity")}}</p>
          <div class="rater_">
            <Grade :grades="5" @grades_rater="grades_rater1"></Grade>
          </div>
        </div>
        <div class="foot_pj">
          <p>{{$t("common.Logistics speed")}}</p>
          <div class="rater_">
            <Grade :grades="5" @grades_rater="grades_rater2"></Grade>
          </div>
        </div>
        <div class="foot_pj">
          <p>{{$t("common.Service Attitude")}}</p>
          <div class="rater_">
            <Grade :grades="5" @grades_rater="grades_rater3"></Grade>
          </div>
        </div>
      </div>
      <div class="foot_button" @click="start_btn(evaluate)">{{$t("common.Comfirm")}}</div>
    </div>
  </div>
</template>

<script>
import { XCircle } from "vux";
import Grade from "@/whole/components/global/rater_grade";
import "element-ui/lib/theme-chalk/index.css";
import publicHead from "@/whole/components/header/publicHead";
import Toast from "@/assets/js/pop_up";
export default {
  components: { XCircle, Grade, publicHead },
  data() {
    return {
      goods_eva: {},
      goodsid: "",
      fb_image: [], // 图
      fs_image: [],
      ifshow: false, // 选择弹出
      evaluate: {
        buyer_val: 5, // 评价
        info: "", // 评语
        description: 5, // 描述相符
        ship: 5, // 发货速度
        service: 5 // 服务态度
      },
      data: {
        goods_id: this.$route.query.goodId || "",
        evaluate_photos: "",
        token: this.$store.state.status.token || ""
      },
      progress: 0
      // Android_iOS:localStorage.getItem("Android_iOS"),
    };
  },
  mounted() {
    const data = {
      id: this.$route.query.orderId,
      goods_id: this.$route.query.goodId
    };
    this.$HTTP.order_evaluate(data).then(res => {
      if (res.code == 4200) {
        this.goods_eva = res.data;
      }
    });
  },
  methods: {
    // 评分
    grades_rater(rater) {
      this.evaluate.buyer_val = rater;
    },
    grades_rater1(rater) {
      this.evaluate.description = rater;
    },
    grades_rater2(rater) {
      this.evaluate.ship = rater;
    },
    grades_rater3(rater) {
      this.evaluate.service = rater;
    },
    // 上传图
    async logoImg(e) {
      console.log(e);
      var that = this;
      var file = e.target.files[0];
      // 本地图片start
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = function() {
        var dataURL = reader.result;
        that.fb_image.push(dataURL);
      };
      // 本地图片end

      let data = {
        goods_id: this.goodsid.good_id,
        evaluate_photos: file,
        token: this.$store.state.status.token
      };
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          let complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          this.progress = complete; //赋值，进度条变化，通过值或者其他事件还可以用showp使得进度条是否隐藏
          console.log(this.progress); //complete是一个变化的值，最大100上传完成
        }
      };
      if (this.fb_image.length < 4) {
        let res = await this.$HTTP.upload_evaluate(data, config, true);
        if (res.code == 0) {
          this.fs_image.push(res.data);
        } else {
          Toast({ message: "Upload Fail", time: 2000, i: 2 });
        }
      } else {
        Toast({ message: "Limit reached", time: 2000, i: 2 });
      }
    },
    // 删除多余的图
    img_sc(index) {
      this.fb_image.splice(index, 1);
      this.fs_image.splice(index, 1);
    },
    // 提交
    async start_btn(evaluate) {
      let description = "";
      let service = "";
      let ship = "";
      let buyer_val = "";
      switch (evaluate.description) {
        case 1:
          description = "a";
          break;
        case 2:
          description = "b";
          break;
        case 3:
          description = "c";
          break;
        case 4:
          description = "d";
          break;
        case 5:
          description = "e";
          break;
      }
      switch (evaluate.service) {
        case 1:
          service = "a";
          break;
        case 2:
          service = "b";
          break;
        case 3:
          service = "c";
          break;
        case 4:
          service = "d";
          break;
        case 5:
          service = "e";
          break;
      }
      switch (evaluate.ship) {
        case 1:
          ship = "a";
          break;
        case 2:
          ship = "b";
          break;
        case 3:
          ship = "c";
          break;
        case 4:
          ship = "d";
          break;
        case 5:
          ship = "e";
          break;
      }
      switch (evaluate.buyer_val) {
        case 1:
          buyer_val = "a";
          break;
        case 2:
          buyer_val = "b";
          break;
        case 3:
          buyer_val = "c";
          break;
        case 4:
          buyer_val = "d";
          break;
        case 5:
          buyer_val = "e";
          break;
      }
      //  console.log(this.fs_image)
      let img_id = [];
      this.fs_image.forEach(item => {
        img_id.push(item.img_id);
      });
      const data = {
        goods_id: this.goods_eva.goods_id,
        id: this.goods_eva.order_id,
        evaluate_session: this.goods_eva.evaluate_session,
        description_evaluate: description, // 评分
        service_evaluate: service, // 评分
        ship_evaluate: ship, // 评分
        evaluate_info: evaluate.info, // 评语
        evaluate_buyer_val: buyer_val, // 评分
        evaluate_photos: img_id.toString()
      };
      let res = await this.$HTTP.order_evaluate_save(data);
      if (res.code == 4200) {
        this.$refs.publicHeadRef.goBack();
        // this.$router.push({
        //   path: "/account/Account/orders",
        //   query: { toPage: 1, page: 1 }
        // });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
p,
h6 {
  margin: 0;
}
.article_cont {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.cp_title {
  background-color: #fff;

  .cp_conter {
    padding: 0.3rem;
    box-sizing: border-box;
    .cp_ge::before {
      content: "";
      width: 0.08rem;
      height: 0.26rem;
      position: absolute;
      top: 0.07rem;
      left: 0;
      background-color: #008edd;
    }
    .cp_ge {
      position: relative;
      display: flex;
      justify-content: space-between;
      font-family: "Calibri";
      font-weight: 400;
      font-size: 0.24rem;
      color: #333;
      height: 0.4rem;
      line-height: 0.4rem;
      .shop_name {
        margin-left: 0.2rem;
      }
      .all {
        background: url(../../../../assets/img/other/xiangyou3.png) no-repeat;
        background-size: cover;
        height: 0.12rem;
        width: 0.06rem;
        margin-top: 0.1rem;
      }
    }
    .gm_xx {
      display: flex;
      flex-direction: row;
      margin-top: 0.3rem;
      .sp_img {
        width: 1.3rem;
        height: 1.26rem;
        background: #ccc;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .sp_xx {
        width: 76%;
        p:nth-child(1) {
          font-size: 0.26rem;
          height: 0.54rem;
          line-height: 0.26rem;
          font-family: "Calibri";
          font-weight: 400;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        p:nth-child(2) {
          display: flex;
          justify-content: space-between;
          font-size: 0.24rem;
          margin-top: 0.48rem;
          span:nth-child(1) {
            width: 3.8rem;
            display: inline-block;
            font-family: "Calibri-Bold";
            font-weight: bold;
            height: 0.2rem;
            line-height: 0.2rem;
            color: #b3b3b3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          span:nth-child(2) {
            color: #999999;
            font-size: 0.3rem;
            font-family: "Calibri";
            font-weight: 400;
            height: 0.2rem;
            line-height: 0.2rem;
          }
        }
      }
    }
  }
}
.sp_text {
  width: 100%;
  background: #fff;
  margin-top: 0.3rem;
  .sp_scoring {
    font-size: 0.3rem;
    display: flex;
    justify-content: space-between;
    height: 0.86rem;
    line-height: 0.86rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
    p:nth-child(1) {
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: bold;
    }
  }
  .sp_textarea {
    padding: 0.3rem 0.3rem 0rem 0.3rem;
    box-sizing: border-box;
    textarea {
      font-size: 0.26rem;
      border: none;
      width: 100%;
      height: 1rem;
    }
    textarea::-webkit-input-placeholder {
      color: #cccccc;
      font-size: 0.26rem;
      font-family: "Calibri-Light";
      font-weight: 200;
    }
  }
  .sc_tp {
    width: 100%;
    padding: 0 0.3rem 0.3rem 0.3rem;
    box-sizing: border-box;
    ul {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .lf_im {
      width: 1.5rem;
      height: 2.2rem;
      overflow: hidden;
      margin: 0.02rem 0.06rem 0.02rem 0;
      position: relative;
      .circle {
        height: 1rem;
        width: 1rem;
      }
      img {
        width: auto;
        width: 100%;
      }
      p {
        position: absolute;
        top: 0rem;
        right: 0;
        width: 0.3rem;
        height: 0.3rem;
        text-align: end;
        img {
          position: absolute;
          top: 0.02rem;
          right: 0;
          width: 0.3rem;
          height: 0.3rem;
        }
      }
    }
    .sc_tupian {
      height: 1.4rem;
      width: 1.4rem;
      border: 1px dashed #d7d7d7;
      font-size: 0.22rem;
      position: relative;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      .img {
        width: 100%;
        height: 0.7rem;
        text-align: center;
        img {
          margin-top: 0.24rem;
          width: 0.46rem;
          height: 0.3rem;
        }
      }
      .name {
        color: #999999;
        text-align: center;
        font-family: "Calibri";
        font-weight: 400;
        line-height: 0.3rem;
        width: 0.6rem;
        margin: auto;
      }
    }
  }
}
.xz_pingjia {
  width: 100%;
  margin-top: 0.3rem;
  height: 2.54rem;
  background: #fff;
  .foot_pj {
    font-size: 0.3rem;
    display: flex;
    justify-content: space-between;
    height: 0.86rem;
    line-height: 0.86rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
    p:nth-child(1) {
      font-size: 0.28rem;
      font-family: "Calibri";
      font-weight: 400;
    }
  }
}
.rater_ {
  margin-top: 0.3rem;
  width: 2rem;
  height: 0.24rem;
  float: left;
  background: url(../../../../assets/img/other/z1.png) no-repeat 0 0px;
  background-size: 2rem 0.27rem;
}
.foot_button {
  width: 3.3rem;
  height: 0.8rem;
  margin: 0.4rem auto 0;
  background: -webkit-linear-gradient(
    left,
    #33b6ff,
    #017ec2
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #33b6ff,
    #017ec2
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #33b6ff,
    #017ec2
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #33b6ff, #017ec2);
  font-size: 0.36rem;
  color: #fff;
  text-align: center;
  line-height: 0.8rem;
  border-radius: 0.4rem;
}
</style>
