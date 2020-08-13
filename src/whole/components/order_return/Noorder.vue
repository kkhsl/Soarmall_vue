<template>
<div>
	<div class="dindan_box">
		<p>	<img src="@/assets/img/other/wb.png" /></p>
		<p>{{tishi}}</p>
		<p @click="to_shouye"></p>
		<p></p>
	</div>
</div>
</template>

<script>
	export default{
		props:{
			tishi:""
		},
    data() {
      return {}
      },
      methods: {
        to_shouye(){
          this.$router.push({ path: "/home" });
        }
      }
	}
</script>

<style lang="scss" scoped>
	.dindan_box{
		width: 4rem;
		margin: auto;
		margin-bottom: 1rem;
		margin-top:3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		p:nth-child(1){
			width: 1.3rem;
			height: 1.4rem;
		}
		p:nth-child(2){
			width: 100%;
			height: 0.3rem;
			line-height: 0.3rem;
			font-size: 0.3rem;
			font-family: "Calibri";
			font-weight: 400;
			color: #999999;
			text-align: center;
			margin:0.3rem 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		p:nth-child(3){
			width: 2.24rem;
			height: 0.9rem;
			border-radius: 23px;
			box-shadow: 2px 2px 10px #e2e2e2;
			margin: 0.1rem 0 0.3rem;
			background: url(../../../assets/img/other/lg.png)no-repeat,linear-gradient(to right, #33B6FF,#017EC2);
			background-position: center;
		}
		p:nth-child(4){
			width: 1.28rem;
			height: 0.34rem;
			background: url(../../../assets/img/other/go.png)no-repeat;
			background-size: 1.28rem 0.34rem;
		}
	}
</style>
