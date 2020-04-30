<template name="Nj_header">
	<view>
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="item.News_Type_ID==TabCur?'text-green cur':''" v-for="(item,index) in list" :key="index" @tap="tabSelect(item.News_Type_ID)" :data-id="index">
				{{item.News_Type_Name}}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"Nj_header",
		data() {
			return {
				TabCur: 1,
				scrollLeft: 0,
				id:"",
				list:[]
			};
		},
		
	
	methods:{
		tabSelect(id) {
		this.TabCur =id;
	    this.$parent.requeslist(this.TabCur);

		},	
		requests(){
			let that=this;
			uni.request({
				url:"http://localhost:58793/Api/Index/Header",
				method:"GET",
				success:function(res){
				
					that.list=res.data;
				}
			})
		}
	},
	mounted(){
		this.requests();
		  this.$parent.requeslist(this.TabCur);
	}	
	}
</script>

<style>

</style>
