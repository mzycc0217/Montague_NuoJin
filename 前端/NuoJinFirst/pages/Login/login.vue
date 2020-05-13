<template>
	<view>
		<view style="height: 10upx;"></view>
		<view style="margin-top: 60upx; " class="flex flex-direction align-center">
			<image class="Logo" src="../../static/Logo/logo.png"></image>
			<view style="margin-top: 30upx;color: grey;">人间四月天，你不来谁来</view>
		</view>
		<!--账号密码区域-->
		<view>
			<view class="input_f">
				<input v-model="form.phone"  placeholder="用户账号/邮箱/手机号" class="log_input"/>
			</view>
			<view class="input_f flex align-center">
				<input v-model="form.password" :password="true"  :placeholder="status==0?'请输入密码':'请输入验证码'"  class="log_input"/>
			     <button :disabled="selectclick" @tap="yanzhengma" class="cu-btn bg-orange" v-if="status==1">{{yzmtext}}</button>
			</view>
		</view>
		<!--登录按钮，输入部分-->
		<view style="margin-top: 40upx;" class="flex justify-center">
			<button class="bg-gradual-blue" style="width: 650upx;" @tap="login">登陆</button>			
		</view>
		<!--忘记密码和注册-->
		<view class="flex justify-between input_f" style="margin-top: 30upx;">
			<text>忘记密码？</text>
			<text>新用户注册</text>
		</view>
		<!--忘记密码和注册结束-->
		<!--分割线-->
		<view class="flex justify-between align-center" style="margin-top: 40upx;">
			<view class="line"></view>
			<view style="color: gray;">其它登陆方式</view>
			<view class="line"></view>
		</view>
		<!--分割线结束-->
		<!--快捷按钮登陆-->
		<view class="flex justify-around" style="margin-top: 40upx;">
			<view class="flex flex-direction align-center justify-center">
				<image class="wxlogn" style="height: 53upx; width: 55upx;" src="../../static/icon/chart.png"></image>
				<view style="margin-top: 10upx;">微信登陆</view>
				</view>
				<view @tap="changstars" class="flex flex-direction align-center justify-center" >
				<image class="wxlogn" :src="status==0?'../../static/icon/shouji.png':'../../static/icon/phone.png'"></image>
				<view style="margin-top: 10upx;" >{{status==0?'验证码':'密码'}}登陆</view>
				</view>
		</view>
		<!--快捷按钮登陆结束-->
		<!--固定的版权声明-->
		<view style="position: fixed; bottom: 10upx; color: gray; text-align: center; width: 750upx;">
			登陆代表您已同意<text class="text-blue">【萌死人协议】</text>
		</view>
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				yzmtext:"获取验证码",
				selectclick:false,//点击倒计时
				status:0,//当0是密码，1是验证码
				form:{
					phone:"",
					password:""
					}
			}
		},
	
	    methods:{
			
			
			yanzhengma(){
				var its =this;
				if(this.form.phone.length!=11){
					uni.showToast({
						icon:"none",
						title:"请输入正确的手机号"
					})
					return;
				}
				if(this.yzmtext=="获取验证码")
				{
					
				this.selectclick=true;
					
				}
				else{
					return
				}
				
				var secods=5;
			var jsshiqi=setInterval(()=>{
					secods--;
					its.yzmtext=secods+"秒后重发";
					if(secods<=0){
						its.yzmtext="获取验证码";
						its.selectclick=false;
						clearInterval(jsshiqi);
					}
				},1000)
				},
			
			changstars(){
				
				this.status=this.status==0?1:0;	
			},
			
			login(){
				 
				if(this.form.phone.length>=2&&this.form.password>=6)
				{
				uni.request({
					url:this.url+'Login/login',
					method:'POST',
				
					data:{
						User_Name:this.form.phone,
						User_PassWord:this.form.password
						},
						method:"POST",
					success: (res) => {
					if(res.data.Code=="200"){
					
				
					//储存tokenas
					uni.setStorageSync("token",res.data.Data)
					uni.setStorageSync("images",res.data.images)
					uni.setStorageSync("name",res.data.LoginName)
					uni.navigateTo({
						url:'../xuanqujiaose/xuanse',
					})
				}
					else
					{
						uni.showToast({
							icon:"none",
							title:"登陆失败"
						})
				}
					}
					
				})
				}
				else{
					uni.showToast({
						icon:"none",
						title:"账号密码格式错误"
					})
				
				}
			}
		}
	}
</script>

<style>
	.Logo{
		width: 200upx;
		height: 200upx;
	}
	.log_input{
		height: 130upx;
		border-bottom: 1upx solid #DDDDDD;
		flex-grow: 1;
	}
	.input_f{
		padding-left: 40upx ;
		padding-right: 40upx;
	}
	.line{
		height: 1upx;
		background-color: #DDDDDD;
		flex-grow: 1;
	}
	.wxlogn{
		width: 65upx;
		height: 65upx;
		
	}
</style>

