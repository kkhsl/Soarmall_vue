<template>
  <div class="Returns">
    <div class="time_s">
      <p>Success</p>
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
      count: '' 
    }
  },
  created () {
    this.adersid = this.$route.query.id
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
          // 跳转的页面写在此处
          /* this.$router.push({
             path: "/home"
           }); */
          let toPage = this.$route.query.toPage
          console.log(toPage)
          if (toPage == 8) {
            this.$router.push({ path: './returns',
              query: { toPage: toPage } })
          } else {
            console.log(toPage)
            this.$router.push({ path: '/account/Account/orders',
              query: { toPage: toPage } })
          }
        }
      }, 1000)
    }
  },
  mounted () { },
  methods: {}
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.Returns {
  //   margin: 50px 0 0 0;
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
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
