// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import axios from 'axios'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI);

//echarts
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;
Vue.prototype.$http = axios;



//引入全局css
import '../static/css/reset.css'
import '../static/css/index.css'
import '../static/css/header.css'
import '../static/css/footer.css'
// 字体图标css
import 'font-awesome/css/font-awesome.css'

/*//创建实例，配置默认项
var instance = axios.create({
  baseURL:'https://beta.qinlinad.com/QADN/'
});
//所有请求在超时前等待2.5s
instance.defaults.timeout = 2500;*/

//全局配置
axios.defaults.baseURL = 'https://beta.qinlinad.com/';
// axios.defaults.baseURL = 'https://www.qinlinad.com/';
Vue.prototype.Map = '/MapAPI'
Vue.prototype.QZhike ='/QZhike';
Vue.prototype.QKuyun ='/QinlinKuyun-API';

Vue.prototype.UCAPI = '/UCAPI'
Vue.prototype.Media = '/mediaService/media'
Vue.prototype.Advertisement = '/advertisement'
//经营分析
Vue.prototype.Count = '/Count'
Vue.prototype.QADNAPI = '/QADNAPI'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

// 无忧地图
// Vue.prototype.wuYouMap = 'https://www.dituwuyou.com/qinlin/embed?mid=FPcrNHyq3xXFZDbqlTyHKA&token=fp3nxsKCYZzOSnU0KosEq0GA1o1qcKh5XLA&mapid=' // 正式服
Vue.prototype.wuYouMap = 'https://wsopbodv.dituwuyou.com/qinlin/embed?mid=_J6aWeV128gkhVn54AfWIw&token=SvcvtTqpktwPUb8dbu_jx0602nj_4tF-is8&mapid='  // 测试服
// 正式服
// Vue.prototype.qadnUrl = 'https://www.qinlinad.com'
//测试服
Vue.prototype.qadnUrl = 'https://beta.qinlinad.com'
Vue.use(ElementUI);

console.log('test');


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
