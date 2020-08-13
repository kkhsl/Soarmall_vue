<template>
  <div class="load">
    <div class="div1"></div>
    <div class="div2">
      <ul>
        <li>
          <p class="ul_li1"></p>
        </li>
        <li>
          <p class="ul_li2"></p>
        </li>
        <li>
          <p class="ul_li3_a"></p>
          <p class="ul_li3_b"></p>
        </li>
        <li>
          <p class="ul_li4"></p>
        </li>
        <li class="ul_li5">
          <p class="ul_li5_a"></p>
          <p class="ul_li5_a"></p>
          <p class="ul_li5_a"></p>
        </li>
      </ul>
    </div>
    <div class="div3">
      <div class="div3_a">
        <p class="p1"></p>
        <p class="p2"></p>
      </div>
      <div class="div3_a">
        <p class="p1"></p>
        <p class="p3"></p>
      </div>
    </div>
    <div class="div3">
      <div class="div3_a">
        <p class="p1"></p>
        <p class="p3"></p>
      </div>
      <div class="div3_a">
        <p class="p1"></p>
        <p class="p2"></p>
      </div>
    </div>
    <div class="div4">
      <p class="p1"></p>
      <p class="p2"></p>
    </div>
    <div class="div5">
      <ul>
        <li>
          <p class="p1"></p>
          <p class="p2"></p>
        </li>
        <li class="p3_p4">
          <p class="p3"></p>
          <p class="p4"></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {};
  },

  methods: {}
};
</script>
<style lang='scss' scoped>
.load {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #fff;
}
.div1 {
  width: 100vw;
  height:calc(100vh - 6.9rem);
  background-color: #fff;
}
.div2 {
  width: 100vw;
  padding: 0 0.3rem;
  box-sizing: border-box;
  border-bottom: 0.06rem solid #f7f7f7;
  background-color: #f7f7f7;
  li {
    height: 0.4rem;
    width: 100%;
    padding: 0.05rem 0;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    p {
      height: 100%;
      background-color: #efefef;
      border-radius: 0.06rem;
    }
    .ul_li1 {
      width: 4rem;
    //   background-color: #ffe7cf !important;
    }
    .ul_li2 {
      width: 3rem;
    }
    .ul_li3_a {
      width: 5rem;
    }
    .ul_li3_b {
      width: 0.8rem;
    }
    .ul_li4 {
      width: 4rem;
    }
  }
  .ul_li5 {
    margin: 0.1rem 0;
    padding: 0.05rem 0.3rem;
    .ul_li5_a {
      width: 1rem;
    }
  }
}
.div3 {
  width: 100vw;
  padding: 0 0.3rem;
  box-sizing: border-box;
  border-bottom: 0.06rem solid #f7f7f7;
  .div3_a {
    display: flex;
    justify-content: flex-start;
    height: 0.3rem;
    padding: 0.2rem 0;
    p {
      border-radius: 0.06rem;
      background-color: #efefef;
    }
    .p1 {
      width: 0.6rem;
      margin-right: 0.3rem;
    }
    .p2 {
      width: 5rem;
    }
    .p3 {
      width: 3rem;
    }
  }
}
.div4 {
  margin: 0.3rem 0;
  width: 100vw;
  padding: 0 0.3rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  height: 0.3rem;
  p {
    border-radius: 0.06rem;
    background-color: #efefef;
  }
  .p1 {
    width: 0.6rem;
    margin-right: 0.3rem;
  }
  .p2 {
    width: 5rem;
  }
}
.div5 {
  width: 100vw;
  padding: 0 0.3rem 0 0.5rem;
  box-sizing: border-box;
  ul {
    display: flex;
    justify-content: space-between;
  }
  .p1 {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.06rem;
    background-color: #efefef;
  }
  .p2 {
    margin-top: 0.1rem;
    width: 0.5rem;
    height: 0.2rem;
    border-radius: 0.06rem;
    background-color: #efefef;
  }
  .p3_p4 {
    display: flex;
    justify-content: flex-start;
    p {
      height: 0.8rem;
    }
    .p3 {
      width: 2.4rem;
      background: linear-gradient(to top, #7ed0fe, #33b6ff);
      opacity: 0.5;  
    }
    .p4 {
      width: 3.2rem;
      background: linear-gradient(to bottom, #7ed0fe, #017ec2);
      opacity: 0.5;  
    }
  }
}
</style>