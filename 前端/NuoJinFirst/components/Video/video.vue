<template name="listVideo">
	<view>
		
   <view class="index-list animated fadeIn fast">
	   <view class="jigao">
		<view class="index-list1 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<image @tap.stop="openSpace" src="../../static/Logo/logo.png" 
				mode="widthFix" 
				lazy-load></image>
				昵称
			</view>
			<view class="u-f-ac" @tap="guanzhu" style="margin-left: 208px;">
				<view class="icon iconfont icon-zengjia"></view>关注
			</view>
		</view>
		<view class="index-list2" @tap="opendetail">标标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题题</view>
		<view class="index-list3 u-f-ajc" @tap="opendetail">
			
				<!-- 图片 -->
				<video src="http://localhost:8002/Video/1.mp4"
				 style="height: 350upx;" 
				d></video>
		
			<!-- 视频 -->
			<!-- <template v-if="item.type=='video'">
				<view class="icon iconfont icon-bofang index-list-play"></view>
				<view class="index-list-playinfo">
					111次播放 222
				</view>
			</template> -->
		</view>
		<view class="index-list4 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<view class="u-f-ac" :class="{'active':(item.infonum.index==1)}"
				@tap="caozuo('ding')">
					<view class="icon iconfont icon-icon_xiaolian-mian"></view>
					10000
				</view>
				<view class="u-f-ac" :class="{'active':(item.infonum.index==2)}"
				@tap="caozuo('cai')">
					<view class="icon iconfont icon-kulian"></view>
					800
				</view>
			</view>
			<view class="u-f-ac" style="margin-left: 275rpx;">
				<view class="u-f-ac">
					<view class="icon iconfont icon-pinglun1"></view>
					评论
				</view>
				<view class="u-f-ac">
					<view class="icon iconfont icon-zhuanfa"></view>
					转发
				</view>
			</view>
		</view>
		</view>
		
		
		 <view class="jigao">
		<view class="index-list1 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<image @tap.stop="openSpace" src="../../static/Logo/logo.png" 
				mode="widthFix" 
				lazy-load></image>
				昵称
			</view>
			<view class="u-f-ac" @tap="guanzhu" style="margin-left: 208px;">
				<view class="icon iconfont icon-zengjia"></view>关注
			</view>
		</view>
		<view class="index-list2" @tap="opendetail">标标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题题</view>
		<view class="index-list3 u-f-ajc" @tap="opendetail">
			
				<!-- 图片 -->
				<video src="http://localhost:8002/Video/1.mp4"
				 style="height: 350upx;"  @error="videoErrorCallback" :danmu-list="danmuList"
				  enable-danmu danmu-btn controls
				></video>
		
			<!-- 视频 -->
			<!-- <template v-if="item.type=='video'">
				<view class="icon iconfont icon-bofang index-list-play"></view>
				<view class="index-list-playinfo">
					111次播放 222
				</view>
			</template> -->
		</view>
		<view class="index-list4 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<view class="u-f-ac" :class="{'active':(item.infonum.index==1)}"
				@tap="caozuo('ding')">
					<view class="icon iconfont icon-icon_xiaolian-mian"></view>
					1000
				</view>
				<view class="u-f-ac" :class="{'active':(item.infonum.index==2)}"
				@tap="caozuo('cai')">
					<view class="icon iconfont icon-kulian"></view>
					200
				</view>
			</view>
			<view class="u-f-ac" style="margin-left: 275rpx;">
				<view class="u-f-ac">
					<view class="icon iconfont icon-pinglun1"></view>
					评论
				</view>
				<view class="u-f-ac">
					<view class="icon iconfont icon-zhuanfa"></view>
					转发
				</view>
			</view>
		</view>
			</view>
		
		
		<view class="index-list1 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<image @tap.stop="openSpace" src="../../static/Logo/logo.png" 
				mode="widthFix" 
				lazy-load></image>
				昵称
			</view>
			<view class="u-f-ac" @tap="guanzhu" style="margin-left: 208px;">
				<view class="icon iconfont icon-zengjia"></view>关注
			</view>
		</view>
		<view class="index-list2" @tap="opendetail">标标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题题</view>
		<view class="index-list3 u-f-ajc" @tap="opendetail">
			
				<!-- 图片 -->
				<video src="http://localhost:8002/Video/1.mp4" 
				 style="height: 350upx;" object-fit="fill"
				d></video>
		
			<!-- 视频 -->
			<!-- <template v-if="item.type=='video'">
				<view class="icon iconfont icon-bofang index-list-play"></view>
				<view class="index-list-playinfo">
					111次播放 222
				</view>
			</template> -->
		</view>
		<view class="index-list4 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<view class="u-f-ac" :class="{'active':(item.infonum.index==1)}"
				@tap="caozuo('ding')">
					<view class="icon iconfont icon-icon_xiaolian-mian"></view>
					10000
				</view>
				<view class="u-f-ac" :class="{'active':(item.infonum.index==2)}"
				@tap="caozuo('cai')">
					<view class="icon iconfont icon-kulian"></view>
					500
				</view>
			</view>
			<view class="u-f-ac" style="margin-left: 275rpx;">
				<view class="u-f-ac">
					<view class="icon iconfont icon-pinglun1"></view>
					评论
				</view>
				<view class="u-f-ac">
					<view class="icon iconfont icon-zhuanfa"></view>
					转发
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
				
			}
		},
		name:"listVideo",
		methods:{
			
			   sendDanmu: function() {
			            this.videoContext.sendDanmu({
			                text: this.danmuValue,
			                color: this.getRandomColor()
			            });
			            this.danmuValue = '';
			        },
			        videoErrorCallback: function(e) {
			            uni.showModal({
			                content: e.target.errMsg,
			                showCancel: false
			            })
			        },
			        getRandomColor: function() {
			            const rgb = []
			            for (let i = 0; i < 3; ++i) {
			                let color = Math.floor(Math.random() * 256).toString(16)
			                color = color.length == 1 ? '0' + color : color
			                rgb.push(color)
			            }
			            return '#' + rgb.join('')
			        }
		}
	}
</script>

<style scoped>
	
	.jigao{
		margin-top: 24upx;
	}
	
.index-list{
	padding: 20upx;
	border-bottom: 1upx solid #EEEEEE;
}
.index-list1>view:first-child{
	color: #999999;
}
.index-list1>view:first-child image{
	width: 85upx;
	height: 85upx;
	border-radius: 100%;
	margin-right: 10upx;
}
.index-list1>view:last-child{
	background: #F4F4F4;
	border-radius:5upx;
	padding: 0 10upx;
}
.index-list2{
	padding-top: 15upx;
	font-size: 32upx;
}
.index-list3{
	position: relative;
	padding-top: 15upx;
}
.index-list3>image{
	width: 100%;
	border-radius: 20upx;
}
.index-list4 view{
	color: #999999;
}
.index-list4{
	padding: 15upx 0;
}
.index-list4>view>view>view,.index-list4>view>view:first-child{
	margin-right: 10upx;
}
.index-list-play{
	position: absolute;
	font-size: 140upx;
	color: #FFFFFF;
}
.index-list-playinfo{
	position: absolute;
	background: rgba(51, 51, 51, 0.72);
	color: #FFFFFF;
	bottom: 8upx;
	right: 8upx;
	border-radius: 40upx;
	font-size: 22upx;
	padding: 0 12upx;
}
.index-list4 .active,.index-list4 .active>view{
	color: #C5F61C;
}
</style>

