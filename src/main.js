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


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
