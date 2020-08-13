<template>
  <div class="full_page">
    <publicHead>
      <h6 slot="headCenter">{{txt_title}}</h6>
    </publicHead>
    <div
      class="wz_style centerWrapNoFoot"
      v-html="wenzhang"
      dir="ltr"
    ></div>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
export default {
  components: { publicHead },
  data () {
    return {
      wenzhang: "",
      txt_title: ""
    };
  },
  activated () {
    this.document();
  },
  methods: {
    get_into () {
      this.$router.push({
        path: "/subpages/Account/chat"
      });
    },
    async document () {
      let id = this.$route.query.id;
      const data = {
        orderBy: "",
        orderType: "",
        title: ""
      };
      if (id == 1) {
        data.title = "About Us";
        this.txt_title = this.$t("common.About Us");
      } else if (id == 2) {
        data.title = "Contact Us";
        this.txt_title = this.$t("common.Contact Us");
      }
      let res = await this.$HTTP.document_about(data)
      if (res.code == 0) {
        this.wenzhang = res.data[0].content;
      } else {
        this.wenzhang = this.$t("message.To be released");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wz_style {
  font-size: 0.26rem;
  overflow: hidden;
  overflow-x: scroll;
  overflow-y: scroll;
  line-height: 0.36rem;
  padding: 0 0.3rem;
  box-sizing: border-box;
  background-color: #f7f7f7;
}

.version {
  padding: 0 0.3rem;
  font-family: "Calibri-Bold";
  font-weight: Bold;
  font-size: 0.3rem;
  color: #333;
  box-sizing: border-box;
  line-height: 1rem;
  background-color: #f7f7f7;
}

.chat {
  width: 0.8rem;
  height: 0.8rem;
  position: fixed;
  bottom: 1rem;
  right: 0.3rem;
  z-index: 10000;
  background: url(../../../assets/img/chat.png) no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}
</style>
