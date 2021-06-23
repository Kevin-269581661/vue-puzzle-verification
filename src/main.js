// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import {router} from './router'
import sessFun from './commonFun/sessFun.js';
import directives from "./commonFun/directives";
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.config.productionTip = false;

// ElementUI
import ElementUI from 'element-ui'
import '../static/css/element-variables.scss'
// import 'element-ui/lib/theme-chalk/index.css'

// MintUI
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import 'default-passive-events'
import App from './App'
Vue.use(ElementUI);
Vue.use(MintUI);
Vue.use(SlideVerify);

//echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

import Viser from 'viser-vue'
Vue.use(Viser)

// axios
import axios from 'axios'
axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// 全局变量
import { apiVar } from './utils/config.js'
Vue.prototype.apiVar = apiVar;
Vue.filter('uTypeToText', function (uType) {
	return { 'SA': '系统管理员','SM': '超级管理员', 'OP': '运营', 'MD': '媒介','BD': '销售','AD': '广告主', 'EP': '工程人员', 'DEV': '开发人员', 'DEV_ASSET': '资产人员', 'DEV_DIRECTOR': '开发总监' }[uType]
})
Vue.filter('moneyFormat', function (value, prefix='', decimal=2) {
	if(value==='' || value===undefined || value===null) {
		return '--'
	} else {
		value = value||0 
	}
	try {
		return prefix+value.toFixed(decimal).toString().replace(/(\d)(?=(?:(\d{3})+$)|(\d{3})+\.\d*$)/g, '$1,') // 将整数部分逢三一断
	} catch (error) {
		console.error(error)
		return value
	}
})

// 全局事件总线
Vue.prototype.$EventBus = new Vue()
//引入全局css
import '../static/css/reset.css'
import '../static/css/public.css'
import '../static/css/index.css'
import '../static/css/header.css'
import '../static/css/footer.css'
// 字体图标css
import 'font-awesome/css/font-awesome.css'
// 引入地图聚合js
import './components/common/map/MarkerClusterer.js'


router.beforeEach((to, from, next) => {
	// 加上mta
	console.log(process.env, 'process.env---');
	let env = process.env.EVN_CONFIG;
	var _mtac = {"senseQuery":1};
	(function() {
		var mta = document.createElement("script");
		mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
		mta.setAttribute("name", "MTAH5");
		if(env == 'test'){
			mta.setAttribute("sid", "500692127");
			mta.setAttribute("cid", "500692130");
		}else if(env == 'gray'){
			mta.setAttribute("sid", "500692128");
			mta.setAttribute("cid", "500692131");
		}else if(env == 'prod'){
			mta.setAttribute("sid", "500692129");
			mta.setAttribute("cid", "500692132");
		}
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(mta, s);
	})();
    // 路由发生变化修改页面title
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = 'QADN'
    }
	next();
});

// axios.defaults.withCredentials = true;
axios.interceptors.request.use(
	config => {
		let sessionStr = sessionStorage.getItem('session_data');
		let session = sessionStr ? JSON.parse(sessionStr) : '';
		let uid = session ? session.uID: '';
		let token = session ? session.token : '';
		if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers['token'] = token;
			config.headers['uid'] = uid;
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});

// 拦截响应
axios.interceptors.response.use(
	response => {
		let res = response.data;
		if(res.SysCode == 100302){
			sessionStorage.clear();
			sessFun.loginTimeout();
		}
		return response;
	},
	err => {
		console.log(err);
		if (err.response) {
			switch (err.response.status) {
				case 401:
					sessionStorage.clear();
					router.replace({
						path: '/login',
					})
				break;
			}
		}
		return Promise.reject(err)
	}
);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
});
