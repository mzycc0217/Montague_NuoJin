<template>
	<view>
		<view class="liandong">
	<pick-regions :defaultRegion="defaultRegionCode" @getRegion="handleGetRegion">
	    <h2>选择省市区</h2>
	</pick-regions>
	  <view class="zixing" style="margin-left: 60upx;" >
		  <input v-model="regionName" type="text" placeholder="请选择省市区" />
	       <!--  <h3>{{regionName}}</h3> -->
	   </view>
	  </view>
	</view>
</template>
 
<script>
	
	  import pickRegions from '@/components/pick-regions/pick-regions.vue'
		export default {
		    components:{ pickRegions },
		    data(){
		        return {
		            region:[],
		            defaultRegion:['广东省','广州市','番禺区'],
		            defaultRegionCode:'440113'
		        }
		    },
		    computed:{
		        regionName(){
		            // 转为字符串
		            return this.region.map(item=>item.name).join(' ')
		        }
		    },
		    methods:{
		        // 获取选择的地区
		        handleGetRegion(region){
		            this.region = region
					var st=this.region[0].name+this.region[1].name+this.region[2].name;
					// for(let i=0;i< this.region.length;i++){
					// 	console.log( )
					// }
					console.log(st);
					
		        }
		    }
		}
	
	
</script>

<style>
	.liandong{
		display: flex;
	}
	.zixing{
		width: 400upx;
		height: 30upx;
		background-color: #efefef;
	}
	..zixing input{
		border: 1rpx solid black;
	}
</style>
