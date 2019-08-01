// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false;

// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import $ from 'jquery'
Vue.use(ElementUI);

// MintUI
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI);

//echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

// axios
import axios from 'axios'
Vue.prototype.$http = axios;
axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// 全局变量
import { apiVar } from './utils/config.js'
Vue.prototype.apiVar = apiVar;


//引入全局css
import '../static/css/reset.css'
import '../static/css/public.css'
import '../static/css/index.css'
import '../static/css/header.css'
import '../static/css/footer.css'
// 字体图标css
import 'font-awesome/css/font-awesome.css'


router.beforeEach((to, from, next) => {
	// 加上mta
	console.log(process.env, 'process.env---');
	let env = process.env.EVN_CONFIG;
	if(env = 'test'){
		var _mtac = {"senseQuery":1};
		(function() {
			var mta = document.createElement("script");
			mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
			mta.setAttribute("name", "MTAH5");
			mta.setAttribute("sid", "500692127");
			mta.setAttribute("cid", "500692130");
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(mta, s);
		})();
	}else if(env = 'gray'){
		var _mtac = {"senseQuery":1};
		(function() {
			var mta = document.createElement("script");
			mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
			mta.setAttribute("name", "MTAH5");
			mta.setAttribute("sid", "500692128");
			mta.setAttribute("cid", "500692131");
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(mta, s);
		})();
	}else if(env == 'prod'){
		var _mtac = {"senseQuery":1};
		(function() {
			var mta = document.createElement("script");
			mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
			mta.setAttribute("name", "MTAH5");
			mta.setAttribute("sid", "500692129");
			mta.setAttribute("cid", "500692132");
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(mta, s);
		})();
	}
	next();
});


/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
});
