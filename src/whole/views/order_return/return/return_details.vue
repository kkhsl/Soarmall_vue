<template>
  <div class="Returns">
    <Header
      ref="child"
      :iffanhui='true'
      :cart='true'
      :search='true'
    ></Header>
    <div class="content">
      <div class="content-top">
        <div class="mar32 image">
          <img v-lazy="adersid.goodsinfo_map.goods_photo" />
        </div>
        <div class="intro">
          <p
            class="title"
            :class="{'ltr':adersid.goodsinfo_map.goods_name.substring(0,1)!=='^'}"
          >{{adersid.goodsinfo_map.goods_name.substring(0,1)=='^'?adersid.goodsinfo_map.goods_name.substring(1):adersid.goodsinfo_map.goods_name}}</p>
          <div class="message">
            <div>
              <span class="prcn">{{GLOBA.money_tag}} {{adersid.goodsinfo_map.goods_price |integerNum}}</span>
              <span class="xiaoshu">.{{adersid.goodsinfo_map.goods_price | decimalNum}}</span>
            </div>
            <span class="shulian">x {{adersid.return_count}}</span>
          </div>
          <!-- <XNumber :min="1" :max="adersid.return_count" v-model="count"></XNumber> -->
        </div>
      </div>

      <div class="sp_text">
        <div class="sp_scoring">
          <p>{{$t("common.Description of the problem")}}:</p>
        </div>
        <div class="sp_textarea">
          <textarea
            name
            id
            cols="30"
            rows="5"
            :placeholder="this.placeholder"
            v-model="textwt"
          ></textarea>
        </div>

      </div>

      <div class="sc_tp">
        <ul>
          <li
            class="lf_im"
            v-for="(image,index) in fb_image"
            :key="index"
          >
            <img :src="image" />
            <div
              class="circle self-centered"
              v-if="progress>0 && progress<100"
            >
              <XCircle
                :percent="progress"
                :trail-width="5"
                :stroke-width="5"
                v-if="fb_image.length-1 == index"
              ></XCircle>
            </div>
            <p @click="img_sc(index)">
              <img src="@/assets/img/other/shanchu.png">
            </p>
          </li>
          <li
            class="sc_tupian"
            @change="logoImg"
          >
            <input
              type="file"
              id="fileimg"
              accept="image/*"
            />
            <p class="img"><img src="@/assets/img/other/tup.png"></p>
            <p class="name">{{$t("common.upload image")}}</P>
          </li>
        </ul>
      </div>

      <div class="refund mode_box">

      </div>
      <div
        class="ft_button"
        @click="start_btn"
      >{{$t("common.Submit")}}</div>
    </div>
    <Jump v-if="jump_if"></Jump>
  </div>
</template>

<script>
import { XTextarea, Datetime, XNumber, XCircle } from 'vux'
import Header from "@/whole/components/header/header_A";
import Jump from "@/whole/components/elastic/jump";
import Toast from "@/assets/js/pop_up";
export default {
  components: { XTextarea, Datetime, XCircle, XNumber, Header, Jump },
  data () {
    return {
      reason_show: false,
      placeholder: "",
      btn: '1',
      adersid: {},
      textwt: '',
      fb_image: [],
      fs_image: [],
      // count: 1,
      contact: '',
      phone: '',
      jump_if: false,
      progress: 0
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$route.query.good == {}) {
        vm.$router.push({ path: '/mycont' })
      }
    });
  },
  created () {
    this.adersid = this.$route.query.good
    if (this.$route.query.lang == 'en') {
      this.placeholder = 'Please describe the reasons for applying for after-sales, text, pictures, at least one entry.  Upload up to five images.'
    } else {
      this.placeholder = 'يرجى تحديد سبب تطبيق خدمة ما بعد البيع ، النص ، الصورة ، دخول واحد على الأقلتحميل خمس صور على الأكثر.'
    }
    console.log(this.adersid)
  },
  mounted () { },
  methods: {
    retreat () {
      this.reason_show = true
    },
    reviews_show () {
      this.reason_show = false
    },
    return_btn (id) {
      if (id == 1) {
        this.btn = 1
      }
      if (id == 2) {
        this.btn = 2
      }
    },

    // 上传图
    async logoImg (e) {
      console.log(e, e.target.files)
      var that = this
      var file = e.target.files[0]
      // 本地图片start
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = function () {
        var dataURL = reader.result;
        that.fb_image.push(dataURL);
      }
      // 本地图片end
      let data = {
        "goods_id":this.adersid.goodsinfo_map.goods_id,
        "evaluate_photos": file,
        "token": this.$store.state.status.token
      }
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
          this.progress = complete  //赋值，进度条变化，通过值或者其他事件还可以用showp使得进度条是否隐藏
          console.log(this.progress)  //complete是一个变化的值，最大100上传完成
        }
      }
      if (this.fb_image.length < 4) {
        let res = await this.$HTTP.upload_evaluate(data,config,true)
        if (res.code == 0) {
          this.fs_image.push(res.data)
        } else {
          Toast({ message: "Upload Fail", time: 2000, i: 2 });
        }
      } else {
        Toast({ message: "Limit reached", time: 2000, i: 2 });
      }
    },
    // 删除多余的图
    img_sc (index) {
      this.fb_image.splice(index, 1)
      this.fs_image.splice(index, 1)
    },

    async start_btn () {
      const data = {
        id: this.adersid.order_id,
        goods_id: this.adersid.goodsinfo_map.goods_id,
        currentPage: '',
        return_goods_content: this.textwt,
        return_goods_count: this.adersid.return_count,
        goods_gsp_ids: this.adersid.goods_gsp_ids,
      }
      let res = await this.$HTTP.return_apply_save(data)
      if (res.code == 0) {
        this.jump_if = true
        setTimeout(() => {
          this.jump_if = false
          this.$router.push({ path: '/subpages/Account/returns/returns' })
        }, 3000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.Returns {
  width: 100%;
}
.content {
  margin-bottom: 0.06rem;
  padding: 2%;
  box-sizing: border-box;
  //   background-color: #fff;
  .ordern {
    font-size: 0.24rem;
    color: #000;
    margin-bottom: 0.04rem;
  }
  .content-top {
    padding-bottom: 0.2rem;
    display: flex;
    width: 100%;
    justify-content: flex-start;
    border-bottom: 1px solid #ccc;
    .image {
      width: 1.6rem;
      height: 1.6rem;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .intro {
      width: 70%;
      position: relative;
      margin-top: 0.1rem;
      .title {
        line-height: 0.28rem;
        font-weight: 600;
        font-size: 0.24rem;
        word-wrap: break-word;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      p {
        line-height: 0.36rem;
        font-size: 0.24rem;
      }
      .message {
        justify-content: space-between;
        display: flex;
        margin: 0.2rem 0;
        font-size: 0.26rem;
        font-family: "Calibri-Bold";
        font-weight: bold;
        color: black;
        .prcn {
          font-size: 0.26rem;
          font-family: "Calibri-Bold";
          font-weight: bold;
        }
        .shulian {
          float: right;
          font-size: 0.26rem;
          font-family: "Calibri";
          font-weight: 400;
          color: #999999;
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
    }
    .sc_tp {
      width: 100%;
      padding: 0 0.3rem 0.3rem 0.3rem;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      .sc_tupian {
        height: 1.4rem;
        width: 1.4rem;
        border: 1px dashed #d7d7d7;
        p {
          margin: auto;
          height: 0.7rem;
          text-align: center;
          width: 0.6rem;
          font-size: 0.22rem;
          color: #cccccc;
          font-family: "Calibri";
          font-weight: 400;
          img {
            margin-top: 0.24rem;
          }
        }
      }
    }
  }
  .mode_box {
    width: 100%;
    padding: 0px 0.3rem;
    margin-bottom: 0.06rem;
    box-sizing: border-box;
    background-color: #fafafa;
    background: #fff;
    margin-top: 0.3rem;
  }
  .refund {
    h4 {
      font-size: 0.32rem;
      padding: 0.2rem 0;
    }
    .tk {
      p {
        height: 1.4rem;
        width: 1.4rem;
        border: 1px solid #f90;
        text-align: center;
        box-sizing: border-box;
        border-radius: 0.2rem;
        line-height: 0.6rem;
        i {
          font-size: 0.6rem;
          color: #f90;
          line-height: 0.2rem;
        }
        span {
          display: block;
          font-size: 0.2rem;
          color: #f90;
        }
      }
    }
    .return_btn {
      border-bottom: 1px solid #ccc;
      margin-bottom: 0.2rem;
      font-size: 0.32rem;
      .btn_1 {
        height: 0.6rem;
        line-height: 0.6rem;
        background-color: #fcfcfc;
        margin: 0.12rem 0.06rem;
        padding: 0 0.2rem;
        border-radius: 0.3rem;
        display: inline-block;
        border: 1px solid #f90;
        background: #f90;
        color: #fff;
      }
      .btn_ {
        height: 0.6rem;
        line-height: 0.6rem;
        background-color: #fcfcfc;
        margin: 0.12rem 0.06rem;
        padding: 0 0.2rem;
        border-radius: 0.3rem;
        display: inline-block;
        border: 1px solid #ccc;
      }
    }
    .contact {
      background-color: #fff;
      box-sizing: border-box;
      padding: 0.2rem 0;
      div:nth-child(1) {
        border-bottom: 1px solid #ccc;
      }
      .contact_box {
        line-height: 0.8rem;
        display: flex;
        justify-content: flex-start;
        font-size: 0.32rem;
        p {
          width: 1.6rem;
          font-weight: 600;
        }
        input {
          width: 60%;
          outline-color: invert;
          outline-style: none;
          outline-width: 0px;
          border: none;
          border-style: none;
          background-color: #fff;
        }
      }
    }
  }
  .ft_button {
    margin: 0.4rem auto;
    width: 4.2rem;
    height: 0.8rem;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#33b6ff),
      to(#017ec2)
    );
    background: linear-gradient(to right, #33b6ff, #017ec2);
    font-size: 0.36rem;
    color: #fff;
    font-weight: bold;
    font-family: "Calibri-Bold";
    text-align: center;
    line-height: 0.8rem;
    border-radius: 0.4rem;
  }
  .title_img {
    width: 100%;
    background-color: #f7f7f7;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 2%;
    box-sizing: border-box;
    .lf_im {
      width: 1.5rem;
      height: 2.2rem;
      overflow: hidden;
      margin: 0.02rem 0.06rem 0.02rem 0;
      position: relative;
      img {
        width: auto;
        width: 100%;
        height: 100%;
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
    .rt_btn {
      position: relative;
      display: flex;
      display: -ms-flexbox;
      display: -webkit-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 5.5rem;
      height: 1.5rem;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 0.1rem;
      i {
        font-size: 0.6rem;
        color: #f90;
      }
      span {
        display: block;
        font-size: 0.2rem;
        color: #999999;
        line-height: 1;
        padding-top: 0.16rem;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}

.sc_tp {
  width: 100%;
  padding: 0.3rem;
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
</style>
