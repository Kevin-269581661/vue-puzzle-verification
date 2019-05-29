<template>
    <div>
        <div class="ad_mediaMana_wrap" id="pdfDom">
            <div class="mediaMana_content_top">
                <div class="content_top_wrap">
                    <div class="title">
                        <h1>{{upReport.apName}}{{(Info.name =='SK')?'上刊':'下刊'}}报告</h1>
                        <h3>{{upReport.bTitle}} &nbsp;&nbsp;{{formatTime(upReport.apcTime)}}</h3>
                    </div>
                    <div class="detail">
                        <p>
                            <em>公司名称：</em>
                            <i>{{upReport.cName}}</i>
                            <em>投放城市：</em>
                            <!-- <i>{{filter(upReport.rIDs)}}</i> -->
                            <i>{{upReport.rIDs}}</i>
                            <em>投放面数：</em>
                            <i>{{upReport.totalNum}}</i>
                        </p>
                    </div>
                </div>
            </div>
            <div class="plan-panel">
                <el-tabs v-model="planPanel" @tab-click="handleClick()">
                    <el-tab-pane label="投放详情" name="first">
                        <div class="first-wrap box-wrap">
                            <!-- <h4>投放详情 <el-button class="down_btn" @click="getPdf('#pdfDom', 0)" :disabled="isDisble">导出PDF</el-button></h4> -->
                            <!-- <h4>投放详情  -->
                                <!-- <el-button class="down_btn" @click="getPTTx()">导出PPTx</el-button> -->
                                <!-- <el-button class="down_btn" @click="getPTT()">导出PPT</el-button> -->
                            <!-- </h4> -->
                            <div class="search-wrap">
                                <span>
                                    <el-select v-model="select" placeholder="请选择" class="type-select">
                                        <el-option v-for="item in typeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <el-input v-model="keyword" placeholder="请输入要搜索的内容" class="searchInput" @change="initData"></el-input>
                                </span>
                                <span>
                                    <el-button type="primary" icon="el-icon-search" class="searchBtn" @click="search()">搜索</el-button>
                                </span>
                                <span>
                                    <!-- <el-button class="down_btn" @click="getPTTx()">导出PPTx</el-button> -->
                                    <el-button @click="getPTT()"  class="down_btn">导出PPT</el-button>
                                    <el-button @click="getPDF()"  class="down_btn">导出PDF</el-button>
                                </span>
                                <p class="search_p">
                                    <!-- *备注：若订单点位数量过多，请点击  “导出pptx”  按钮 ，导出的 “pptx” 文件使用正版软件打开后可再另存为“ppt”格式即可发给客户 -->
                                </p>
                            </div>
                            <div class="table_wrap">
                                <el-table border :data="currPutDetail" style="width: 100%" :default-sort="{prop: 'recName', order: 'descending'}" v-loading="loading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading">
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-form label-position="left" inline class="demo-table-expand">
                                                <el-form-item label="商圈：">
                                                    <span>{{ props.row.tradingArea}}</span>
                                                </el-form-item>
                                                <el-form-item label="楼栋数量：">
                                                    <span>{{ props.row.fNum }}</span>
                                                </el-form-item>
                                                <el-form-item label="资产编号：">
                                                    <span>{{ props.row.assetTag }}</span>
                                                </el-form-item>
                                                <el-form-item label="入住年份：">
                                                    <span>{{ props.row.chDay }}</span>
                                                </el-form-item>
                                                <el-form-item label="广告限制：">
                                                    <span>{{ props.row.notPush }}</span>
                                                </el-form-item>
                                            </el-form>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="city" label="城市" min-width="6.7%" :filters="filterCityData" :filter-method="filterCity">
                                    </el-table-column>
                                    <el-table-column prop="rName" label="区域" min-width="6.7%" :filters="filtersArea" :filter-method="filterRName">
                                    </el-table-column>
                                    <el-table-column prop="resName" label="资源名称" min-width="11.9%" class="tar">
                                    </el-table-column>
                                    <el-table-column prop="resAddress" label="地址" min-width="19.5%">
                                    </el-table-column>
                                    <el-table-column prop="cType" label="楼盘类型" min-width="6.1%">
                                    </el-table-column>
                                    <el-table-column prop="chDay" label="入住时间" min-width="6.1%" class="tar">
                                    </el-table-column>
                                    <el-table-column label="楼盘价格" min-width="7.6%">
                                        <template slot-scope="scope">
                                            <span>{{priceFormat(scope.row.hPrice/100)}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="hNum" label="户数" min-width="5.6%">
                                    </el-table-column>
                                    <el-table-column label="媒体数量" prop="mediaNum" min-width="6.1%">
                                    </el-table-column>
                                    <el-table-column label="操作" min-width="6.1%">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="showImg(scope.row)">查看监播</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="地图展示" name="second">
						<div class="sec-wrap box-wrap">
							<h4>地图展示</h4>
							<div class="map">

							</div>
						</div>
					</el-tab-pane> -->
                    <el-tab-pane label="监播图片" name="third">
                        <div class="sec-wrap box-wrap">
                            <el-radio-group v-model="mediaType" size="medium" @change="changeUpMedia()">
                                <el-radio-button label="广告门"></el-radio-button>
                                <el-radio-button label="道闸"></el-radio-button>
                            </el-radio-group>
                            <div class="pager">
                                <el-pagination small background :current-page.sync="currUpPage" :page-sizes="[6, 12]" :page-size="pageUpSize" layout="sizes, prev, pager, next, jumper" :total="totalUpNum" @size-change="sizeChange" @current-change='changePage'>
                                </el-pagination>
                            </div>
                            <div class="typeOfRec">
                                <div v-for="(up, upIndex) of upReportArr" :key="up.asID+'-'+upIndex" @mouseenter="showPreImg = upIndex" @mouseleave="showPreImg = null" class="pic_box">
                                    <el-card shadow="hover" >
                                        <div slot="header" class="clearfix">
                                            <!-- <span>{{up.city+"-"+up.rName+"-"+up.resName+"-"+up.mTitle+"-"+up.asLab}}</span> -->
                                            <el-tooltip class="item" effect="dark" :content='up.city+"-"+up.rName+"-"+up.resName+"-"+up.mTitle+"-"+up.asLab' placement="bottom" v-if='(up.city+"-"+up.rName+"-"+up.resName+"-"+up.mTitle+"-"+up.asLab).length>20'>
                                                <span style="margin-right:10px;">{{wordlimit(up.city+"-"+up.rName+"-"+up.resName+"-"+up.mTitle+"-"+up.asLab, 20)}}</span>
                                            </el-tooltip>
                                            <span v-else style="margin-right:10px;">{{up.city+"-"+up.rName+"-"+up.resName+"-"+up.mTitle+"-"+up.asLab}}</span>

                                            <el-tooltip placement="top" width="200" trigger="hover" effect="dark" >
                                                <div slot="content">
                                                    <p class="tooltip_p">
                                                        <b>资产编号</b>
                                                        <span>{{up.assetTag}}</span>
                                                        <b>广告排期</b>
                                                        <span>{{formatTime(up.lStar)+'-'+formatTime(up.lEnd)}}</span>
                                                    </p>
                                                </div>
                                                <i class="el-icon-date" style="float: right; padding: 3px 0" type="text"></i>
                                            </el-tooltip>
                                        </div>
                                        <el-carousel :autoplay="false" trigger="click">
                                            <el-carousel-item v-for="(item, index) in up.upImgArr" :key="index">
                                                <img v-lazyload="item.url" alt="" @click="handlePictureCardPreview(item.url)">
                                                <!-- <img :src="item.url" alt="" @click="handlePictureCardPreview(item.url)"> -->
                                                <div class="mask-btn" v-if="showPreImg == upIndex ">
                                                    <i class="el-icon-search" @click="handlePictureCardPreview(item.url)"></i>
                                                </div>
                                            </el-carousel-item>
                                        </el-carousel>

                                    </el-card>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="发布情况" name="forth">
                        <div class="forth-wrap box-wrap">
                            <!-- <h4>发布情况</h4> -->
                            <div class="table_wrap">
                                <el-table border :data="postDetail" style="width: 100%" :default-sort="{prop: 'recName', order: 'descending'}">
                                    <el-table-column prop="city" label="城市" min-width="10.3%">
                                    </el-table-column>
                                    <el-table-column prop="planNum" label="计划点位数" min-width="18.6%">
                                    </el-table-column>
                                    <el-table-column prop="realNum" label="实际执行点位数" min-width="18.8%" class="tar">
                                    </el-table-column>
                                    <el-table-column prop="wrongNum" label="问题点位数" min-width="19.3%">
                                    </el-table-column>
                                    <el-table-column prop="resolveNum" label="问题解决数" min-width="19.8%">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!--缩略图对话框-->
                <el-dialog :visible.sync="dialogVisible">
                    <img style="width: 100%;height: 100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <!--监播图-->
                <el-dialog :visible.sync="isShowImgArr" class="JB">
                    <div style="clear: both">
                        <el-carousel :autoplay="false" trigger="click">
                            <el-carousel-item v-for="(item, index) in ImgBoxArr" :key="index">
                                <img :src="item" alt="" style="width:100%; height:100%;">
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div class="ad_index_footer clearfix">
            <p>
                Copyright &copy;{{newDate}} 亲邻科技线上产品部
            </p>
        </div>
    </div>

</template>

<script>
import Vue from "vue";
import LazyLoad from "../../commonFun/lazyLoad.js";

Vue.use(LazyLoad);

import { api } from "../../api/api";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import {
    Dialog,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Input,
    Button,
    Upload,
    Select,
    Option,
    Checkbox,
    Card,
    Progress,
    Cascader,
    Pagination,
    MessageBox,
    Message,
    Form,
    FormItem,
    Carousel,
    CarouselItem
} from "element-ui";

export default {
    name: "Report",
    components: {
        elDialog: Dialog,
        elTabs: Tabs,
        elTabPane: TabPane,
        elTable: Table,
        elTableColumn: TableColumn,
        elInput: Input,
        elButton: Button,
        elUpload: Upload,
        elSelect: Select,
        elOption: Option,
        elCheckbox: Checkbox,
        elCard: Card,
        elProgress: Progress,
        elCascader: Cascader,
        elPagination: Pagination,
        elForm: Form,
        elFormItem: FormItem,
        elCarousel: Carousel,
        elCarouselItem: CarouselItem
    },
    data() {
        return {
            newDate: new Date().getFullYear(),
            // 原数据存储
            dataFanganInfo:{},
            dataAPD: '',
            dataAdL: '',
            dataImg: '',
            loading: true,
            Info: {},
            // 当前页
            currUpPage: 1,
            pageUpSize: 6,
            totalUpNum: 0,
            //显示预览图蒙版
            showPreImg: null,
            upReport: {},
            //投放详情
            putDetail: [],
            currPutDetail: [],
            // 城市过滤
            filterCityData: [],
            // 区域过滤
            filtersArea: [],
            //搜索类型
            typeSelect: [
                { value: 1, label: "资源名称" },
                { value: 2, label: "商圈" }
            ],
            //搜索框
            keyword: "",
            select: 1,
            // tab选项
            planPanel: "first",
            //发布情况
            postDetail: [],
            // 媒体类型
            mediaType: '广告门',
            // 监播图片
            upReportArr: [],
            currUpReportArr: [],
            imgInfo: [],
            currImgInfo: [],
            // 查看监播
            isShowImgArr: false,
            // 监播图片组合
            ImgBoxArr: [],
            //监播图片内容为true则是按照资源分，false按照图片分
            isActive: true,

            //缩略图对话框
            dialogVisible: false,
            dialogImageUrl: "",
            isDisble: false,
            isImgDis: false,
        };
    },
    created() {
        this.getRouter();
        this.getData();
        // this.searchFun();
    },
    methods: {
        // tab点击
        handleClick() {
            if (this.planPanel == "third") {
                this.searchFun();
            }
        },
        // 获取ppt
        getPTT(){
            let name = this.Info.name.toString().toLowerCase();
            let val = this.Info.val;
            let info = {
                [name]: val
            };
            let addload = this.$loading({
                lock: true,
                text: '加急下载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let tempwindow = window.open();
            tempwindow.document.body.style.color = 'red';
            tempwindow.document.body.style.textAlign = 'center';
            tempwindow.document.body.style.marginTop = '200';
            tempwindow.document.body.innerHTML="正在奋力下载ppt,请稍后！"
            api.getApi(this.apiVar.Advertisement+'/GetPPTReport', info).then(res =>{
                console.log(res.data);
                addload.close();
                if(res.data.code == 300200){
                    tempwindow.location = res.data.data;
                }else if(res.data.code == 200200){
                    Message.warning(res.data.data);
                    tempwindow.document.body.innerHTML = res.data.data;
                }
            }).catch(error =>{
                if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
                    Message.warning('系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。');
                    tempwindow.document.body.innerHTML = '系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。';
                }else{
                    if(error.toString().includes('Network Error') || error.toString().includes('504')){
                        Message.warning('系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。');
                        tempwindow.document.body.innerHTML = '系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。';
                    }
                    console.log('error---', error);
                }
                addload.close();
            });
        },
        // 获取pptx
        getPTTx(){
            let name = this.Info.name.toString().toLowerCase();
            let val = this.Info.val;
            let info = {
                [name]: val
            };
            let addload = this.$loading({
                lock: true,
                text: '加急下载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let tempwindow = window.open();
            tempwindow.document.body.style.color = 'red';
            tempwindow.document.body.style.textAlign = 'center';
            tempwindow.document.body.style.marginTop = '200';
            tempwindow.document.body.innerHTML="正在奋力下载ppt,请稍后！"
            api.getApi(this.apiVar.Advertisement+'/GetPPTXReport', info).then(res =>{
                console.log(res.data);
                addload.close();
                if(res.data.code == 300200){
                    tempwindow.location = res.data.data;
                }else if(res.data.code == 200200){
                    Message.warning(res.data.data);
                    tempwindow.document.body.innerHTML = res.data.data;
                }
            }).catch(error =>{
                if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
                    Message.warning('系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。');
                    tempwindow.document.body.innerHTML = '系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。';
                }else{
                    if(error.toString().includes('Network Error') || error.toString().includes('504')){
                        Message.warning('系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。');
                        tempwindow.document.body.innerHTML = '系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。';
                    }
                    console.log('error---', error);
                }
                addload.close();
            });
        },
        // 获取pdf
        getPDF(){
            let name = this.Info.name.toString().toLowerCase();
            let val = this.Info.val;
            let info = {
                [name]: val
            };
            let addload = this.$loading({
                lock: true,
                text: '加急下载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let tempwindow = window.open();
            tempwindow.document.body.style.color = 'red';
            tempwindow.document.body.style.textAlign = 'center';
            tempwindow.document.body.style.marginTop = '200';
            tempwindow.document.body.innerHTML="正在奋力下载pdf,请稍后！"
            api.getApi(this.apiVar.Advertisement+'/GetPdfReport', info).then(res =>{
                console.log(res.data);
                addload.close();
                if(res.data.code == 300200){
                    tempwindow.location = res.data.data;
                }else if(res.data.code == 300504){
                    Message.warning(res.data.data);
                    tempwindow.document.body.innerHTML = res.data.data;
                }
            }).catch(error =>{
                if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
                    Message.warning('系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。');
                    tempwindow.document.body.innerHTML = '系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。';
                }else{
                    if(error.toString().includes('Network Error') || error.toString().includes('504')){
                        Message.warning('系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。');
                        tempwindow.document.body.innerHTML = '系统正在为您拼命加工报告，由于数据量大，请稍后回来提取报告。。。';
                    }
                    console.log('error---', error);
                }
                addload.close();
            });
        },
        // 页数大小改变
        sizeChange(pageVal) {
            console.log("pageVal", pageVal);
            this.currUpPage = 1;
            this.pageUpSize = pageVal;
            this.searchFun();
        },
        // 分页功能
        changePage(page) {
            console.log('page----', page);
            this.currUpPage = page;
            this.searchFun();
        },
        searchFun(){
            let info = this.searchFormat();
            this.getImgData(info);
        },
        changeUpMedia(){
            this.currUpPage = 1;
            this.searchFun();
        },
        // 搜索数据格式化
        searchFormat(){
            let name = this.Info.name.toString().toLowerCase();
            let val = this.Info.val;
            let info = {
                [name]: val,
                pType: this.Info.name,
                pageNum: this.currUpPage,
                pageSize: this.pageUpSize,
                mVehicle: this.mediaType,
            };
            console.log('type---', info);
            return info;
        },
        // 获取路由数据
        getRouter() {
            let route = this.$route.query;
            console.log(route);
            this.Info.name = Object.keys(route);
            this.Info.val = route[this.Info.name];
        },
        // 获取原始数据
        getData() {
            // 真实数据
            let name = this.Info.name.toString().toLowerCase();
            let val = this.Info.val;
            let info = {
                [name]: val
            };
            api.getApi(this.apiVar.Advertisement+"/GetReportBatch", info)
                .then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let data = res.data;

                        // 上下刊抬头信息
                        this.upReport = this.getFangInfo(data.adPlanInfo);
                        // 投放详情
                        let result = this.getResInfo(data.resInfo)
                        this.putDetail = result;
                        this.currPutDetail = JSON.parse(JSON.stringify(this.putDetail));
                        this.filterCityData = filterFormat(result, "city");
                        this.filtersArea = filterFormat(result, "rName");
                        // 发布情况
                        this.postDetail = this.getCityAdSpaceCount(data.cityAdSpaceCount);
                        this.loading = false;
                    } else if (res.data.SysCode == 100302) {
                        this.loading = false;
                        this.loginTimeout();
                    } else {
                        this.loading = false;
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    this.loading = false;
                    console.log(res);
                });
        },
        // 头部信息
        getFangInfo(upInfo){
            let info = {
                adcID: upInfo.adcID,
                apID: upInfo.apID,
                apName: upInfo.apName,
                apQC: upInfo.apQC,
                apState: upInfo.apState,
                apTotal: upInfo.apTotal,
                apcTime: dateFormat.toDate(upInfo.apcTime, '/'),
                bTitle: upInfo.bTitle,
                cName: upInfo.cName,
                cuName: upInfo.cuName,
                pdEnd: upInfo.pdEnd,
                pdStar: upInfo.pdStar,
                rID: upInfo.rID,
                rIDs: upInfo.rIDs,
                realName: upInfo.realName,
                totalNum: upInfo.asSpaceSum,
            };
            return info;
        },
        // 投放详情
        getResInfo(arr){
            let result = [];
            for(let item of arr){
                let obj = {
                    IsLock: item.IsLock,
                    adSize: item.adSize,
                    mediaNum: item.adSpaceCount,
                    adViewSize: item.adViewSize,
                    asID: item.asID,
                    asLab: item.asLab,
                    assetTag: item.assetTag,
                    cType: item.cType,
                    chDay: item.chDay,
                    city: item.city,
                    fNum: item.fNum,
                    hNum: item.hNum,
                    hPrice: item.hPrice,
                    lEnd: item.lEnd,
                    lID: item.lID,
                    lSetTime: item.lSetTime,
                    lStar: item.lStar,
                    lState: item.lState,
                    mTitle: item.mTitle,
                    mVehicle: item.mVehicle,
                    rID: item.rID,
                    rName: item.rName,
                    resAddress: item.resAddress,
                    resID: item.resID,
                    resName: item.resName,
                    tradingArea: item.tradingArea,
                    notPush: item.notPush
                };
                result.push(obj);
            }
            return result;
        },
        // 发布情况
        getCityAdSpaceCount(arr){
            let result = [];
            for(let data of arr){
                let obj = {
                    city: data.cityName,
                    planNum: data.adSpaceCount,
                    realNum: data.adSpaceCount,
                    wrongNum: 0,
                    resolveNum:0,
                }
                result.push(obj);
            }
            return result;
        },

        // 获取图片信息(广告门)
        getImgData(params){
            api.postApi(this.apiVar.Advertisement+"/GetImg", params)
                .then(res => {
                    if (!res.data.SysCode) {
                        console.log(res.data);
                        let dataInfo = res.data;
                        this.totalUpNum = dataInfo.totalCount;
                        for(let data of dataInfo.dataList){
                            for(let item of data.photoList){
                                item.url = item.pURL;
                            }
                            let time = this.formatTime(data.lStar) + "-" +this.formatTime(data.lEnd);
                            data.timeRange = time;
                            data.upImgArr = data.photoList;
                        }
                        this.upReportArr = dataInfo.dataList;
                        if(dataInfo.totalCount == 0){
                            Message.warning('暂无数据');
                        }
                        console.log(this.upReportArr);
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        // 查看监播
        showImg(row) {
            let name = this.Info.name.toString().toLowerCase();
            let val = this.Info.val;
            let info = {
                resId: row.resID,
                pType: this.Info.name,
                [name]: val
            };
            api.postApi(this.apiVar.Advertisement+'/GetImgByResId', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    if(res.data.data.length){
                        this.ImgBoxArr = res.data.data;
                        this.isShowImgArr = true;
                    }else{
                        Message.warning("暂无数据！！！");
                    }
                }else{
                    Message.warning(res.data.MSG);
                }
            });
        },
        // 当搜索框为空的时候进行重置显示
        initData() {
            if (!this.keyword) {
                this.currPutDetail = this.putDetail;
            }
        },
        // 搜索
        search() {
            // 账号，姓名
            console.log(this.select);
            console.log(this.keyword);
            let select = this.select;
            let keyword = this.keyword;
            if (this.keyword) {
                let arr = [];
                for (let data of this.putDetail) {
                    if (data.resName) {
                        if (select == "1" && data.resName.includes(keyword)) {
                            arr.push(data);
                        }
                    }
                    if (data.tradingArea) {
                        if (
                            select == "2" &&
                            data.tradingArea.includes(keyword)
                        ) {
                            arr.push(data);
                        }
                    }
                }
                this.currPutDetail = arr;
                return;
            }
            this.currPutDetail = this.putDetail;
        },
        // 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val, "/");
        },
        // 价格加上逗号
        priceFormat(price) {
            // console.log('price', price);
            return commaFormat.init(price);
        },
        // 字段截取
        wordlimit(word, num) {
            if(document.body.clientWidth<=1366){
                if (word && (word.length > num)) {
                    return word = word.substr(0, num) + '...';
                }
                return word;
            }else{
                return word;
            }
        },
        //缩略图
        handlePictureCardPreview(url) {
            console.log("item", url);
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        filterCity(value, row) {
            return row.city === value;
        },
        filterRName(value, row) {
            return row.rName === value;
        },
        changeImgType() {
            this.isActive = !this.isActive;
        },
        loginTimeout() {
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        }
    },
    mounted() {
        $(function() {
            $(".tabs")
                .find("button")
                .click(function() {
                    $(this)
                        .addClass("active")
                        .siblings()
                        .removeClass("active");
                });
        });
    }
};
</script>

<style scoped>
.ad_mediaMana_wrap {
    width: 100%;
    padding-top: 40px;
    position: relative;
}

.mediaMana_content_top {
    width: 90%;
    padding: 28px;
    margin: 0 auto;
    background: #fff url("../../assets/images/upReportBg.png") right no-repeat;
}

.title {
    border-bottom: 1px solid #d8d8d8;
    margin-right: 200px;
}

.title h1 {
    font-size: 42px;
    margin-bottom: 18px;
    color: rgba(0, 0, 0, 0.85);
}

.title h3 {
    font-size: 24px;
    color: #333333;
    margin-bottom: 19px;
}

.detail p {
    margin-top: 23px;
}

.detail p em {
    font-size: 18px;
    color: #333333;
    margin-left: 24px;
}

.detail p em:nth-of-type(1) {
    margin-left: 0;
}

.detail p i {
    font-size: 18px;
    color: #2a2a2a;
    font-style: normal;
}

.plan-panel {
    width: 90%;
    padding: 28px;
    margin: 24px auto;
    background: #fff;
}

/deep/ .el-tabs__nav-wrap{
    overflow: initial;
    height: 40px;
    line-height: 41px;
    border-bottom: 1px solid #dedede;
}
/deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
}
/*投放详情*/

/deep/ .el-button [class*=el-icon-]+span{
  position: relative;
  top: 0px;
  left: 2px;
}
.searchBtn {
    background: #1890ff;
    border-radius: 4px;
    width: 76px;
    height: 34px;
    position: relative;
    left: 16px;
    padding: 0;
}
.search-wrap{
    margin-left: -30px;
    position: relative;
    margin-bottom: 20px;
}
.search-wrap span {
    float: left;
    margin-left: 2px;
}
.first-wrap /deep/ .el-select .el-input .el-select__caret {
    position: relative;
    left: 0;
    top: 2px;
}

/*超出省略*/
/deep/ .el-table .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.el-input {
    width: 300px;
    height: 34px;
}

/deep/ .el-table td,
.el-table th {
    padding: 2px 0;
}

/deep/ .type-select .el-input,
/deep/ .type-select .el-input__inner {
    width: 95px;
    position: relative;
    top: 2px;
    left: 10px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 0;
    padding-left: 10px;
    height: 34px;
}

.searchInput /deep/ .el-input__inner,
.searchInput {
    width: 224px !important;
    position: relative;
    left: 7px;
    top: 0;
    height: 34px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

/deep/ .el-input__suffix {
    right: -6px;
}

.box-wrap {
    background-color: #ffffff;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
}

.box-wrap > h4 {
    margin-bottom: 26px;
    height: 55px;
    border-bottom: 1px solid #e6e7e9;
    font-size: 16px;
    color: rgba(51, 51, 51, 0.85);
    line-height: 55px;
    font-weight: bold;
}

/deep/ .el-table__column-filter-trigger {
    position: relative;
    left: 5px;
}

/deep/ .el-table th,
.el-table tr {
    background: #f7f7f7;
    padding: 4px 0;
}

/deep/ .el-table th > .cell {
    color: #666666;
    line-height: 14px;
    font-weight: bold;
}

/deep/ .el-table__expanded-cell[class*="cell"] {
    padding: 0 45px;
    background-color: #f7f7f7;
}

/deep/ .el-table__expanded-cell[class*="cell"] .el-form {
    height: 44px;
    line-height: 44px;
}

/deep/ .el-form-item__label {
    padding: 0 0 0 12px;
}

/deep/ .el-form-item__content {
    line-height: 46px;
}

/deep/ .el-table_1_column_9,
/deep/ .el-table_1_column_10 {
    text-align: right !important;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    /* height: 450px;
    overflow-y: scroll;
    overflow-x: hidden; */
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/

    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}

.el-table {
    border-radius: 4px;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/deep/ .el-tabs__item.is-active {
    font-weight: bold;
}

.ad_index_footer {
    font-size: 14px;
    color: #8a8a8a;
    text-align: center;
}

/* 监播图片 */
.typeOfRec /deep/ .el-carousel{
    width: 100%;
}
.typeOfRec /deep/ .el-carousel__item img{
    width: 100%;
    height: 100%;
}
/*查看监播*/
.JB /deep/ .el-dialog {
    width: 42%;
    margin-top: 7vh;
}

.JB /deep/ .el-carousel__container {
    height: 650px;
}

/*地图展示*/
.sec-wrap .map {
    width: 1246px;
    height: 527px;
    padding: 21px 29px;
}

/*监播图片*/
/deep/ .el-dialog {
    width: 40%;
}

/deep/ .el-tabs__header{
  margin-bottom: 10px;
}

.tabs {
    padding-left: 38px;
    margin-bottom: 25px;
    height: 34px;
}

.tabs button {
    width: 88px;
    height: 32px;
    outline: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px 0 0 4px;
    background-color: #fff;
    cursor: pointer;
    float: left;
}

.tabs button + button {
    border-radius: 0 4px 4px 0;
}

.tabs button.active {
    border: 1px solid #1890ff;
    font-weight: bold;
    color: #1890ff;
}

/*图片切换*/
.typeOfRec .pic_box{
    /* width: 30%;
    margin-top: 18px;
    display: inline-block;
    margin-right: 3.1%;
    display: inline-block; */
    width: 30%;
    margin-top: 18px;
    margin-right: 1.6%;
    display: inline-block;
    max-width: 400px;
    min-width: 385px;
}
/deep/ .typeOfRec .el-card{
    width: 100%;
}
/deep/ .typeOfRec .el-card__header{
    padding: 16px;
}
.picBox {
    width: 220px;
    height: 326px;
    padding: 4px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    display: inline-block;
    margin-bottom: 34px;
    position: relative;
    margin-right: 8px;
    margin-left: 8px;
}

.picBox img {
    width: 210px;
    height: 280px;
    border-bottom: 1px solid #e9e9e9;
}

.picBox .pic-title {
    font-size: 14px;
    color: #666666;
    text-align: center;
    height: 30px;
    line-height: 30px;
}

/deep/ .el-carousel__button {
    width: 18px;
}

/deep/ .el-carousel__indicators {
    position: absolute;
    list-style: none;
    bottom: 0;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    z-index: 2;
    width: 100%;
}

/deep/ .el-carousel__button {
    background-color: #666;
}

/*发布情况*/
.forth-wrap /deep/ .el-table th,
.el-table tr {
    padding: 6px 0;
}

.forth-wrap /deep/ .el-table .cell {
    padding: 9px 14px;
}

/deep/ .el-table_2_column_13,
/deep/ .el-table_2_column_14,
/deep/ .el-table_2_column_15,
/deep/ .el-table_2_column_16 {
    text-align: right;
}
.tooltip_p b, .tooltip_p span{
    display: block;
}
.tooltip_p span{
    color:rgba(255,255,255,1);
    margin-bottom: 10px;
}
.mask-btn .el-icon-search {
    position: absolute;
    left: 43%;
    top: 43%;
    font-size: 30px;
    color: #fff;
    cursor: pointer;
    z-index: 2;
}
/deep/ .el-tooltip__popper.is-dark{
    background: rgba(0,0,0,0.75);
}

/deep/ .el-select .el-input .el-select__caret {
    position: relative;
    left: -9px;
}

/deep/ .el-select {
    top: -4px;
}

/deep/ .btn-prev {
    position: relative;
    top: -4px !important;
}

/deep/ .el-pagination {
    position: absolute;
    right: 0;
    top: 10px;
}

/deep/ .el-pagination.is-background .el-pager li {
    font-weight: normal;
    font-size: 13px;
    background-color: transparent;
}

/deep/ .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
    position: relative;
    top: 0px !important;
    background-color: transparent !important;
}

/deep/ .el-pagination__jump {
    margin-left: 13px;
    position: relative;
    top: -4px;
}

/deep/ .el-card__body {
    display: flex;
    flex-wrap: wrap;
}

.down_btn{
    margin-left: 10px;
    border-radius: 4px;
    width: 76px;
    height: 34px;
    position: relative;
    left: 16px;
    padding: 0;
}
.search_p{
    clear: both;
    padding-left: 28px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    font-size: 12px;
    color: rgb(102, 102, 102);
}

</style>


