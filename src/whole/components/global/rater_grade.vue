<template>

    <div class="grade_box" :style="undertone">
        <input type="radio" v-for="rater in grades" @click="grades_rater(rater)" :key="rater">
    </div>

</template>

<script>

  export default {
    props: ["grades"],
    data () {
      return {
        undertone:{
            width:"",
        },
      };
    },

   created() {
      console.log(this.grades)
   },

    methods: {
        grades_rater(rater){
            this.$emit("grades_rater", rater)
            this.undertone.width = rater/this.grades*100 + "%"
        }
    },


  }

</script>
<style lang='scss' scoped>
.grade_box{
    background: url(../../../assets/img/other/z2.png) no-repeat 0px 0px;
    background-size:2rem 0.27rem;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    input{
        outline:none; 
        border: none;
    }
    input[type="radio"] {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        margin: 0;
        vertical-align: text-bottom;
        margin-right: 0.084rem;
    }
    input[type="radio"]:after {
        display: block;
        content: "";
        width: 0.34rem;
        height: 0.5rem;
        // background: #fff;
        border-radius: 50%;
        // border: 2px solid #bfbfbf;
    }

}
</style>