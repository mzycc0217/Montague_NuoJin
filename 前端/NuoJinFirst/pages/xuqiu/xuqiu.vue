<template>
	<view>
        <view class="nj_header" style="display: flex;">
		      <view class="uni-title uni-common-pl ct">需求类型选择:</view>
		        <view class="uni-list">
		            <view class="uni-list-cell">
		               
		                <view class="uni-list-cell-db">
		                    <picker @change="bindPickerChange" :value="id" mode="selector"
							:range="arryObject" :range-key="'name'" >
		                      	<view>{{arryObject[index]['name']}}</view>
		                    </picker>
		                </view>
		            </view>
		        </view>	  
		</view>
		
		
		<view class="cu-form-group">
			<view class="title">需求名称</view>
			<input placeholder="请输入" name="input" v-model="form.name"></input>
		</view>
		<view class="cu-form-group align-start">
			<view class="title">需求描述</view>
			<textarea maxlength="-1" :disabled="modalName!=null" v-model="form.miaoshu" placeholder="请输入需求内容描述"></textarea>
		</view>
		
	<view class="cu-bar bg-white margin-top">
		<view class="action">
			图片上传
		</view>
		<view class="action">
			{{imgList.length}}/1
		</view>
	</view>
	<view class="cu-form-group">
		<view class="grid col-4 grid-square flex-sub">
			<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
			 <image :src="imgList[index]" mode="aspectFill"></image>
				<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
					<text class='cuIcon-close'></text>
				</view>
			</view>
			<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
				<text class='cuIcon-cameraadd'></text>
			</view>
		</view>
	</view>
		
		<view class="cu-form-group margin-top">
			<!-- <view style="font-size: 20upx; margin-left: 30upx;margin-top: -350upx;"> 请输入内容</view> -->
			<textarea maxlength="-1" :disabled="modalName!=null" v-model="form.content" placeholder="请输入内容" style="height: 360upx;"></textarea>
		</view>
		
		
		<view class="padding flex flex-direction" @tap="tijioa">
		
			<button class="cu-btn bg-blue margin-tb-sm lg">提交</button>
		</view>
		
	</view>
</template>

<script>
	 
	export default{
		data(){
			return{   
				//xianshi:false,
				  title: 'picker',
				index: 1,
				    arryObject: [{
				                              id: 1,
				                              name: '行业新闻' ,
											  
				                          },
				                          {
				                             id: 2,
				                              name: '行业消息',
				                             
				                          },
				                          {
				                             id: 3,
				                              name: '人事需求'
				                          },
				                          {
				                            id: 4,
				                              name: '食材需求'
				                          },
				                          {
				                             id: 5,
				                              name: '餐饮器件需求'
				                          },
				                       
				                      ],
				 
				imgList: [],
				modalName: null,
				textareaAValue: '',
				textareaBValue: '',
				form:{
					name:"",
					miaoshu:"",
					xuanze:"",
					content:""
				},
			
			}
		},
		onLoad() {
			/* this.quanxian(); */
		},
		methods:{
			
		
			
			DelImg(e) {
				uni.showModal({
					title: '小姐姐小哥哥',
					content: '确定要删除这张图片嘛？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			
			
			
			  bindPickerChange: function(e) {
				  this.index = e.target.value
				  this.form.xuanze=this.arryObject[e.detail.value].id;
			},
			tijioa(){
				let that =this;
				
				console.log("2")
			if(that.form.name == "" ||that.form.content == "" || that.form.miaoshu == "" || that.form.xuanze == "" || that.imgList==[]){
				console.log("1")
				uni.showToast({
				    title: '请填写必要信息',
				    duration: 2000,
					icon:"none"
				});
			}	
			else
			{
				 const token = uni.getStorageSync('token');
				 uni.uploadFile({
				     url : 'http://localhost:58793/Api/Home/content',
				     filePath: this.imgList[0],
					
					 fileType:'image',
				     name: 'file',
					   header:{
						   
						   "Content-Type": "multipart/form-data",
					   "token":token
					   },

				     formData: {
				     News_Title:that.form.name,
				 	News_Content:that.form.content,
				     News_Describe:that.form.miaoshu,
				     News_Type_ID:that.form.xuanze
				     },
				     success: function (uploadFileRes) {
				    
					  that.form.name="",
					  that.form.content="",
					  that.form.miaoshu="",
					  
					 that.imgList=[]
					 }
				    });
		}
			 },
			//上传图片
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths);
							 // const uploadTask = uni.uploadFile({
							 // url : '',
							 //      filePath: res.tempFilePaths[0],
							 //      name: 'file',
							 //      formData: {
							 //       'user': 'test'
							 //      },
							 //      success: function (uploadFileRes) {
							 //       console.log(uploadFileRes.data);
							 //      }
							 //     });
						} else {
							this.imgList = res.tempFilePaths
						};
						console.log(this.imgList);
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
		}
	}
</script>

<style>
	.nj_header{
		background-color: white;
		width: 100%;
		height: 100upx;
		margin-bottom: 5upx;
		line-height: 100upx;
	}
	.ct{
		font-size: 30upx;
		margin-left: 30upx;
		line-height: 100upx;
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
</style>
