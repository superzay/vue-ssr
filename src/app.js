
//app.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store/index.js'
import { sync } from 'vuex-router-sync'
import {BASE_URL} from './js/config.js'
import {apiPost} from './js/http.js'

//vue原型挂载
Vue.prototype.BASE_URL=BASE_URL;
Vue.prototype.apiPost=apiPost;

//全局混合
Vue.mixin({
	mounted() {
		if(!window.__INITIAL_STATE__ && this.$options.asyncData) {
			this.$options.asyncData({
				store: this.$store,
				router: this.$router,
				rootVm:this.$root,
			})
		}
	}
})

export function createApp(cookie) {
	//如果是服务器端，挂载cookie
	if(TERMINAL==='server'){
		Vue.prototype.cookie=cookie
	}
	// 创建 router 实例
	const router = createRouter()
	const store = createStore();
	sync(store, router)
	const app = new Vue({
		// 注入 router 到根 Vue 实例
		router,
		store,
		render: h => h(App)
	})
	// 返回 app 和 router
	return {
		app,
		router,
		store
	}
}