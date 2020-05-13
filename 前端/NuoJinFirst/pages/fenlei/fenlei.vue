<template>
 <view>
	 <view class="zhanweo">
      <view> <text class="cuIcon-back" style="font-size: 50upx; color: #000000;line-height: 220upx; margin-left: 30upx;" @tap="batackto"> </text>
	 </view>
	  </view>
	  <view class="cu-bar search bg-white">
	  	<view class="search-form round">
	  		<text class="cuIcon-search"></text>
	  		<input v-model="search" placeholder="请输入想要的商品" />
	  	</view>
	  	<view class="action">
	  		<text class="cuIcon-scan" style="font-size: 150%;"></text>
	  	</view>
	  </view>
	  <view class="list-flex">
	  	<scroll-view class="" scroll-y="y" style="height: calc(100vh - 3upx); width: 200upx;">
	  		<view v-for="(item,index) in rightlist" :key="index" class="item_leftlist" :class="selected==index?'item_leftlists':''"
	  		 @tap="xuanzhong(index,item.Shop_Type_Id)">
	  			<view :class="selected==index?'shuxian':''"></view> {{item.Shop_Type_Name}}
	  		</view>
	  	</scroll-view>
	  	<scroll-view scroll-with-animation :scroll-into-view="'t'+selected" class="bg-white" scroll-y="y" style="height: calc(100vh - 3upx); width: 550upx;">
	  		<view :id="'t'+index" v-for="(item,index) in rightlist" :key="index">
	  			<!-- -->
	  			<view class="fonts text-bold text-black" style="font-size: 120%;">{{item.Shop_Type_Name}}</view>
	  			<view class="listss">
	  				<view v-for="(itemss,indexss) in item.children" :key="indexss">
	  					<!--  -->
	  					<view class="image_s">
	  						<image :src="getimage(itemss.Shop_Information_Image)"></image>
	  					</view>
	  					<view>{{itemss.Shop_Information_Name}}</view>
	  					<view><i>￥{{itemss.Shop_Information_Price}}</i></view>
	  				</view>
	  			</view>
	  		</view>
	  	</scroll-view>
	  
	  </view>
 </view>
 </view>	
</template>

<script>
	export default {
		data() {
			return {
				index: "",
				indexs: "",
				search:"",

				selected: 0,
				rightlist: [],
			}
		},
		onReady() {
		},
		onLoad(option) {
			
			//this.leftrequest();
			this.righrequest();
		},
		methods: {
          batackto(){
			  uni.switchTab({
			  	url:"../sahngcheng/sahngcheng"
			  })
		  },

			xuanzhong: function(id) {

				this.selected = id;

				

			},
			righrequest: function() {
				// const token = uni.getStorageSync('token');
				let that = this;
				uni.request({
					url: this.url+"Deafalut/AllContents",
					method: 'GET',
					//header:{'token':token},
					success: (res) => {
						that.rightlist = res.data;
					}
				})
			},
			getimage: function(imagepa) {
				return "http://lulumeng.qicp.vip" + imagepa;
			},
		}

	}
</script>

<style>
	.zhanweo{
		width: 100%; height:160upx;  background-color:  #F37B1D;
	}
	
	.list-flex {
		display: flex;
	}

	.item_leftlist {
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		border-bottom: 0.5upx solid white;

	}

	.item_leftlists {
		font-size: 32upx;
		font-weight: 700;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		border-bottom: 0.5upx solid white;
		position: relative;
	}

	.shuxian {
		position: absolute;
		background: red;
		height: 55upx;
		width: 18upx;
		top: 25upx;
		border-radius: 5upx;
		left: 14upx;
	}

	.listss {
		display: flex;
		flex-wrap: wrap;
	}

	.listss>view {
		width: 181upx;
		height: 300upx;
		border: 0.5upx solid #E6E6E6;
		margin-top: 40upx;
		margin-left: 3upx;
		border-radius: 5upx;
	}

	.image_s>image {
		width: 180upx;
		height: 200upx;
	}

	.fonts {
		margin-top: 30upx;
		margin-left: 40upx;
	}
</style>

