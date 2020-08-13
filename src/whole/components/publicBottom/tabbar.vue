<template>
  <div class="bottomWrap">
    <div 
      class="tabbarItem"
      :class="{'active': index==tabbarIndex}" 
      v-for="(tabbar,index) of tabbarItems" 
      :key="index"
      @click="$router.push({path: tabbar.path})" 
    >
      <div class="tabbarImg" v-if="index==tabbarIndex"><img :src="tabbar.activeIcon" /></div>
      <div class="tabbarImg" v-else><img :src="tabbar.defaultIcon" /></div>
      <p class="tabbarText">{{tabbar.title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabbarIndex:{
      default: 0
    }
  },
  data() {
    return {
      tabbarItems:[
        {
          path: '/home',
          title: this.$t("common.Home"),
          defaultIcon: require('@/assets/img/tabbar/home1.png'),
          activeIcon: require('@/assets/img/tabbar/home2.png')
        },
        {
          path: '/categories',
          title: this.$t("common.Categories"),
          defaultIcon: require('@/assets/img/tabbar/categories2.png'),
          activeIcon: require('@/assets/img/tabbar/categories1.png')
        },
        {
          path: '/discovery',
          title: this.$t("common.Discovery"),
          defaultIcon: require('@/assets/img/tabbar/discovery2.png'),
          activeIcon: require('@/assets/img/tabbar/discovery1.png')
        },
        {
          path: '/mycont',
          title: this.$t("common.Account"),
          defaultIcon: require('@/assets/img/tabbar/account2.png'),
          activeIcon: require('@/assets/img/tabbar/account1.png')
        },
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.bottomWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.3rem;
}
.tabbarItem{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.7rem;
  border-radius: 1.75rem;
  font-size: 0.24rem;
  font-weight: 600;
  width: 1rem;
  .tabbarText{
    display: none;
  }
  &.active{
    width: 2.26rem;
    box-shadow: 1px 2px 5px #ccc;
    background-color: #017ec2;
    color: #fff;
    .tabbarText{
      display: block;
    }
  }
}
.tabbarImg img{
  height: 0.34rem;
  display: block;
  padding: 0 0.1rem;
}
</style>
