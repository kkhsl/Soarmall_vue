<template>
  <div class="Returns">
    <div class="time_s">
      <p>{{$t("common.Success")}}</p>
      <p>
        <span>{{count}}</span>s
      </p>
    </div>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      count: ""
    }
  },
  created () {
    this.jump_s()
  },
  mounted () { },
  methods: {
      jump_s(){
            const TIME_COUNT = 3
            if (!this.timer) {
            this.count = TIME_COUNT
            this.show = false
            this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
                } else {
                this.show = true
                clearInterval(this.timer)
                this.timer = null
                }
            }, 1000)
            }
      }
  }
}
</script>

<style lang="scss" scoped>
.Returns {
    position: fixed;
    top: 1.5rem;
    left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fafafa;
  z-index: 10;
}
.time_s {
  padding: 150px 10%;
  width: 80%;
  text-align: center;
  font-size: 18px;
  line-height: 40px;
  color: #f90;
  font-weight: 600;
  span {
    font-size: 22px;
    color: red;
  }
}
</style>
