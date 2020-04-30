<template>
	<view>
	<view style=" width: 100%; height: 200upx; background-color:#F37B1D;">
		<view style="padding-top: 120upx; font-size: 36upx; color:white;padding-left: 20upx; font-weight: bold;">诺金科技有限公司</view>
		
	</view>
	<view class="hd-mi">
		
		<view>欢迎进入诺金科技有限公司</view>
		<view>请选择您的职位</view>
	</view>
	
	<view class="middle" style="display: flex;">
	<block v-for="(item,index) in list" :key="index">
		<view class="m_h" @tap="select(item.User_TyID)">
			<image :src="item.Icon"></image>
			<view>{{item.User_TyName}}</view>
			
		</view>
	
	</block>
		
	</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
			list:[]	,
			
			}
		},
		onLoad() {
			this.reques();
		},
		methods:{
			
			 
			 
			select(id){
				uni.switchTab({
					url:"../my/my"
				})
			},
			
			reques(){
				uni.request({
					url:"http://localhost:58793/Api/logins/jaose",
					method:"GET",
					success: (res) => {
						console.log(res.data)
                          this.list=res.data;						
					}
				})
			}
		}
		
	}
	
</script>

<style>
	.hd-mi{
		margin-top: 30upx;
		margin-left: 40upx;
	}
	.hd-mi>view:first-child{
		font-size: 34upx;
		font-weight: bold;
		
	}
	.hd-mi>view:last-child{
		font-size: 32upx;
	}
	.middle{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 40upx;
	}
	.m_h{
		box-shadow: 5px 5px 2px #E4E4E4;
		display: flex;
		width: 200upx;
		height: 220upx;
		background-color:#F7F7F7;
		flex-direction: column;
		padding-left: 30upx;
		margin-top: 40upx;
		align-items: center;
		justify-content: center;
		padding: 20upx;
		border-radius: 20upx;
	}
	.m_h>image{
		width: 130upx;
		height: 130upx;
		
	}
	.m_h>view{
		white-space: nowrap;
	}
	.m_h:last-child {
	    margin-right: auto;
		margin-left: 40upx;
	}
</style>
