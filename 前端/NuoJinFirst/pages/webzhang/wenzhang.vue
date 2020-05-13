<template>
	<view>
       
		
		
		<view class="cu-form-group">
			<view class="title">文章标题</view>
			<input placeholder="请输入" name="input" v-model="form.name"></input>
		</view>
		<view class="cu-form-group align-start">
			<view class="title">文章描述</view>
			<textarea maxlength="-1" :disabled="modalName!=null" v-model="form.miaoshu" placeholder="请输入需求内容描述"></textarea>
		</view>
		
	<view class="uni-list list-pd">
		<view class="uni-list-cell cell-pd">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">点击可预览选好的图片</view>
					<view class="uni-uploader-info">{{imageList.length}}/1</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList" :key="index">
							<view class="uni-uploader__file">
								<view class="icon iconfont icon-shanchu" @tap="delimage(index)"></view>
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
							</view>
						</block>
						<view class="uni-uploader__input-box">
							<view class="uni-uploader__input" @tap="chooseImage"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
		
		<view class="cu-form-group margin-top">
			<!-- <view style="font-size: 20upx; margin-left: 30upx;margin-top: -350upx;"> 请输入内容</view> -->
			<textarea maxlength="-1" :disabled="modalName!=null" v-model="form.content" placeholder="请输入文章内容" style="height: 360upx;"></textarea>
		</view>
		
		
		<view class="padding flex flex-direction" @tap="tijioa">
		
			<button class="cu-btn bg-blue margin-tb-sm lg">提交</button>
		</view>
		<!--弹出公告-->
		<uni-popup :show="showpopup" position="middle" mode="fixed" @hidePopup="hidePopup">
			<view class="gonggao">
				<view class="u-f-ajc">
					<image src="../../static/common/addinput.png" mode="widthFix"></image>
				</view>
				<view>1.涉及黄色，政治，广告及骚扰信息</view>
				<view>2.涉及黄色，政治，广告及骚扰信息</view>
				<view>3.涉及黄色，政治，广告及骚扰信息</view>
				<view>4.涉及黄色，政治，广告及骚扰信息</view>
				<button type="default" @tap="hidePopup">朕知道了</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import permision from "@/common/permission.js"
	import uniPopup from "../../components/uni-popup/uni-popup.vue";
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	 
	export default{
		components:{
			uniPopup
		},
		data(){
			return{   
				showpopup:true,
				  title: 'picker',
				index: 1,
				
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				
				
				modalName: null,
				textareaAValue: '',
				textareaBValue: '',
				form:{
					name:"",
					miaoshu:"",
					
					content:""
				},
			
			}
		},
		onLoad() {
			/* this.quanxian(); */
		},
		methods:{
			hidePopup(){
				this.showpopup=false;
				
			},
			
			  bindPickerChange: function(e) {
				  this.index = e.target.value
				  this.form.xuanze=this.arryObject[e.detail.value].id;
			},
			tijioa(){
				let that =this;
				
				console.log("2")
			if(that.form.name == "" ||that.form.content == "" || that.form.miaoshu == ""  || that.imgList==[]){
				console.log("1")
				uni.showToast({
				    title: '请填写必要信息',
				    duration: 2000,
					icon:"none"
				});
			}	
			else
			{
				 //const token = uni.getStorageSync('token');
				 uni.uploadFile({
				     url : this.url+'Fabu/Content',
				     filePath: this.imageList[0],
					  
					 fileType:'image',
				     name: 'file',
					   header:{
						   
						   "Content-Type": "multipart/form-data",
					  // "token":token
					   },

				     formData: {
				     wenzhang_title:that.form.name,
				 	wenzhang_Content:that.form.content,
				     wenzhang_Describe:that.form.miaoshu,
				  
				     },
				     success: function (uploadFileRes) {
				    
					  that.form.name="",
					  that.form.content="",
					  that.form.miaoshu="",
					  
					 that.imageList=[]
					 }
				    });
		}
		},	
		
		//删除图片
		delimage(index){
			uni.showModal({
				title:"提示",
				content:"确定要删除这张图片吗",
				success:(res)=>{
					if(res.confirm){
						this.imageList.splice(index,1)
					}
				}
			})
			},
			//上传图片
		chooseImage: async function() {
			// #ifdef APP-PLUS
			// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
			if (this.sourceTypeIndex !== 2) {
				let status = await this.checkPermission();
				if (status !== 1) {
					return;
				}
			}
			// #endif
		
			if (this.imageList.length === 1) {return;}
			uni.chooseImage({
				sourceType: sourceType[this.sourceTypeIndex],
				sizeType: sizeType[this.sizeTypeIndex],
				count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
				success: (res) => {
					this.imageList = this.imageList.concat(res.tempFilePaths);
				},
				fail: (err) => {
					// #ifdef APP-PLUS
					if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
						this.checkPermission(err.code);
					}
					// #endif
					// #ifdef MP
					uni.getSetting({
						success: (res) => {
							let authStatus = false;
							switch (this.sourceTypeIndex) {
								case 0:
									authStatus = res.authSetting['scope.camera'];
									break;
								case 1:
									authStatus = res.authSetting['scope.album'];
									break;
								case 2:
									authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
									break;
								default:
									break;
							}
							if (!authStatus) {
								uni.showModal({
									title: '授权失败',
									content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting()
										}
									}
								})
							}
						}
					})
					// #endif
				}
			})
		},
		
		previewImage: function(e) {
			var current = e.target.dataset.src
			uni.previewImage({
				current: current,
				urls: this.imageList
			})
		},
		}
		
	}
</script>

<style>
	.gonggao{
		width: 500upx;
	}
	.gonggao image{
		width: 75%;
		margin-bottom: 20upx;
	}
	.gonggao button{
		margin-top: 20upx;
		background: #FFE934;
		color: #171606;
	}
	.nj_header{
		background-color: white;
		width: 100%;
		height: 100upx;
		margin-bottom: 5upx;
		line-height: 100upx;
	}
	.ct{
		font-size: 30upx;
		margin-left: 4upx;
		line-height: 100upx;
		width: 213rpx;
		
	}
	.tex_height{
		height: 500upx;
	}
	.xuanzeqi{
		display: flex;
	}
	.input-xuanzeqi{
		border: 1px solid black;
	}
	.cs
	{
		margin-left: 9rpx;
		justify-content: center;

	}
	.cell-pd {
		padding: 22rpx 30rpx;
	}

	.list-pd {
		margin-top: 50rpx;
	}
	.uni-uploader__file{
		position:relative;
	}
	.icon-shanchu{
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
		background: #333333;
		color: #FFFFFF;
		padding: 2upx 10upx;
		border-radius: 10upx;
	}
	
		
	
</style>
