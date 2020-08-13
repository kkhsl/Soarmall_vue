<template>
  <div class="tankuan_box" v-if="pop_if">
      <div class="tankuan">
          <p class="img" v-if="ifcart"></p>
          <p>{{words}}</p>
      </div>
  </div>
</template>

<script>

  export default {
    props: {words: "",ifcart:true, pop_if:false},
    data () {
      return { };
    },
    created() {
    },
    methods: {

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
        width: 2.4rem;
        height: 2.2rem;
        border-radius: 0.1rem;
        font-family: "Calibri";
        font-weight: 400;
        font-size:0.4rem;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
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

</style>
