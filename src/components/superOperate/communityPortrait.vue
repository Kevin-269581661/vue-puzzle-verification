<template>
    <div class="community_portrait">
        <div class="ad_mediaDetail_nav ">
            <p><a href="#" style="color: #999">亲邻智邻</a></p>
        </div>
        <div class="portrait_main">
            <div class="portrait_basic_info">
                <div class="portrait_header_select">
                    <el-select v-model="selectAsrId"
                               size="mini"
                               placeholder="请选择"
                               style="width: 190px"
                               @change="selectAsrIdFun">
                        <el-option
                            v-for="item in companyList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <img src="../../assets/images/resLogo.svg" alt="" style="vertical-align: middle">
                <el-popover
                    placement="bottom"
                    title=""
                    width="188"
                    trigger="click">
                    <div>
                        <el-input
                            placeholder="请输入内容"
                            size="small"
                            suffix-icon="el-icon-search"
                            v-model="searchResName"
                            @change="searchFun">
                        </el-input>
                        <ul class="resName_list">
                            <li class="resName_li"
                                v-for="(item,index) in resList"
                                :class="item.resName === selectRes ? 'active_Li' : ''"
                                :key="index"
                                @click="changeResName(item)">
                                {{item.resName}}
                            </li>
                        </ul>
                    </div>
                    <h2 slot="reference" class="community_name">
                        {{selectRes}}
                        <i class="el-icon-caret-bottom"></i>
                    </h2>
                </el-popover>
                <div class="community_main_info">
                    <div class="community_info_row">
                        <h4 class="community_info_h4">位置信息</h4>
                        <el-row>
                            <el-col :span="6">
                                <label class="community_info_label">城市：</label><span>{{resData.city || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">区域：</label><span>{{resData.cityArea || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">商圈：</label><span>{{resData.tradingArea || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">详细地址：</label><span>{{resData.resAddress}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="community_info_row">
                        <h4 class="community_info_h4">社区类型</h4>
                        <el-row>
                            <el-col :span="6">
                                <label class="community_info_label">资源类型：</label><span>{{resData.resType == 1 ? '社区' : '写字楼'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">楼盘类型：</label><span>{{resData.houseType || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">楼盘价格：</label><span>¥{{resData.floorPrice || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">入住年份：</label><span>{{resData.joinTime || '--'}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="community_info_row">
                        <h4 class="community_info_h4">社区信息</h4>
                        <el-row>
                            <el-col :span="6">
                                <label class="community_info_label">楼栋数量：</label><span>{{resData.buildingNum || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">住户数量：</label><span>{{resData.HouseNum || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">媒体数量：</label><span>{{resData.mediaNum || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <label class="community_info_label">点位数量：</label><span>{{resData.adsNum || '--'}}</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="chart_wrap" v-show="isHaveData"
                 v-loading="chartWrapLoading"
                 element-loading-text="玩命加载中..."
                 element-loading-background="rgba(255, 255, 255)">
                <!--性别情况、婚姻状况、子女预测-->
                <div class="portrait_row">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">性别情况</span>
                                </div>
                                <div class="box_main">
                                    <div ref="sexConditionPie" style="width: 100%;height: 100%;"></div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">婚姻状况</span>
                                </div>
                                <div class="box_main">
                                    <div ref="marriagePie" style="width: 100%;height: 100%"></div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">子女预测</span>
                                </div>
                                <div class="box_main">
                                    <div ref="childrenForecastPie" style="width: 100%;height: 100%"></div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <!--年龄分布、生肖Top5-->
                <div class="portrait_row">
                    <el-row :gutter="24">
                        <el-col :span="16">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">年龄分布</span>
                                </div>
                                <div class="box_main">
                                    <div ref="ageDataBar" style="width: 100%;height: 100%"></div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">生肖Top6</span>
                                </div>
                                <div class="box_main">
                                    <p class="progress_li progress_li_title">
                                        <span class="progress_li_name">生肖</span>
                                        <span class="progress_li_num">占比</span>
                                    </p>
                                    <ul v-show="shengXiaoList.length">
                                        <li class="progress_li" v-for="(item,index) in shengXiaoList" :key="index+1">
                                            <span class="progress_li_name">{{item.label}}</span>
                                            <span class="progress_li_value">{{item.value}}%</span>
                                            <div class="progress_li_num">
                                                <el-progress :percentage="item.percent" :show-text="false"></el-progress>
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-show="!shengXiaoList.length">
                                        <noSearchResult style="text-align: center;margin-top: 24px"></noSearchResult>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <!--教育程度、职业分布、毕业院校-->
                <div class="portrait_row">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">教育程度</span>
                                </div>
                                <div class="box_main">
                                    <ul class="little_height_ul">
                                        <li class="progress_li progress_li_title">
                                            <span class="progress_li_name">学历</span>
                                            <span class="progress_li_num">占比</span>
                                        </li>
                                        <li class="progress_li" v-for="(item,index) in educationList" :key="index+1">
                                            <span class="progress_li_name">{{item.label}}</span>
                                            <span class="progress_li_value">{{item.value}}%</span>
                                            <div class="progress_li_num">
                                                <el-progress :percentage="item.percent" :show-text="false"></el-progress>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">职业分布</span>
                                </div>
                                <div class="box_main">
                                    <ul class="little_height_ul">
                                        <li class="progress_li progress_li_title">
                                            <span class="progress_li_name">职业</span>
                                            <span class="progress_li_num">占比</span>
                                        </li>
                                        <li class="progress_li" v-for="(item,index) in professionDistributeList" :key="index+1">
                                            <span class="progress_li_name">{{item.label}}</span>
                                            <span class="progress_li_value">{{item.value}}%</span>
                                            <div class="progress_li_num">
                                                <el-progress :percentage="item.percent" :show-text="false"></el-progress>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">毕业院校</span>
                                </div>
                                <div class="box_main">
                                    <p class="progress_li progress_li_title">
                                        <span class="progress_li_name">学历</span>
                                        <span class="progress_li_num">占比</span>
                                    </p>
                                    <ul class="little_height_ul" v-show="schoolKindList.length">
                                        <li class="progress_li" v-for="(item,index) in schoolKindList" :key="index+1">
                                            <span class="progress_li_name">{{item.label}}</span>
                                            <span class="progress_li_value">{{item.value}}%</span>
                                            <div class="progress_li_num">
                                                <el-progress :percentage="item.percent" :show-text="false"></el-progress>
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-show="!schoolKindList.length">
                                        <noSearchResult style="text-align: center;margin-top: 24px"></noSearchResult>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <!--有车概率、有房概率、购买力-->
                <div class="portrait_row">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">有车概率</span>
                                </div>
                                <div class="box_main">
                                    <div ref="haveCarPie" style="width: 100%;height: 100%"></div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">有房概率</span>
                                </div>
                                <div class="box_main">
                                    <div ref="haveHousePie" style="width: 100%;height: 100%"></div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="8">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="box_card_title">购买力</span>
                                </div>
                                <div class="box_main">
                                    <div ref="purchasingPowerPie" style="width: 100%;height: 100%"></div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <!--手机设备-->
                <div class="portrait_row">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span class="box_card_title">手机设备</span>
                        </div>
                        <div class="box_main" >
                            <el-row>
                                <el-col :span="11">
                                    <div ref="mobilePhonePie" style="width: 100%;height: 352px"></div>
                                </el-col>
                                <el-col :span="13">
                                    <p class="progress_li progress_li_title">
                                        <span class="progress_li_rate">排名</span>
                                        <span class="progress_li_name phone_li_name">手机品牌</span>
                                        <span class="progress_li_num">占比</span>
                                    </p>
                                    <ul class="little_height_ul mobile_phone_ul" v-show="mobilePhoneList.length">
                                        <li class="progress_li" v-for="(item,index) in mobilePhoneList" :key="index+1">
                                            <span class="progress_li_rate">{{index + 1}}</span>
                                            <span class="progress_li_name phone_li_name">{{item.label}}</span>
                                            <span class="progress_li_value">{{item.value}}%</span>
                                            <div class="progress_li_num">
                                                <el-progress :percentage="item.percent"
                                                             :show-text="false"></el-progress>
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-show="!mobilePhoneList.length">
                                        <noSearchResult style="text-align: center;margin-top: 24px"></noSearchResult>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </div>
            </div>
            <div class="no_data" v-show="!isHaveData">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="box_card_title">社区画像</span>
                    </div>
                    <div class="box_main" style="text-align: center;padding-top: 78px;height: 248px">
                        <img src="../../assets/images/nofound.png" alt="暂无社区画像数据" width="122" height="83" />
                        <p class="not_search">暂无社区画像数据</p>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../api/api';
    import sessFun from '../../commonFun/sessFun';
    import noSearchResult from '../common/components/noSearchResult'
    export default {
        name: "communityPortrait",
        components:{
            noSearchResult
        },
        data() {
            return {
                // 默认小区
                portraitInfo: '',
                chartWrapLoading: true,
                colorArr: ['#F1627A', '#1890FF', '#4DCB73', '#FFBE00', '#48CBFF', '#FF6C42'],
                // 该小区是否有社区画像数据
                isHaveData: true,
                sessionData: '',
                // 默认选择的公司
                selectAsrId: '',
                companyList: [],
                resList: [],
                selectRes: '',
                activeResID: '',
                // 搜索框内容
                searchResName: '',
                resData: {
                    resName: '',
                    resType: '1',
                    city: '',
                    cityArea: '',
                    tradingArea: '',
                    houseType: '',
                    floorPrice: '',
                    HouseNum: 0,
                    buildingNum: 0,
                    joinTime: '',
                    resAddress: '',
                    mediaNum: 0,
                    adsNum: 0
                },
                // 性别环状图表
                sexPieEcharts: '',
                sexPieInfo: [],
                // 婚姻状况
                marriagePieEcharts: '',
                marriagePieInfo: [],
                // 子女预测
                childrenForecastPieEcharts: '',
                childrenForecastPieInfo: [],
                // 年龄分布
                ageDataBarEcharts: '',
                AgeBarInfo:{
                  data:[],
                  title:[]
                },
                // 生肖top5
                shengXiaoList:[],
                // 教育程度
                educationList:[],
                // 职业分布
                professionDistributeList:[],
                // 毕业院校
                schoolKindList:[],
                // 有车概率
                haveCarPieEcharts: '',
                haveCarPieInfo: [],
                // 有房概率
                haveHousePieEcharts: '',
                haveHousePieInfo:[],
                // 购买力
                purchasingPowerPieEcharts: '',
                purchasingPowerPieInfo:[],
                // 手机设备
                mobilePhonePieEcharts: '',
                mobilePhonePieInfo: '',
                // 手机品牌列表
                mobilePhoneList: [],
            }
        },
        mounted() {
            this.getSessionData();
            // 获取小区详细信息
            this.getResInfoByID();
            // 获取小区的画像排行数据
            this.getPortraitByResID();
            // 手机设备
            // this.initMobilePhonePie();
            // 图表统一监听
            this.echartsListener();
        },
        methods: {
            // 获取用户信息
            getSessionData() {
                this.sessionData = sessFun.getSess()
                this.portraitInfo = JSON.parse(sessionStorage.getItem('portraitInfo'))
                console.log('portraitInfo',this.portraitInfo)
                this.getCompanyList()
            },
            // 平台商公司列表
            getCompanyList() {
                // 选中的资源名称
                this.selectRes = this.portraitInfo[0].resName
                // 选中的资源id
                this.activeResID = this.portraitInfo[0].resId
                // 选中的公司
                this.selectAsrId = this.portraitInfo[0].asrId
                let arr = []
                for (let key of this.portraitInfo) {
                    arr.push({
                        value: key.asrId,
                        label: key.asrName,
                    })
                }
                this.companyList = arr
                console.log('companyList', this.companyList)
            },
            // 选择公司
            selectAsrIdFun(){
                this.searchResName = ''
                this.resList = []
                for (let key of this.portraitInfo) {
                    if (key.asrId == this.selectAsrId) {
                        // 选中的资源名称
                        this.selectRes = key.resName
                        // 选中的资源id
                        this.activeResID = key.resId
                        // 选中的公司
                        this.selectAsrId = key.asrId
                        this.getResInfoByID();
                        this.getPortraitByResID();
                        break
                    }
                }
            },
            // 统一监听
            echartsListener() {
                window.addEventListener("resize", ()=> {
                    this.sexPieEcharts.resize();
                    // 婚姻状况
                    this.marriagePieEcharts.resize();
                    // 子女预测
                    this.childrenForecastPieEcharts.resize();
                    // 年龄分布
                    this.ageDataBarEcharts.resize();
                    this.haveCarPieEcharts.resize();
                    this.haveHousePieEcharts.resize();
                    // 购买力
                    this.purchasingPowerPieEcharts.resize();
                    // 手机设备
                    this.mobilePhonePieEcharts.resize();
                });
            },
            // 根据名称模糊匹配小区
            searchFun(val){
                if (val) {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        asrId: this.selectAsrId,// this.sessionData.asrID,
                        resName: val
                    }
                    api.getApi(this.apiVar.portrait + '/api/v1/resInfo/getResList',params).then(res=>{
                        console.log('小区列表res',res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            sessFun.loginTimeout()
                        } else if (res.data.SysCode === 200200) {
                            let resData = res.data.data
                            let arr = []
                            for(let key of resData) {
                                arr.push({
                                    resName: key.resName,
                                    resID: key.resID
                                })
                            }
                            this.resList = arr
                        } else {
                            sessFun.messageFun('warning',res.data.MSG)
                        }
                    })
                } else {
                    console.log('输入框为空',val)
                }
            },
            // 选择资源
            changeResName(item) {
                console.log('item', item)
                this.selectRes = item.resName
                this.activeResID = item.resID
                this.getResInfoByID()
                this.getPortraitByResID()
            },
            // 获取小区详细信息
            getResInfoByID() {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    resId: this.activeResID
                }
                api.getApi(this.apiVar.portrait + '/api/v1/resInfo/getResInfoByResId',params).then(res=>{
                    console.log('小区详情res',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.resData = {
                            resID: dataObj.resID,
                            resName: dataObj.resName,
                            resType: dataObj.resType,
                            city: dataObj.rname,
                            cityArea: dataObj.pname,
                            tradingArea: dataObj.tradingArea,
                            houseType: dataObj.ctype,
                            floorPrice: dataObj.hprice / 100,
                            HouseNum: dataObj.hnum,
                            buildingNum: dataObj.fnum,
                            joinTime: dataObj.chDay,
                            resAddress: dataObj.resAddress,
                            mediaNum: dataObj.mediaCount,
                            adsNum: dataObj.asCount
                        }
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                })
            },
            // 获取小区的画像排行数据
            getPortraitByResID(){
                this.chartWrapLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    resId: this.activeResID//40730//this.activeResID
                }
                api.getApi(this.apiVar.portrait + '/api/v1/resInfo/getByComId',params).then(res=>{
                    console.log('小区详情res',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        if((dataObj.getGender && dataObj.getGender.length) ||
                            (dataObj.getMarriage && dataObj.getMarriage.length) ||
                            (dataObj.getAge && dataObj.getAge.length) ||
                            (dataObj.getChildren &&  dataObj.getChildren.length)||
                            (dataObj.getZodiac &&  dataObj.getZodiac.length) ||
                            (dataObj.getAcademy &&  dataObj.getAcademy.length) ||
                            (dataObj.getHaveRoom &&  dataObj.getHaveRoom.length) ||
                            (dataObj.getBuy &&  dataObj.getBuy.length) ||
                            (dataObj.getBrand &&  dataObj.getBrand.length)){
                            this.isHaveData = true
                            let timer = setTimeout(()=>{
                                // 性别情况
                                this.setSexPieData(dataObj.getGender)
                                // 婚姻状况
                                this.setMarriagePieData(dataObj.getMarriage)
                                // 子女预测
                                this.setChildrenForecastPieData(dataObj.getChildren)
                                // 年龄分布
                                this.setAgeBarData(dataObj.getAge)
                                // 生肖Top5
                                this.setProgressData(dataObj.getZodiac,'生肖');
                                // 教育程度
                                this.setProgressData(dataObj.getEducation,'教育程度');
                                // 职业分布
                                this.setProgressData(dataObj.getOccupation,'职业分布');
                                // 毕业院校
                                this.setProgressData(dataObj.getAcademy,'毕业院校');
                                // 有车概率
                                this.setHaveCarAndHousePieData(dataObj.getHaveCar,'car')
                                // 有房概率
                                this.setHaveCarAndHousePieData(dataObj.getHaveRoom,'house')
                                // 购买力
                                this.setPurchasingPowerPieData(dataObj.getBuy)
                                // 手机操作系统
                                this.setMobilePhonePieData(dataObj.getOperating)
                                // 手机品牌列表
                                this.setMobilePhoneList(dataObj.getBrand)
                                clearTimeout(timer)
                            },10)
                        } else {
                            this.isHaveData = false
                        }
                        this.chartWrapLoading = false
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                        this.isHaveData = false
                        this.chartWrapLoading = false
                    }
                })
            },
            // 设置性别情况数据
            setSexPieData(data){
                let arr = []
                for (let key of data) {
                    let tagValue = this.keepTwoDecimal(key.tagValue)
                    if (key.tagIdSecondName.includes('女')) {
                        arr[0] = {value: tagValue, name: key.tagIdSecondName}
                    } else if (key.tagIdSecondName.includes('男')) {
                        arr[1] = {value: tagValue, name: key.tagIdSecondName}
                    } else if (key.tagIdSecondName.includes('未知') || !key.tagIdSecondName) {
                        arr[2] = {value: tagValue, name: key.tagIdSecondName || '未知'}
                    }
                }
                this.sexPieInfo = arr
                this.initSexPie()
            },
            // 性别情况
            initSexPie() {
                if(this.sexPieEcharts){
                    this.sexPieEcharts.dispose()
                }
                this.sexPieEcharts = this.$echarts.init(this.$refs.sexConditionPie);
                this.sexPieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        // top: '3%',
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        icon:'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                    },
                    series: [
                        {
                            name:'性别情况',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            color: this.colorArr,
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 6,
                                    show: true
                                }
                            },
                            data: this.sexPieInfo
                        }
                    ]
                });
            },
            // 设置婚姻状况数据
            setMarriagePieData(data){
                let arr = []
                for (let key of data) {
                    let tagValue = this.keepTwoDecimal(key.tagValue)
                    if (key.tagIdSecondName.includes('未婚')) {
                        arr[0] = {value: tagValue, name: key.tagIdSecondName}
                    } else if (key.tagIdSecondName.includes('已婚')) {
                        arr[1] = {value: tagValue, name: key.tagIdSecondName}
                    } else if (key.tagIdSecondName.includes('未知') || !key.tagIdSecondName) {
                        arr[2] = {value: tagValue, name: key.tagIdSecondName || '未知'}
                    }
                }
                this.marriagePieInfo = arr
                this.initMarriagePie();
            },
            // 婚姻状况
            initMarriagePie() {
                if(this.marriagePieEcharts){
                    this.marriagePieEcharts.dispose()
                }
                this.marriagePieEcharts = this.$echarts.init(this.$refs.marriagePie);
                this.marriagePieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        // top: '3%',
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        icon:'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                    },
                    series: [
                        {
                            name:'婚姻状况',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            color: this.colorArr,
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 6,
                                    show: true
                                }
                            },
                            data:this.marriagePieInfo
                        }
                    ]
                });
            },
            // 设置子女预测数据
            setChildrenForecastPieData(data){
                let arr = []
                if (data && data.length) {
                    for (let key of data) {
                        let tagValue = this.keepTwoDecimal(key.tagValue)
                        if (key.tagIdSecondName.includes('有')) {
                            arr[0] = {value: tagValue, name: key.tagIdSecondName}
                        } else if (key.tagIdSecondName.includes('未知') || !key.tagIdSecondName) {
                            arr[1] = {value: tagValue, name: key.tagIdSecondName || '未知'}
                        }
                    }
                }
                this.childrenForecastPieInfo = arr
                this.initChildrenForecastPie();
            },
            // 子女预测
            initChildrenForecastPie() {
                if(this.childrenForecastPieEcharts){
                    this.childrenForecastPieEcharts.dispose()
                }
                this.childrenForecastPieEcharts = this.$echarts.init(this.$refs.childrenForecastPie);
                this.childrenForecastPieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        // top: '3%',
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        icon:'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                    },
                    series: [
                        {
                            name:'子女预测',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            color: ['#1890FF','#4DCB73'],
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 6,
                                    show: true
                                }
                            },
                            data: this.childrenForecastPieInfo
                        }
                    ]
                });
            },
            // 设置年龄分布数据
            setAgeBarData(data) {
                let arrData = []
                let arrTitle = []
                for (let key of data) {
                    let tagValue = this.keepTwoDecimal(key.tagValue)
                    arrData.push(tagValue)
                    arrTitle.push(key.tagIdSecondName)
                }
                this.AgeBarInfo.data = arrData
                this.AgeBarInfo.title = arrTitle
                console.log('this.AgeBarInfo',this.AgeBarInfo)
                this.initAgeDataBar();
            },
            // 年龄分布
            initAgeDataBar() {
                if(this.ageDataBarEcharts){
                    this.ageDataBarEcharts.dispose()
                }
                this.ageDataBarEcharts = this.$echarts.init(this.$refs.ageDataBar)
                this.ageDataBarEcharts.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' + '<span>' + '年龄分布' + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params[0].name +
                                '</span>' + params[0].data + '%' +'</p>'
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        x: 100,     //控制x轴文字与底部的距离
                        y2: 200,    // y2可以控制倾斜的文字与最右边的距离，放置倾斜的文字超过显示区域
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.AgeBarInfo.title,//['15岁以下','16-25岁','26-35岁','36-45岁','46-55岁','56岁以上','未知'],
                            axisTick: {
                                alignWithLabel: true
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
                                interval: 0,    //强制文字产生间隔
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                },
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                            axisLabel: {
                                formatter: '{value}%',
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
                        }
                    ],
                    series: [
                        {
                            color: '#4AA6FC',
                            name: '',
                            type: 'bar',
                            barWidth: '18%',
                            data: this.AgeBarInfo.data,//[380,920,650,520,230,330,190]
                        }
                    ]
                });
            },
            // 生肖Top5、教育程度、职业分布、毕业院校
            setProgressData(data,string){
                let arr = []
                if (data && data.length) {
                    let i = 0
                    let max = this.keepTwoDecimal(data[0].tagValue)
                    for (let key of data) {
                        if (i < 6) {
                            let tagValue = this.keepTwoDecimal(key.tagValue)
                            arr.push({
                                value: tagValue,
                                label: key.tagIdSecondName || '未知',
                                percent: tagValue < max ? (tagValue / max) * 100 : 100,
                            })
                        } else {
                            break;
                        }
                        i++
                    }
                }
                if (string === '生肖') {
                    this.shengXiaoList = arr
                } else if (string === '教育程度') {
                    this.educationList = arr
                } else if (string === '职业分布') {
                    this.professionDistributeList = arr
                } else if (string === '毕业院校') {
                    this.schoolKindList = arr
                }
            },
            // 设置有车概率数据 / 设置有房概率数据
            setHaveCarAndHousePieData(data,string){
                let arr = []
                if(data) {
                    for (let key of data) {
                        let tagValue = this.keepTwoDecimal(key.tagValue)
                        switch (key.tagIdSecondName) {
                            case '高':
                                arr[0] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '中高' :
                                arr[1] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '中等':
                                arr[2] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '中低' :
                                arr[3] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '低':
                                arr[4] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '未知' :
                                arr[5] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                        }
                    }
                }
                if (string === 'car') {
                    this.haveCarPieInfo = arr
                    this.initHaveCarPie()
                } else if (string === 'house') {
                    this.haveHousePieInfo = arr
                    this.initHaveHousePie()
                }
            },
            // 有车概率
            initHaveCarPie() {
                if(this.haveCarPieEcharts){
                    this.haveCarPieEcharts.dispose()
                }
                this.haveCarPieEcharts = this.$echarts.init(this.$refs.haveCarPie);
                this.haveCarPieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        // top: '3%',
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        icon:'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                    },
                    series: [
                        {
                            name:'有车概率',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            color: this.colorArr,
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 6,
                                    show: true
                                }
                            },
                            data: this.haveCarPieInfo
                        }
                    ]
                });
            },
            // 有房概率
            initHaveHousePie(){
                if(this.haveHousePieEcharts){
                    this.haveHousePieEcharts.dispose()
                }
                this.haveHousePieEcharts = this.$echarts.init(this.$refs.haveHousePie);
                this.haveHousePieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        // top: '3%',
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        icon:'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                    },
                    series: [
                        {
                            name:'有房概率',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: false,
                            color: this.colorArr,
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '14',
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 10,
                                    length2: 6,
                                    show: true
                                }
                            },
                            data: this.haveHousePieInfo
                        }
                    ]
                });
            },
            // 设置购买力数据
            setPurchasingPowerPieData(data){
                let arr = [
                    {value: 0, name: ''},
                    {value: 0, name: ''},
                    {value: 0, name: ''},
                    {value: 0, name: ''}
                ]
                if (data && data.length) {
                    for (let key of data) {
                        let tagValue = this.keepTwoDecimal(key.tagValue)
                        switch (key.tagIdSecondName) {
                            case '高':
                                arr[0] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '中':
                                arr[1] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '低':
                                arr[2] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                            case '未知' :
                                arr[3] = {value: tagValue, name: key.tagIdSecondName};
                                break;
                        }
                    }
                }
                this.purchasingPowerPieInfo = arr
                this.initPurchasingPowerPie()
            },
            // 购买力
            initPurchasingPowerPie(){
                if(this.purchasingPowerPieEcharts){
                    this.purchasingPowerPieEcharts.dispose()
                }
                this.purchasingPowerPieEcharts = this.$echarts.init(this.$refs.purchasingPowerPie);
                this.purchasingPowerPieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        // top: '3%',
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        icon:'circle',
                        itemWidth: 9,
                        itemHeight: 9,
                    },
                    series: [
                        {
                            name:'购买力',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['50%', '45%'],
                            avoidLabelOverlap: true,
                            color: this.colorArr,
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 14,
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    length: 10,
                                    length2: 6,
                                }
                            },
                            data: this.purchasingPowerPieInfo
                        }
                    ]
                });
            },
            // 设置手机操作系统数据
            setMobilePhonePieData(data){
                let arr = []
                if (data && data.length) {
                    for (let key of data) {
                        let tagValue = this.keepTwoDecimal(key.tagValue)
                        arr.push({
                            value: tagValue,
                            name: key.tagIdSecondName || '未知'
                        })
                    }
                }
                this.mobilePhonePieInfo = arr
                this.initMobilePhonePie()
            },
            // 手机设备
            initMobilePhonePie(){
                if(this.mobilePhonePieEcharts){
                    this.mobilePhonePieEcharts.dispose()
                }
                this.mobilePhonePieEcharts = this.$echarts.init(this.$refs.mobilePhonePie);
                this.mobilePhonePieEcharts.setOption ({
                    tooltip: {
                        trigger: 'item',
                        formatter: (params)=> {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    legend: {
                        orient: 'vertical',
                        right: '8%',
                        top: 'center',
                        icon:'circle',
                        itemWidth: 10,
                        itemHeight: 10,
                        itemGap: 16,
                    },
                    series: [
                        {
                            name:'手机设备',
                            type:'pie',
                            radius: ['50%', '70%'],
                            center: ['43%', '45%'],
                            avoidLabelOverlap: true,
                            color: this.colorArr,
                            label: {
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: 14,
                                    }
                                },
                                textStyle: {
                                    // color: '#666',
                                    fontSize: 12
                                },
                                formatter: (params)=>{
                                    // return  params.name + '(' +params.percent + '%)'
                                    return params.percent  + '%'
                                }
                            },
                            labelLine: {
                                normal: {
                                    length: 12,     // 视觉引导线第一段的长度
                                    length2: 8,     // 视觉引导项第二段的长度
                                    show: true
                                }
                            },
                            data: this.mobilePhonePieInfo
                        }
                    ]
                });
            },
            // 手机品牌列表
            setMobilePhoneList(data) {
                let arr = []
                if (data && data.length) {
                    let max = this.keepTwoDecimal(data[0].tagValue)
                    for(let key of data) {
                        let tagValue = this.keepTwoDecimal(key.tagValue)
                        arr.push({
                            value: tagValue,
                            label: key.tagIdSecondName || '未知',
                            percent: (tagValue / max) * 100,
                        })
                    }
                }
                this.mobilePhoneList = arr
            },
            // 保留两位小数
            keepTwoDecimal(num){
                if (!num && num !== 0) {
                    return 0;
                }
                let result = parseFloat(num);
                result = Math.round(result * 10000) / 100;
                return result;
            },
        },
    }
</script>

<style scoped>
    .portrait_main{
        margin: 0 64px;
    }

    /* 小区信息 */
    .portrait_basic_info{
        min-height:275px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(230,231,233,1);
        margin-bottom: 24px;
        padding: 24px;
        position: relative;
    }

    .portrait_header_select{
        position: absolute;
        right: 0;
        top: -30px;
    }

    .portrait_header_select /deep/ .el-input__inner{
        /*border-bottom-right-radius: unset;*/
        /*border-top-right-radius: unset;*/
        /*padding-left: 4px;*/
        background: rgba(0,0,0,0);
        color: #999;
        border: none;
        text-align: center;
        padding-left: 0;
        font-size: 14px;
    }

    .community_name{
        min-width: 140px;
        height: 22px;
        font-size: 16px;
        font-weight: 600;
        display: inline-block;
        color:rgba(0,0,0,0.85);
        border:1px solid #dcdfe6;
        padding: 2px 24px 2px 3px;
        cursor:pointer;
        position: relative;
        top: 1px;
        left: 8px;
    }

    .community_name .el-icon-caret-bottom{
        position: absolute;
        right: 8px;
        top:3px;
    }

    /deep/ .resName_list{
        height: 158px;
        overflow-y: auto;
        overflow-x: hidden;
        border-top: 1px solid #ebeef5;
        margin-top: 8px;
        padding:  6px 0 0 0;
    }

    /deep/ .resName_list .resName_li{
        height: 26px;
        line-height: 26px;
        cursor: pointer;
        color:#666666;
        font-size: 14px;
    }

    /deep/ .resName_list .active_Li{
        color: #409eff;
        font-weight: 600;
    }

    .resName_li:hover{
        background: #f5f7fa;
    }

    .community_info_h4{
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,0.85);
        line-height:22px;
        margin-bottom: 8px;
    }

    .community_main_info{
        padding: 16px 0 0 44px;
    }

    .community_info_row{
        font-size: 14px;
        margin-bottom: 24px;
    }

    .community_info_row span{
        color: #666666;
    }

    .community_info_row .community_info_label {
        color: #333333;
    }

    /* 卡片样式覆盖 */
    .community_portrait /deep/ .el-card{
        overflow: unset;
    }

    /deep/ .el-card__body {
        padding: 16px;
    }

    .portrait_row {
        margin-bottom: 24px;
    }

    .box_main {
        height: 352px;
    }

    .box_card_title {
        font-size:16px;
        font-weight:600;
        color:rgba(44,49,60,1);
    }

    /* 进度条 */
    .mobile_phone_ul{
        height: 285px;
        overflow-y: auto;
    }

    .progress_li {
        display: flex;
        height: 50px;
        line-height: 50px;
        font-size:14px;
        padding: 0 8px;
        color:rgba(44,49,60,1);
        border-bottom: 1px solid rgba(233, 233, 233, 1);
    }

    .little_height_ul .progress_li{
        height: 44px;
        line-height: 44px;
    }

    .progress_li.progress_li_title{
        color:rgba(151,151,151,1);
    }

    .progress_li_rate{
        width: 58px;
    }

    .progress_li_name {
        width: 90px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .progress_li_name.phone_li_name{
        width: 120px;
    }

    .progress_li_value{
        width: 62px;
    }

    .progress_li_num {
        flex: 1;
        -webkit-box-flex: 1;
        -ms-flex: 1;
    }

    .progress_li_num /deep/ .el-progress {
        top:44%;
    }

    /* echarts的tooltip样式 */
    /deep/ .echarts_tooltip_title {
        width: 180px;
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

    /deep/ .echarts_tooltip_content {
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

    /deep/ .echarts_tooltip_i {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 5px;
    }

    /* 滚动条 */
    ::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background: #FAFAFA;
    }

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
    }

    /* 无社区画像数据 */
    .not_search{
        margin-top: 24px;
        color: rgba(0,0,0,0.45);
        font-size: 14px;
    }
</style>
