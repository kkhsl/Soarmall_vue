<template>
  <div class="tankuan_box" v-if="pop_if">
      <div class="tankuan">
          <p class="img" v-if="ifcart"></p>
          <p>{{words}}</p>
      </div>


       <!-- 小球 -->
    <!-- <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball" v-show="ballFlag" ref="ball"></div>
    </transition> -->
  </div>
</template>

<script>

  export default {
    props: {words: "",ifcart:true,},
    data () {
      return {
        pop_if:false
      };
    },
    created() {
    },
    methods: {
      popout(){
       this.pop_if = true
        setTimeout(() => {
          this.pop_if = false
        },2000)
      }
          //
        // beforeEnter(el) {
        // el.style.transform = "translate(0, 0)";
        // },
        // enter(el, done) {
        // el.offsetWidth;
        // // 获取小球的 在页面中的位置
        // const ballPosition = this.$refs.ball.getBoundingClientRect();
        // console.log(ballPosition)
        // // 获取 徽标 在页面中的位置
        // const badgePosition = document
        //     .getElementById("badge")
        //     .getBoundingClientRect();
        //     console.log(badgePosition)
        // const xDist = badgePosition.left - ballPosition.left;
        // const yDist = badgePosition.top - ballPosition.top;

        // el.style.transform = `translate(${xDist}px, ${yDist}px)`;
        // el.style.transition = "all 0.5s cubic-bezier(.5,.5,.5,.5)";
        // done();
        // },
        // afterEnter(el) {
        // this.ballFlag = !this.ballFlag;
        // },
        // getSelectedCount(count) {
        // // 当子组件把 选中的数量传递给父组件的时候，把选中的值保存到 data 上
        // this.selectedCount = count;
        // console.log("父组件拿到的数量值为： " + this.selectedCount);
        // },
    },


  }

</script>
<style lang='scss' scoped>
    .tankuan_box{
       position: fixed;
        top: 30%;
        left: 50%;
        z-index: 100000;
    }
    .tankuan{
        transform: translate(-50%, -50%);
        text-align: center;
        border-radius: 0.1rem;
       width: 2.4rem;
       justify-content: center;
       height: 2.24rem;
       display: flex;
       align-items: center;
       font-family: "Calibri";
       font-weight: 400;
       font-size: 0.3rem;
        color: #fff;
        background-color:rgba(0, 0, 0, 0.7);
        padding: 0.3rem;
        animation: fadeio 0.5s 1;
        .img{
            margin:0 auto;
            width: 0.4rem;
            height: 0.4rem;
            background:url(../../../assets/img/other/addtocart.png) no-repeat;
            background-size: cover;
        }
    }
    @keyframes fadeio
    {
    0%   {opacity: 0;}
    100% {opacity: 1;}
    }

    // 小球
// .ball {
//   width: 0.3rem;
//   height: 0.3rem;
//   border-radius: 50%;
//   background-color: red;
//   position: fixed;
//   z-index: 99999;
//   bottom: 0.56rem;
//   left: 0.92rem;
// }

</style>
