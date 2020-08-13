<template>
  <div class="full_page">
    <publicHead :goSearch="true"></publicHead>
    <div class="article_cont centerWrapNoFoot">
      <div class="cp_conter">
        <div class="cp_ge">
          <p class="bar" :class="{'rightBar':this.$route.query.lang=='sa'}"></p>
          <p class="shop_name">{{goods_eva.store_name}}</p>
          <p class="rotateY all" :class="{'isRotate':GLOBA.isRotate}"></p>
        </div>
        <div class="gm_xx">
          <div class="marg1 sp_img">
            <img v-lazy="goods_eva.eva_goods_main_photo_path"/>
          </div>
          <div class="sp_xx">
            <p v-if="goods_eva.goods_name" :class="{'ltr':goods_eva.goods_name.substr(0, 1) !== '^'}" class="firstP">
              {{goods_eva.goods_name.substr(0, 1) === '^'?goods_eva.goods_name.substr(1):goods_eva.goods_name}}
            </p>
            <div>
              <!-- <span v-if="goods_eva.eva_goods_gsp_val">{{goods_eva.eva_goods_gsp_val}}</span> -->
              <p dir="ltr">
                <span>{{GLOBA.money_tag}} {{goods_eva.eva_goods_price |integerNum}}</span>
                <span class="xiaoshu">.{{goods_eva.eva_goods_price | decimalNum}}</span>
              </P>
              <span>x{{goods_eva.eva_goods_count}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="eva_box">
        <div class="sp_textarea">
          <textarea
            cols="30"
            rows="5"
           :placeholder="$t('message.Please state your comment about the commodity')"
            v-model="evaluate_info"
          >
          </textarea>
        </div>
        <!-- v-if="Android_iOS==0" -->
        <ul class="sc_tp">
          <li class="lf_im" v-for="(image,index) in fb_image" :key="index">
            <img :src="image" />
            <p @click="img_sc(index)">
              <img src="@/assets/img/other/shanchu.png"/>
            </p>
          </li>
          <li class="sc_tupian" @change="logoImg">
            <input type="file" id="fileimg" accept="image/*" />
            <p class="img"><img src="@/assets/img/other/tup.png"/></p>
            <p class="name">{{$t("common.upload image")}}</P>
          </li>
        </ul>
      </div>
      <div class="foot_button" @click="start_btn(evaluate)">{{$t("common.Comfirm")}}</div>
      <Jump v-if="jump_if"></Jump>
    </div>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Jump from "@/whole/components/elastic/jump";
import Toast from "@/assets/js/pop_up";
export default {
  components: { publicHead, Jump },
  data () {
    return {
      goods_eva: {},
      fb_image: [], // 图
      fs_image: [],
      ifshow: false, // 选择弹出
      evaluate_info: "",
      jump_if: false,
      progress: 0,
      // Android_iOS:localStorage.getItem("Android_iOS"),
    }
  },
  created () {
    this.evaluate()
  },
  methods: {
    async evaluate () {
      let eva_id = this.$route.query.id
      let res = await this.$HTTP.add_evaluate({ id: eva_id })
      if (res.code == 4200) {
        this.goods_eva = res.data
      }else if(res.code = 4251){
        Toast({ message: "the time limit", time: 2000, i: 2 });
        this.$router.go(-1)
      }
    },
    // 上传图
    async logoImg (e) {
      console.log(e)
      if (this.fb_image.length > 4) {
        return Toast({ message: "Limit reached", time: 2000, i: 2 });
      }
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
        "goods_id":this.goods_eva.goods_id,
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
      let res = await this.$HTTP.upload_evaluate(data,config,true)
      if (res.code == 0) {
        this.fs_image.push(res.data)
      } else {
        Toast({ message: "Upload Fail", time: 2000, i: 2 });
      }
    },
    // 删除多余的图
    img_sc (index) {
      this.fb_image.splice(index, 1)
      this.fs_image.splice(index, 1)

    },
    // 提交
    async start_btn (evaluate) {
      let img_id = []
      this.fs_image.forEach(item => {
        img_id.push(item.img_id)
      })
      let data = {
        jsessionid: this.goods_eva.evaluate_session,
        id: this.goods_eva.id,
        evaluate_info: this.evaluate_info,
        evaluate_photos: img_id.toString()
      }
      let res = await this.$HTTP.add_evaluate_save(data)
      if (res.code == 4200) {
        this.jump_if = true
        setTimeout(() => {
          this.jump_if = false
          this.$router.push({ path: '/whole/views/order_return/review' })
        }, 3000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.article_cont {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}

.cp_conter {
  background-color: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  .cp_ge {
    .bar {
      width: 0.08rem;
      height: 0.26rem;
      position: absolute;
      top: 0.07rem;
      left: 0;
      background-color: #008edd;
    }
    .rightBar {
      right: 0;
    }
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
      padding: 0 0.2rem;
    }
    .all {
      background: url(../../../assets/img/other/xiangyou3.png) no-repeat;
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
      .firstP {
        font-size: 0.26rem;
        height: 0.52rem;
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
      div {
        line-height: 0.8rem;
        display: flex;
        justify-content: space-between;
        font-size: 0.24rem;
        height: 0.6rem;
        line-height: 0.8rem;
        color: #999999;
        p {
          line-height: 0.8rem;
          height: 0.8rem;
          display: flex;
          span:nth-child(2) {
            line-height: 0.6rem;
            vertical-align: middle;
          }
        }
      }
      span {
        font-size: 0.3rem;
        font-family: "Calibri";
        font-weight: 400;
      }
    }
  }
}

.eva_box {
  width: 100%;
  height: calc(100vh - 6rem);
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
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .lf_im {
    width: 1.5rem;
    height: 2.2rem;
    overflow: hidden;
    margin: 0.02rem 0.06rem 0.02rem 0;
    position: relative;
    img {
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
