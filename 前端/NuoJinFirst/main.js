import Vue from 'vue'
import App from './App'
import store from './store/index.js'
Vue.prototype.url = 'http://localhost:58793/Api/';  
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
