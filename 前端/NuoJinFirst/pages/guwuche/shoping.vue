<template>
	<view>
		<!--顶部-->
		<view class="caozuo">
		<view>
			<checkbox-group @change="changeAll" class="flex align-center">
			<checkbox :checked="checked" :class="checked==true?'checked':''" class="round sx-check"></checkbox>全选
			</checkbox-group>
			</view>
        <view>
		<view class="cu-btn sm round" @tap="DeletAll"><text class="cuIcon-deletefill"></text>删除</view>
		</view>
		</view>
		<!--上面结束-->
		<view class="cart-content">
			<view v-for="(p,i) in lists" :key="i" class="cart-item bg-white">
				<view class="flex align-center">
					<checkbox-group ><!-- @change="changeAll" class="flex align-center" -->
					<checkbox @tap="changchked(i)" :checked="p.Order_Checked" :class="p.Order_Checked==true?'checked':''" class="round sx-check"></checkbox>
					</checkbox-group>
					<image :src="getimage(p.Shop_Information_image)"></image>
				</view>
				<view class="cart-Ycounten" style="width: 450upx;">
					<view class="cart-title">{{p.Shop_Information_Name}}</view>
					
					<view>
						<view class="text-gray">类型：{{p.Shop_Type_Name}}</view>
					   <view class="flex justify-between">
						   <view class="text-red text-bold text-lg">￥{{p.Shop_Information_Price}}</view>
						   <view  style="margin-right: 10upx; color: #797979; display: flex;"><view class="icon iconfont icon-multiplied_by_the" style="margin-top: 7upx; font-size: 20upx;"></view> {{p.Order_Count}} </view>
					      <!-- <uni-number-box @change="changshuliang" v-model="p.Order_Count" style="margin-left: 35upx;" :min="1" :max="9" ></uni-number-box>
						  --></view> 
					</view>
				
				</view>
			</view>
		</view>
		<!--下面-->
		<view class="heji flex justify-between align-center">
			<view style="font-size:100% ;">合计<text class="text-orange">￥{{sum}}</text></view>
			<view>
				<view class="cu-btn bg-gradual-red round">去结算</view>
			</view>
		</view>
		<!--下面结束-->
	</view>
	
</template>

<script>
	
	export default{
		data(){
			return{
				checked:true,
				// Order_Checked:true,
				lists:[]
			}
		},
		onLoad(){
			this.getdata()
			// this.$store,dispatch("getdata")
			// console.log(this.$store.state.lists)
			// this.lists=this.$store.state.lists;
			
		},
		//计算属性
		computed:{
			//合计
			sum(){
				var he=0;
					
				this.lists.forEach(p=>{
					console.log(p.Order_Checked);
					if(p.Order_Checked==true){
						he+=p.Order_Count*p.Shop_Information_Price
					}
				});
				return he.toFixed(2);
			}
		},
		methods:{
			
			//全选-删除
			DeletAll(){
				
				//过滤掉选中的数据
					var t=this.lists.filter(s=>{
					return s.Order_Checked
				})
				//取出选中数据的ID放在数组中
				var dellid=[];
				
			     for(let i=0; i<t.length;i++)
				 {
					 
					 console.log(t[i].Order_Id);
				     dellid.push(t[i].Order_Id)
					 
				 }
			    console.log(dellid)
				uni.request({
					url:this.url+'Deafalut/DelShopping',
					method:"POST",
					data:dellid,
					success:(res)=> {
							this.lists=this.lists.filter(p=>{
					        return !p.Order_Checked;
							
				})
					}
				})
				
				
				
				
			
			
			},
			
			
			//全选
			changeAll(e){
				//this.checked==true?this.lists.forEach(p=>{p.checked=false}):this.lists.forEach(p=>{p.checked=true})
				this.lists.forEach(p=>{
					p.Order_Checked=!this.checked;
				})
				this.checked?this.checked=false:this.checked=true
			},
			//单选
			changchked(index){
				
				this.lists[index].Order_Checked=this.lists[index].Order_Checked?false:true;
                //过滤看有没有没没有被选中的
				//filter默认返回的是一个数组
				
				var selected=this.lists.filter(p=>{return !p.Order_Checked});
				//当数组长度为0,就是全部选中
				selected.length==0?this.checked=true:this.checked=false;

			},
			
			//numberbox的@change属性，可以传给value值
		// changshuliang(val){
		// 	console.log(val)
		// 	 val=parseInt(val)
		// 	 //当其中的numboxwei中的value值为零时
		// 	if(val==0){
		// 		//就在数组里面找出num为0的数据
		// 		var thisdata=this.lists.find(p=>{
		// 			return p.Order_Count==0
		// 		})
				
		// 		var its=this;
		// 		uni.showModal({
		// 			confirmText:"是的",
		// 			content:"您确定要把它移除购物车",
		// 			title:"提示",
		// 			success(res){
		// 				if(res.confirm){
		// 					//过滤掉value值为0的数组
		// 				its.lists=its.lists.filter(p=>{
		// 					return p.Order_Id != thisdata.Order_Id;
		// 				})
		// 				}
						
		// 			}
		// 		})	
				
		// 	}
			
		// },
			getdata(){
				// const token = uni.getStorageSync('token');
				uni.request({
					url:this.url+"Deafalut/Shopping",
					method: 'GET',
					//header:{'token':token},
					success: (res) => {
			    	console.log("sss")
					this.lists=res.data;
					console.log(res.data)
					}
				})
				
				// var data=[{
				// 	id:2,
				// 	img:"../../static/moremtouxing/touxiang.png",
				// 	title:"华为mate30.0",
				// 	type:"手机",
				// 	price:3999.9,
				// 	num:3,
				// 	checked:true
				// },{
				// 	id:3,
				// 	img:"../../static/moremtouxing/touxiang.png",
				// 	title:"华为mate30.0111111111111111111111111",
				// 	type:"手机",
				// 	price:3999.9,
				// 	num:2,
				// 	checked:true
				// },
				// {
				// 	id:4,
				// 	img:"../../static/moremtouxing/touxiang.png",
				// 	title:"华为mate30.0",
				// 	type:"手机",
				// 	price:3999.9,
				// 	num:4,
				// 	checked:true
				// }];
				// this.lists=data;
			},
			getimage:function(imagepa) {
				
					return "http://lulumeng.qicp.vip" + imagepa;
				},
			
			
		},
		// components:{uniNumberBox}
	}
</script>

<style>
	.sx-check{
		transform: scale(0.7);
	}
	.cart-Ycounten{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 8upx;
		padding-bottom: 8upx;
	}
.caozuo{
	  position: fixed;
	  top: 0upx;
	 /*#ifdef H5*/
	  top:96upx;
	  /*#endif*/
      background-color: white;
	  display: flex;
	  justify-content: space-between;
	  height: 80upx;
	  width: 750upx;
	  align-items: center;
	  padding-left: 30upx;
	  padding-right: 30upx;
}
.heji{
	position: fixed;
	
	bottom: 0upx;
	/*#ifdef H5*/
	/* bottom: 60upx; */
	/*#endif*/
	width: 750upx;
	height: 160upx;
	background-color: white;
	padding-left: 30upx;
	padding-right: 30upx;
	
}
.cart-content{
	margin-top: 100upx;
	margin-bottom: 200upx;
}
.cart-item{
	display: flex;
	justify-content: space-between;
	padding: 20upx 20upx 20upx 20upx;
	margin-top: 20upx;
}
.cart-item image{
	width: 200upx;
	height: 200upx;
	margin-left: -30rpx;
;
}
.cart-title{
	font-size: 110%;
	font-weight: bold;
	width: 300upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
