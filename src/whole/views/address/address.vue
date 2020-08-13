<template>
  <div class="full_page">
    <publicHead>
      <h6 slot="headCenter">{{$t("title.Address")}}</h6>
      <div slot="headRight" @click="newAddress(null)" class="newAddress"><img src="@/assets/img/accout/addPlus.png" /></div>
    </publicHead>
    <div class="addressWrap centerWrapNoFoot">
      <div class="addressItem" v-for="(addressItem,index) of addressList" :key="index" @click="changeAddress(addressItem)">
        <div class="itemLeft">
          <div class="itemRow">
            <div class="rowTitle"><img src="@/assets/img/other/rt.png" /></div>
            <div class="rowVal">{{addressItem.consigneeName}}&nbsp;&nbsp;{{addressItem.telephone}}</div>
          </div>
          <div class="itemRow">
            <div class="rowTitle"><img src="@/assets/img/other/dw.png" /></div>
            <div class="rowValue">{{addressItem.areaParendName}}&nbsp;{{addressItem.areaName}}&nbsp;{{addressItem.areaChildName}}&nbsp;{{addressItem.areaInfo}}</div>
          </div>
        </div>
        <div class="itemRight">
          <div class="deleteBtn" v-if="$route.query.canNotDelete != 1" @click.stop="deleteAddress(addressItem.id)">×</div>
          <img @click.stop="newAddress(addressItem.id)" src="@/assets/img/other/qb.png" />
        </div>
        <div class="isDefault" v-if="addressItem.defaultVal">Default</div>
      </div>
      <div class="emptyAddress" v-if="!addressList || addressList.length==0">
        <div class="emptyImg">
          <img src="@/assets/img/accout/emptyAddress.png" alt="">
          <p>{{$t("title.You have no shipping address")}}</p>
        </div>
        <div class="addBtn" @click="newAddress(null)">{{$t("common.Add a new address")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import Dialog from 'vant/lib/dialog';
import 'vant/lib/dialog/style';
export default {
  components: { publicHead, Dialog},
  data() {
    return {
      addressList: []
    };
  },
  activated() {
    this.getAddress();
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    // 添加地址
    newAddress(editId){
      this.$router.push({
        path: '/newAddress',
        query:{
          ...this.$route.query,
          editId: editId,
          isFirst: this.addressList.length <= 0
        }
      })
    },
    // 删除
    deleteAddress(addId) {
      Dialog.confirm({
        className: 'vantConfirm',
        message: this.$t("message.You want to delete this address"),
        confirmButtonText: this.$t("common.Confirm"),
        cancelButtonText: this.$t("common.Cancel")
      })
      .then(async() => {
        let res = await this.$HTTP.address_del({mulitId:addId})
        if (res.code == 0) {
          this.getAddress();
        }
      })
    },
    // 获取地址列表
    async getAddress() {
      let addre = [];
      let res = await this.$HTTP.address()
      if (res.code == 0) {
        this.addressList = res.data.addresList;
      }else{
        this.addressList = []
      }
    },
    changeAddress(addItem){
      if(this.$route.query.paths){
        this.$store.commit("to_adders", addItem);
        this.$router.push({
          path: this.$route.query.paths,
          query: {
            check: 1
          }
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.emptyAddress{
  text-align: center;
}
.addBtn{
  margin-top: 0.2rem;
  display: inline-block;
  padding: 0.1rem 0.3rem;
  background: linear-gradient(to right, #33b6ff, #017ec2);
  font-size: 0.3rem;
  color: #fff;
  font-weight: bold;
  font-family: "Calibri-Bold";
  text-align: center;
  border-radius: 0.4rem;
}
.emptyImg{
  padding-top: 1rem;
  img{
    min-width: 3rem;
  }
}
.addressWrap{
  padding: 0.2rem;
  box-sizing: border-box;
  font-size: 0.28rem;
  overflow-x: hidden;
  overflow-y: scroll;
}
.addressItem{
  margin-bottom: 0.2rem;
  box-shadow: 2px 2px 10px #e2e2e2;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem 0.1rem 0.3rem;
  position: relative;
  border-radius: 0.1rem;
}
.isDefault{
  position: absolute;
  bottom: 0;
  left: 1rem;
  width: 1.2rem;
  font-size: 0.2rem;
  text-align: center;
  color: #fff;
  height: 0.3rem;
  border-top-left-radius: 0.06rem;
  border-top-right-radius: 0.06rem;
  background: #017ec2;
}
.deleteBtn{
  color: #f00;
  font-size: 0.36rem;
  padding: 0 0.1rem;
}
.itemRow{
  display: flex;
  padding: 0.1rem 0;
}
.itemRight{
  padding: 0 0.2rem;
  display: flex;
  flex-direction: column;
  min-height: 1.2rem;
  justify-content: space-around;
  align-items: center;
}
.rowTitle{
  padding: 0 0.2rem;
   img{
     vertical-align: middle;
   }
}
.rowValue{
  word-break: break-all;
}
.newAddress img{
  width: 0.46rem;
  display: block;
}
</style>
