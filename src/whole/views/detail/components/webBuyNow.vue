<template>
  <div class="receiving_box">
    <div class="headClose">
      <div class="close" @click="$emit('close')">x</div>
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
          <input
            type="text"
            :placeholder="$t('message.Please enter your name')"
            v-model="userInfo.name"
          />
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
              :placeholder="$t('message.Please enter your phone number')"
              v-model="userInfo.phone"
            />
          </span>
        </p>
      </div>
      <div class="inputRow">
        <p class="inputRowLeft">
          <img src="@/assets/img/accout/userEmail.png" style="width: 0.3rem;" />
        </p>
        <p class="inputRowRight">
          <span class="title">{{$t('common.E-mail')}}</span>
          <span class="phone_tag">
            <input
              type="text"
              class="ltr"
              :style="$route.query.lang == 'sa'?'text-align:end;':''"
              :placeholder="$t('tips.Enter your mailbox')"
              v-model="userInfo.email"
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
          <div class="newaddre_xz flexBox">
            <select v-model="addSelect1.selectId" @change="getAddress2(true)">
              <option
                :value="area.areaId"
                name="care1"
                v-for="(area,i) in addSelect1.list"
                :key="i"
              >{{area.areaName}}</option>
            </select>
            <p class="xiangyou"></p>
          </div>
          <div class="newaddre_xz flexBox">
            <select v-model="addSelect2.selectId" @change="getAddress2(true)">
              <option
                :value="area.id"
                name="care1"
                v-for="(area,i) in addSelect2.list"
                :key="i"
              >{{area.areaName}}</option>
            </select>
            <p class="xiangyou"></p>
          </div>
          <div class="newaddre_xz flexBox">
            <select v-model="addSelect3.selectId">
              <option
                :value="area.id"
                name="care1"
                v-for="(area,i) in addSelect3.list"
                :key="i"
              >{{area.areaName}}</option>
            </select>
            <p class="xiangyou"></p>
          </div>
        </div>
      </div>
      <div class="textarea">
        <textarea
          cols="50%"
          rows="4%"
          :placeholder="$t('message.Please enter your detailed')"
          v-model="userInfo.details"
        ></textarea>
      </div>
    </div>
    <div class="confirm">
      <p v-click="confirm">{{$t("common.Confirm")}}</p>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  components: {
    Toast,
  },
  data() {
    return {
      userInfo: {
        name: "",
        phone: "",
        email: "",
        details: "",
      },
      addSelect1: {
        selectId: "",
        list: [],
      },
      addSelect2: {
        selectId: "",
        list: [],
      },
      addSelect3: {
        selectId: "",
        list: [],
      },
    };
  },
  mounted() {
    this.getAddress1(); // 获取一级地址信息及用户信息
  },
  methods: {
    async getAddress1() {
      let res = await this.$HTTP.address_add();
      if (res.code == 0) {
        this.addSelect1.list = res.data.areaMap;
        this.addSelect1.selectId = res.data.areaMap[0].areaId; // 默认选择一级数组第0个
      }
      this.getAddress2();
    },
    async getAddress2(change) {
      // 根据一级地址id获取二级地址信息
      let res = await this.$HTTP.load_area(
        { pid: this.addSelect1.selectId },
        { showLoading: false }
      );
      if (res.code == 0) {
        if (change) {
          // res.data.forEach((address2) => {
          //   if (this.userInfo.parentAreaName == address2.areaName) {
          //     this.addSelect2.selectId = address2.id;
          //   }
          // });
        } else {
          this.addSelect2.selectId = res.data[0].id;
        }
        this.addSelect2.list = res.data;
      }
      this.getAddress3();
    },
    async getAddress3(change) {
      // 根据二级地址id获取三级地址信息
      let res = await this.$HTTP.load_area(
        { pid: this.addSelect2.selectId },
        { showLoading: false }
      );
      if (res.code == 0) {
        if (change) {
          // 如果不是select切换 并且是编辑的时候才会对比areaname确定id  否则都是默认选择第一个
          // res.data.forEach((address3) => {
          //   if (this.userInfo.areaName == address3.areaName) {
          //     this.addSelect3.selectId = address3.id;
          //   }
          // });
        } else {
          this.addSelect3.selectId = res.data[0].id;
        }
        this.addSelect3.list = res.data;
      }
    },
    async confirm() {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.userInfo.details)) {
        Toast({ message: "Cannot enter Chinese" });
        return false;
      }
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.userInfo.name)) {
        Toast({ message: "Cannot enter Chinese" });
        return false;
      }
      if (this.userInfo.name == "") {
        Toast({ message: "Please fill in the user name" });
        return false;
      }
      if (this.userInfo.phone == "") {
        Toast({ message: "Please fill in mobile" });
        return false;
      } else if (!this.userInfo.phone.match(/^(5|0)\d{7,9}$/)) {
        Toast({ message: "Please fill in the correct mobile" });
        return false;
      }
      if (this.userInfo.details == "") {
        Toast({ message: "Please fill in the detailed address" });
        return false;
      }
      const data = {
        area_id: this.addSelect3.selectId, // 区域id 传第三级就可
        area_info: this.userInfo.details,
        email: this.userInfo.email,
        mobile: this.GLOBA.phone_tag + this.userInfo.phone,
        true_name: this.userInfo.name,
      };
      // let userName = this.userInfo.phone.replace(/\s*/g, "");
      let ress = await this.$HTTP.wap_register(data); //APP-注册
      if (ress.code == 4200) {
        const data = {
          userName: ress.data.userName,
          password: ress.data.pwd,
          token: "",
        };
        let res = await this.$HTTP.token_login(data);
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
            this.$emit("webConfirm");
            break;
          case -1:
            Toast({ message: this.$t("message.The account does not exist") });
            break;
          case -2:
            Toast({ message: this.$t("message.Username or password error") });
            break;
          case -3:
            Toast({ message: this.$t("message.Login failure") });
            break;
          case -4:
            Toast({ message: this.$t("message.Username or password error") });
            break;
          default:
            Toast({ message: this.$t("message.Server is busy") });
        }
      } else if (ress.code == 4400) {
        return Toast({ message: "Please input the correct mobile number" });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
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
  padding: 0 0.3rem 0.3rem;
  box-sizing: border-box;
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
.confirm {
  height: 1.2rem;
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
.newaddre_ {
  display: flex;
}
.newaddre_box {
  flex: 1;
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
.newaddre_xz:last-child {
  border: none;
}
.newaddre_xz {
  background: #fff;
  padding: 0.16rem 0;
  border-bottom: 1px solid #ebebeb;
  select {
    width: 5.5rem;
    padding: 0 .3rem;
    height: 0.6rem;
    background: #fff;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
    border: none;
    /* -webkit-box-sizing: border-box; */
    /* box-sizing: border-box; */
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.28rem;
    color: #333;
  }
  select::-ms-expand {
    display: none;
  }
  .xiangyou {
    width: 0.06rem;
    height: 0.12rem;
    background: url(~@/assets/img/other/xiangyou3.png) no-repeat;
    background-size: 100% auto;
  }
}
</style>