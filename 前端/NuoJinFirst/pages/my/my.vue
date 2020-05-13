<template>
	<view>
		<!--第一部分 蓝框-->
		<view class="zhanwei" style="display: flex; width: 100%;height: 300upx; background-color: #1285FC; border-bottom-right-radius: 30%;border-bottom-left-radius: 30%;">
			<view style="font-size: 140%; color: white;top: 100upx; padding-top: 10%; padding-left: 30upx;">诺金科技有限公</view>
		</view>
		<!--信息卡片-->
		<view class="Nj_card" style="display: flex;">
			<view class="nj-cardImage">
				<image src="../../static/Logo/logo.png"></image>
			</view>
			<view class="nj-ri">
			<view class="nj-phone">
				<view>{{name}}</view>
				<view class="nj-guanli"><text style="font-weight: bold;">积分  {{jifen}}</text></view>
			</view>
			<view class="nj_wenzi">诺金科技有限公司</view>
			</view>
		</view>
		<!--菜单-->
		<view class="nj_yingyong">
			<view class="nj_zi">
				我的应用
			</view>
			<!-- <view class="nj_middle">
				
				<view class="nj_caidan">
					<view><view class="icon iconfont icon-qicheqianlian-1 blue" style="font-size: 60upx; color: blue;"></view></view>
					<view style="font-size: 26upx; font-weight: bold;">购物车</view>
				</view>
			
			</view> -->
			<view class="nj_middle">
				<view class="nj_caidan">
					<view @tap="gouwuche"><view class="icon iconfont icon-qicheqianlian-1 blue" style="font-size: 60upx; color: blue;"></view></view>
					<view style="font-size: 26upx; font-weight: bold;">购物车</view>
				</view>
			<block v-for="(item,index) in list" :key="index" >
			<view class="nj_caidan" @tap="tiaozhuan(item.Menu_Active)">
				<view><view :class="item.Menu_Icon" style="font-size: 60upx; color: blue;"></view></view>
				<view style="font-size: 26upx; font-weight: bold;"> {{item.Menu_Name}}</view>
			</view>
		</block>
		</view>
    	</view>
		<!--滚动-->
		<view class="middles">
		
		<swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
		 indicator-active-color="#0081ff">
		 <block v-for="(item,index) in imgList" :key="index">
			<swiper-item  :class="cardCur==index?'cur':''">
				<view class="swiper-item">
					<image :src="item.iamges" mode="aspectFill"></image>
				</view>
			</swiper-item>
			</block>
		</swiper>
		</view>
		
		<!--下面当导航栏-->
		<view class="nj_yingyong bottom_caidan">
			<view class="nj_zi">
				我的应用
			</view>
			<view class="nj_middle">
				
			
				
			<block v-for="(item,index) in menulists" :key="index" >
				<view class="nj_caidan" @tap="tiaozhuan(item.Menus_Url)">
					<view><view :class="item.Menus_icon" style="font-size: 60upx; color: blue;"></view></view>
					<view style="font-size: 26upx; font-weight: bold;"> {{item.Menus_Name}}</view>
				</view>
			</block>
		</view>
		</view>
	</view>

</template>

<script>
	
	export default {
		data() {
			return {
				name:"",
				image:"",
				jifen:"",
				menulists:[],
				list:[],
			imgList: [
				{iamges:'../../static/images/daxiong.jpg'},
				{iamges:'../../static/Logo/logo.png'},
				{iamges:'../../static/images/daxiong.jpg'},
				{iamges:'../../static/Logo/logo.png'}
			],
				cardCur: 0,
			}
	},
	onLoad() {
	this.requestmenu();
		this.requesUser();
		this.requestmenus()
	},
	methods:{
		cardSwiper(e) {
			this.cardCur = e.detail.current
		},
		requestmenu:function(){
			
			uni.request({
				url:this.url+"Logins/logins?id="+this.$store.state.jiaoseID,
				method:"GET",
				success:(res)=> {
					console.log(res)
					this.list=res.data;
					
				}
			})
		},
		requestmenus:function(){
			
			uni.request({
				url:this.url+"Logins/menu",
				method:"GET",
				success:(res)=> {
					console.log(res)
					this.menulists=res.data;
					
				}
			})
		},
		
		requesUser(){
			
			uni.request({
				url:this.url+"Login/loginss",
				method:"GET",
				success:(res)=> {
					console.log(res.data[0]);
			  // for(){
				  
				  
			  // }
					this.jifen=res.data[0].User_JIfen;
					this.image=res.data[0].User_Image;
					this.name=res.data[0].User_Bieming
					
				}
			})
		},
		gouwuche(){
			console.log("ss")
		  uni.navigateTo({
		  	url:"../guwuche/shoping"
		  })
		},
		tiaozhuan(action){
			console.log(action);
			uni.navigateTo({
			  url:action,
			})
			
		}
		
}
    
   }
	
</script>

<style>
	.tower-swiper .tower-item {
		transform: scale(calc(0.5 + var(--index) / 10));
		margin-left: calc(var(--left) * 100upx - 150upx);
		z-index: var(--index);
	}
	.zhanwei{
		position: relative;
	}
 .Nj_card{
	 position: absolute;
	 width: 94%;
	 height: 200upx;
	 border-radius: 16upx;
	 left: 2.8%;
	 background-color: white;
	 box-shadow: 6upx 6upx 2upx #E4E4E4;
	 box-shadow: #999999;
	 top: 15%;
	
 }
	 
.nj-cardImage{
	display: flex;
    margin-left: 40upx;
	align-items: center;
}
 .nj-cardImage image{
 	 
 	 width: 140upx;
 	 height: 140upx;
 }
	 .nj-ri{
		  display: flex; 
		  flex-direction: column;
		 margin-left: 40upx;
		 justify-content: center;
	 }
 .nj-phone{
	
	  display: flex; 
	flex-direction: row;
 }
 .nj-phone>view:first-child{
	 font-size: 120%;
	 font-weight: bold;
 }
 .nj-guanli{
	 width: 120upx;
	 height: 40upx;
	 background-color:#FB9046 ;
	 margin-left: 20upx;
	
	border-top-right-radius: 20upx;
	border-bottom-left-radius: 20upx;
	border-bottom-right-radius: 20upx;
 }
 .nj-guanli>text{
	 font-size: 90%;
	 line-height: 40upx;
	 font-weight: 500;
	text-align: center;
	 display: block;
 }
 .nj_wenzi{
	 font-weight: 400;
	 margin-top: 30upx;
	 font-weight: #797979;
 }
 .nj_content{
	 margin-top: 30upx;
 }
 .nj_gundong{
	 margin-top: 500upx;
 }
.nj_yingyong{
	width: 94%;
	height: 520upx;
	background-color: white;
	margin-left: 2.8%;
	margin-top: 130upx;
}
	
.nj_zi{
	font-size: 130%;
	font-weight: bold;
	padding-left: 15upx;
	padding-top: 30upx;
}
	
.nj_middle{
	display: flex;
	flex-wrap: wrap;
		justify-content: space-between;
		text-align: center;

}
.nj_caidan{
	width: 166upx;
	height: 120upx;
	padding: 30upx;
	text-align: cente
	}
.nj_middle:after{
    content: '';
    width: 345upx;
 }
	.img-sw {
	
		padding: 10rpx 20rpx 20rpx 5rpx;
	
	}
	
	.img-sw image {
		width: 100%;
		border-radius: 20upx;
		margin: 10upx;
		
	    padding-left: 20upx;
	}
	.mides{
		width: 100%;
		height: 240upx;
		
	}
		
	.middles{
		margin-top:-20upx ;
	}
		
	.bottom_caidan{
		margin-top: -12upx;
		height: 500upx;
		margin-bottom: 40upx;
	}
</style>

