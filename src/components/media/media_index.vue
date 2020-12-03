<template>
	<div class="media_index">
		<div class="ad_index_container">
			<div class="index-top-row">
				<div class="left-layout">
					<personal-info :user-info="userInfo" :honor-img="companyHonor" :linkArr="linkArrNew"></personal-info>
					<div class="card-group">
						<el-row :gutter="24" style="margin-bottom: 24px;">
							<el-col :span="8"><chart-card :cardData="cardData1"></chart-card></el-col>
							<el-col :span="8"><chart-card :cardData="cardData2"></chart-card></el-col>
							<el-col :span="8"><chart-card :cardData="cardData3"></chart-card></el-col>
						</el-row>
						<el-row :gutter="24">
							<el-col :span="8"><chart-card :cardData="cardDataOther1"></chart-card></el-col>
							<el-col :span="8"><chart-card :cardData="cardDataOther2"></chart-card></el-col>
							<el-col :span="8"><chart-card :cardData="cardDataOther3"></chart-card></el-col>
						</el-row>
					</div>
				</div>
				<!-- 消息推送和应用市场 -->
				<div class="right-board">
					<message-and-app :appCenter="appCenter" @goToPage="goToPage"></message-and-app>
				</div>
			</div>
			<el-row :gutter="24" class="index-row">
				<!-- 媒体概况 -->
				<el-col :span="12">
					<index-custom-card>
						<template slot="head">
							媒体概况&nbsp
							<el-tooltip popper-class="amount-tooltip" effect="dark" content="Top center" placement="top">
								<ul slot="content">
									<li style="line-height: 20px;">
										签约额：均为合同金额，未扣除总部收益部分
									</li>
									<li style="line-height: 20px;">
										全国单发单执行额：该执行额不以实际订单金额统计，而以拆单时的方案金额以公式计算获得
									</li>
									<li style="line-height: 20px;">
										按周统计：指每周六至下周五为一个周
									</li>
									<li style="line-height: 20px;">
										按月统计：指从1号至自然月底
									</li>
								</ul>
								<img class="quesition-icon" src="../../assets/images/question_icon.png" />
							</el-tooltip>
							<el-radio-group v-model="isPoint" size="small" class="achievement-radio-group">
								<el-radio-button :label="false">媒体</el-radio-button>
								<el-radio-button :label="true">点位（面）</el-radio-button>
							</el-radio-group>
						</template>
						<template slot="content">
							<ring-chart container="ringChart" :sourceData="ringData[isPoint*1]"></ring-chart>
							<div class="bottom-box">
                                贵公司<span class="avtive">{{ringData[2][isPoint*1][0]}}</span>个媒体处于不可投状态，多于全国<span class="avtive">{{ringData[2][isPoint*1][1]}}</span>的公司，请尽快处理下吧！
                            </div>
						</template>
					</index-custom-card>
				</el-col>
				<el-col :span="12">
					<index-custom-card>
						<template slot="head">
							预锁概况
						</template>
						<template slot="content">
							<el-table
                                :data="preLockArr"
                                max-height="460"
								style="padding: 25px 25px 0;"
                            >
                                <el-table-column
									prop="apName"
                                    label="方案"
                                    width="230">
                                </el-table-column>
                                <el-table-column
                                    prop="dayDiffer"
                                    label="预锁剩余天数"
                                >
                                    <template slot-scope="scope">
										<mini-progress slot="reference" :target="0" :percentage="scope.row.dayDiffer/7*100" :value="scope.row.dayDiffer + '天'" :height="'20px'" :color="scope.row.dayDiffer>4?'#1890FF':(scope.row.dayDiffer>1?'#FAAD14':'#FF7875')"></mini-progress>
                                    </template>
                                </el-table-column>
                            </el-table>
						</template>
					</index-custom-card>
				</el-col>
			</el-row>
			<!-- <home-top :user-info="userInfo" :data-arr="dataArr" :honor-img="companyHonor"></home-top> -->
			<!-- <div style="margin:24px 0;display:flex;">
				<div style="width:66%;border: 1px solid #e5e6e9;">
					<h2 class="h2_style">常用模块</h2>
					<home-link :link="linkArr"></home-link>
				</div>
				<div style="width:33%; margin-left:24px;background:#fff;border: 1px solid #e5e6e9;">
					<h2 :class="isCom?'com_style':'h2_style'">个人荣誉</h2>
					<div :class="isCom?'com_loglistBox':'loglist_box'">
						<el-row style="text-align:center;">
							<el-col :span="isCom?4:8" v-for="(item, index) of imginfo" :key="item.name">
								<img :src="item.url" :alt="item.name" @click="showImg(index, item.url)">
							</el-col>
						</el-row>
					</div>
					<template v-if="isCom">
						<h2 class="com_style">公司荣誉</h2>
						<div class="com_loglistBox">
							<el-row style="text-align:center;">
								<el-col :span="4" v-for="item of comimgInfo" :key="item.label">
									<img :src="item.value" :alt="item.label">
								</el-col>
							</el-row>
						</div>
					</template>
				</div>
			</div> -->
            <!-- <div class="app-center-item" id="appCenter"> -->
                <!--isPlatform-->
                <!-- <h2 class="h2_style"><span @click="goToPage()">应用中心 <i class="el-icon-arrow-right"></i></span></h2>
                <ul :style="{height:isSlideDown?'254px':'510px'}">
                    <li v-for="item in appCenter" @click="goToPage(item)">
                        <div class="item-left">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-right">
                            <h5>{{item.title}}</h5>
                            <el-tooltip popper-class="desc-tooltip" effect="dark" :content="item.desc" placement="top" v-model="item.descTooltip">
                                <p>{{item.desc}}</p>
                            </el-tooltip>
                        </div>
                    </li>
                </ul>
                <div class="slide" @click="slideAppCenterItem">
                    <span class="down" v-if="isSlideDown">展开 <i class="el-icon-d-arrow-left"></i> </span>
                    <span class="up" v-else>收起 <i class="el-icon-d-arrow-left"></i> </span>
                </div>
            </div> -->
			<el-tabs class="index-tab-group" style="height: 643px;border: 1px solid #e5e6e9;" v-model="activeTabsName">
                <el-tab-pane label="点位分布" name="pointDistribution">
                    <point-distribution mapContainer="mapContainer1" :hasMpvgl="hasMpvgl" :actived="activeTabsName === 'pointDistribution'"></point-distribution>
                </el-tab-pane>
                <el-tab-pane label="点位上刊率" name="pointPublication">
                    <publish-rate mapContainer="mapContainer2" :hasMpvgl="hasMpvgl" :actived="activeTabsName === 'pointPublication'"></publish-rate>
                </el-tab-pane>
            </el-tabs>
			<div style="margin:24px 0; background:#fff;padding-bottom: 24px;border: 1px solid #e5e6e9;">
				<h2 class="h2_style flex_box">
					<b>业绩指标</b>
					<span style="margin-right:24px;">
						<el-date-picker
							v-model="monthRange[0]"
							type="month"
							size="mini"
							value-format="yyyy-MM"
							format="yyyy-MM"
							placeholder="选择月"
							:picker-options="disableDate1"
							@change="selectMonth()">
						</el-date-picker>
						<span>~</span>
						<el-date-picker
							v-model="monthRange[1]"
							type="month"
							size="mini"
							value-format="yyyy-MM"
							format="yyyy-MM"
							placeholder="选择月"
							:picker-options="disableDate2"
							@change="selectMonth()">
						</el-date-picker>
					</span>
				</h2>
				<div v-if="getNumIsNull(orderPointData.pointData)|| getNumIsNull(orderPointData.orderData)" id="perform" ref="perform" class="charts2" style="width:100%;height:400px;"></div>
				<template v-else>
					<div class="img_point">
						<no-search-result></no-search-result>
					</div>
				</template>
			</div>
		</div>

		<div class="dialog_box">
			<el-dialog
				title=""
				:visible.sync="isShowMedal"
				width="340">
				<div class="dia_con">
					<div class="top">
						<img :src="currentImgInfo.url" alt="">
					</div>
					<div class="con">
						<!-- <p style="font-size:28px;line-height:20px;font-weight:bold;">{{currentImgInfo.name}}</p> -->
						<p style="height:24px;line-height:24px;margin-top: 10px;">
							<span>{{currentImgInfo.name}}达 {{currentImgInfo.num}} {{currentImgInfo.unit}}</span>
						</p>
						<div class="img_modal">
							<el-row>
								<el-col :span="7">
									<img :src="currentImgInfo.img2" alt="">
									<span class="line_style"></span>
								</el-col>
								<el-col :span="7">
									<img :src="currentImgInfo.img3" alt="">
									<span class="line_style"></span>
								</el-col>
								<el-col :span="7">
									<img :src="currentImgInfo.img4" alt="">
									<span class="line_style"></span>
								</el-col>
								<el-col :span="3">
									<img :src="currentImgInfo.img5" alt="">
								</el-col>
							</el-row>
						</div>
					</div>
				</div>
			</el-dialog>
		</div>

		<!-- 媒介工作量 -->
		<div v-if="isShowNum" style="z-index:2;background: #000000;opacity: 0.3;width:100%;height:100%;position:absolute;top:0;left:0;"> </div>
		<div v-if="isShowNum" class="rank_box">
			<ul class="ul_box">
				<li>
					<div class="img_box">
						<img src="../../assets/images/index/release.png" alt="" class="center_img">

						<img src="../../assets/images/index/left-star.png" alt="" class="postionB left_star">
						<img src="../../assets/images/index/left.png" alt="" class="postionB left">
						<img src="../../assets/images/index/right.png" alt="" class="postionB right">
						<img src="../../assets/images/index/right-star.png" alt="" class="postionB right_star">
						<img src="../../assets/images/index/name.png" alt="" class="postionB name">
						<span class="postionB name_span">发布方案</span>
					</div>
					<p class="point_num">
						<span>{{contribute.adPlanCount}}</span>
					</p>
				</li>
				<li v-if="!isAllMedia">
					<div class="img_box" id="point_animation">
						<img src="../../assets/images/index/remedia.png" alt="" class="center_img">

						<img src="../../assets/images/index/left-star.png" alt="" class="postionB left_star">
						<img src="../../assets/images/index/left.png" alt="" class="postionB left">
						<img src="../../assets/images/index/right.png" alt="" class="postionB right">
						<img src="../../assets/images/index/right-star.png" alt="" class="postionB right_star">
						<img src="../../assets/images/index/name.png" alt="" class="postionB name">
						<span class="postionB name_span">录入媒体</span>
					</div>
					<p class="point_num">
						<span>{{contribute.mediaCount}}</span>
					</p>
				</li>
				<li>
					<div class="img_box">
						<img src="../../assets/images/index/repoint.png" alt="" class="center_img">

						<img src="../../assets/images/index/left-star.png" alt="" class="postionB left_star">
						<img src="../../assets/images/index/left.png" alt="" class="postionB left">
						<img src="../../assets/images/index/right.png" alt="" class="postionB right">
						<img src="../../assets/images/index/right-star.png" alt="" class="postionB right_star">
						<img src="../../assets/images/index/name.png" alt="" class="postionB name">
						<span class="postionB name_span">录单点位</span>
					</div>
					<p class="point_num">
						<span>{{contribute.asCount}}</span>
					</p>
				</li>
			</ul>
			<p style="margin-top:20px;color:#FFD424;">
				<el-button type="danger" size="medium" @click="isShowNum =false">继续努力</el-button>
			</p>
		</div>
	</div>
</template>

<script>
import { Button, Message } from 'element-ui';
import timeFormat from '../../commonFun/timeFormat.js';
// import homeTop from '../common/components/homeTop.vue';
import homeLink from '../common/components/homeLink.vue';
import { api } from '../../api/api';
import comcards from '../../commonFun/json/comcard.json';
import sessFun from '../../commonFun/sessFun.js';
import indexIsDateFirst from '../../commonFun/indexIsDateFirst.js';
import noSearchResult from "../../components/common/components/noSearchResult.vue";
import appCenter from '../../commonFun/json/appCenter.json';

import personalInfo from '../common/components/personalInfo.vue';
import messageAndApp from '../common/components/messageAndApp.vue';
import chartCard from '../common/components/chartCard.vue';
import indexCustomCard from '../common/components/indexCustomCard.vue';
import ringChart from '../common/components/ringChart.vue';
import miniProgress from '../common/components/miniProgress.vue';
import pointDistribution from '../common/components/pointDistribution.vue';
import publishRate from '../common/components/publishRate.vue';

export default {
	name: "media_index",
	components:{
		// homeTop,
		homeLink,
		noSearchResult,

		personalInfo,
		messageAndApp,
		chartCard,
		indexCustomCard,
		ringChart,
		miniProgress,
		pointDistribution,
        publishRate
	},
	data(){
		return{
			hasMpvgl: false,
			activeTabsName: 'pointDistribution',

			isAllMedia: false,
			isShowNum: false,
			// 勋章弹出框
			isShowMedal: false,
			linkArrNew: [
				{
					imgurl: require('../../assets/images/importPoint.png'),
					title: '导出空位',
					link: '',
				},
				{
					imgurl: require('../../assets/images/fangan.png'),
					title: '新建方案',
					link: './media/createPlan',
				},
				{
					imgurl: require('../../assets/images/addMedia.png'),
					title: '新建媒体',
					link: './media/mediaInput',
				},
				{
					imgurl: require('../../assets/images/gua.png'),
					title: '点位表盘',
					link: './media/adsDialPlate',
				},
			],
			linkArr:[
                {
                    imgurl: require('../../assets/images/media.png'),
                    title: '媒体管理',
                    desc: '媒体管理模块，您可在此模块中查看、添加、编辑媒体',
                    link: './media/mediaList',
                    children: [
                        {
                            title: '媒体列表',
                            link: './media/mediaList',
                        },
                        {
                            title: '新建媒体',
                            link: './media/mediaInput',
                        }
                    ],
                },
                {
                    imgurl: require('../../assets/images/editor.png'),
                    title: '方案管理',
                    desc: '方案管理模块，您可在此模块中查看、新建、发布方案',
                    link: './media/planList',
                    children: [
                        {
                            title: '导出空位',
                            link: '',
						},
						// {
                        //     title: '方案列表',
                        //     link: './media/planList',
                        // },
                        {
                            title: '新建方案',
                            link: './media/createPlan',
                        }
                    ],
                },
                {
                    imgurl: require('../../assets/images/order.png'),
                    title: '订单管理',
                    desc: '订单管理模块，您可在此模块查看订单，中止订单',
                    link: './media/orderList',
                    children: [
                        {
                            title: '订单列表',
                            link: './media/orderList'
                        }
                    ],
                },
			],
			userInfo: {
                username: '熊善琪',
                greetings: '祝您开心每一天!',
                duty: '媒介',
                dep: '市场销售部',
                phone: '13570491551',
                avator: require('../../assets/images/tvQNA_img3.jpg'),
				endTime: '2018-06-09',
			},
			// dataArr:[
            //     {
            //         name: '资源总数',
            //         data: '3,042'
            //     },
            //     {
            //         name: '本月创建方案数',
            //         data: 22
            //     },
            //     {
            //         name: '本月发布订单数',
            //         data: 17
            //     },
            //     {
            //         name: '本月录单点位数',
            //         data: 437
            //     },
            //     {
            //         name:'禁用点位总数(面)',
            //         data:1
            //     }
			// ],
			// 勋章排名
			medalInfo: {
				point: 1,
				help: 2,
				release: 3,
				pointNum: 0,
				helpNum: 0,
				releaseNum : 0,
			},
			imginfo: [
				{
					name: '录点能手',
					num: '',
					url: '',
					unit: '个',
					rank: 0,
				},
				{
					name: '协助新人',
					num: '',
					url: '',
					unit: '个',
					rank: 0,
				},
				{
					name: '发布之星',
					num: '',
					url: '',
					unit: '单',
					rank: 0
				},
			],
			// 弹出框信息
			currentImgInfo:{
				url: '',
				name: '',
				num: '',
				unit: '',
				img1: '',
				img2: '',
				img3: '',
				img4: '',
			},
			// 弹窗贡献值
			contribute:{
				adPlanCount: 0,
				mediaCount: 0,
				asCount: 0,
			},
			monthRange: [],
			disableDate1:{
				disabledDate: (time)=> {
					return time.getTime() > Date.parse(this.monthRange[1])
				},
			},
			disableDate2:{
				disabledDate: (time)=> {
					return time.getTime() < Date.parse(this.monthRange[0])
				},
			},
			// 图表数据
			orderPointData:{
				legendTitle: ['发布订单数','录单点位数'],
				title: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
				orderData: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
				pointData: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
			},
			isCom: false,
			// 公司勋章
			comimgInfo: [],
			companyHonor: [],
            // 应用中心
            appCenter: '',
			isSlideDown: true,
			
			cardData1: {
				type: 'bar',
				title: '明日预锁到期方案',
				tip: '数据实时更新，指明日将到期自动解锁的方案数量',
				value: 0,
				valueAlias: '方案个数',
				compare: 0,
				trendLabel: '同比上周',
				data: []
			},
			cardData2: {
				type: 'bar',
				title: '本月发布订单',
				tip: '数据实时更新，本月该媒介发布的订单数量',
				value: 0,
				valueAlias: '订单数',
				compare: 0,
				trendLabel: '月环比',
				data: []
			},
			cardData3: {
				type: 'bar',
				title: '本月创建方案',
				tip: '数据实时更新，本月该媒介协助创建的方案数量',
				value: 0,
				valueAlias: '方案数',
				compare: 0,
				trendLabel: '月环比',
				data: []
			},
			cardDataOther1: {
				title: '社区总数',
				tip: '数据截止至昨日，社区总数数据来源为统计周期内新增的社区数量总和',
				value: 0,
				valueAlias: '新增小区数量',
				compare: 0,
				trendLabel: '同比去年',
				data: []
			},
			cardDataOther2: {
				title: '在刊点位',
				tip: '数据实时更新，当前正在被投放的点位数量',
				value: 0,
				valueAlias: '在刊点位数量',
				compare: 0,
				trendLabel: '同比上周',
				data: [],
				formatter: (val)=>{return val.substr(5)}
			},
			cardDataOther3: {
				title: '禁用点位',
				tip: '数据实时更新，公司禁用的总点位数',
				value: 0,
				valueAlias: '禁用点位数量',
				compare: 0,
				trendLabel: '同比上周',
				data: [],
				formatter: (val)=>{return val.substr(5)}
			},
			// 媒体概况 媒体和点位切换
			isPoint: false,
			// 媒体概况饼图数据
			ringData: [
				[], 
				[], 
				[
					['0', '0%'],
					['0', '0%']
				]
			],
			// 媒介预锁概况表格
			preLockArr: []
		}
	},
	beforeCreate() {
		var glSript = document.createElement('script');
		glSript.type = 'text/javascript';
		glSript.src = '//api.map.baidu.com/api?type=webgl&v=1.0&ak=OuaBKFQpjyuK6a2BvVW7qbNagMkSAKqI&callback=init';
		document.body.appendChild(glSript);
		glSript.onload = ()=>{
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "/static/mapvgl.min.js";
			document.body.appendChild(script);
			script.onload = ()=>{
				this.hasMpvgl = true
			}
		}
	},
	methods:{
		getSession(){
			this.sessionData = sessFun.getSess();
			let sess = this.sessionData;
			this.isAllMedia = (sess.uType=='MD' && sess.mediaManageLevel==1) ? true: false;
			this.userInfo.username = sess.realName;
			this.userInfo.dep = sess.division;
			this.userInfo.duty = sess.asName;
			this.userInfo.phone = sess.phone;
			this.userInfo.avator = sess.headPic ? sess.headPic : require('../../assets/images/index/niu.png')

		},
		getIsCom(){
			let sessrid = this.sessionData.asrID;
			let comarr = ['1','2','3','4','5','6','7'];
			for(let data of comarr){
				if(sessrid== data){
					this.isCom = true;
					break;
				}
			}
			if(this.isCom){
				let cards = [];
				let result = [];
				for(let data of comcards){
					if(sessrid == data.value){
						cards = data.cards;
						break;
					}
				}
				for(let item of cards){
					let obj = {
						label: item.label,
						title: item.title,
						flag: item.label.includes('2') ? true : false,
						value: require('../../assets/images/index/'+item.value+'.png'),
					};
					obj.url = obj.value;
					result.push(obj);
				}
				// console.log('result----cards', result);
				this.comimgInfo = result;
			}
		},
		// 获取数据
		getData(){
			let info = {
				uid: this.sessionData.uID,
				token: this.sessionData.token,
			};
			api.getApi(this.apiVar.report + '/GetHomePageInfoOfMD', info).then(res =>{
				// console.log(res.data);
				if(res.data.SysCode == 200200){
					let resInfo = res.data.data;
					this.dataArr[0].data = resInfo.resCount;
					this.dataArr[1].data = resInfo.createdAdPlanCount;
					this.dataArr[2].data = resInfo.publishedAdPlanCount;
                    this.dataArr[3].data = resInfo.asCount;
                    this.dataArr[4].data = resInfo.bannedAdsCount;

					this.userInfo.endTime = timeFormat.toDate(resInfo.time, '/');
				}else{
					Message.warning(res.data.MSG);
				}
			}).catch(err =>{
				console.log(err);
			});
		},
		// 媒介贡献弹窗
		getContributeBox(){
			let info = {
				uid: this.sessionData.uID,
				token: this.sessionData.token,
			};
			api.getApi(this.apiVar.report + '/GetSummaryOfLastMonthOfMD', info).then(res =>{
				// console.log(res);
				if(res.data.SysCode == 200200){
					let resinfo = res.data.data;
					this.contribute = {
						adPlanCount: resinfo.adPlanCount,
						mediaCount: resinfo.mediaCount,
						asCount: resinfo.asCount,
					};
				}else{
					Message.warning(res.data.MSG);
				}
			}).catch(err =>{
				console.log(err);
			});
		},
		// 媒介贡献信息的总数
		getContribute(){
			let info = {
				uid: this.sessionData.uID,
				token: this.sessionData.token,
			};
			api.getApi(this.apiVar.report + '/GetTotalPerformanceOfMD', info).then(res =>{
				// console.log(res);
				if(res.data.SysCode == 200200){
					let resinfo = res.data.data;
					this.medalInfo = {
						point: this.getRank(1, resinfo.totalMediaCount)+1,
						help: this.getRank(2, resinfo.totalCreatedAdPlanCount)+1,
						release: this.getRank(3, resinfo.totalPublishedAdPlanCount)+1,
						pointNum: resinfo.totalMediaCount,
						helpNum: resinfo.totalCreatedAdPlanCount,
						releaseNum: resinfo.totalPublishedAdPlanCount,
					}
					this.imginfo[0].url = require('../../assets/images/index/repoint-'+this.medalInfo.point+'.png');
					this.imginfo[0].num = this.medalInfo.pointNum;
					this.imginfo[0].rank = this.medalInfo.point;
					this.imginfo[0].name = this.getName(1, this.medalInfo.point-2);
					this.imginfo[0].title = this.imginfo[0].name?this.imginfo[0].name:'';
					this.imginfo[1].url = require('../../assets/images/index/assist-'+this.medalInfo.help+'.png');
					this.imginfo[1].num = this.medalInfo.helpNum;
					this.imginfo[1].rank = this.medalInfo.help;
					this.imginfo[1].name = this.getName(2, this.medalInfo.help-2);
					this.imginfo[1].title = this.imginfo[1].name?this.imginfo[1].name:'';
					this.imginfo[2].url = require('../../assets/images/index/release-'+this.medalInfo.release+'.png');
					this.imginfo[2].num = this.medalInfo.releaseNum;
					this.imginfo[2].rank = this.medalInfo.release;
					this.imginfo[2].name = this.getName(3, this.medalInfo.release-2);
					this.imginfo[2].title = this.imginfo[2].name?this.imginfo[2].name:'';

					// console.log('this.imginfo', this.imginfo);
					for(let data of this.imginfo){
						if(data.title){
							data.flag = true;
						}else{
							data.flag = false;
						}
					}
					this.companyHonor = this.comimgInfo.concat(this.imginfo);
					// console.log(this.companyHonor, 'companyHonor');
				}else{
					Message.warning(res.data.MSG);
				}
			}).catch(err =>{
				console.log(err);
			});
		},
		getName(type, value){
			let arr = [];
			if(type == 1){
				arr = [ '录点新手', '录点能手', '录点之星', '录点超人'];
			}else if(type == 2){
				arr = [ '录单新手', '录单能手', '录单之星', '录单超人'];
			}else{
				arr = [ '发布新手', '发布能手', '发布之星', '发布超人'];
			}
			return arr[value];
		},
		getRank(type, value){
			// console.log('type---', type, value);
			let rank = 0;
			let oldArr = [];
			if(type == 1){
				oldArr = [, 500, 2500, 5000, 10000];
			}else if(type == 2){
				oldArr = [0, 200, 500, 1000, 2500];
			}else{
				oldArr = [0, 200, 500, 1000, 2500];
			}
			let arr = oldArr.concat(value);
			arr.sort((a, b)=>{
				return a-b;
			});
			for(let i = 0; i<arr.length; i++){
				if(arr[i] == value){
					rank = i;
					break;
				}
			}
			return rank;
		},
		showImg(index, value){
			// this.isShowMedal = true;
			let curr = this.imginfo[index];
			if(curr.rank == 1){
				this.isShowMedal = false;
			}else{
				this.isShowMedal = true;
			}
			let str = '';
			if(index == 0){
				str = 'repoint';
			}else if (index == 1){
				str = 'assist';
			}else {
				str = 'release';
			}
			this.currentImgInfo = {
				url: curr.url,
				name: curr.name,
				num: curr.num,
				unit: curr.unit,
				img2: require('../../assets/images/index/'+str+'-2.png'),
				img3: require('../../assets/images/index/'+str+'-3.png'),
				img4: require('../../assets/images/index/'+str+'-4.png'),
				img5: require('../../assets/images/index/'+str+'-5.png'),
			};
		},
		setTime(){
			let starTime = timeFormat.returnMonthCount(5,'-') //this.GetDateStr(5)
			let endTime = timeFormat.returnMonthCount(0,'-')  //this.GetDateStr(0)
			let starTimeSub = starTime.substring(0,7)
			let endTimeSub = endTime.substring(0,7)
			console.log(starTime, endTime);
			this.monthRange = [starTimeSub, endTimeSub]     // 关键数据增量趋势
			this.selectMonth();
		},
		selectMonth(){
			if(this.monthRange[0] && this.monthRange[1]){
				if(this.monthRange[0]>this.monthRange[1]){
					Message.warning('结束时间小于开始时间');
				}else{
					this.getchartData();
				}
			}else {
				Message.warning('请先选择一段时间');
			}
		},
		// 获取图表数据
		getchartData(){
			let info = {
				uid: this.sessionData.uID,
				token: this.sessionData.token,
				startTime: this.monthRange[0],
				endTime: this.monthRange[1]
			};
			api.getApi(this.apiVar.report + '/GetAdPlanCountAndAsCountByPeriodOfMD', info).then(res =>{
				// console.log(res.data);
				if(res.data.SysCode == 200200){
					let title = [];
					let orderData = [];
					let pointData = [];
					for(let data of res.data.data){
						title.push(data.month);
						orderData.push(data.apCount);
						pointData.push(data.asCount);
					}
					this.orderPointData.title = title;
					this.orderPointData.orderData = orderData;
					this.orderPointData.pointData = pointData;
					if(this.getNumIsNull(orderData) || this.getNumIsNull(pointData)){
						this.getLinePer();
					}
				}else{
					Message.warning(res.data.MSG);
				}
			}).catch(err =>{
				console.log(err);
			});
		},
		getNumIsNull(arr){
			let isHad = arr.filter(item =>{
				return item>0;
			});
			return isHad.length==0?false:true;
		},
		getLinePer(){
			let perLine = this.$echarts.init(this.$refs.perform)
			perLine.setOption({
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
						shadowStyle: {
							shadowColor: '#999'
						}
					},
					backgroundColor: '#FFFFFF',
					padding: 0,
					borderColor: '#dddddd',
					borderWidth: 1,
					formatter: function(params){
                        let title = '';
                        let arr = [];
                        for (let i = 0; i < params.length; i++) {
                            title = `<p class="echarts_tooltip_title"><span>${params[i].name}</span><span>数值</span></p> <br/>`
                            let data = `<p class="echarts_tooltip_content"><span><i class="echarts_tooltip_i" style="background:${params[i].color}"></i>
                                ${params[i].seriesName}</span> ${params[i].value}</p>`
                            arr.push(data)
                        }
                        let tooltip = arr.join('')
                        return title + tooltip
					},
				},
				legend: {
					top: 'bottom',
					left: 'center',
					data: this.orderPointData.legendTitle
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '8%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: this.orderPointData.title,
						axisPointer: {
							type: 'shadow'
						},
						axisLabel: {
							//坐标轴刻度标签
							margin: 7, //刻度标签与轴线之间的距离
							interval: 0,    //强制文字产生间隔
							// rotate: 25,     //文字逆时针旋转25°
							textStyle: {
								fontFamily: "DINPro-Regular",
								color: "#2C313C" //坐标轴刻度文字的颜色
							}
						},
						axisLine: {
							//坐标轴线条相关设置(颜色等)
							lineStyle: {
								color: "#E8E8E8"
							}
						},
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '发布订单数',
						nameTextStyle:{
							fontWeight: 'bold',
							fontSize: 14,
							color: '#000'
						},
						axisLine: {
							//坐标轴线条相关设置(颜色等)
							lineStyle: {
								color: "#E8E8E8"
							}
						},
						axisLabel: {
							//坐标轴刻度标签
							margin: 7, //刻度标签与轴线之间的距离
							textStyle: {
								fontFamily: "DINPro-Regular",
								color: "#2C313C" //坐标轴刻度文字的颜色
							}
						},
						splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
					},
					{
						type: 'value',
						name: '录单点位数',
						nameTextStyle:{
							fontWeight: 'bold',
							fontSize: 14,
							color: '#000'
						},
						axisLine: {
							//坐标轴线条相关设置(颜色等)
							lineStyle: {
								color: "#E8E8E8"
							}
						},
						axisLabel: {
							//坐标轴刻度标签
							margin: 7, //刻度标签与轴线之间的距离
							textStyle: {
								fontFamily: "DINPro-Regular",
								color: "#2C313C", //坐标轴刻度文字的颜色，
							}
						},
						splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
					}
				],
				series: [
					{
						color: '#1890FF',
						name:'发布订单数',
						barWidth: "10%",
						type:'bar',
						data:this.orderPointData.orderData
					},
					{
						color: '#FF9118',
						name:'录单点位数',
						barWidth: "10%",
						type:'bar',
						yAxisIndex: 1,
						data:this.orderPointData.pointData
					}
				]
			});
			window.addEventListener("resize", function (e) {
				perLine.resize();
			});
		},
        // 应用中心的展开和收起
        slideAppCenterItem() {
            this.isSlideDown = !this.isSlideDown
            if(!this.isSlideDown){
                this.uploadEvent(1)
            }

        },
        // 应用中心跳转
        goToPage(item) {
            if (item) {
                this.uploadEvent(2,item.name)
                item.descTooltip = false
                window.open(item.link, '_blank')
            } else {
                this.uploadEvent(2,'home')
                window.open('https://apps.qinlinad.com', '_blank')
            }
        },
        getUuid() {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            let uuid = s.join("");
            return uuid;
        },
        // 用户中心事件上报 1展示2点击
        uploadEvent(type,name){
            this.$nextTick(function() {
                //用户中心渲染完成
                // console.log('用户中心渲染完成')
                let params = []
                if(type==1){
                    //展现
                    for(let i=0;i<this.appCenter.length;i++){
                        if(this.isSlideDown){
                            if(i<8){
                                let obj = {
                                    "userId":this.sessionData.uID,
                                    "behaviorTime":timeFormat.toDateTime(new Date()),
                                    "componentName":this.appCenter[i].name,
                                    "requestId":this.getUuid(),
                                    "type":type
                                }
                                params.push(obj)
                            }
                        }else{
                            if(i>7){
                                let obj = {
                                    "userId":this.sessionData.uID,
                                    "behaviorTime":timeFormat.toDateTime(new Date()),
                                    "componentName":this.appCenter[i].name,
                                    "requestId":this.getUuid(),
                                    "type":type
                                }
                                params.push(obj)
                            }
                        }
                    }
                }else{
                    //点击
                    let obj = {
                        "userId":this.sessionData.uID,
                        "behaviorTime":timeFormat.toDateTime(new Date()),
                        "componentName":name,
                        "requestId":this.getUuid(),
                        "type":type
                    }
                    params.push(obj)
                }
                console.log(params)
                api.postApi(this.apiVar.UCAPI+'/UserStaticReport',{userStatics:JSON.stringify(params)}).then(res=>{
                    // console.log('UserStaticReport---',res.data);
                })
            });
		},
		// 首页报表接口
		allReportApi() {
			let params = {
				uid: this.sessionData.uID,
				token: this.sessionData.token
			}
			// 媒介的明日预锁到期卡片 /report /homepage/getMDUnlockPlanCardReport
			api.getApi(this.apiVar.report + '/homepage/getMDUnlockPlanCardReport',params).then(res=>{
				if (res.data.SysCode === 200200) {
					let temp = res.data.data;
					Object.assign(this.cardData1, {
						value: temp.unlockPlanCnt,
						compare: temp.unlockPlanIncrRate
					})
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('err', err)
			}).finally(_=>{
			})
			// 媒介的发布订单和创建方案卡片 /report /homepage/getMDAdPlanReport
			api.getApi(this.apiVar.report + '/homepage/getMDAdPlanReport',params).then(res=>{
				if (res.data.SysCode === 200200) {
					let temp = res.data.data;
					Object.assign(this.cardData2, {
						value: temp.totalOrderCnt,
						compare: temp.orderIncrRate
					})
					Object.assign(this.cardData3, {
						value: temp.totalFanganCnt,
						compare: temp.fanganIncrRate
					})
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('err', err)
			}).finally(_=>{
			})
			// 媒介的社区总数卡片 /report /homepage/getMDResCntReport
			api.getApi(this.apiVar.report + '/homepage/getMDResCntReport',params).then(res=>{
				if (res.data.SysCode === 200200) {
					let temp = res.data.data;
					Object.assign(this.cardDataOther1, {
						value: temp.totalResCnt,
						compare: temp.resIncrRate
					})
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('err', err)
			}).finally(_=>{
			})
			// 媒介的在刊点位和禁止点位卡片 /report /homepage/getMDPointReport
			api.getApi(this.apiVar.report + '/homepage/getMDPointReport',params).then(res=>{
				if (res.data.SysCode === 200200) {
					let temp = res.data.data;
					Object.assign(this.cardDataOther2, {
						value: temp.onPubLabCnt,
						compare: temp.onPubIncrRate
					})
					Object.assign(this.cardDataOther3, {
						value: temp.banLabCnt,
						compare: temp.banIncrRate
					})
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('err', err)
			}).finally(_=>{
			})
			// 媒介的卡片的周报和日报数据 /report /homepage/getMDWeekReport
			api.getApi(this.apiVar.report + '/homepage/getMDWeekReport',params).then(res=>{
				if (res.data.SysCode === 200200) {
					if(Array.isArray(res.data.data.weekDataList)) {
						let weekDataList = res.data.data.weekDataList,
							tempcCardData1 = [],
							tempcCardData2 = [],
							tempcCardData3 = [],
							tempcCardDataOther1 = [];
						weekDataList.forEach((item, index)=>{
							tempcCardData1.push({
								week: `第${index+1}周`,
								dateStr: item.weekStart + item.weekEnd,
								value: item.unlockCnt || 0
							})
							tempcCardData2.push({
								week: `第${index+1}周`,
								dateStr: item.weekStart + item.weekEnd,
								value: item.orderCnt || 0
							})
							tempcCardData3.push({
								week: `第${index+1}周`,
								dateStr: item.weekStart + item.weekEnd,
								value: item.fanganCnt || 0
							})
							tempcCardDataOther1.push({
								week: `第${index+1}周`,
								name: '新增社区',
								dateStr: item.weekStart + item.weekEnd,
								value: item.weekBarrierCnt || 0
							})
						})
						Object.assign(this.cardData1, {
							data: tempcCardData1,
						})
						Object.assign(this.cardData2, {
							data: tempcCardData2,
						})
						Object.assign(this.cardData3, {
							data: tempcCardData3,
						})
						Object.assign(this.cardDataOther1, {
							data: tempcCardDataOther1,
						})
					}
					if(Array.isArray(res.data.data.dayDataList)) {
						let dayDataList = res.data.data.dayDataList,
							tempcCardDataOther2 = [],
							tempcCardDataOther3 = [];
						dayDataList.forEach((item, index)=>{
							tempcCardDataOther2.push({
								week: item.dateId,
								dateStr: item.dateId,
								value: item.onPubLabCnt || 0
							})
							tempcCardDataOther3.push({
								week: item.dateId,
								dateStr: item.dateId,
								value: item.banLabCnt || 0
							})
						})
						Object.assign(this.cardDataOther2, {
							data: tempcCardDataOther2,
						})
						Object.assign(this.cardDataOther3, {
							data: tempcCardDataOther3,
						})
					}
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('err', err)
			}).finally(_=>{
				
			})
			/* 
				媒介的媒体概况
				"banLabCnt" 禁止的点位数
				"banMediaCnt" 禁止的媒体数
				"normalLabCnt" 正常的点位数
				"normalMediaCnt" 正常的媒体数
				"installLabCnt" 待安装的点位数
				"installMediaCnt" 待安装的媒体数
				"repairLabCnt" 待修理的点位数
				"repairMediaCnt" 待修理的媒体数
				"demolishLabCnt" 拆除的点位数
				"demolishMediaCnt" 拆除的媒体数
				"offPubMediaCnt" 不可投的媒体数
				"offPubLabCnt" 不可投的点位数
				"offPubRank" 排名百分比 
			*/
			api.getApi(this.apiVar.report + '/homepage/getMDMediaReport', params).then(res=>{
				if (res.data.SysCode === 200200) {
					let temp = res.data.data;
					this.ringData = [
						[
							{ item: "正常", count: temp.normalMediaCnt+1 },
							{ item: "待安装", count: temp.installMediaCnt+1 },
							{ item: "待维修", count: temp.repairMediaCnt+1 },
							{ item: "禁用", count: temp.banMediaCnt+1 }
						],
						[
							{ item: "正常", count: temp.normalLabCnt+10 },
							{ item: "待安装", count: temp.installLabCnt+1 },
							{ item: "待维修", count: temp.repairLabCnt+1 },
							{ item: "禁用", count: temp.banLabCnt+1 }
						],
						[
							[temp.offPubMediaCnt, temp.offPubRank+'%'],
							[temp.offPubLabCnt, temp.offPubRank+'%']
						]
					];
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('媒体概况', err)
			}).finally(_=>{
			})
			// 媒介的预锁概况 /report /homepage/getMDUnlockPlanReport
			api.getApi(this.apiVar.report + '/homepage/getMDUnlockPlanReport',params).then(res=>{
				if (res.data.SysCode === 200200) {
					this.preLockArr = res.data.data || []
				} else {
					this.messageFun('warning', res.data.MSG)
				}
			}).catch(err=>{
				console.log('err', err)
			}).finally(_=>{
			})
		}
	},
	mounted(){
		this.getSession();
		this.getIsCom();
		this.getData();
		this.getContributeBox();
		this.getContribute();
		let nowDate = timeFormat.toDate(new Date(), '/');
		if(indexIsDateFirst.getIsFirst(this.sessionData.uID, nowDate)){
			this.isShowNum = true;
		}
		this.setTime();
        //用户中心
        this.appCenter = appCenter
        this.uploadEvent(1)
		// this.getLinePer();
		this.allReportApi()
	},
};
</script>

<style scoped lang="scss">
/** 新增*/
	.index-tab-group {
		background: #fff;
        position: relative;
		/deep/ .el-tabs__nav-scroll{
			padding-left: 40px;
			line-height: 52px;
			font-size:16px;
			font-family:PingFangSC-Medium;
			font-weight:500;
			color:rgba(24,144,255,1);
		}
		/deep/ .el-tabs__item{
			font-size:16px;
		}
		/deep/ .el-tabs__content{
			padding: 9px 24px 24px 24px;
			height: calc(100% - 67px);
			box-sizing: border-box;
			.el-tab-pane {
				height: 100%;
			}
		}
	}
    .index-top-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 24px;
        .left-layout {
            display: flex;
            flex: 1;
			width: 75%;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            margin-right: 24px;
            .card-group {
                position: relative;
                height: 428px;
                width: 100%;
                margin-top: 24px;
            }
        }
        .right-board {
            width: 25%;
            height: 582px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid #E6E7E9;
        }
    }
    .index-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        & > div {
            flex: 1;
        }
        
        .achievement-radio-group {
            margin-left: auto;
            /deep/ .el-radio-button__inner {
                width: 88px;
            }
        }
        .item-list {
            height: 100%;
            padding: 16px 24px;
            box-sizing: border-box;
            .item {
                display: flex;
                align-items: center;
                margin: 9px 0;
                .progress {
                    flex: 1;
                    cursor: pointer;
                }
                .label {
                    width: 56px;
                    height: 20px;
                    margin-right: 8px;
                    line-height: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                }
            }
        }
    }
	.bottom-box {
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: #F8F8F8;
        border-radius: 2px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        .avtive {
            color: #1890FF;
        }
    }
    .pop-box {
        border-radius: 2px;
        line-height: 16px;
        font-size: 12px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        .pop-title {
            display: flex;
            color: rgba(0, 0, 0, 0.85);
            .target-btn {
                margin: 0 0 2px auto;
                color: rgba(24, 144, 255, 1);
                cursor: pointer;
            }
            .bottom-btn {
                width: 64px;
                height: 24px;
                line-height: 24px;
                margin: 8px auto 2px auto;
                border: 1px solid #1890FF;
                border-radius: 2px;
                text-align: center;
                font-size: 12px;
                color: rgba(24, 144, 255, 1);
                cursor: pointer;
            }
        }
        .pop-item {
            margin: 2px 0;
            color: rgba(0, 0, 0, 0.65);
        }
    }
 /**新增 */
.ad_index_container{
	margin: 24px 64px;
	height: auto;
}
.h2_style{
	font-family:PingFangSC-Medium;
	font-weight:500;
	color:rgba(0,0,0,0.85);
	background: #fff;
    font-size: 16px;
    font-weight: bold;
    height: 52px;
    line-height: 52px;
    padding-left: 24px;
    border-bottom: 1px solid #ececec;
}
.h2_style b{
	font-weight: bold;
}
.h2_style span{
	font-weight: normal;
	/* margin-right: 24px; */
}
/deep/ .h2_style .el-date-editor{
	font-weight: normal;
	width: 120px;
}
.flex_box{
	display: flex;
	justify-content: space-between;
}
.media_index /deep/ .dialog_box .el-dialog{
	background: #fff;
	height: 420px;
	width: 340px;
	background-repeat: no-repeat;
	background-image: url('../../assets/images/index/modal-bg.png');
}
.dia_con {
	text-align: center;
}
.top img{
	width: 150px;
}
.span_style{
	/* display: inline-block; */
    font-size: 14px;
    color: rgba(51,51,51,0.85);
}
.img_modal{
	margin-top: 40px;
}
.img_modal img{
	width: 38px;
	vertical-align: middle;
}
.line_style{
	display: inline-block;
	height: 2px;
	width: 30px;
	background: -webkit-linear-gradient(left,rgba(255, 255, 255, 0),#D8D8D8,rgba(255,255,255,0));
	background: linear-gradient(to right, rgba(255, 255, 255, 0),#D8D8D8,rgba(255,255,255,0));
}

.rank_box{
	z-index: 100;
    position: absolute;
	left: 50%;
    top: 35%;
    transform: translate(-50%, -35%);
	text-align: center;
}
.ul_box{
	display: flex;
	width: 100%;
	justify-content: space-between;
}
.ul_box li{
	padding: 0 70px;
}
.img_box{
	position: relative;
}
.center_img{
	width: 120px;
}
.postionB{
	position: absolute;
}
.left_star{
	top: -10px;
    left: 0px;
}
.left{
	left: -48px;
    top: 24px;
    z-index: -1;
}
.right{
	left: 80px;
    top: 24px;
    z-index: -1;
}
.right_star{
	top: -10px;
    left: 100px
}
.name{
	top: 90px;
	left: 0;
	width: 140px;
}
.name_span{
	top: 92px;
    font-size: 16px;
    color: #fff;
    left: 36px;
}
.point_num{
	margin-top: 8px;
    width: 100%;
    height: 42px;
    display: block;
    line-height: 42px;
    text-align: center;
}
.point_num span{
	width: 128px;
    display: inline-block;
    color: #fff;
    text-align: center;
    background: rgba(0,0,0,0.3);
    font-weight: bold;
    border-radius: 8px;
    font-size: 24px;
}

#point_animation{
	animation-name: imgAnimation;
	animation: imgAnimation 1s alternate;
	-webkit-animation: imgAnimation 1s alternate ;
	-moz-animation: imgAnimation 1s alternate infinite;
}
#point_animation .left_star,
#point_animation .right_star{
	animation-name: starimation;
	animation: starimation 2s alternate;
	-webkit-animation: starimation 2s alternate ;
	-moz-animation: starimation 2s alternate infinite;
}
#point_animation .left,
#point_animation .right{
	animation-name: directimation;
	animation: directimation 1s alternate;
	-webkit-animation: directimation 1s alternate ;
	-moz-animation: directimation 1s alternate infinite;
}
@-webkit-keyframes imgAnimation{
	0%{
		top: 500px;
	}
	100%{
		top: 0px;
	}
}
@-webkit-keyframes directimation{
	0%{
		top: 70px;
	}
	100%{
		top: 60px;
	}
}
@-webkit-keyframes starimation{
	0%{
		top: 70px;
	}
	100%{
		top: -10px;
	}
}

.com_style{
	font-family:PingFangSC-Medium;
	font-weight:500;
	color:rgba(0,0,0,0.85);
	background: #fff;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
}
.com_loglistBox img{
	width:51px;
	height:62px;
}
.loglist_box{
	margin-top:24px;
}
.img_point{
	text-align: center;
	color: #666;
	margin-top: 20px;
}

/deep/ .echarts_tooltip_title{
    width: 200px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    align-items: center;
    box-sizing: border-box;
    margin-bottom: -20px;
    color: #808080;
    background-color:#F4F6F6;
    font-size: 12px;
}

/deep/ .echarts_tooltip_content{
    display: flex;
    justify-content: space-between;
    padding: 0px 10px;
    box-sizing: border-box;
    align-items: center;
    font-size: 12px;
    color: #2C313C;
    height: 32px;
    line-height: 32px;
}

/deep/ .echarts_tooltip_i{
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
}
</style>
