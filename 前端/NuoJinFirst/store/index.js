import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store =new Vuex.Store({
  state: {
	  user_id:'',
	  jiaoseID:'',
	  
	  lists:[],
	  carts:[
		  
		  
		  {id:1}
	  ]
  },
  mutations: {
	INIT_cRATS(state,data){
		state.lists=data;
	}
  },
  actions: { 
	  init_Carts(context){
		  uni.request({
		  	url:this.prototype.url +"Deafalut/Shopping",
		  	method: 'GET',
			success: (res) => {
				  context.commit("INIT_cRATS",res.data)
				}
			})
		
		  
	  },
	  
	  
	  getdata(Content){
	  	// const token = uni.getStorageSync('token');
	  	uni.request({
	  		url:this.prototype.url +"Deafalut/Shopping",
	  		method: 'GET',
	  		//header:{'token':token},
	  		success: (res) => {
				context.commit("INIT_cRATS",res.data)
	      	console.log("sss")
	  		this.lists=res.data;
	  		console.log(res.data)
	  		}
	  	})
		}
  },
  modules: {
  }
})
 export default store