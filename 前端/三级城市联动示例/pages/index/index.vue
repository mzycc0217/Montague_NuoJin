<template>
	<view class="cgh-view">
		<view class="title">选择城市:</view>
		<view class="input" @click="isShowCity = true">
			{{cityInfo.province}} - {{cityInfo.city}} - {{cityInfo.area}}
		</view>	
		<view v-if="isShowCity">
			<cityChiden :cityInfo="cityInfo" @selCity="selCity" @closeAlert="isShowCity = false" ></cityChiden>
		</view>
	</view>
</template>

<script>
	import cityChiden from '../components/chenguanhua-city/cityChiden.vue';
	export default {
		data() {
			return {
				isShowCity: false,
				cityInfo: {province: '请选择省份', city: '请选择城市', area: '请选择县区'},
			}
		},
		onLoad(option) {
		},
		methods: {
			selCity (cityInfo, index) { // 选择城市
				let str = cityInfo.province + '-' + cityInfo.city + '-' + cityInfo.area
				this.cityInfo = cityInfo;
				this.isShowCity = false;
			},
		},
		components: {
			cityChiden
		}
	}
</script>
<style lang="scss" scoped="">
	.cgh-view {
		width: 100%;
		height: 100%;
		overflow: hidden;
		padding-bottom: 40upx;
		font-size: 30upx;
		margin-top: 30upx;
		.title {
			width: 25%;
			margin-left: 3%;
			font-size: 30upx;
			color: #333;
		}
		.input {
			width: 90%;
			padding: 10upx;
			margin-left: 2%;
			margin-top: 20upx;
			border: 1upx solid #999;
			border-radius: 10upx;
		}
	}
</style>
