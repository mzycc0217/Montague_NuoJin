<template>
	<view>
		<!--占位符-->
		<!-- <view class="zhanwei"></view> -->
		<!--轮播图-->
		<view>
			<swiper style="width: 100%;height: 460upx;">
				<swiper-item v-for="(item,index) in listimage" :key="index">
					<image mdoel="widthFix" class="bannerimage" :src="getimage(item.shopImage)"></image>
				</swiper-item>

			</swiper>
		</view>
		<!--商品详情中间部份-->
		<view class="midell-Deciam" v-for="(itemd,indexd) in list" :key="indexd">
			<view class="midell-top">
				<view>￥{{itemd.Shop_Information_Price}}</view>
				<!-- <view>  <text style='font-size: 32upx; color:#AAAAAA;text-decoration:line-through;'> {{itemd.Shop_Information_Discount}} </text></view> -->
				<view>售出 {{itemd.Shop_Information_Sell}}</view>
			</view>


			<view class="midell-midell">
				<view>{{itemd.Shop_Information_Name}}</view>
				<view>{{itemd.Shop_Information_Deciaml}}</view>
			</view>
			<!--评价模块-->
			<view class="pingjia">
				<view>商品评价</view>
<block v-for="(items,indexs) in pinglunlist" :key="indexs">
				<view class="index-list animated fadeIn fast">
					<view class="jigao">
						
							<view class="index-list1 u-f-ac u-f-jsb">
								<view class="u-f-ac">
									<image @tap.stop="openSpace" src="../../static/Logo/logo.png" mode="widthFix" style="width: 60upx; height: 60upx;"
									 lazy-load></image>
									{{items.User_Bieming}}
								</view>
							</view>
							<view class="index-list2" @tap="opendetail">{{items.Pinglun_Countent}}</view>
						
					</view>
              
				</view>
 </block>

			</view>
		</view>
		<!--结束-->
		<view style="display: flex; width: 100%; height: 30upx;">
			<input type="text" v-model="pinglun" placeholder="内容不超过120字" style="border-bottom:1px solid #B2B2B2; width: 70%; height: 75upx; margin: auto;" />

			<button class="cu-btn bg-blue margin-tb-sm" @tap="fabiao">发表</button>
		</view>
		<!--占位-->
		<view style="width: 100%; height: 160upx;"></view>

	
	

	<!--购物车底部栏-->
	<view class="barfixed cu-bar tabbar bg-white border shop">
		<button class="action">
			<view class="cuIcon-service text-green">
				<view class="cu-tag badge"></view>
			</view>客服
		</button>
		<button class="action">
			<view class="cuIcon-favor">

			</view>收藏
		</button>
		<button class="action">
			<view class="cuIcon-cart">
				<view class="cu-tag badge" v-if="jiaru">1</view>
			</view>购物车
		</button>
		<view class="bg-orange submit" @tap="addshop">加入购物车</view>
		<view class="bg-red submit"  @tap="goumai">立即购买</view>
	</view>
	</view>

</template>

<script>
	export default {

		data() {
			return {
				pinglun: "",
				jiaru: false,
				Order_Count: 1,
				Shop_Information_Id: "",
				list: [],
				listimage: [],
				pinglunlist: []
			}
		},
		methods: {
       
              goumai(){
				  
				  
			  },
       
     
			fabiao() {
				console.log(this.pinglun)
				uni.request({
					url: this.url + "Myedit/Alledits",
					method: "POST",
					data: {
						Pinglun_Countent: this.pinglun
					},
					success: (res) => {
						
						const img=uni.getStorageSync('images')
						const name=uni.getStorageSync('name')
						const pinglunli={
							img:img, 
							User_Bieming:name, 
							Pinglun_Countent:this.pinglun,
							};
						//pinglunli.push(img,name)
						this.pinglunlist.unshift(pinglunli)
						console.log(this.pinglunlist)
						console.log(res.data.code)
						this.pinglun = "";
					}
				})

			},




			requestt: function() {

				let that = this;
				// const token = uni.getStorageSync('token');
				uni.request({
					url: this.url + "Deafalut/Content?id=" + this.Shop_Information_Id,
					method: "GET",
					//header:{'token':token},
					success: (res) => {
						that.list = res.data;
						for (var item of res.data) {
							that.listimage = item.childrn,
								that.pinglunlist = item.data

						}
						console.log(that.listimage)
					}

				})

			},
			//添加购物车
			addshop() {

				this.jiaru == true ? this.jiaru = false : this.jiaru = true;

				if (this.jiaru == true) {


					// // const token = uni.getStorageSync('token');
					uni.request({
						url: this.url + "Deafalut/AddShopping",
						method: "POST",
						data: {
							Shop_Information_Id: this.Shop_Information_Id,
							Order_Count: this.Order_Count
						},
						//header:{'token':token},
						success: (res) => {
							console.log(res.data.message)
						}
					})

				}
			},

			getimage: function(imagepa) {
				return "http://lulumeng.qicp.vip" + imagepa;
			},
		},
		onLoad: function(Object) {
			this.Shop_Information_Id = Object.id;
			this.requestt();

			this.$store.dispatch("INIT_cRATS");

			// this.$store.dispatch("init_car")
		},



	}
</script>

<style>
	.barfixed {
		position: fixed;
		bottom: 3upx;
		width: 750upx;
	}

	/* 	.zhanwei{ 
		width: 100%;
		height: var(--status-bar-height);
	} */
	.bannerimage {
		width: 750upx;
	}

	.midell-Deciam {
		margin-top: 30upx;
	}

	.midell-top {
		width: 100%;
		height: 80upx;
		background: white;
		display: flex;
		padding-top: 30upx;
		padding-left: 30upx;
		justify-content: center;


	}

	.midell-top>view:first-child {
		font-size: 40upx;
		color: #D91200;
	}

	.midell-top>view:nth-child(2) {
		margin-left: 40upx;
		margin-top: 10upx;
	}

	.midell-top>view:last-child {
		margin-left: 360upx;
		font-size: 26upx;
		color: #AAAAAA;
	}

	.midell-midell {
		height: 360upx;
		padding-left: 90upx;
		background-color: white;
	}

	.midell-midell>view:first-child {
		font-size: 36upx;
		font-style: inherit;
		font-weight: 700;
	}

	.midell-midell>view:last-child {
		font-size: 34upx;
		margin-top: 30upx;
	}

	.pingjia {
		background: white;
		margin-top: 20upx;
	}

	.pingjia>view:first-child {
		height: 50upx;
		text-align: center;
		border-bottom: 1upx solid #EEEEEE;
		font-size: 30upx;
	}

	.pingjia>view:last-child {
		width: 100%;
		height: 300upx;
		background: white;
		margin-top: 15upx;
	}


	.jigao {
		margin-top: 24upx;
	}

	.index-list {
		padding: 20upx;
		border-bottom: 1upx solid #EEEEEE;
	}

	.index-list1>view:first-child {
		color: #999999;
	}

	.index-list1>view:first-child image {
		width: 85upx;
		height: 85upx;
		border-radius: 100%;
		margin-right: 10upx;
	}

	.index-list1>view:last-child {

		border-radius: 5upx;
		padding: 0 10upx;
	}

	.index-list2 {
		padding-top: 15upx;
		font-size: 32upx;
	}

	.index-list3 {
		position: relative;
		padding-top: 15upx;
	}

	.index-list3>image {
		width: 100%;
		border-radius: 20upx;
	}
</style>
