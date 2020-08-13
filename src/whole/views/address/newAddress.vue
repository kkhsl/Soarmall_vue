<template>
  <div class="full_page">
    <publicHead :noHeadRight="true">
      <h6 slot="headCenter">{{$t("title.Add New Address")}}</h6>
    </publicHead>
    <div class="tj_conter centerWrapNoFoot">
      <div class="tj_cot">
        <div class="userRow">
          <p>
            <img src="@/assets/img/other/rt.png" alt />
          </p>
          <p class="paad">
            <span>{{$t("common.Name")}}</span>
            <input
              type="text"
              :placeholder="$t('message.Please enter your name')"
              v-model="userInfo.userName"
            />
          </p>
        </div>
        <div class="userRow">
          <p>
            <img src="@/assets/img/other/sj.png" style="width: 0.22rem;height: 0.34rem;" />
          </p>
          <p class="paad">
            <span>{{$t("common.Phone number")}}</span>
            <span class="phone_tag">
              +{{GLOBA.phone_tag}}
              <input
                type="number"
                :placeholder="$t('message.Please enter your phone number')"
                v-model="userInfo.telephone"
              />
            </span>
          </p>
        </div>
        <div class="userRow">
          <p>
            <img src="@/assets/img/accout/userEmail.png" style="width: 0.28rem;" />
          </p>
          <p class="paad">
            <span>{{$t('common.E-mail')}}</span>
            <input
              :style="$route.query.lang == 'sa'?'text-align:end;':''"
              class="ltr"
              type="text"
              :placeholder="$t('tips.Enter your mailbox')"
              v-model="userInfo.email"
            />
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
                  v-for="(area, index) in addSelect1.list"
                  :value="area.areaId"
                  :key="index"
                >{{area.areaName}}</option>
              </select>
              <p class="xiangyou"></p>
            </div>
            <div class="newaddre_xz flexBox">
              <select v-model="addSelect2.selectId" @change="getAddress3(true)">
                <option
                  v-for="(area, index) in addSelect2.list"
                  :value="area.id"
                  :key="index"
                >{{area.areaName}}</option>
              </select>
              <p class="xiangyou"></p>
            </div>
            <div class="newaddre_xz flexBox" id="newaddre_xz3">
              <select
                v-model="addSelect3.selectId"
              >
                <option
                  v-for="(area, index) in addSelect3.list"
                  :value="area.id"
                  :key="index"
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
            v-model="userInfo.AreaInfo"
          ></textarea>
        </div>
      </div>
      <div class="tj_close">
        <div>{{$t("common.Set as default address")}}</div>
        <vantSwich v-model="userInfo.defaultVal" @change="swichChange" active-color="#017ec2"></vantSwich>
      </div>
      <div class="ft_button" v-click="Save_Btn">{{$t("common.Comfirm")}}</div>
    </div>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Toast from "@/assets/js/pop_up";
import vantSwich from "vant/lib/switch";
import "vant/lib/switch/style/index";
export default {
  components: { publicHead, vantSwich },
  data() {
    return {
      editId: "",
      userInfo: {
        userName: "",
        telephone: "",
        email: '',
        parentParentName: "",
        parentAreaName: "",
        areaName: "",
        defaultVal: "",
        AreaInfo: ''
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
      }
    };
  },
  mounted() {
    this.editId = this.$route.query.editId;
    this.getAddress1(); // 获取一级地址信息及用户信息
  },
  methods: {
    swichChange(i) {
      if (!i) {
        Toast({
          message: this.$t("message.At least one default address"),
          time: 2000,
          i: 2,
        });
      }
    },
    async getAddress1() {
      if (this.editId) {
        // 修改地址
        let res = await this.$HTTP.address_edit({ id: this.editId });
        if (res.code == 0) {
          this.userInfo = res.data;
          this.userInfo.defaultVal = res.data.defaultVal == 1;
          res.data.areaMap.forEach((address1) => {
            // 对比一级菜单名字 拿到id 以便拿二级数据
            if (this.userInfo.parentParentName == address1.areaName) {
              this.addSelect1.selectId = address1.areaId;
            }
          });
          this.addSelect1.list = res.data.areaMap;
          console.log(this.userInfo);
        }
      } else {
        // 新增地址
        this.userInfo.defaultVal = Boolean(this.$route.query.isFirst)
        let res = await this.$HTTP.address_add();
        if (res.code == 0) {
          this.addSelect1.list = res.data.areaMap;
          this.addSelect1.selectId = res.data.areaMap[0].areaId; // 默认选择一级数组第0个
        }
      }
      this.getAddress2();
    },
    async getAddress2(change) {
      // 根据一级地址id获取二级地址信息
      let res = await this.$HTTP.load_area({ pid: this.addSelect1.selectId },{showLoading:false});
      if (res.code == 0) {
        if (this.editId && !change) {
          res.data.forEach((address2) => {
            if (this.userInfo.parentAreaName == address2.areaName) {
              this.addSelect2.selectId = address2.id;
            }
          });
        } else {
          this.addSelect2.selectId = res.data[0].id;
        }
        this.addSelect2.list = res.data;
      }
      this.getAddress3();
    },
    async getAddress3(change) {
      // 根据二级地址id获取三级地址信息
      let res = await this.$HTTP.load_area({ pid: this.addSelect2.selectId },{showLoading:false});
      if (res.code == 0) {
        if (this.editId && !change) {
          // 如果不是select切换 并且是编辑的时候才会对比areaname确定id  否则都是默认选择第一个
          res.data.forEach((address3) => {
            if (this.userInfo.areaName == address3.areaName) {
              this.addSelect3.selectId = address3.id;
            }
          });
        } else {
          this.addSelect3.selectId = res.data[0].id;
        }
        this.addSelect3.list = res.data;
      }
    },
    async Save_Btn() {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.userInfo.AreaInfo)) {
        Toast({
          message: this.$t("message.Cannot enter Chinese"),
          time: 2000,
          i: 1,
        });
        return false;
      }
      if (/.*[\u4e00-\u9fa5]+.*$/.test(this.userInfo.userName)) {
        Toast({
          message: this.$t("message.Cannot enter Chinese"),
          time: 2000,
          i: 1,
        });
        return false;
      }
      if (this.userInfo.userName == "") {
        Toast({
          message: this.$t("message.Please fill in the user name"),
          time: 2000,
          i: 2,
        });
        return false;
      }
      if (this.userInfo.telephone == "") {
        Toast({
          message: this.$t("message.Please fill in mobile"),
          time: 2000,
          i: 2,
        });
        return false;
      } else if (!this.userInfo.telephone.match(/^(5|0)\d{7,9}$/)) {
        Toast({
          message: this.$t("message.Please fill in the correct mobile"),
          time: 2000,
          i: 2,
        });
        return false;
      }
      if (this.userInfo.AreaInfo == "") {
        Toast({
          message: this.$t("message.Please fill in the detailed address"),
          time: 2000,
          i: 2,
        });
        return false;
      }
      const data = {
        id: this.editId || "",
        area_id: this.addSelect3.selectId,
        area_info: this.userInfo.AreaInfo,
        email: this.userInfo.email,
        telephone: this.GLOBA.phone_tag + this.userInfo.telephone,
        trueName: this.userInfo.userName,
        flag: Number(this.userInfo.defaultVal)
      };
      let res = await this.$HTTP.address_save(data);
      if (res.code == 0) {
        if(this.$route.query.toPath){
          let toPath = this.$route.query.toPath
          try {
            delete this.$route.query.toPath;
          } catch (error) {}
          this.$router.push({
            path: toPath,
            query: {
              ...this.$route.query
            }
          })
        }else{
          this.$router.push({
            path: '/address',
            query: {
              ...this.$route.query
            }
          })
        }
      } else if (res.code == 4400) {
        Toast({
          message: this.$t("message.Please fill in the correct mobile"),
          time: 2000,
          i: 2,
        });
      }
    },
    // 地址选择
    async address1() {
      const data = {
        pid: this.userInfo.areaadd,
      };
      let res = await this.$HTTP.load_area(data);
      this.areaName = res.data;
      this.userInfo.areand = res.data[0].id;
    },
    async address2() {
      const dat = {
        pid: this.userInfo.areand,
      };
      let res = await this.$HTTP.load_area(dat);
      this.areaName2 = res.data;
      this.userInfo.areand2 = res.data[0].id;
    },
  },
};
</script>

<style lang="scss" scoped>
input::-webkit-input-placeholder {
  color: #ccc;
  font-size: 0.26rem;
  font-family: "Calibri-Light";
}
.tj_conter {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 0.2rem;
  box-sizing: border-box;
  font-size: 0.32rem;
}
.tj_cot {
  width: 100%;
  background: #fff;
  box-shadow: 2px 2px 5px #e2e2e2;
}
.tj_text {
  padding: 0 0.3rem 0.3rem 0.3rem;
  margin-top: 0.2rem;
  width: 100%;
  background: #fff;
  box-shadow: 0.02rem 0.02rem 0.2rem rgba(51, 51, 51, 0.15);
  /* padding: 0 0 0.3rem 0.3rem; */
  box-sizing: border-box;
  .newaddre_ {
    display: flex;
  }
}
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
.dressLogo {
  margin-right: 0.3rem;
}
#newaddre_xz3 {
  border: none;
}
.newaddre_xz {
  background: #fff;
  padding: 0.15rem 0.2rem;
  border-bottom: 1px solid #ebebeb;
  select {
    width: 100%;
    height: 0.6rem;
    background: #fff;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
    border: none;
    box-sizing: border-box;
    font-family: "Calibri";
    font-weight: 400;
    font-size: 0.28rem;
    color: #333;
  }
  .marginValue {
    padding-left: 0.8rem;
    padding-right: 0.1rem;
  }
  select::-ms-expand {
    display: none;
  }
}
.xiangyou {
  width: 0.06rem;
  height: 0.12rem;
  background: red;
  background: url(~@/assets/img/other/xiangyou3.png) no-repeat;
  background-size: 100% auto;
}
.textarea {
  margin: 0 0.3rem;
  display: flex;
  textarea {
    width: 100%;
    outline: none;
    resize: none;
    border: 1px solid #ebebeb;
    font-size: 0.22rem;
    padding: 0.1rem;
    box-sizing: border-box;
    margin-bottom: 0.1rem;
  }
  textarea::-webkit-input-placeholder {
    color: #ccc;
    font-size: 0.28rem;
  }
}
.tj_close {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 1rem;
  padding: 0.2rem 0.3rem;
  line-height: 0.7rem;
  box-sizing: border-box;
  background: #fff;
  margin-top: 0.2rem;
  box-shadow: 2px 2px 5px #e2e2e2;
  font-size: 0.28rem;
  font-weight: bold;
  font-family: "Calibri-Bold";
  position: relative;
}
.userRow {
  height: 1.34rem;
  width: 100%;
  padding: 0.3rem 0.3rem 0 0.3rem;
  box-sizing: border-box;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  justify-content: flex-start;

  p:nth-child(1) {
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

  p:nth-child(2) {
    display: flex;
    flex-direction: column;
    span {
      display: inline-block;
      font-size: 0.28rem;
      font-weight: bold;
      font-family: "Calibri-Bold";
    }
    input {
      margin-top: 0.16rem;
      border: none;
      outline: none;
      width: 4.6rem;
      height: 0.3rem;
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
    white-space: nowrap;
  }
}
.ft_button {
  width: 3.3rem;
  height: 0.8rem;
  margin: 0.3rem auto 0;
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
.paad {
  padding: 0 0.3rem;
}
</style>
