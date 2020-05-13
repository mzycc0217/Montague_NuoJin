<template>
	<view>
		
		
		<!--顶部tab-->
		<view class="uni-tab-bar">
			<scroll-view scroll-x class="uni-swiper-tab">
				<block v-for="(tab,index) in taBars" :key="index">
				<view class="swiper-tab-list" :class="{'active':tabIndex==tab.id}" @tap="tabtap(tab.id)">
					{{tab.name}}
					<view class="swiper-tab-line"></view>
				</view>
				</block>
			</scroll-view>
		</view>
		
		
		<view>
		<commlist v-if="tabIndex==1?true:false"></commlist>
		<listVideo v-if="tabIndex==2?true:false"></listVideo>
	</view>
	</view>
</template>

<script>
	import commlist from "../../components/commin-list/commin-list.vue"
	import listVideo from "../../components/Video/video.vue"
	export default{
		components:{
			commlist,
			listVideo
		},
		data(){
		return{
			tabIndex:1,
			taBars:[
				{name:"行业文章",id:1},
				{name:"行业视频",id:2},
			]
		}	
		},
		onLoad() {
			
		},
		methods:{
			tabtap(id){
				console.log(id)
				this.tabIndex=id;
			}
		}
		
		
	}
</script>

<style>
		
		
	page{
		background-color: white;
	}
   .u-f ,.u-f-ac, .u-f-ajc{
	   display: flex;
   }
	.u-f-ac, .u-f-ajc{
		align-items: center;
	}
		
	.u-f-ajc{
		justify-content: center;
		align-items: center;
	}
	.swiper-tab-list{
		width: 376rpx;

		color: #969696;
		font-weight: bold;
	}
	.uni-tab-bar .active{
		color: #343434;
	}
	.active .swiper-tab-line{
		border-bottom: 6upx solid #FEDE33; 
		width: 180UPX;
		margin: auto;
		border-top:6upx solid #FEDE33;
	}
	
/* 	
	.index-list{
		padding: 40rpx;
		border-bottom: 1upx solid #efefef;
		background-color: ;
	}
	.index-list1{
		
		justify-content: space-between;
		
	}
	.index-list1>view:first-child{
		
		color: #999999;
	}
	.index-list1>view:first-child>image{
		width: 60rpx;
		height: 60rpx;

		border-radius: 100%;
		margin-right: 14upx;
	}
	.index-list1>view:last-child{
		
		background-color: #a2a2a2;
		border-radius: 5upx;
		padding: 0 10upx;
	}
	.index-list1>view:last-child{
		
	}
	.index-list2{
		padding: 15upx;
		font-size: 32upx;
		font-weight: bold;
	}
	.index-list3{
		/* padding-top: 15upx; }*/
	
	/* .index-list3>image{
		width: 100%;
		
		height: 430rpx;
		
		border-radius: 20upx;
	}
	.index-list4{
		
		padding: 15upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
		.index-list4>view{
			color: #999999;
		}
	.index-list4>view:first-child{
		display: flex;
		align-items: center;
	}
	.index-list4>view:last-child{
		display: flex;
		align-items: center;
	}
	.index-list4>view>view{
		
	}
	.index-list4>view>view>view{
		margin-left: 15upx;
	}
	.index-list4>view>view:first-child{
		margin-right: 10upx;
	} */ 
</style>
