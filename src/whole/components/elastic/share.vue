<template>
  <div class="share_box">
      <div class="empty" @click="share_c"></div>
      <div class="share_cont">
          <ul>
              <li>
                <p class="imga">
                  <img src="@/assets/img/share/Facebook.png" alt="">
                </p>
                <p class="name">Facebook</p>
              </li>
              <li>
                <p class="imga">
                  <img src="@/assets/img/share/Twitter.png" alt="">
                </p>
                <p class="name">Twitter</p>
              </li>
              <li>
                <p class="imga">
                  <img src="@/assets/img/share/Linkedin.png" alt="">
                </p>
                <p class="name">Linkedin</p>
              </li>
              <li>
                <p class="imga">
                  <img src="@/assets/img/share/WhatsApp.png" alt="">
                </p>
                <p class="name">Whats App</p>
              </li>
          </ul>
      </div>
      <div class="cancel" @click="share_c">Cancel</div>
  </div>
</template>

<script>

export default {
    props: ["share_c"],
  data() {
    return {
    };
  },
  created() {
    
  },
  mounted() {
  
  },
  beforeDestroy() {
    
  },
  methods: {
   
  }
};
</script>
<style lang='scss' scoped>
  .share_box{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
  .empty{
    width: 100%;
    height: 70vh;
  }
  .share_cont{
    width: 100%;
    height: 2.6rem;
    background-color: #fff;
    padding:0.3rem;
    box-sizing: border-box;
    ul{
      display: flex;
      justify-content: space-between;
      li{
        width: 1.5rem;
        height: 2rem;
        .imga{
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
           padding: 0.1rem;
          box-sizing: border-box;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .name{
          font-family: "Calibri";
          font-weight: 400;
          font-size:0.26rem;
          color: #333;
          width: 1.5rem;
          height: 0.5rem;
          line-height: 0.5rem;
          text-align: center;
        }
      }
    }
  }
  .cancel{
      width: 100%;
      height: calc(30vh - 2.6rem);
      line-height: 1.1rem;
      background-color: #fff;
      border-top: 0.1rem solid #ededed;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      font-size:0.3rem;
      color: #333;
      text-align: center;
    }
</style>