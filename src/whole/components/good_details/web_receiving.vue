<template>
  <div class="receiving">
    <div class="receiving_box">
      <div class="headClose">
        <div class="close" @click="closeReceivingBox">x</div>
      </div>
      <div class="hear">
        <h5>Receiving information</h5>
      </div>

      <div class="tj_cot">
        <div class="inputRow">
          <p class="inputRowLeft">
            <img src="@/assets/img/other/rt.png" alt />
          </p>
          <p class="inputRowRight">
            <span class="title">{{$t("common.Name")}}</span>
            <input type="text" :placeholder="peun" v-model="newaddre.name" />
          </p>
        </div>
        <div class="inputRow">
          <p class="inputRowLeft">
            <img src="@/assets/img/other/sj.png" style="width: 0.22rem;height: 0.34rem;" />
          </p>
          <p class="inputRowRight">
            <span class="title">{{$t("common.Phone number")}}</span>
            <span class="phone_tag">
              +{{GLOBA.phone_tag}}
              <input
                type="number"
                :placeholder="peypn"
                v-model="newaddre.phone"
              />
            </span>
          </p>
        </div>
        <div class="inputRow">
          <p class="inputRowLeft">
            <img src="@/assets/img/accout/userEmail.png" style="width: 0.3rem;" />
          </p>
          <p class="inputRowRight">
            <span class="title">Email</span>
            <span class="phone_tag">
              <input
                type="text"
                placeholder="Please enter your email"
                v-model="newaddre.email"
              />
            </span>
          </p>
        </div>
      </div>

      <div class="tj_text">
        <div class="newaddre_">
          <div class="biaozhi">
            <img src="@/assets/img/other/dw.png" alt />
          </div>
          <div class="newaddre_box">
            <div class="newaddre_xz">
              <select v-model="newaddre.areaadd" @change="address1">
                <option
                  :value="area.areaId"
                  name="care1"
                  v-for="(area,i) in items"
                  :key="i"
                >{{area.areaName}}</option>
              </select>
              <p class="xiangyou" :class="GLOBA.gw"></p>
            </div>
            <div class="newaddre_xz">
              <select v-model="newaddre.areand" @change="address2">
                <option
                  :value="area.id"
                  name="care1"
                  v-for="(area,i) in areaName"
                  :key="i"
                >{{area.areaName}}</option>
              </select>
              <p class="xiangyou" :class="GLOBA.gw"></p>
            </div>
            <div class="newaddre_xz" id="newaddre_xz3">
              <select v-model="newaddre.areand2">
                <option
                  :value="area.id"
                  name="care1"
                  v-for="(area,i) in newAreaName2"
                  :key="i"
                >{{area.areaName}}</option>
              </select>
              <p class="xiangyou" :class="GLOBA.gw"></p>
            </div>
          </div>
        </div>
        <div class="textarea">
          <textarea cols="50%" rows="6%" :placeholder="peyd" v-model="newaddre.details"></textarea>
        </div>
      </div>
      <div class="confirm">
        <p v-click="confirm">{{$t("common.Confirm")}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/assets/js/pop_up";
export default {
  data() {
    return {
      peun: this.$t("message.Please enter your name"),
      peypn: this.$t("message.Please enter your phone number"),
      peyd: this.$t("message.Please enter your detailed"),
      items: [], // areaMap
      areaName: [], // 二级地址data
      areaName2: [], // 三级地址data
      newAreaName2: [],
      newaddre: {
        name: "",
        phone: "",
        email: "", // 邮编
        areaadd: "", // areaMap[0].areaId
        areand: "", // 二级地址值
        areand2: "", // 三级地址值
        details: ""
      },
      stringValue: "",
      mulitId: "",
      addresList: [],
      flag: "" //默认地址
    };
  },

  created() {
    this.updateAddress();
  },
  //   activated() {
  //     this.updateAddress();
  //   },
  watch: {
    areaName2: {
      handler(val, oldVal) {
        this.newAreaName2 = [];
        val.forEach(item => {
          this.newAreaName2.push(item);
        });
      },
      deep: true
    }
  },
  methods: {
    closeReceivingBox() {
      this.$emit("closeReceivingBox");
    },
    async updateAddress() {
      let edit_data = this.$route.query.edit_data;
      this.mulitId = this.$route.query.id;
      this.stringValue = this.$route.query.default_val;
      if (typeof edit_data !== "undefined") {
        this.newaddre.name = edit_data.userName;
        this.newaddre.phone = edit_data.telephone;
        this.newaddre.details = edit_data.Area_info;
        this.newaddre.areaadd = edit_data.parentParentName; // 一级地址
        this.newaddre.areand = edit_data.parentAreaName;
        this.newaddre.areand2 = edit_data.areaName;
      }
      let res = await this.$HTTP.address_add();
      if (res.code == 0) {
        res.data.areaMap.forEach(item => {
          this.items.push(item);
        });

        if (edit_data) {
          res.data.areaMap.forEach(item => {
            if (item.areaName == edit_data.parentParentName) {
              this.newaddre.areaadd = item.areaId;
            }
          });
        } else {
          this.newaddre.areaadd = res.data.areaMap[0].areaId;
        }

        const data = {
          pid: this.newaddre.areaadd
        };
        this.$HTTP.load_area(data).then(res => {
          this.areaName = res.data;
          if (edit_data) {
            res.data.forEach(item => {
              if (item.areaName == edit_data.parentAreaName) {
                this.newaddre.areand = item.id;
              }
            });
          } else {
            this.newaddre.areand = res.data[0].id;
          }

          const dat = {
            pid: this.newaddre.areand
          };
          this.$HTTP.load_area(dat).then(ress => {
            this.areaName2 = ress.data;
            if (edit_data) {
              ress.data.forEach(item => {
                if (item.areaName == edit_data.areaName) {
                  this.newaddre.areand2 = item.id;
                }
              });
            } else {
              this.newaddre.areand2 = ress.data[0].id;
            }
          });
        });
      }
    },
    // 地址选择
    async address1() {
      const data = {
        pid: this.newaddre.areaadd
      };
      let res = await this.$HTTP.load_area(data);
      this.areaName = res.data;
      this.newaddre.areand = res.data[0].id;
    },
    async address2() {
      const dat = {
        pid: this.newaddre.areand
      };
      let res = await this.$HTTP.load_area(dat);
      this.areaName2 = res.data;
      this.newaddre.areand2 = res.data[0].id;
    },
    async confirm() {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.newaddre.details)) {
        Toast({
          message: "Cannot enter Chinese",
          time: 2000,
          i: 1
        });
        return false;
      }
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.newaddre.name)) {
        Toast({
          message: "Cannot enter Chinese",
          time: 2000,
          i: 1
        });
        return false;
      }
      if (this.newaddre.name == "") {
        Toast({
          message: "Please fill in the user name",
          time: 2000,
          i: 2
        });
        return false;
      }
      if (this.newaddre.phone == "") {
        Toast({
          message: "Please fill in mobile",
          time: 2000,
          i: 2
        });
        return false;
      } else if (!this.newaddre.phone.match(/^(5|0)\d{7,9}$/)) {
        Toast({
          message: "Please fill in the correct mobile",
          time: 2000,
          i: 2
        });
        return false;
      }
      if (this.newaddre.details == "") {
        Toast({
          message: "Please fill in the detailed address",
          time: 2000,
          i: 2
        });
        return false;
      }
      const data = {
        area_id: this.newaddre.areand2,
        area_info: this.newaddre.details,
        email: this.newaddre.email,
        mobile: this.GLOBA.phone_tag + this.newaddre.phone,
        true_name: this.newaddre.name
      };
      // let userName = this.newaddre.phone.replace(/\s*/g, "");
      
      let ress = await this.$HTTP.wap_register(data);

      if (ress.code == 4200) {
        const data = {
          userName: ress.data.userName,
          password: ress.data.pwd,
          token: ""
        };
        this.$HTTP.token_login(data).then(res => {
          switch (res.code) {
            case 0:
              let account = res.data;
              account.password = ress.data.pwd;
              // 调用 store 中的 mutations 来将信息传过去
              this.$store.commit("Login", account);
              // 设置Vuex登录标志为true，默认userLogin为false
              this.$store.dispatch("userLogin", true);
              // Vuex在用户刷新的时候userLogin会回到默认值false，所以需要用到HTML5储存
              // 设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
              localStorage.setItem("Flag", "isLogin");
              this.$emit("web_confirm");
              break;
            case -1:
              Toast({
                message: this.$t("message.The account does not exist"),
                time: 2000,
                i: 1
              });
              break;
            case -2:
              Toast({
                message: this.$t("message.Username or password error"),
                time: 2000,
                i: 1
              });
              break;
            case -3:
              Toast({
                message: this.$t("message.Login failure"),
                i: 1
              });
              break;
            case -4:
              Toast({
                message: this.$t("message.Username or password error"),
                time: 2000,
                i: 1
              });
              break;
            default:
              Toast({
                message: this.$t("message.Server is busy"),
                time: 3000,
                i: 1
              });
          }
        });
      } else if (ress.code == 4400) {

        return Toast({
          message: "Please input the correct mobile number",
          time: 2000,
          i: 1
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.receiving {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(51, 51, 51, 0.7);
  z-index: 1000;
}
.headClose {
  display: flex;
  justify-content: flex-end;
  padding: 0.1rem 0.2rem;
  .close {
    width: 0.4rem;
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
  }
}
.receiving_box {
  width: 6.8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  .hear {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.32rem;
    text-align: center;
    height: 0.8rem;
    line-height: 0.8rem;
    font-weight: bold;
    font-family: "Calibri-Bold";
  }
}
.inputRow {
  padding: 0.3rem 0.3rem 0 0.3rem;
  box-sizing: border-box;
  border-bottom: 2px solid #ebebeb;
  display: flex;
  justify-content: flex-start;
}
.inputRowLeft {
  height: 0.3rem;
  width: 0.26rem;
  display: flex;
  align-items: flex-start;
  font-size: 0.28rem;
  outline: none;

  img {
    width: 100%;
    height: 100%;
  }
}
.inputRowRight {
  padding: 0 0.3rem;
  white-space: nowrap;
  .title {
    display: block;
    font-size: 0.28rem;
    font-weight: bold;
    font-family: "Calibri-Bold";
  }
  input {
    border: none;
    outline: none;
    width: 4.6rem;
    height: 0.3rem;
    padding: 0.16rem 0;
    font-size: 0.26rem;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
}
.phone_tag {
  font-family: "Calibri" !important;
  font-weight: 400 !important;
  font-size: 0.26rem;
  color: #999;
}
.tj_text {
  width: 100%;
  background: #fff;
  // box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  // margin-top: 0.1rem;
  padding: 0 0.3rem 0.3rem;
  box-sizing: border-box;
  .newaddre_ {
    display: flex;
    justify-content: flex-start;
    height: 3rem;
    .newaddre_box {
      width: 6.01rem;
      background: #fff;
    }
    .biaozhi {
      width: 0.24rem;
      height: 0.32rem;
      margin-top: 0.3rem;
      img {
        width: 100%;
      }
    }
    #newaddre_xz3 {
      border: none;
    }
    .newaddre_xz {
      background: #fff;
      display: flex;
      justify-content: space-between;
      margin-left: 0.3rem;
      width: 100%;
      height: 0.96rem;
      border-bottom: 1px solid #ebebeb;
      position: relative;
      select {
        width: 100%;
        background: #fff;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        outline: none;
        border: none;
        padding-left: 0.1rem;
        padding-right: 0.8rem;
        box-sizing: border-box;
        font-family: "Calibri";
        font-weight: 400;
        font-size: 0.28rem;
        color: #333;
      }
      select::-ms-expand {
        display: none;
      }
      .xiangyou {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0.06rem;
        height: 0.12rem;
        background: red;
        background: url(../../../assets/img/other/xiangyou3.png) no-repeat;
        background-size: cover;
      }
    }
  }
  .textarea {
    // margin: 0 0.3rem;
    margin-left: 0.3rem;
    display: flex;
    textarea {
      width: 100%;
      outline: none;
      resize: none;
      border: 1px solid #ebebeb;
      font-size: 0.22rem;
      padding: 0.1rem;
      box-sizing: border-box;
    }
    textarea::-webkit-input-placeholder {
      color: #ccc;
      font-size: 0.28rem;
    }
  }
}
.confirm {
  height: 1.2rem;
  width: 100%;
  padding-top: 0.3rem;
  p {
    margin: auto;
    // background-color: #017ec2;
    width: 3.3rem;
    border-radius: 0.4rem;
    line-height: 0.8rem;
    text-align: center;
    color: #fff;
    font-size: 0.3rem;
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
  }
}
</style>