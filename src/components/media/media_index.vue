<template>
	<div class="media_index">
		<div class="ad_index_container">
			<home-top :user-info="userInfo" :data-arr="dataArr" :honor-img="companyHonor"></home-top>
			<div style="margin:24px 0;display:flex;">
				<div style="width:66%;">
					<h2 class="h2_style">常用模块</h2>
					<home-link :link="linkArr"></home-link>
				</div>
				<div style="width:33%; margin-left:24px;background:#fff;">
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
			</div>
			<div style="margin:24px 0; background:#fff;">
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
				<div style="padding:24px;">
					<div id="perform" ref="perform" class="charts2" style="width:100%;height:400px;"></div>
				</div>
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
						<img src="../../assets/images/index/release.png" alt="">

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
						<img src="../../assets/images/index/remedia.png" alt="">

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
						<img src="../../assets/images/index/repoint.png" alt="">

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
import homeTop from '../common/components/homeTop.vue';
import homeLink from '../common/components/homeLink.vue';
import { api } from '../../api/api';
import comcards from '../../commonFun/json/comcard.json';

export default {
	name: "media_index",
	components:{
		homeTop,
		homeLink,
	},
	data(){
		return{
			isAllMedia: false,
			isShowNum: true,
			// 勋章弹出框
			isShowMedal: false,
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
			dataArr:[
                {
                    name: '资源总数',
                    data: '3,042'
                },
                {
                    name: '本月创建方案数',
                    data: 22
                },
                {
                    name: '本月发布订单数',
                    data: 17
                },
                {
                    name: '本月录单点位数',
                    data: 437
                },
			],
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
		}
	},
	methods:{
		getSession(){
			this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
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
				console.log('result----cards', result);
				this.comimgInfo = result;
			}
		},
		// 获取数据
		getData(){
			let info = {
				uid: this.sessionData.uID,
				token: this.sessionData.token,
			};
			api.postApi(this.Count+'/GetHomePageInfoOfMD', info).then(res =>{
				console.log(res.data);
				if(res.data.SysCode == 200200){
					let resInfo = res.data.data;
					this.dataArr[0].data = resInfo.resCount;
					this.dataArr[1].data = resInfo.createdAdPlanCount;
					this.dataArr[2].data = resInfo.publishedAdPlanCount;
					this.dataArr[3].data = resInfo.asCount;

					this.userInfo.endTime = timeFormat.toDate(resInfo.time);
				}else if(res.data.SysCode == 100302){
					this.loginTimeout();
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
			api.postApi(this.Count + '/GetSummaryOfLastMonthOfMD', info).then(res =>{
				console.log(res);
				if(res.data.SysCode == 200200){
					let resinfo = res.data.data;
					this.contribute = {
						adPlanCount: resinfo.adPlanCount,
						mediaCount: resinfo.mediaCount,
						asCount: resinfo.asCount,
					};
				}else if(res.data.SysCode == 100302){
					this.loginTimeout();
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
			api.postApi(this.Count + '/GetTotalPerformanceOfMD', info).then(res =>{
				console.log(res);
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

					console.log('this.imginfo', this.imginfo);
					for(let data of this.imginfo){
						if(data.title){
							data.flag = true;
						}else{
							data.flag = false;
						}
					}
					this.companyHonor = this.comimgInfo.concat(this.imginfo);
					console.log(this.companyHonor, 'companyHonor');
				}else if(res.data.SysCode == 100302){
					this.loginTimeout();
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
			console.log('type---', type, value);
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
			api.postApi(this.Count + '/GetAdPlanCountAndAsCountByPeriodOfMD', info).then(res =>{
				console.log(res.data);
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
					this.getLinePer();
				}else if(res.data.SysCode == 100302){
					this.loginTimeout();
				}else{
					Message.warning(res.data.MSG);
				}
			}).catch(err =>{
				console.log(err);
			});
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
						return `<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex;
									justify-content:space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">
									<span>数据</span><span>数值</span>
								</p><br/>
                                <p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;	color: #2C313C;height: 32px; ">
									<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #1890FF;margin-right: 5px"></i> ${params[0].seriesName}</span>${params[0].value}
								</p>
								<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;	color: #2C313C;height: 32px; ">
									<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #FF9118;margin-right: 5px"></i> ${params[1].seriesName}</span>${params[1].value}
								</p>`
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

					}
				],
				yAxis: [
					{
						type: 'value',
						name: '发布订单数',
						axisLabel: {
							formatter: '{value}'
						},
						nameTextStyle:{
							fontWeight: 'bold',
							fontSize: 14
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
						axisLabel: {
							formatter: '{value}'
						},
						nameTextStyle:{
							fontWeight: 'bold',
							fontSize: 14
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
						barWidth: "20%",
						type:'bar',
						data:this.orderPointData.orderData
					},
					{
						color: '#FF9118',
						name:'录单点位数',
						barWidth: "20%",
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
		loginTimeout() {
			Message.warning("登录超时,请重新登录");
			this.$router.push("/login");
		},
	},
	mounted(){
		this.getSession();
		this.getIsCom();
		this.getData();
		this.getContribute();
		this.getContributeBox();
		this.setTime();
		// this.getLinePer();
	},
};
</script>

<style scoped>
.ad_index_container{
	margin: 24px auto;
	width: 92%;
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
 @media all and (min-width: 1900px) {
    .charts2 {
      width: 1700px !important;
    }
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
.postionB{
	position: absolute;
}
.left_star{
	top: -10px;
    left: 0px;
}
.left{
	left: -46px;
    top: 60px;
    z-index: -1;
}
.right{
	left: 140px;
    top: 60px;
    z-index: -1;
}
.right_star{
	top: -10px;
    left: 135px;
}
.name{
	top: 150px;
	left: 0;
}
.name_span{
    top: 156px;
    font-size: 22px;
    color: #fff;
    left: 50px;
}
.point_num{
	margin-top: 6px;
	width: 100%;
    height: 49px;
    display: block;
    line-height: 49px;
    text-align: center;
}
.point_num span{
	width: 141px;
	display: inline-block;
    color: #fff;
    text-align: center;
    background: rgba(0,0,0,0.3);
    font-weight: bold;
    border-radius: 8px;
    font-size: 32px;
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
</style>
