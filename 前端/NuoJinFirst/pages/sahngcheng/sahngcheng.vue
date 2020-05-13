<template>
	<view>
		<view style="height: 110upx; width: 100%;background-color: #F37B1D;"></view>
		<view @tap="fellei" class="zhanwei" style="background-color:  #F37B1D; z-index: 1; position: absolute; top: 360upx; right: 20upx; width: 60upx; height: 60upx; border-radius:50%; font-size: 20upx;">
			
			<text  style="display: flex;justify-content: center; line-height: 60upx; color: white;">分类</text>
			</view>
		
		<view class="cu-bar search bg-white">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input v-model="search" placeholder="请输入想要的商品" />
			</view>
			<view class="action" @tap="sousuo">
				<text class="cuIcon-search" style="font-size: 150%;"></text>
			</view>
		</view>
		<!--导航排序-->
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''" v-for="(item,index) in scrolllef" :key="index" @tap="tabSelect" :data-id="index">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<!--列表--><!-- ,items.items.Shop_Information_Image,items.Shop_Information_Name,items.Shop_Information_Sell,items.Shop_Information_Price -->
		<view class="liebiao">
			<block v-for="(items,indexs) in list" :key="indexs">
				<view class="block-first" @tap="xiangqing(items.Shop_Information_Id)">
					<view>
						<image :src="getimage(items.Shop_Information_image)" mode="widthFix"></image>
					</view>
					<view class="cst">
					<view>[{{items.Shop_Information_Name}}]</view>
					<view>出售<text>{{items.Shop_Information_Sell}}</text>个</view></view>
					<view><i>￥{{items.Shop_Information_Price}}</i></view>
				</view>
			</block>
		
		</view>
	</view>
</template>

<script>
	export default{
		data(){
				
				
			return{
				search:"",
				list:[],
				
				TabCur: 0,
				//scrollLeft: 0
				scrolllef:[{"name":"综合"},
				{"name":"销量"},
				{"name":"价格"},
				]
			}
		},
		onLoad() {
			this.requessts();
		},
		methods:{
			xiangqing(id){
				uni.navigateTo({
					url:`../Decimal/Decimal?id=${id}`
				})
				
			},
			
		requessts:function(){
			uni.request({
				url:this.url+"Deafalut/AllContent?Shop_Information_Name="+this.search,
				method:"GET",
				//header:{'token':token},
				success: (res) => {
					console.log(res.data)
					this.list=res.data;
					// for(var item of res.data){
					// that.listimage =item.childrn
					
					// 	}
					
				}
			})
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			console.log(this.TabCur)
			if(	this.TabCur==0)
			{
			this.requessts();
			}
			else if(this.TabCur==1)
			{
		
				this.list.sort(function(a,b){
					return a.Shop_Information_Price-b.Shop_Information_Price
			})
			}
			else if(this.TabCur==2)
			{
			
				this.list.sort(function(a,b){
					return a.Shop_Information_Sell-b.Shop_Information_Sell
			})
		
			
			}
			
		},
		sousuo(){
			this.requessts();
		},
		fellei(){
			
			uni.navigateTo({
				url:"../fenlei/fenlei"
			})
		},
		getimage:function(imagepa) {
				return "http://lulumeng.qicp.vip" + imagepa;
			},
		
		
			
		}
	}
	
</script>

<style>
	.liebiao {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 10upx;
		margin-top: -15upx;
	}
	
	.block-first {
		box-shadow: 5px 5px 2px #E4E4E4;
		background: #EEEEEE;
		width: 360upx;
		height:509upx;
		border-radius: 15upx;
		box-shadow: #999999;
		margin-top: 30upx;
		font-size: 30upx;
		
	}
	
	.block-first>view:first-child image {
		border-radius: 20upx;
		width: 360upx;
		height: 300upx;
	}
		.cst{
				font-weight: 700;
		       display: flex;
		       margin-left: 22upx;
		}
	.cst>view:last-child {
		color: #797979;
		font-weight: 400;
	     margin-left: 135upx;
	}
	.cst>view:last-child>text {
	    color: #D123BB;
	}
	
	.block-first>view:nth-child(3) {
		font-size: 30upx;
		color: #D123BB;
		margin-left: 20upx;
	}
	
	.block-first>view:last-child {
		font-size: 36upx;
		color: #D123BB;
		margin-left: 20upx;
	}
	
	
</style>
