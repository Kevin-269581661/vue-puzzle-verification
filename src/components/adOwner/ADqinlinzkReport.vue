<template>
	<div class="ad_mediaDetail_wrap clearfix">
		<div class="ad_mediaDetail_nav ">
			<p class="clearfix">
				<a href="#" style="color: #999">亲邻智邻</a>
			</p>
		</div>
		<div class="mediaList_wrap">
			<div class="banner">
				<div class="banner-txt">
					<h1>亲邻智邻</h1>
					<p>可视化数据报告提供全面人流管理，包含人流趋势、停留时段、人群特征与偏好等多维筛选分析， 基于地理位置数据，可视化呈现商圈人群分布
					</p>
				</div>
				<div class="banner-img">
					<img src="../../assets/images/qlzk_banner.png" alt="">
				</div>
			</div>
			<div class="tabs">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="全部报告" name="first">
					</el-tab-pane>
					<el-tab-pane label="已通过" name="second"></el-tab-pane>
					<el-tab-pane label="待审核" name="third"></el-tab-pane>
					<el-tab-pane label="被拒绝" name="fourth"></el-tab-pane>
				</el-tabs>
				<div class="cards">
					<el-card class="box-card" v-if="currOrderArr.length" shadow="hover" v-for="(data, index) of currOrderArr" :key="index">
						<div class="text item" @click="toDetail(data)">
							<!-- <router-link :to="{path:'/adOwner/ADqinlinzk'}">
							</router-link> -->
							<div class="card-top">
								<div class="card-top-title">
									<img src="../../assets/images/qlzk_icon.png" alt="">
									<!-- <h3>{{data.apName}}</h3> -->
									<el-tooltip class="item" effect="dark" :content="data.apName" placement="bottom" v-if="data.apName.length>9">
										<h3 title="">{{data.apName}}</h3>
									</el-tooltip>
									<h3 v-else title="">{{data.apName}}</h3>
								</div>
								<div class="card-top-data">
									<ul>
										<li style="font-size: 12px">开通社区</li>
										<li>{{data.rescount||'--'}}
											<span style="font-size: 14px">个</span>
										</li>
									</ul>
									<ul>
										<li style="font-size: 12px">总人流量</li>
										<li style="color: rgba(0,0,0,0.65);">{{priceFormat(data.total)}}</li>
									</ul>
								</div>
							</div>
							<div class="card-bottom">
								<p>状态：
									<span v-if="data.aiState==1" class="green">{{stateToText(data.aiState)}}</span>
									<span v-if="data.aiState==0" class="blue">{{stateToText(data.aiState)}}</span>
									<span v-if="data.aiState==2" class="red">{{stateToText(data.aiState)}}</span>
								</p>
								<p>{{formatTime(data.aiTime)}}</p>
							</div>
						</div>
					</el-card>
					<div v-if="!currOrderArr.length">暂无数据</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import { api } from '../../api/api';
export default {
    name: "ADqinlinzkReport",
    data() {
        return {
			// 登录信息
			sessionData:{},
			orderArr: [
				{
					rescount: 1,
					aiTime: "Aug 27, 2018 7:31:00 PM",
					total: 18427,
					apID: 1,
					aiState: 1,
					ctList: "31,32,33",
					apName: "通过的方案",
					pTime: "Aug 28, 2018 11:08:44 AM"
				},
				{
					rescount: 1,
					aiTime: "Aug 23, 2018 7:28:16 PM",
					total: 18427,
					apID: 89,
					aiState: 2,
					ctList: "31,32,33",
					apName: "拒绝的方案",
				},
				{
					rescount: 3,
					aiTime: "Aug 28, 2018 10:07:05 AM",
					total: 4345,
					apID: 95,
					aiState: 0,
					ctList: "31,32,33",
					apName: "审核中的方案",
					pTime: "Aug 28, 2018 10:19:15 AM"
				}

			],
			currOrderArr: [
				{
					rescount: 1,
					aiTime: "Aug 27, 2018 7:31:00 PM",
					total: 18427,
					apID: 1,
					aiState: 1,
					ctList: "31,32,33",
					apName: "啦啦啦",
					pTime: "Aug 28, 2018 11:08:44 AM"
				},
				{
					rescount: 1,
					aiTime: "Aug 23, 2018 7:28:16 PM",
					total: 18427,
					apID: 89,
					aiState: 2,
					ctList: "31,32,33",
					apName: "啦啦啦",
				},
				{
					rescount: 3,
					aiTime: "Aug 28, 2018 10:07:05 AM",
					total: 4345,
					apID: 95,
					aiState: 0,
					ctList: "31,32,33",
					apName: "审核中的方案",
					pTime: "Aug 28, 2018 10:19:15 AM"
				}
			],
            activeName: "first",
        };
    },
    created() {
		this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
		this.getInitData();
    },
    methods: {
		handleClick() {
			console.log(this.activeName);
			let processArr = [
				{ active : "first", status : 100 },
				{ active : "second", status : 1 },
				{ active : "third", status : 0 },
				{ active : "fourth", status : 2 },
			];
			let selected = '';
			for(let state of processArr){
				if(this.activeName == state.active){
					selected = state.status;
					break;
				}
			}
			let result = [];
			if(selected==100){
				result = this.orderArr;
			}else{
				for(let data of this.orderArr){
					if(data.aiState == selected){
						result.push(data);
					}
				}
			}
			this.currOrderArr = result;
		},
		// 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "审核中", value: 0 },
                { text: "已通过", value: 1 },
                { text: "已拒绝", value: 2 }
            ];
            for (let data of state) {
                if (val == data.value) {
                    return data.text;
                }
            }
        },
		getInitData(){
			// uid[必填]       申请人ID
			// tooken[必填]    登陆凭证
			let sessionData = this.sessionData;
			let info = {
				uid:sessionData.uID,
				tooken: sessionData.token
			};
			api.getApi(this.QZhike+'/SelectAllOrder', info).then(res=>{
				console.log(res.data);
				if(res.data){
					if (res.data.SysCode == 100302) {
						this.loginTimeout();
					}
					if(res.data.length == 0){
						this.$router.push('./ADqinlinzk');
					}
					if(res.data.length){
						let result = [];
						for(let data of res.data){
							let format = {
								apName: data.apName?data.apName:'',
								rescount: data.rescount?data.rescount:'',
								apID: data.apID?data.apID:'',
								aiState: data.aiState?data.aiState:'',
								aiTime: data.aiTime?data.aiTime:'',
								totalCount: data.total?data.total:'',
								total: data.total?this.totalCountSum(data.total.split(',')):'',
								ctList: data.ctList?data.ctList: ''
							};
							result.push(format);
						}
						this.orderArr = result.reverse();
					}
					this.handleClick();
				} else {
					Message.warning(res.data.MSG);
				}
			});
		},
		// 计算人流量(累加)
        totalCountSum(arr){
            let result = 0;
            for(let data of arr){
                if(data){
                    result += parseInt(data); 
                }
            }
            return result;
        },
		// 时间格式规范
        formatTime(val) {
			if(val){
				return dateFormat.toDateTime(val, ".");
			}
        },
        // 价格加上逗号
        priceFormat(price) {
			if(price){
				return commaFormat.init(price);
			}
			return '--';
		},
		// 详情跳转
		toDetail(item){
			console.log(item);
			if(item.aiState ==0 || item.aiState == 2){
				return;
			}
			sessionStorage.setItem('AD_apid', item.apID);
			sessionStorage.setItem('ctList_data', item.ctList);
			sessionStorage.setItem('aiTime', item.aiTime);
			this.$router.push('./ADqinlinzk');
		},
		loginTimeout() {
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
        //开通社区画像
    }
};
</script>

<style scoped>
/*面包屑导航*/
.ad_mediaDetail_wrap {
    position: relative;
    /*padding-top: 60px;*/
}

.ad_mediaDetail_nav p {
    padding-left: 65px;
    position: absolute;
    left: 0;
    top: 12px;
    font-size: 14px;
    line-height: 18px;
}

.ad_mediaDetail_nav p a {
    color: #666;
}

.ad_mediaDetail_nav {
    height: 42px;
    position: relative;
}

.mediaList_wrap {
    width: 90%;
    /*height: 581px;*/
    border-radius: 4px;
    margin: 0 auto;
}

/*内容*/
.banner {
    display: flex;
    justify-content: space-between;
    padding: 27px 70px 47px 27px;
    background: #ffffff;
    border: 1px solid #e6e7e9;
}
.banner-txt {
    width: 55%;
}
.banner-txt h1 {
    font-size: 20px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
}
.banner-txt p {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
}

/*tabs*/
.tabs {
    position: relative;
    top: -41px;
}
.tabs /deep/ .el-tabs__header {
    padding-left: 44px;
}
.tabs /deep/ .el-tabs__nav-wrap::after {
    height: 0;
}
.cards {
    display: flex;
    /*justify-content: space-between;*/

    flex-wrap: wrap;
}
.cards .box-card {
    width: 294px;
    height: 174px;
    margin-bottom: 25px;
    margin-right: 3px;
}
.cards .box-card:nth-child(4n){
    margin-right: 0px;
}
.box-card .card-top {
    border-bottom: 1px solid #e8e8e8;
    padding: 20px 20px 16px 20px;
}
.box-card .card-top-title {
    display: flex;
    /*justify-content: space-around;*/
    align-items: center;
    padding: 0 30px;
}
.box-card .card-top-title img {
    width: 32px;
    height: 32px;
}
.box-card .card-top-title h3 {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    margin-left: 20px;
	overflow: hidden;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/deep/ .el-card__body {
    padding: 0;
    cursor: pointer;
}

.box-card .card-top-data {
    display: flex;
    /*justify-content: space-around;*/
    margin-top: 12px;
    padding: 0 0 0 30px;
}
.box-card .card-top-data ul:last-of-type{
    margin-left: 30px;
}
.box-card .card-top-data li:last-child {
    font-size: 24px;
    color: #000000;
    margin-top: 4px;
}
.card-bottom {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 12px;
    height: 40px;
    color: #9b9b9b;
}
.card-bottom .green {
    color: #30bb5a;
}
.card-bottom .blue {
    color: #2a98fe;
}
.card-bottom .red {
    color: #ff7373;
}

/*1440*/
@media all and (min-width: 1420px) {
    .ad_mediaDetail_nav p {
        padding-left: 70px;
    }
    .cards .box-card{
        margin-right: 26px;
    }


}

/*1920*/
@media all and (min-width: 1900px) {
    .ad_mediaDetail_nav p {
        padding-left: 95px;
    }
    .cards .box-card{
        margin-right: 58px !important;
    }
    .cards .box-card:nth-child(5n){
        margin-right: 0px !important;
    }
}
</style>
