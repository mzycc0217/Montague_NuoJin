<template>
	<view>
		   <easy-upload
		    :dataList="imageList" uploadUrl="http://localhost:58793/Api/Fabu/Contents" :types="video"
		    deleteUrl='http://localhost:3000/upload' :uploadCount="1"
		    @successImage="successImage" @successVideo="successvideo"
		    ></easy-upload>
	  
	</view>
</template>

<script>
	  import easyUpload from '@/components/easy-upload/easy-upload.vue'
 	export default{
	 components:{
	        easyUpload
	    },
	
		data(){
			return{
				
			}
		},
		onLoad() {
			 
		},
		methods:{
	
		}
		}
	
</script>

<style>
</style>
