<template>
  <div class="full_page">
    <publicHead>
      <img slot="headLeft" class="searchIcon" src="@/assets/img/other/sousuo.png" />
      <h6 slot="headCenter">{{$t("common.Categories")}}</h6>
    </publicHead>
    <div class="category_box centerWrap">
      <ul class="category_title" :class="{'reversal':$route.query.lang == 'sa'}">
        <li
          v-for="(navItem,index) in navTitle"
          @click="gcslist(navItem.gcid)"
          :class="{'navActive':navActive == navItem.gcid }"
          :key="index"
        >
          <p class="gcname line-clamp">{{navItem.gcname}}</p>
          <p class="gcimg">
            <img :src="navItem.icon_acc" alt />
          </p>
        </li>
      </ul>
      <div class="category_content">
        <div class="category_content_box" v-for="(list,index) in childList" :key="index">
          <div class="category_content_title">
            <p class="title_name">{{list.gc_name}}</p>
            <p class="title_more" @click="categoods(list.gc_id)">
              {{$t("common.more")}}
              <img
                :class="{'isRotate':GLOBA.isRotate}"
                src="@/assets/img/other/xiangyou2.png"
                alt
              />
            </p>
          </div>
          <div class="category_content_img">
            <div
              v-for="(child,index) in list.childList"
              :key="index"
              @click="categoods(child.gc_id)"
            >
              <p>
                <img v-lazy="child.gc_img" />
              </p>
              <p class="name line-clamp">{{child.gc_name}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <publicTabbar tabbarIndex="1"></publicTabbar>
  </div>
</template>

<script>
import publicHead from "@/whole/components/header/publicHead";
import publicTabbar from "@/whole/components/publicBottom/tabbar";
export default {
  components: {publicHead,publicTabbar},
  data() {
    return {
      navActive: 1,
      navTitle: [],
      childList: [],
      loadComplete: false,
    };
  },
  created() {
    this.classification_i();
  },
  mounted() {},
  methods: {
    gcslist(id) {
      if (this.loadComplete) {
        this.loadComplete = false;
        this.navActive = id;
        this.classification_c(id);
      }
    },
    async classification_i() {
      let res = await this.$HTTP.nav_querygc();
      if (res.code == 0) {
        let id = res.data.gcslist[0].gcid;
        let navList = [];
        res.data.gcslist.forEach((item) => {
          this.navTitle.push(item);
          this.$HTTP.nav_gcchilds({ pid: item.gcid }).then((res) => {
            if (res.code == 0) {
              navList.push(res.data);
              this.$store.commit("childList", navList);
            }
          });
        });
        console.log(this.navTitle);
        this.classification_c(id);
      }
    },
    classification_c(id) {
      let child_nav = [];
      let navList = this.$store.state.navList;
      if (navList.length == this.navTitle.length) {
        this.loadComplete = true;
        navList.some((it, i) => {
          if (it.topgc[0].gc_id == id) {
            it.gcslist.forEach((ite) => {
              child_nav.push(ite);
            });
            this.childList = child_nav;
          }
        });
      } else {
        this.$HTTP.nav_gcchilds({ pid: id }).then((res) => {
          if (res.code == 0) {
            res.data.gcslist.forEach((item) => {
              child_nav.push(item);
            });
            this.childList = child_nav;
          }
          this.loadComplete = true;
        });
      }
    },
    categoods(id) {
      this.$router.push({ path: "/subpages/cate_goods", query: { id: id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.searchIcon img {
  max-width: 0.36rem;
}
.category_box {
  display: flex;
  justify-content: space-between;
  background-color: #f7f7f7;
}
.category_title::-webkit-scrollbar {
  display: none;
}
.category_title {
  width: 2.34rem;
  font-size: 0.24rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  li {
    background-color: #ededed;
    height: 0.88rem;
    width: 1.84rem;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 0.2rem;
    box-sizing: border-box;
    .gcname {
      max-height: 0.88rem;
      line-height: 0.3rem;
    }
    .gcimg {
      display: none;
      position: absolute;
      top: 0.28rem;
      right: -0.25rem;
      width: 0.5rem;
      height: 0.5rem;
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
  li.navActive {
    background-color: #fff;
    height: 1.06rem;
    width: 2.08rem;
    box-shadow: 2px 2px 10px rgb(236, 236, 236);
    .gcimg {
      display: block;
    }
  }
}
.reversal li .gcimg {
  left: -0.25rem;
  right: auto;
}
.category_content {
  width: 5rem;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
}
.category_content_box {
  width: 100%;
  background-color: #fff;
}
.category_content_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0.94rem;
  line-height: 0.94rem;
  background-color: #f7f7f7;
}
.title_name {
  font-size: 0.28rem;
  color: #333;
  font-weight: Bold;
  font-family: "Calibri-Bold";
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.title_more {
  font-size: 0.24rem;
  color: #333;
  font-family: "Calibri-Light";
  img {
    width: 0.14rem;
    height: 0.12rem;
  }
}
.category_content_img {
  width: 100%;
  // padding-right:2%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  background-color: #fff;
  div {
    width: 33.333333%;
    height: 2.26rem;
    padding: 0.2rem;
    box-sizing: border-box;
    // z-index: 10;
    p {
      text-align: center;
    }
    p:nth-child(1) {
      // padding: 0 0.17rem;
      box-sizing: border-box;
      height: 1.2rem;
      // width: 1rem;
      width: 1.2rem;
      position: relative;
      img {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .name {
      font-size: 0.22rem;
      height: 0.5rem;
      line-height: 0.25rem;
      font-family: "Calibri-Bold";
      color: #333;
      margin-top: 0.2rem;
      font-weight: Bold;
    }
  }
}
.category_a {
  position: absolute;
  z-index: 10000;
  top: 0.5rem;
  left: 38%;
  width: 2rem;
  height: 0.8rem;
}
</style>
