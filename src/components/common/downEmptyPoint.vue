<template>
    <div>
        <div>
            <header class="share_index_header">
            <div class="logo_img">
                <img src="../../assets/images/logo.png" alt="qinlink">
            </div>
            </header>
        </div>
        <div class="content">
            <div class="content_head">
                <h2>空位情况：{{rangeTime}}
                    <span style="float:right;" @click="showCart()">
                        <i class="fa fa-shopping-cart" style="color:green;"></i>
                        购物车
                    </span>
                </h2>
            </div>
            <div class="content_main">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="item.label" :name="item.label" v-for="item of cityList" :key="item.value">
                    </el-tab-pane>
                </el-tabs>
                <!-- 表格数据 -->
                <div class="city_box">
                    <div class="searchInfo">
                        <el-row>
                            <el-col :span="8">
                                <b>资源名称:</b>
                                <el-input v-model="searchInfo.resName" size="small" placeholder="请输入资源名称"></el-input>
                            </el-col>
                            <el-col :span="8">
                                <b>地理位置:</b>
                                <el-select v-model="searchInfo.area" placeholder="请选择" size="small">
                                    <el-option v-for="item in allArea" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8">
                                <b>建成年份:</b>
                                <el-date-picker v-model="searchInfo.liveTime" size="small" type="year" value-format="yyyy" format="yyyy 年" placeholder="请选择年" @change="changYear">
                                </el-date-picker>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <b>资源价格:</b>
                                <el-input-number v-model="searchInfo.startPrice" :controls='false' size="small"></el-input-number>~
                                <el-input-number v-model="searchInfo.endPrice" :controls='false' size="small"></el-input-number>
                            </el-col>
                            <el-col :span="8">
                                <b>资源户数:</b>
                                <el-input-number v-model="searchInfo.startNum" :controls='false' size="small"></el-input-number>~
                                <el-input-number v-model="searchInfo.endNum" :controls='false' size="small"></el-input-number>
                            </el-col>
                            <el-col :span="8">
                                <el-button type="primary" size="small" @click="search()">筛选</el-button>
                                <el-button  size="small" @click="reset()">重置</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-table :data="planList" border height="460" ref="multipleTable" v-loading="resLoading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading"
                        v-loadmore="resLoadMore" @select="handleSelect" @select-all="handleSelectAll">
                        <el-table-column type="selection" width="41px" scope="scope" >
                        </el-table-column>
                        <el-table-column fixed prop="resName" label="资源名称" width="200">
                            <template slot-scope="scope">
                                <b>{{scope.row.resName}}</b><br>
                                <span>{{scope.row.city+scope.row.rName+'('+scope.row.tradingArea+')'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="chDay" label="建成年份" width="110" sortable>
                        </el-table-column>
                        <el-table-column fixed prop="hPrice" label="资源价格" width="110" sortable>
                            <template slot-scope="scope">
                                <span>{{priceFormat(scope.row.hPrice/100)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="hNum" label="资源户数" width="110" sortable>
                            <template slot-scope="scope">
                                <span>{{priceFormat(scope.row.hNum)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed prop="dNum" label="总面数" width="110" sortable>
                        </el-table-column>
                        <template v-for="(item, index) of dateArr">
                            <el-table-column :label="item" :key="index" v-if="index>=0&&index<dateArr.length" min-width="190" >
                                <template slot-scope="scope">
                                    <span :key="scope.$index+'-'+index">{{scope.row.show[index].adsNum}}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </el-table>
                    <div>
                        <b>所选资源数:</b>
                        <span v-for="(item, index) of resNum" :key="index">
                            <span style="margin-left:20px;">{{item.city}}:</span>
                            <span>{{item.num}}个</span>
                        </span>
                    </div>
                    <p style="text-align:center;margin-top:20px;">
                        <el-button type="primary" size="small" @click="autoSelect()">自动换点</el-button>
                    </p>
                </div>
            </div>
            <!--尾部-->
            <div class="ad_index_footer clearfix">
                <p><img src="../../assets/images/home_icon.png" alt="">
                    Copyright &copy;{{newDate}} 亲邻科技线上产品部
                </p>
            </div>

            <!-- 自动选点 -->
            <el-dialog title="自动选点" :visible.sync="showAuto" :show-close="false" :modal="false" top="60vh">
                <div>
                    <b>投放面数:</b>
                    <el-input-number v-model="pointNum" controls-position="right" size="small"></el-input-number>
                    <b>选点排期:</b>
                    <el-date-picker size="small" class="input-with-select" v-model="rangeDate" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="投放日期" end-placeholder="投放日期">
                    </el-date-picker>
                    <p style="margin-top:30px;text-align:center;">
                        <el-button @click="doPoint" type="primary" size="small">执行选点</el-button>
                    </p>
                </div>
            </el-dialog>
            <!-- 购物车 -->
            <el-dialog title="购物车" :visible.sync="showCartBox" width="82%" class="dialog_table">
                <h3>
                    共投放  <span>200</span> 面，<span>200</span> 个资源， <span>189</span> 个门
                    <el-button size="small" style="float:right;margin-bottom:10px;" @click="clearSelect()">清除所选</el-button>
                </h3>
                <el-table :data="carShopList" border fixed height="400" width="85%">
                    <el-table-column prop="resName" label="省市区">
                        <template slot-scope="scope">
                            <span v-if="scope.row.province!=scope.row.city">{{scope.row.province+scope.row.city+scope.row.rName}}</span>
                            <span v-else>{{scope.row.city+scope.row.rName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="resName" label="资源名称">
                        <template slot-scope="scope">
                            <span>{{scope.row.resName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chDay" label="门名称">
                    </el-table-column>
                    <el-table-column prop="chDay" label="商圈">
                    </el-table-column>
                    <el-table-column prop="chDay" label="建成年份" sortable>
                    </el-table-column>
                    <el-table-column prop="hPrice" label="资源价格" sortable>
                        <template slot-scope="scope">
                            <span>{{priceFormat(scope.row.hPrice/100)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="hNum" label="资源户数" sortable>
                        <template slot-scope="scope">
                            <span>{{priceFormat(scope.row.hNum)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chDay" label="排期">
                    </el-table-column>
                    <el-table-column prop="dNum" label="投放面数">
                        <template slot-scope="scope">
                            <el-input-number size="small" v-model="scope.row.dNum"></el-input-number>
                        </template>
                    </el-table-column>
                </el-table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelEmptyPoint" size="small">返回空点</el-button>
                    <el-button type="primary" @click="addEmptyPoint" size="small">生成方案</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
// 时间格式化
import timeFormat from '../../commonFun/timeFormat.js';
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
import { api } from '../../api/api.js';
import areaToText from '../../commonFun/areaToText_new.js';
import { MessageBox, Message } from 'element-ui';
export default {
    computed:{
        // 资源数
        resNum: {
            get: function(){
                let arr = [];
                for(let data of this.cityList){
                    let obj = {
                        city: data.label,
                        num: 0
                    };
                    for(let i = 0, len = this.shopList.length;i <len; i++){
                        if(data.label == this.shopList[i].city){
                            obj.num++;
                        }
                        if(i >= len-1){
                            console.log('obj----', obj);
                            arr.push(obj);
                        }
                    }
                }
                return arr;
            },
            set: function(){

            },
        },
    },
    data(){
        return{
            newDate: new Date().getFullYear(),
            rangeTime: '',
            activeName: '广州市',
            rIDs: '',
            cityList: [],
            searchInfo:{
                resName: '',
                area: '',
                liveTime: '',
                startPrice: 0,
                endPrice: 0,
                startNum: 0,
                endNum: 0
            },
            // 资源名称列表 - 滚动加载
            resLoading: true,
            // 是否滚动加载
            loading_res: true,
            // 总的数据
            beforADTotalList: [],
            // 记录每个城市遍历到的下标
            CityPlanIndex: [],
            // 全部城市的选点列表
            totalPlanList: [],
            // 表格数据
            planList: [],
            // 资源数
            // resNum:[],

            // areaNum: [],
            // currAreaNum: [],
            // areaNumIndex: 0,
            // 当前城市社区信息
            allArea:[],
            // 所有社区信息
            areaArrList:[],
            // 表头信息时间
            dateArr: [],
            // 勾选的数据
            shopList:[],
            // 购物车数据
            carShopList:[],
            // 是否展示购物车
            showCartBox: false,
            // 是否显示自动选点
            showAuto: false,
            // 投放面数
            pointNum: 0,
            // 排期
            rangeDate: '',
        }
    },
    directives: {
        loadmore: {
            bind: function (el, binding) {
                const selectWrap = el.querySelector('.el-table__body-wrapper')
                selectWrap.addEventListener('scroll', function () {
                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                    // console.log('滚动的距离',scrollDistance)
                    if (scrollDistance <= 100) {
                        binding.value()
                    }
                })
            }
        }
    },
    methods:{
        // 资源点位 - 滚动监听
        resLoadMore(){
            if(this.loading_res){
                this.loading_res = false;
                this.addResLoadMoreFun()
                let setTimer = setTimeout(() => {
                    this.loading_res = true;
                    clearTimeout(setTimer);
                }, 1000)
            }
        },
        // 获取路由信息
        getRoute(){
            console.log(this.$route);
            console.log(this.$route.query);
            this.rIDs = this.$route.query.rid;
            let arr = this.rIDs.split(',');
            let result = [];
            for(let data of arr){
                let obj = {
                    label: areaToText.toTextCity(data),
                    value: data,
                    rid: data
                };
                result.push(obj);
            }
            this.cityList = result;
            this.activeName = this.cityList[0].label;
            for(let data of result){
                this.resNum.push({
                    city: data.label,
                    num: 0
                });
            }
        },
        // 获取默认数据
        getInitData(){
            this.getRoute();
            for(let data of this.cityList){
                console.log(data);
                api.getApi('https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/cityRes/'+data.value+'.json').then(res=>{
                    console.log(res);
                    // console.log(res.data);
                    if(!res.data.SysCode){
                        let dataArr = res.data;
                        console.log('dataArr---', dataArr);
                        let listObj = {city: data.label, rid: data.value, list: []}
                        listObj.list = dataArr;
                        this.beforADTotalList.push(listObj);
                        console.log('before---', this.beforADTotalList);
                        if(this.beforADTotalList.length >= this.cityList.length){
                            // 表头数据
                            if(dataArr[0].DateInfo){
                                for(let data of dataArr[0].DateInfo){
                                    this.dateArr.push(timeFormat.toDate(data.starDate, '/')+'-'+timeFormat.toDate(data.endDate, '/'));
                                }
                                this.rangeTime = this.dateArr[0].substring(0, 10)+'~'+this.dateArr[this.dateArr.length-1].substring(0, 10);
                            }

                            this.setAdPlan();

                        }
                        this.resLoading = false;
                    }else{
                        this.$message({
                            message: '权限异常,请重新登录',
                            type: 'warning'
                        })
                        this.$router.push('/login')
                    }
                });
            }
        },
        // 资源点位 -滚动加载2
        setAdPlan(){
            this.CityPlanIndex = [];
            let ADArr = this.beforADTotalList;
            let throwCity = this.cityList;
            console.log('throwCity-----', throwCity);
            console.log('ADArr-----', ADArr);
            // 全部城市的选点列表
            let totalList = [];
            let areaArrList = [];
            for(let i = 0, cityLen = throwCity.length; i<cityLen; i++){
                for(let j = 0, ADlen = ADArr.length; j<ADlen; j++){
                    if(throwCity[i].rid == ADArr[j].rid){
                        console.log('城市与全部点位相同的rid', ADArr[j].rid);
                        let ADList = ADArr[j].list;
                        let planArr = {city: throwCity[i].label, rid: throwCity[i].rid, list: []};
                        if(ADList.length){
                            for(let k=0, listLen = ADList.length; k<listLen; k++){
                                let obj = '';
                                obj = this.setResTableData(ADList[k]);
                                planArr.list.push(obj);
                                let index = 19;
                                if (k >= index && ADList.length >= index && planArr.list.length >= index) {
                                    let indexObj = {city: ADArr[j].city, rid: ADArr[j].rid, LIndex: k + 1}
                                    this.CityPlanIndex.push(indexObj);
                                    console.log('城市rid:', indexObj.rid, '遍历到的下标:', indexObj.LIndex);
                                    console.log('选点列表1', planArr);
                                    totalList.push(planArr);
                                    break;
                                } else {
                                    if (k >= ADList.length - 1) {
                                        let indexObj = {city: ADArr[j].city, rid: ADArr[j].rid, LIndex: k + 1}
                                        this.CityPlanIndex.push(indexObj);
                                        console.log('选点列表长度小于19', planArr);
                                        totalList.push(planArr);
                                    }
                                }
                            }
                        }else{
                            totalList.push(planArr);
                        }

                        let areaArr = {city: throwCity[i].label, rid: throwCity[i].rid, list: []};
                        areaArr.list = this.getArea(ADArr[j].list);
                        areaArrList.push(areaArr);
                    }
                }
            }

            this.totalPlanList = totalList;
            this.areaArrList = areaArrList;
            let activeName = this.activeName;
            for(let data of this.totalPlanList){
                if(data.city == activeName){
                    this.planList = data.list;
                    break;
                }
            }

            for(let data of this.areaArrList){
                if(data.city == this.activeName){
                    this.allArea = data.list;
                    break;
                }
            }
            console.log('表格数据---', this.planList);

        },
        // 设置点位上刊率表格数据
        setResTableData(resData){
            let obj = {
                resID: resData.resID,
                province: resData.prName,
                city: resData.crName,
                rName: resData.rName,
                resName: resData.resName,
                tradingArea: resData.resName,
                chDay: resData.chDay,
                hPrice: resData.hPrice,
                hNum: resData.hNum,
                dNum: resData.dNum,
                show: resData.DateInfo.sort(this.sortDate),
                isSelect: false,
            };
            return obj;
        },
        // 价格格式化
        priceFormat(price){
            return commaFormat.format(price);
        },
        // 获取区域信息
        getArea(arr){
            let result = [];
            for(let data of arr){
                let obj = {
                    label: data.rName,
                    value: data.rName
                };
                let jsonRes = JSON.stringify(result);
                let jsonObj = JSON.stringify(obj);
                if(!jsonRes.includes(jsonObj)){
                    result.push(obj);
                }
            }
            return result;
        },
        // 时间大小排序
        sortDate(a, b){
            let aDate = timeFormat.toDate(a.starDate, '');
            let bDate = timeFormat.toDate(b.starDate, '');
            return aDate - bDate;
        },
        // 资源点位 - 滚动加载
        addResLoadMoreFun(){
            console.log('监听到滚动，并调用了addADList');
            let beforAD = this.beforADTotalList;   // 选点列表
            let cityListIndex = this.CityPlanIndex;
            console.log('cityListIndex', cityListIndex);
            console.log('this.beforADTotalList', this.beforADTotalList);
            console.log('this.activeName', this.activeName);
            for (let n = 0, beLen = beforAD.length; n < beLen; n++) {
                for (let g = 0, cityLen = cityListIndex.length; g < cityLen; g++) {
                    if (cityListIndex[g].rid == beforAD[n].rid && this.activeName == beforAD[n].city) {
                        let rid = cityListIndex[g].rid;
                        console.log(cityListIndex[g].rid, '该城市从下标为', cityListIndex[g].LIndex);
                        let myIndex = cityListIndex[g].LIndex;
                        console.log('myIndex----', myIndex);
                        let city = cityListIndex[g].city;
                        let ADList = beforAD[n].list;
                        console.log('ADList.length----', ADList.length);
                        let planArr = {city: city, rid: rid, list: []}
                        for (let i = myIndex; i < ADList.length; i++) {
                            console.log('遍历选点列表');
                            let obj = '';
                            obj = this.setResTableData(ADList[i]);
                            planArr.list.push(obj);
                            if (i >= myIndex + 29 && ADList.length >= myIndex + 29 && planArr.list.length >= 29) {
                                this.CityPlanIndex[g].LIndex = i + 1;
                                console.log('滚动加载选点列表', planArr)
                                this.addListPush(planArr);
                                break;
                            } else {
                                if (i >= ADList.length - 1) {
                                    this.CityPlanIndex[g].LIndex = i + 1;
                                    console.log('滚动加载选点列表小于29', planArr);
                                    this.addListPush(planArr);
                                }
                            }
                        }
                    }
                }
            }
            // 勾选
            this.SelectioUpdate();
        },
        // addADList完成push动作
        addListPush(addData) {
            let addList = addData
            console.log('addListPush滚动增加的数据', addList)
            let city = this.activeName;
            if (city == addList.city) {
                let tempArr = addList.list
                for (let j = 0; j < tempArr.length; j++) {
                    this.planList.push(tempArr[j])
                }
            }
            console.log('this.planlist----', this.planList);
        },
        // 自动选点
        autoSelect(){
            this.showAuto = true;
        },
        // 执行选点
        doPoint(){
            this.showAuto = false;
            // api.postApi().then(res =>{
            //     console.log(res.data);
            // });
        },
        // 展示购物车
        showCart(){
            this.showCartBox = true;
        },
        // 切换城市
        handleClick(){
            console.log('this.activeName----', this.activeName);
            this.reset();
            let plan = this.totalPlanList;
            for (let i = 0, len=plan.length; i < len; i++) {
                if(plan[i].city == this.activeName){
                    this.planList = plan[i].list;
                    break;
                }
            }
            for(let data of this.areaArrList){
                if(data.city == this.activeName){
                    this.allArea = data.list;
                    break;
                }
            }
            this.SelectioUpdate();
            console.log('this.planlist-----fas', this.planList);
        },
        // 单选
		handleSelect(selection, row){
			console.log('selection___________', selection, row);
			row.isSelect = !row.isSelect;
			console.log('row.isSelect-------', row.isSelect);
			if(row.isSelect){
				let bool = true;
				for(let data of this.shopList){
					if(data.resID == row.resID){
						bool = false;
						break;
					}
				}
				if(bool){
					this.shopList.push(row);
				}

			}else{

				for(let i = 0; i< this.shopList.length; i++){
					if(this.shopList[i].resID == row.resID){
						this.shopList.splice(i, 1);
					}
				}
			}
			console.log('this.shopList-----', this.shopList);
		},
		// 全选
		handleSelectAll(selection){
			console.log('selection___fdas____', selection);
			if(selection.length){
				for(let data of this.planList){
					data.isSelect = true;
					let bool = true;
					for(let item of this.shopList){
						if(data.resID == item.resID){
							console.log('重复了');
							bool = false;
							break;
						}
					}
					if(bool){
						this.shopList.push(data);
					}
				}
				console.log('this.shopListSelectTrue',this.shopList);
			}else{
				for(let data of this.planList){
					data.isSelect = false;
					for(let i = 0; i< this.shopList.length; i++){
						if(this.shopList[i].resID == data.resID){
							this.shopList.splice(i, 1);
							break;
						}
					}
				}
				console.log('取消全选之后的数据', this.shopList);
			}
		},
        // 是否勾选更新
		SelectioUpdate(){
            let timer = setTimeout(() => {
                for(let item of this.shopList){
                    for(let data of this.planList){
                        if(item.resID == data.resID){
                            data.isSelect = true;
                            this.$refs.multipleTable.toggleRowSelection(data, true);
                            break;
                        }
                    }
                }
				clearTimeout(timer);
			}, 0);
		},
        // 清除所选
        clearSelect(){
            MessageBox.confirm('是否确认清除所选？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.carShopList = [];
                    Message.success('成功清除');
                }).catch(() => {
                    Message.info('取消清除');
                });
        },
        // 返回空点
        cancelEmptyPoint(){
            this.showCartBox = false;
        },
        // 生成方案
        addEmptyPoint(){
            this.showCartBox = false;
            MessageBox.confirm('是否确认提交方案？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    Message.success('成功提交xxx面点位');
                }).catch(() => {
                    Message.info('取消了提交');
                });
        },
        // 改变年份
        changYear(year){
            console.log(year);
        },


        // 搜索
        search(){
            console.log(this.searchInfo);
            let { resName, area, liveTime, startPrice, endPrice, startNum, endNum } = this.searchInfo;
            if(
                resName ||
                area ||
                liveTime ||
                startPrice ||
                endPrice ||
                startNum ||
                endNum
            ){
                this.resNameSearch();
            }else{
                this.$message.warning('请输入搜索条件');
            }
        },
        // 资源名称
        resNameSearch(){
            let result = [];
            let arr = [];
            let res = this.searchInfo.resName;
            for(let data of this.beforADTotalList){
                if(data.city == this.activeName){
                    arr = data.list;
                    break;
                }
            }
            if(res){
                for(let data of arr){
                    if(data.resName.includes(res)){
                        result.push(data);
                    }
                }
                this.areaSearch(result);
            }else{
                this.areaSearch(arr);
            }
        },
        // 区域搜索
        areaSearch(arr){
            let result = [];
            let area = this.searchInfo.area;
            if(area){
                for(let data of arr){
                    if(data.rName.includes(area)){
                        result.push(data);
                    }
                }
                this.liveTimeSearch(result);
            }else{
                this.liveTimeSearch(arr);
            }
        },
        // 建成年份搜索
        liveTimeSearch(arr){
            let result = [];
            let liveTime = this.searchInfo.liveTime;
            if(liveTime){
                for(let data of arr){
                    if(data.chDay.includes(liveTime)){
                        result.push(data);
                    }
                }
                this.priceSearch(result);
            }else{
                this.priceSearch(arr);
            }
        },
        // 价格搜索
        priceSearch(arr){
            let result = [];
            let start = this.searchInfo.startPrice;
            let end = this.searchInfo.endPrice;
            if( start || end){
                if(start && end){
                    for(let data of arr){
                        if((data.hPrice/100)<=end && (data.hPrice/100)>=start){
                            result.push(data);
                        }
                    }
                }else if(start){
                    for(let data of arr){
                        if((data.hPrice/100)>=start){
                            result.push(data);
                        }
                    }
                }else if(end){
                    for(let data of arr){
                        if((data.hPrice/100)<=end){
                            result.push(data);
                        }
                    }
                }

                this.numSearch(result);
            }else{
                this.numSearch(arr);
            }
        },
        // 资源户数搜索
        numSearch(arr){
            let result = [];
            let start = this.searchInfo.startNum;
            let end = this.searchInfo.endNum;
            if( start || end ){
                if(start && end){
                    for(let data of arr){
                        if(data.hNum<=end && data.hNum>=start){
                            result.push(data);
                        }
                    }
                }else if(start){
                    for(let data of arr){
                        if(data.hNum>=start){
                            result.push(data);
                        }
                    }
                }else if(end){
                    for(let data of arr){
                        if(data.hNum<=end){
                            result.push(data);
                        }
                    }
                }
                this.formatData(result);
            }else{
                this.formatData(arr);
            }
        },
        // 数据格式化
        formatData(arr){
            let result = [];
            for(let data of arr){
                let tem = '';
                tem = this.setResTableData(data);
                result.push(tem);
            }
            this.loading_res = false;
            // this.currAreaNum = result;
            this.planList = result;
            this.SelectioUpdate();
        },
        // 重置
        reset(){
            this.searchInfo = {
                resName: '',
                area: '',
                liveTime: '',
                startPrice: 0,
                endPrice: 0,
                startNum: 0,
                endNum: 0
            };
            // this.areaNumIndex = 0;
            // this.currAreaNum = [];
            this.planList = [];
            for(let data of this.CityPlanIndex){
                if(data.city == this.activeName){
                    data.LIndex = 0;
                    break;
                }
            }
            this.addResLoadMoreFun();
            this.loading_res = true;
        },
        // 登录超时进行登出
        loginTimeout(){
            this.$message({
                message: '登录超时或权限异常,请重新登录',
                type: 'warning'
            })
            this.$router.push('/login')
        },
    },
    mounted(){

        this.getInitData();

    },
}
</script>

<style scoped>
.share_index_header {
    width: 100%;
    background: #444;
    height: 60px;
}

.logo_img {
    padding: 14px 0 0 38px;
}
.logo_img img {
    width: 103px;
}

.content{
    width: 90%;
    margin: 0 auto;
}
.content_head {
    margin-top: 25px;
    height: 90px;
    background: #fff;
    padding: 17px 24px;
}

.content_head h2 {
    font-family: PingFangSC-Medium;
    font-weight: bold;
    font-size: 20px;
    color: rgba(0,0,0,0.85);
    line-height: 28px;
    margin-bottom: 10px;
}
.content_main{
    margin-top: -40px;
}
.city_box{
    background: #fff;
    margin-top: 12px;
    padding: 24px;
}
.content_main /deep/ .el-tabs__nav-scroll {
    padding-left: 28px;
}
.content_main /deep/ .el-table th,
.el-table tr {
    background: #f7f7f7;
    padding: 7px 0;
}

.searchInfo .el-input{
    max-width: 200px;
    margin-bottom: 16px;
}
.searchInfo b{
    font-weight: normal;
    font-size: 14px;
}
.searchInfo .el-input-number--small{
    width: 92px;
}
.searchInfo{
    margin-bottom: 20px;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    overflow-y: scroll;
    overflow-x: scroll;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    height: 8px;
    background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}
/deep/ .el-date-editor--daterange.el-input__inner{
    width: 245px;
}
/deep/ .city_box .el-table__fixed{
    height: 450px !important;
}
/deep/ .el-input-number--small .el-input-number__decrease{
    width: 25px;
    font-size: 13px;
}
/deep/ .el-input-number--small .el-input-number__increase{
    width: 25px;
    font-size: 13px;
}
/deep/ .el-input-number--small{
    width: 100px;
    line-height: 30px;
}
/deep/ .dialog_table .el-table th{
    background-color: #f7f7f7;
    padding: 7px 0;
}
</style>
