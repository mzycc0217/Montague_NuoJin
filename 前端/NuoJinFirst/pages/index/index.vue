<template>
	
	<view>
		
		<view>公司信息简介</view>
		
		<!--头部导航-->
	<!-- 	<view>
			<Nj_header></Nj_header>	
		</view> -->
		<!--中部卡片-->
	<!-- 	<view class="nj_card" v-for="(item,index) in lists" :key="index">
	      <view class="nj_image">
			  <image :src="getimage(item.News_Image)"></image>
		  </view>
		 <view class="nj_right">
			 <view>{{item.News_Title}}</view>
			 <view>{{item.News_Describe}} </view>
			
		 </view>
		  <view class="datas">{{item.News_Releasetime}}</view>
		</view> -->
	</view>
</template>

<script>
	
	/* import Nj_header from "../../components/header.vue"
	export default {
		data() {
			return {
				id:'',
				lists:[
					
				]
			}
		},
		onLoad(option) {
			
	     this.requeslist()
		},
		methods: {
            requeslist(News_Type_ID){
				let that=this;
				 const token = uni.getStorageSync('token');
				uni.request({
					url:"http://localhost:58793/Api/Index/defalut?News_Type_ID="+News_Type_ID,
					method:"GET",
						header:{'token':token},
					success: (res) => {
						// res.data.forEach(p=>{
						// 	p.News_Releasetime=p.News_Releasetime.substring(0,16)
						// })
						this.lists=res.data
					}
				})
			},
			getimage:function(imagepa) {
					return "http://lulumeng.qicp.vip" + imagepa;
				},
		
		},
		components:{
			
			Nj_header
		}
	} */
</script>

<style>
/* .nj_card{
	width: 750upx;
	height: 160upx;
	background-color: white;
	display: flex;
	margin-top: 10upx;
}
.nj_image{
	width: 160upx;
	height: 160upx;
}
.nj_image>image{
	width: 160upx;
	height: 160upx;
}
.nj_right{
	width: 400upx;
	flex-direction: column;
	padding: 10upx;
	margin-left: 20upx;
}
.nj_right>view{
	margin-top: 20upx;
	
}
.nj_right>view:first-child{
	  white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	font-size: 32upx;
	font-weight: bold;
	color: #8C9DA7;
}
.nj_right>view:last-child{
	  white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	margin-top: 40upx;
	font-size: 26;
	
	color: #8C9DA7;
}
.datas{
	white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis;
    margin-left: 100upx;
	margin-right: 20upx;
	line-height: 160upx;
	
	font-size: 24upx;
	color:#8C9DA7 ; 
} */


</style>
