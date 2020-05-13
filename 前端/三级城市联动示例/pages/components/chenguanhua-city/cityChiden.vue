<template>
	<view class="cgh-city-childe">
		<view class="alert-black" @click="closeAlert"></view>
		<view class="radio-con">
			<view class="close" @click="closeAlert">
				<image src="../../static/left.png"></image>
				<text :class="selCityInfo.province !== '请选择省份' ? 'check': ''">{{selCityInfo.province}}</text>
				<text :class="selCityInfo.city !== '请选择城市' ? 'check': ''" >{{selCityInfo.city}}</text>
				<text :class="selCityInfo.area !== '请选择县区' ? 'check': ''" >{{selCityInfo.area}}</text>
			</view>
			<view class="search-con">
				<view class="left">
					<image src="../../static/search.png"></image>
					<input  type="text" confirm-type="search" v-model="keyword"  @confirm="keyWordSearch"  placeholder="请输入关键字" />
				</view>
				<view class="right" @click="keyWordSearch">搜索</view>
			</view>
			<view class="radio-info-con"  v-if="selIndex === 1" >
				<view class="item" v-for="(v, index) in cityList" :key="index" @click="selCity(v)">
					<view class="name">{{v.name}}</view>
				</view>
				<view class="child-more">已加载全部</view>
			</view>
			<view class="radio-info-con"  v-if="selIndex === 2" >
				<view class="item" v-for="(v, index) in cityList" :key="index" @click="selCity(v)">
					<view class="name">{{v.name}}</view>
				</view>
				<view class="child-more">已加载全部</view>
			</view>
			<view class="radio-info-con"  v-if="selIndex === 3" >
				<view class="item" v-for="(v, index) in cityList" :key="index" @click="selCity(v)">
					<view class="name">{{v.name}}</view>
				</view>
				<view class="child-more">已加载全部</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cityData from '../../components/chenguanhua-city/city.js';
	export default {
		props: ['cityInfo'],
		data() {
			return {
				tempCityList:  cityData.data,
				cityList: cityData.data,
				keyword: '',
				selCityInfo: {province: '请选择省份', city: '请选择城市', area: '请选择县区'},
				selIndex: 1
			}
		},
		created() {
			this.selCityInfo = this.cityInfo;
		},
		methods: {
			selCity (info) {
				if  (this.selIndex === 1) {
					if (this.selCityInfo.province !==  info.name) {
						this.selCityInfo = {province: info.name, city: '请选择城市', area: '请选择县区'};
					} else {
						this.selCityInfo.province = info.name;
					}
				} else if  (this.selIndex === 2) {
					if (this.selCityInfo.city !==  info.name) {
						this.selCityInfo.area = '请选择县区';
					} 
					this.selCityInfo.city = info.name;
				} else  {
					this.selIndex = 1;
					this.cityList =  cityData.data;
					this.tempCityList =  cityData.data;
					this.selCityInfo.area = info.name;
					this.$emit('selCity', this.selCityInfo);
					return;
				}
				this.selIndex++;
				this.cityList = info.districtList;
				this.tempCityList = info.districtList;
			},
			keyWordSearch () { // 关键字搜索
				if (this.keyword.trim() !== '') {
					this.cityList = this.tempCityList.filter((obj)=>{
						return obj.name.indexOf(this.keyword) != -1;
					});
				} else {
					this.cityList = this.tempCityList;
				}
				
			},
			closeAlert () {
				this.$emit('closeAlert');
			}
		},
		 watch: {
			  'keyword': function (newVal) { // 监听关键字的变化
				setTimeout(() => {
					this.keyWordSearch();
				}, 1000);
			  }
		  }
	}
</script>

<style lang="scss" scoped="">
	.cgh-city-childe {
		width: 100%;
		overflow: hidden;
		.alert-black  {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 1; 
			left: 0;
			top: 0;
			background: black;
			opacity: 0.5;
		}
		.all-user-text {
			padding: 25upx 20upx 25upx 20upx;
			border-bottom: 1upx solid #f4f4f4;
			font-size: 30upx;
			color: #333;
		}
		.radio-con {
			width: 100%;
			height: 70%;
			position: fixed;
			overflow:auto;
			bottom: 0;
			left: 0;
			z-index: 11;
			background: #fff;
			padding-bottom: 80upx;
			.search {
				background: red;
				margin-top: 100upx;
			}
			.radio-info-con {
				width: 100%;
				height: 70%;
				position: fixed;
				left: 0;
				bottom:  0u;
				z-index: 2009;
				overflow: scroll;
				.item {
					font-size: 36upx;
					color: #333;
					border-bottom: 1upx solid #f4f4f4;
					padding: 25upx 20upx 25upx 20upx;
					display: flex;
					justify-content:space-between;
					.name {
						width: 90%;
					}
					.chide-position {
						color: orange;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
		.close {
			width: 100%;
			color: #333;
			background: #42A5FE;
			color: #fff;
			padding: 10upx 0upx;
			image {
				width: 45upx;
				height: 50upx;
				margin-left: 20upx;
				vertical-align: middle;
			}
			text {
				padding-left: 20upx;
				color: red;
			}
			.check {
				color: #fff;
			}
		}
		.search-con {
			width: 92%;
			height: 80upx;
			margin-left: 4%;
			margin-top: 20upx;
			font-size: 32upx;
			line-height: 80upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			white-space: nowrap;
			.left {
				width: 75%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border: 1upx solid #f4f4f4;
				border-radius: 20upx;
				padding-left: 20upx;
				image {
					width: 45upx;
					height: 45upx;
				}
				input {
					width: 88%;
					text-align: left;
				}
			}
			.right {
				width: 18%;
				height: 100%;
				border: 1upx solid #f4f4f4;
				border-radius: 20upx;
				text-align: center;
				line-height: 80upx;
			}
		}
		.child-more {
			font-size: 28upx;
			color: #999;
			margin-bottom: 120upx;
			padding-top: 20upx;
			text-align: center;
		}
	}
</style>