<template>
    <div class="citys_contrast">
        <!--城市数据展示-->
        <div class="citys_contrast_box"
             v-loading="citysContrastLoading"
             element-loading-text="玩命加载中.."
             element-loading-spinner="el-icon-loading">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">城市数据展示</span>
                </div>
                <el-row>
                    <el-col :lg="12" :xl="10" class="chinaMapChart">
                        <div id="chinaMap" ref="chinaMap"
                             style="width: 600px; height: 400px;margin: 0 auto"></div>
                    </el-col>
                    <el-col :lg="12" :xl="14" class="all_data_table">
                        <el-table
                            class="cityBattle-table"
                            :data="cityCompareTable"
                            border
                            height="420"
                            style="width: 100%">
                            <el-table-column
                                type="index"
                                fixed
                                label="序号"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                fixed
                                prop="city"
                                label="城市"
                                min-width="120"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.city || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="countRes"
                                label="社区数"
                                align="right"
                                sortable
                                min-width="90">
                            </el-table-column>
                            <el-table-column
                                prop="countMedia"
                                label="广告门数"
                                align="right"
                                sortable
                                :sort-method="sortMedia"
                                min-width="110">
                            </el-table-column>
                            <el-table-column
                                prop="countAds"
                                label="点位数"
                                align="right"
                                sortable
                                :sort-method="sortAds"
                                min-width="90">
                            </el-table-column>
                            <el-table-column
                                prop="upPercent"
                                label="上刊率(2019)"
                                align="right"
                                sortable
                                :sort-method="sortUpPercent"
                                min-width="140">
                                <template slot-scope="scope">
                                    <span>{{scope.row.upPercent}}%</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="adOwners"
                                label="广告主数"
                                align="right"
                                sortable
                                min-width="120">
                                <template slot-scope="scope">
                                    <span>{{scope.row.adOwners}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="orders"
                                label="订单数"
                                align="right"
                                sortable
                                min-width="90">
                            </el-table-column>
                            <el-table-column
                                prop="totalPrice"
                                label="订单总额"
                                align="right"
                                sortable
                                min-width="135">
                                <template slot-scope="scope">
                                    <span>&yen;{{priceFormat(scope.row.totalPrice)}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!--城市数据对比-->
        <div class="citys_contrast_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">城市数据对比</span>
                </div>
                <div>
                    <div class="data-tab">
                        <span> 数据：</span>
                        <el-radio-group v-model="cityBattleTitle"
                                        :disabled="isCityBattleRadio"
                                        size="mini"
                                        @change="cityBattleRadio">
                            <el-radio-button label="社区数"></el-radio-button>
                            <el-radio-button label="广告门数"></el-radio-button>
                            <el-radio-button label="点位数"></el-radio-button>
                            <el-radio-button label="上刊率"></el-radio-button>
                            <el-radio-button label="订单数"></el-radio-button>
                            <el-radio-button label="订单总额"></el-radio-button>
                            <el-radio-button label="广告主数"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="cityBattleTime" size="mini"
                                        @change="RadioTime(cityBattleTime,'cityBattle')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box">
                            <el-date-picker
                                v-model="compareCityTime[0]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="cityCompareOptionsStar"
                                :clearable="false"
                                @change="cityCompareChangeTime('cityBattle','0')">
                            </el-date-picker>
                            至
                            <el-date-picker
                                v-model="compareCityTime[1]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="cityCompareOptionsEnd"
                                :clearable="false"
                                @change="cityCompareChangeTime('cityBattle','1')">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="data-tab citySelect">
                        <span>城市：</span>
                        <el-select filterable v-model="selectCityLine" multiple collapse-tags :multiple-limit=8
                                   placeholder="请选择"
                                   size="mini" @change="selectCompareCities">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="cityBattleChart"
                     v-loading="cityBattleLoading"
                     element-loading-text="玩命加载中..."
                     element-loading-background="rgba(255, 255, 255)">
                    <div class="charts2" id="cityBattleLine" ref="cityBattleLine"
                         style="width:100%;height: 450px">
                    </div>
                </div>
            </el-card>
        </div>
        <!--城市上刊率对比-->
        <div class="citys_contrast_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">城市上刊率对比</span>
                </div>
                <div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="cityRateCompareTime" size="mini"
                                        @change="RadioTime(cityRateCompareTime,'cityRate')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box rate_date_picker">
                            <el-date-picker
                                size="mini"
                                v-model="cityRateCompareDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="cityCompareChangeTime('cityRate')"
                                :clearable="false">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="data-tab citySelect">
                        <span> 城市： </span>
                        <el-select filterable v-model="cityRateCompareShowData.name" multiple :multiple-limit=8
                                   placeholder="请选择"
                                   collapse-tags
                                   size="mini"
                                   @change="cityRateSelect">
                            <el-option v-for="item in cityRateCompare" :key="item" :value="item"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="cityBattleChart"
                     v-loading="cityPercentBattleLoading"
                     element-loading-text="玩命加载中..."
                     element-loading-background="rgba(255, 255, 255)">
                    <div class="charts2" id="cityPercentBattleBar" ref="cityPercentBattleBar"
                         style="width:100%;height: 450px"></div>
                </div>
            </el-card>
        </div>
        <!--城市关键数据对比-->
        <div class="citys_contrast_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">城市关键数据对比</span>
                </div>
                <div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="cityKeyDataTime" size="mini"
                                        @change="RadioTime(cityKeyDataTime,'cityKey')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box rate_date_picker">
                            <el-date-picker
                                size="mini"
                                v-model="cityKeyDataDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                @change="cityCompareChangeTime('cityKey')"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="data-tab citySelect">
                        <span>城市：</span>
                        <el-select v-model="selectCompareCityData" filterable multiple :multiple-limit=8
                                   placeholder="请选择"
                                   size="mini" collapse-tags @change="cityKeySelect">
                            <el-option
                                v-for="item in directNameList"
                                :key="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="data-charts city_key_data_charts">
                        <div class="pie_wrap">
                            <div class="charts" ref="keyDataPie"
                                 style="width: 1200px;height: 600px"></div>
                            <p>社区</p>
                            <p>广告门</p>
                            <p>点位</p>
                            <p>订单</p>
                            <p>订单总额</p>
                            <p>广告主</p>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import api from '../../../api/api';
    import commaFormat from '../../../commonFun/commaFormat';
    import timeFormat from '../../../commonFun/timeFormat';
    import sessFun from '../../../commonFun/sessFun';
    export default {
        name: "citysContrast",
        data() {
            return {
                isGetData: false,
                // 城市对比选择的城市只能为0
                selectCity: '0',
                cityList: [],
                nowMonth: '',               // 当前月份日期
                totalDataYear: '',          // 当前年份
                toDay:'',
                citysContrastLoading: true,
                //城市对比
                //全国数据表格
                cityCompareTable:[],
                chinaMapEcharts: '',
                chinaMapData: [
                    {name: '广东', value: 0},
                    {name: '北京', value: 0},
                    {name: '天津', value: 0},
                    {name: '上海', value: 0},
                    {name: '广西', value: 0},
                    {name: '湖南', value: 0},
                    {name: '重庆', value: 0},
                    {name: '四川', value: 0},
                    {name: '江西', value: 0},
                    {name: '山西', value: 0},
                    {name: '湖北', value: 0},
                    {name: '安徽', value: 0},
                    {name: '福建', value: 0},
                    {name: '浙江', value: 0},
                    {name: '河南', value: 0},
                    {name: '河北', value: 0},
                    {name: '陕西', value: 0},
                    {name: '贵州', value: 0},
                    {name: '香港', value: 0},
                    {name: '江苏', value: 0},
                    {name: '山东', value: 0},
                    {name: '辽宁', value: 0},
                    {name: '吉林', value: 0},
                    {name: '黑龙江', value: 0},
                    {name: '青海', value: 0},
                    {name: '甘肃', value: 0},
                    {name: '内蒙古', value: 0},
                    {name: '海南', value: 0},
                    {name: '云南', value: 0},
                    {name: '宁夏', value: 0},
                    {name: '新疆', value: 0},
                    {name: '西藏', value: 0},
                    {name: '台湾', value: 0}
                ],
                chinaMapDataMax: 10000,
                /*  城市数据对比  */
                colorArr: ['#975fe4', '#3aa0ff', '#36cbcb', '#4dcb73', '#fad337', '#f2637b', '#6081FF', '#FE752A'],
                // 城市数据对比loading
                cityBattleLoading: true,
                cityBattleTitle: '社区数',
                cityBattleTime: '最近半年',
                // 数据获取时按钮禁用
                isCityBattleRadio: true,
                compareCityTime: [],
                // compareCityTime前一个时间段
                beforeCompareCityTime: [],
                // 记录变化前城市个数，用来判断城市是增加还是减少
                beforeCityLineShow:[],
                //城市数据对比
                cityBattleLineEcharts: '',
                // 折线原数据
                cityBattleLineSeries: [],
                // 显示折线数据
                cityLineDataShow: [],
                // 选择的城市
                selectCityLine: [],
                //城市上刊率对比
                cityPercentBattleEchart: '',
                cityPercentBattleLoading: true,// 城市上刊率对比loading
                // cityBattleLoading: true,       // 城市数据对比loading
                cityRateCompareDate: [],
                BeforeCityRateCompareDate: [],
                cityRateCompareTime: '最近半年',
                cityRateCompare: '',
                cityRateCompareData:[],         //  六大城市上刊率 - 数据
                cityRateCompareShowData:{name:[],value:[]},     //  城市上刊率 - 显示
                beforeCityRate: [],
                /*  城市关键数据对比  */
                cityKeyData: {res:[],ads:[],media:[],order:[],totalPrice:[],adOwner:[]},
                cityResKeyData:[],          // 城市关键数据对比 - 饼状图社区数据
                cityAdsKeyData:[],          // 城市关键数据对比 - 饼状图点位数据
                cityMediaKeyData:[],          // 城市关键数据对比 - 饼状图媒体数据
                RMPieOrderData: [],        // 城市关键数据对比 - 饼状图订单数据
                RMPieTotalPriceData: [],  // 城市关键数据对比 - 饼状图订单总额数据
                RMPieAdOwnersData: [],     // 城市关键数据对比 - 饼状图广告主数据
                cityKeyDataDate: [],
                cityKeyDataTime: '最近半年',
                selectCompareCityData: [],
                beforeCityKey:[],
                CityBattleData: [],   // 城市关键数据对比 - 广告主数据
                cityBattlePieStep: 0,   // 城市关键数据对比 - 步数
                // 城市数据对比
                cityCompareOptionsStar: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.parse(this.compareCityTime[1])
                    }
                },
                cityCompareOptionsEnd: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse(this.compareCityTime[0])
                    }
                },
            }
        },
        props:{
            sessionData: {
                type: Object,
                required: true,
            },
            activeName:{
                type:String,
                required: true
            },
            citys:{
                type:Array,
                required: true
            },
            directNameList:{
                type: Array,
                required:true
            }
        },
        watch: {
            sessionData(newVal, oldVal) {
                console.log('newVal', newVal, 'oldVal', oldVal)
                this.sessionData = newVal
            },
            directNameList(newVal, oldVal){
                this.directNameList = newVal
                this.initCitySelect()
            },
            activeName(newVal,oldVal){
                this.activeName = newVal
                // 关键数据总量/增量趋势 - 社区接口
                if (this.activeName === 'fouth') {
                    if (this.isGetData) {
                        this.chinaMap()
                        this.cityBattleLine()
                        this.cityPercentBattleBar()
                        this.keyDataPie()
                    } else {
                        // 统一调用接口
                        this.getCityContrastData()
                    }
                }
            }
        },
        mounted(){
            this.setTime()
            this.echartsListener()

        },
        methods:{
            // 设置初始时间
            setTime() {
                let starTime = timeFormat.returnMonthCount(5,'-')
                let endTime = timeFormat.returnMonthCount(0,'-')
                let starTimeSub = starTime.substring(0,7)
                let endTimeSub = endTime.substring(0,7)
                this.nowMonth = endTimeSub
                this.toDay = timeFormat.returnDayCount(0,'/')
                this.compareCityTime = [starTimeSub,endTimeSub]        //  城市数据对比
                this.cityRateCompareDate = [starTime,endTime]     // 城市上刊率对比
                this.BeforeCityRateCompareDate = this.cityRateCompareDate.concat()
                this.cityKeyDataDate = [starTime,endTime]          // 城市关键数据对比
            },
            // 统一监听
            echartsListener(){
                window.addEventListener("resize", ()=> {
                    this.chinaMapEcharts && this.chinaMapEcharts.resize();
                    this.cityBattleLineEcharts && this.cityBattleLineEcharts.resize();
                    this.cityPercentBattleEchart && this.cityPercentBattleEchart.resize();
                    this.keyDataPieEcharts && this.keyDataPieEcharts.resize();
                });
            },
            // 统一调用接口
            getCityContrastData(){
                // 城市数据对比
                this.getAllCityInfo()
                this.cityBattleRadio()
                // 城市上刊率对比
                this.getCompareCityRate()
                // 城市关键数据 - 社区、点位、媒体
                this.getCityKeyDataResMediaAds()
                // 城市关键数据 - 订单、广告主、订单总额
                this.forCityKeyData()
                this.isGetData = true
            },
            // 初始化各模块的城市选择
            initCitySelect(){
                let arr = []
                let asrIDList = []
                for(let key of this.citys){
                    if(key.value !== '0'){
                        arr.push({
                            value: key.value,
                            label: key.label,
                        })
                        asrIDList.push(key.value)
                    }
                }
                this.cityList = arr
                this.selectCityLine = asrIDList
                // console.log('城市对比mounted',this.selectCityLine,this.cityList)
                this.beforeCityLineShow = this.selectCityLine.concat()
                // 上刊率
                this.beforeCityRate = this.directNameList.concat()
                // 关键数据对比
                this.selectCompareCityData = this.directNameList.concat()
                this.beforeCityKey = this.directNameList.concat()
                console.log('directNameList',this.directNameList)
            },
            /*  城市数据展示  */
            getAllCityInfo(){
                this.citysContrastLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.toDay.substring(0,4) + '/01/01',
                    endDate: this.toDay,
                }
                api.getApi(this.apiVar.report + '/api/v2/getCityInfo', params).then(res=>{
                    console.log('城市数据展示表格res',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataArr = res.data.data
                        let cityDataTable = []
                        for (let key of dataArr) {
                            cityDataTable.push({
                                countRes: key.resourceCount || 0,
                                countAds: key.totalAdsCount || 0,
                                city: this.returnAsName(key.asrId) || '--',
                                countMedia: key.mediaCount || 0,
                                upPercent: this.keepTwoDecimal(key.publishRate * 100),
                                adOwners: key.advertisementCount,
                                orders: key.orderCount,
                                totalPrice: key.orderSale,
                                asrID: key.asrId
                            })
                        }
                        this.cityCompareTable = cityDataTable.sort(this.compareSort('countRes'))
                        this.citysContrastLoading = false
                        this.getCityDataShow()
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 城市数据展示
            getCityDataShow(){
                console.log('地图getCityDataShow', this.cityCompareTable)
                // this.cityCompareTable = this.cityCompareTable.sort(this.compareSort('countRes'))
                this.chinaMapDataMax = this.cityCompareTable[0].countRes
                for (let cityKey of this.cityCompareTable) {
                    this.setChinaMapData(cityKey)
                }
                this.chinaMap()
            },
            // 设置全国地图数据
            setChinaMapData(RMData){
                // console.log('设置中国地图数据',RMData)
                for (let Ckey of this.chinaMapData) {
                    if (RMData.city.includes('北京') && Ckey.name === '北京') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('上海') && Ckey.name === '上海') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('广州') && Ckey.name === '广东') {
                        Ckey.value += RMData.countRes
                        break
                    } else if (RMData.city.includes('深圳') && Ckey.name === '广东') {
                        Ckey.value += RMData.countRes
                        break
                    } else if (RMData.city.includes('重庆') && Ckey.name === '重庆') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('成都') && Ckey.name === '四川') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('天津') && Ckey.name === '天津') {
                        Ckey.value = RMData.countRes
                        break
                    }
                }
            },
            // 全国地图
            chinaMap() {
                this.chinaMapEcharts = this.$echarts.init(this.$refs.chinaMap);
                this.chinaMapEcharts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            if (params.name) {
                                return params.seriesName + '<br/>' + params.name + ' : ' + params.value;
                            }
                        }
                    },
                    visualMap: {
                        type: 'continuous',
                        min: 0,
                        max: this.chinaMapDataMax,
                        text: ['高', '低'],
                        realtime: false, //拖拽手柄时实时更新
                        calculable: false, //是否显示手柄
                        color: ['#3887e0', '#6a9ce3', '#92bdee', '#c7ddf6', '#ebf3fc']
                    },
                    series: [
                        {
                            name: '社区数',
                            type: 'map',
                            mapType: 'china',
                            roam: false, //是否可以放大缩小
                            itemStyle: {
                                emphasis: {label: {show: true}},
                                borderColor: '#f7f7f7',
                                areaColor: '#e6e6e6'
                            },
                            data: this.chinaMapData
                        }
                    ]
                });
            },
            /*  城市数据对比  */
            // 类型radio
            cityBattleRadio(){
                console.log('城市数据对比',this.cityBattleTitle)
                this.isCityBattleRadio = true
                let stringName = this.cityBattleTitle
                this.forCityData(stringName)
            },
            // 时间radio
            RadioTime(val, string) {
                let String = ''
                let starTime = ''
                let endTime = timeFormat.returnMonthCount(0, '-')
                if (val === '最近三个月') {
                    starTime = timeFormat.returnMonthCount(2, '-')
                } else if (val === '最近半年') {
                    starTime = timeFormat.returnMonthCount(5, '-')
                } else if (val === '全部') {
                    String = 'allTime'
                }
                switch (string) {
                    case 'cityBattle':
                        // 城市数据对比
                        this.compareCityTime = [starTime.substring(0,7), endTime.substring(0,7)]
                        this.beforeCompareCityTime = this.compareCityTime.concat()
                        this.forCityData(this.cityBattleTitle)
                        break;
                    case 'cityRate':
                        // 城市上刊率对比
                        this.cityRateCompareDate = [starTime, endTime]
                        this.BeforeCityRateCompareDate = this.cityRateCompareDate.concat()
                        this.getCompareCityRate()
                        break;
                    case 'cityKey':
                        this.cityKeyDataDate = [starTime, endTime]
                        this.forCityKeyData()
                        // 城市关键数据对比 - 社区、点位、媒体
                        this.getCityKeyDataResMediaAds()
                        break;
                    default:
                        console.log('时间切换');
                }
            },
            // 城市对比上刊率 - 日期选择
            cityCompareChangeTime(String,index){
                let starT = ''
                let endT = ''
                if (String === 'cityBattle') {
                    // 城市数据对比
                    let compareLen = this.isMonthLength(this.compareCityTime)
                    if (compareLen > 5) {
                        if (index === '0') {
                            starT = this.compareCityTime[0]
                            endT = timeFormat.getSpecifiedDateStr(this.compareCityTime[0], -5).substring(0, 7)
                        } else if (index === '1') {
                            starT = timeFormat.getSpecifiedDateStr(this.compareCityTime[1], 5).substring(0, 7)
                            endT = this.compareCityTime[1]
                        }
                        this.compareCityTime = [starT, endT]
                        sessFun.messageFun('warning','月份跨度不能大于六个月!')
                    }
                    this.cityBattleTime = '其它'
                    this.forCityData(this.cityBattleTitle)
                } else if (String === 'cityRate') {
                    // 城市对比上刊率
                    let compareLen = this.isMonthLength(this.cityRateCompareDate)
                    if (compareLen > 5) {
                        starT = this.cityRateCompareDate[0]
                        endT = timeFormat.getSpecifiedDateStr(this.cityRateCompareDate[0], -5)
                        this.cityRateCompareDate = [starT, endT]
                        sessFun.messageFun('warning','时间跨度不能大于六个月!')
                    }
                    this.cityRateCompareTime = '其它'
                    this.getCompareCityRate()
                } else if (String === 'cityKey') {
                    // 城市关键数据对比
                    let compareLen = this.isMonthLength(this.cityKeyDataDate)
                    if (compareLen > 5) {
                        starT = this.cityKeyDataDate[0]
                        endT = timeFormat.getSpecifiedDateStr(this.cityKeyDataDate[0], -5)
                        this.cityKeyDataDate = [starT, endT]
                        sessFun.messageFun('warning','时间跨度不能大于六个月!')
                    }
                    this.cityKeyDataTime = '其它'
                    this.forCityKeyData()
                    this.getCityKeyDataResMediaAds()
                }
            },
            // 城市数据对比 - 城市选择和charts关联
            selectCompareCities(cityList) {
                console.log('城市选择和charts关联',cityList,this.beforeCityLineShow,'this.cityLineDataShow',this.cityLineDataShow)
                if (cityList.length > 0) {
                    let beforeCityData = this.beforeCityLineShow
                    if (beforeCityData.length > cityList.length) {
                        // 删除了
                        for (let key of this.cityLineDataShow) {
                            if (!cityList.includes(key.asrID)) {
                                key.data = []
                            }
                        }
                    } else {
                        // 增加了
                        let key = this.compareCityFun(beforeCityData, cityList)
                        // console.log('返回值', key)
                        if (key !== false) {
                            for (let CShow of this.cityLineDataShow) {
                                if (CShow.name === key.name) {
                                    CShow.data = key.data
                                }
                            }
                        }
                    }
                    console.log('series---', this.cityLineDataShow,this.cityBattleLineSeries)
                    this.beforeCityLineShow = cityList
                    this.cityBattleLine()
                } else {
                    this.selectCityLine = this.beforeCityLineShow
                    sessFun.messageFun('warning','城市不能为空!')
                }
            },
            // 新增城市
            compareCityFun(beforeCityData, cityList) {
                console.log('判断增加了哪个城市', this.cityBattleLineSeries)
                for (let cKey of cityList) {
                    for (let j = 0; j < beforeCityData.length; j++) {
                        if (cKey === beforeCityData[j]) {
                            break
                        }
                        if (j >= beforeCityData.length - 1) {
                            for (let Rkey of this.cityBattleLineSeries) {
                                if (Rkey.asrID === cKey) {
                                    return Rkey
                                }
                            }
                        }
                    }
                }
                return false
            },
            // 循环调用城市数据接口
            forCityData(name) {
                this.cityBattleLoading = true
                this.cityBattleLineSeries = []
                this.cityBattleLineStep = 0
                console.log('------------',this.selectCityLine)
                for (let key of this.selectCityLine) {
                    if (name === '社区数') {
                        this.getCityTotalAndIncrement(key, '/GetResCountOfTotalAndIncrement');
                    } else if (name === '广告门数') {
                        this.getCityTotalAndIncrement(key, '/GetMediaCountOfTotalAndIncrement');
                    } else if (name === '点位数') {
                        this.getCityTotalAndIncrement(key, '/GetAdSpaceCountOfTotalAndIncrement');
                    } else if (name === '上刊率') {
                        this.getCityTotalAndIncrement(key, '/GetPublicationRateTotalAndIncrement', 'rate');
                    } else if (name === '订单数') {
                        this.getCityTotalAndIncrement(key, '/GetOrderTotalAndIncrement');
                    } else if (name === '订单总额') {
                        this.getCityTotalAndIncrement(key, '/GetOrderIncomeTotalAndIncrement', 'price');
                    } else if (name === '广告主数') {
                        this.getCityTotalAndIncrement(key, '/GetAdOwnerTotalAndIncrement');
                    }
                }
            },
            // 城市数据对比 - 接口
            getCityTotalAndIncrement(asrID,url,String) {
                let onStart = this.returnDate(this.compareCityTime[0],'start')
                let onEnd = this.returnDate(this.compareCityTime[1])
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: asrID,
                    onStart: onStart,
                    onEnd: onEnd
                }
                api.getApi(this.apiVar.Count + url, params).then(res => {
                    console.log('asrID', asrID, '城市数据对比社区接口 - 接口', res)
                    let ResCount = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        if (ResCount === '') {
                            sessFun.messageFun('warning','该时间段暂无数据!')
                        }
                        this.cityBattleLineStep++
                        // console.log('步数',this.cityBattleLineStep)
                        let tempObj = {asrID: asrID, name: this.returnAsName(asrID), type: 'line', data: []}
                        let timeArr = []
                        if (String === 'rate') {
                            for (let res of ResCount) {
                                tempObj.data.push(Math.round(res.totalPublicationRate * 10000) / 100)
                                timeArr.push(res.month)
                            }
                        } else {
                            for (let res of ResCount) {
                                if (String === 'price') {
                                    tempObj.data.push((res.total / 100).toFixed(0))
                                } else {
                                    tempObj.data.push(res.total)
                                }
                                timeArr.push(res.month)
                            }
                        }
                        this.cityBattleLineSeries.push(tempObj)
                        if (this.cityBattleLineStep >= 7) {
                            this.cityBattleLineTime = timeArr
                            this.cityLineDataShow = JSON.parse(JSON.stringify(this.cityBattleLineSeries))
                            console.log('---城市数据对比社区', this.cityBattleLineSeries, this.cityLineDataShow)
                            this.isCityBattleRadio = false
                            this.cityBattleLine()
                        }
                    }
                })
            },
            // 城市数据对比  折线图
            cityBattleLine() {
                if(this.cityBattleLineEcharts){
                    this.cityBattleLineEcharts.dispose()
                }
                this.cityBattleLineEcharts = this.$echarts.init(this.$refs.cityBattleLine);
                let that = this
                this.cityBattleLineEcharts.setOption({
                        color: this.colorArr,
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                let title = '';
                                let arr = [];
                                for (let i = 0; i < params.length; i++) {
                                    title = '<p class="echarts_tooltip_title"><span>' + '城市(' + params[i].name + ')' + '</span>' + '<span>' + '数量' + '</span></p>' + '<br/>'
                                    let data = '<p class="echarts_tooltip_content">' +
                                        '<span><i class="echarts_tooltip_i" style="background: '+ params[i].color +'"></i>' + params[i].seriesName + '</span>' +
                                        params[i].value + (that.cityBattleTitle === '上刊率' ? '%' : '')+ '</p>'
                                    arr.push(data)
                                }
                                let tooltip = arr.join('');
                                return title + tooltip
                            },
                            backgroundColor: '#FFFFFF',
                            textStyle: {
                                color: '#2C313C'
                            },
                            borderColor: '#ddd',
                            borderWidth: 1,
                            padding: 0,
                        },
                        legend: {
                            data: this.selectCityLine
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: this.cityBattleLineTime,
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
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                            axisLabel: {
                                formatter: that.cityBattleTitle === '上刊率' ? '{value}%' : '{value}',
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
                        series: this.cityLineDataShow
                    },
                );
                this.cityBattleLoading = false
            },
            /*  城市上刊率对比  */
            // 城市选择
            cityRateSelect(res){
                console.log('城市上刊率对比 - 城市选择',res)
                if (res.length > 0) {
                    let beforCity = this.beforeCityRate
                    let RateData = this.cityRateCompareData
                    if (beforCity.length > res.length) {
                        for (let i = 0; i < beforCity.length; i++) {
                            if (res.indexOf(beforCity[i]) === -1) {
                                this.cityRateCompareShowData.value.splice(i, 1)
                            }
                        }
                    } else {
                        console.log('增加了', res[res.length - 1], this.cityRateCompareData)
                        let addCity = res[res.length - 1]
                        for (let val of RateData) {
                            if (val.asName.includes(addCity)) {
                                this.cityRateCompareShowData.value.push(Math.round(val.publicationRate * 10000) / 100)
                                break
                            }
                        }
                    }
                    this.beforeCityRate = res
                    this.cityPercentBattleBar()
                } else {
                    this.cityRateCompareShowData.name = this.beforeCityRate
                    sessFun.messageFun('warning', '城市不能为空!')
                }
            },
            // 城市上刊率对比 - 接口
            getCompareCityRate(){
                this.cityPercentBattleLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    startDate:this.cityRateCompareDate[0].split('-').join('/'),
                    endDate:this.cityRateCompareDate[1].split('-').join('/'),
                }
                // api.getApi(this.apiVar.Count + '/GetPublicationRateByCityCompare', params).then(res=>{
                api.getApi(this.apiVar.report + '/api/v2/getCityPublishRate', params).then(res=>{
                    console.log('城市上刊率对比',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else if (res.data.SysCode === 200200) {
                        let dataArr = res.data.data
                        this.cityRateCompareData = dataArr
                        let rateList = []
                        let cityList = []
                        for (let val of dataArr) {
                            rateList.push(Math.round(val.rate * 10000) / 100)
                            if (val.name.length > 6) {
                                cityList.push(val.name.substring(0, val.name.length - 6))
                            } else {
                                cityList.push(val.name)
                            }
                        }
                        this.cityRateCompareShowData.name = cityList
                        this.cityRateCompare = cityList
                        this.cityRateCompareShowData.value = rateList
                        console.log('城市上刊率对比', this.cityRateCompareShowData)
                        this.cityPercentBattleBar()
                    } else {
                        sessFun.messageFun('warning', '城市上刊率对比,在该时段暂无数据!')
                    }
                    this.cityPercentBattleLoading = false
                })
            },
            // 城市上刊率对比 - 柱状图
            cityPercentBattleBar() {
                if(this.cityPercentBattleEchart){
                    this.cityPercentBattleEchart.dispose()
                }
                this.cityPercentBattleEchart = this.$echarts.init(this.$refs.cityPercentBattleBar);
                this.cityPercentBattleEchart.setOption({
                    color: ['#4AA6FC'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title"><span>' + params[0].name + '</span></p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC;"></i>' + params[0].seriesName + '</span>' + params[0].data + '%' + '</p>'

                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data:  this.cityRateCompareShowData.name,
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
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            min: 0,
                            max: 100,
                            axisLabel: {
                                formatter: '{value}%',
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
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
                            name: '上刊率',
                            type: 'bar',
                            barWidth: '20%',
                            data: this.cityRateCompareShowData.value
                        }
                    ]
                });
                this.cityPercentBattleLoading = false
            },
            /*  城市关键数据对比  */
            // 城市选择
            cityKeySelect(res){
                if(res.length > 0){
                    let beforCity = this.beforeCityKey
                    let keyData = this.cityKeyData
                    console.log(beforCity,'城市关键数据对比 - 城市选择',keyData,res)
                    if (beforCity.length > res.length) {
                        // 减少了
                        for (let i = 0; i < beforCity.length; i++) {
                            if (res.indexOf(beforCity[i]) === -1) {
                                for (let j = 0; j < this.cityResKeyData.length; j++) {
                                    if (this.cityResKeyData[j].name === beforCity[i]) {
                                        this.cityResKeyData[j].value = 0
                                        this.cityAdsKeyData[j].value = 0
                                        this.cityMediaKeyData[j].value = 0
                                        break
                                    }
                                }
                                for (let n = 0; n < this.RMPieOrderData.length; n++) {
                                    if (this.RMPieOrderData[n].name === beforCity[i]) {
                                        this.RMPieOrderData[n].value = 0
                                        this.RMPieTotalPriceData[n].value = 0
                                        this.RMPieAdOwnersData[n].value = 0
                                        break
                                    }
                                }
                                break
                            }
                        }
                    } else {
                        // 增加了
                        console.log('增加了', res[res.length - 1])
                        let addCity = res[res.length - 1]
                        for (let kData in keyData) {
                            console.log('kData', kData)
                            for (let val of keyData[kData]) {
                                if (val.name === addCity) {
                                    console.log('kData:', kData, addCity)
                                    if (kData === 'res') {
                                        this.cityKeyCompare(addCity,this.cityResKeyData,val); //增加的城市,遍历的数据,所需的数据
                                        break;
                                    } else if (kData === 'ads') {
                                        this.cityKeyCompare(addCity,this.cityAdsKeyData,val);
                                        break;
                                    } else if (kData === 'media') {
                                        this.cityKeyCompare(addCity,this.cityMediaKeyData,val);
                                        break;
                                    } else if (kData === 'order') {
                                        this.cityKeyCompare(addCity,this.RMPieOrderData,val);
                                        break;
                                    } else if (kData === 'totalPrice') {
                                        this.cityKeyCompare(addCity,this.RMPieTotalPriceData,val);
                                        break;
                                    } else if (kData === 'adOwner') {
                                        this.cityKeyCompare(addCity,this.RMPieAdOwnersData,val);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    this.beforeCityKey = res
                    console.log('城市关键数据对比:(社区，点位，媒体)',this.cityResKeyData,this.cityAdsKeyData,this.cityMediaKeyData)
                    console.log('城市关键数据对比:(广告主，订单金额，订单数)',this.RMPieAdOwnersData,this.RMPieTotalPriceData,this.RMPieOrderData)
                    this.keyDataPie()
                } else {
                    this.selectCompareCityData = this.beforeCityKey
                    sessFun.messageFun('warning', '城市不能为空!')
                }
            },
            //参数：增加的城市,遍历的数据,所需的数据
            cityKeyCompare(addCity, dataList, val) {
                for (let key of dataList) {
                    if (key.name === addCity) {
                        key.value = val.value
                        break
                    }
                }
            },
            // 城市关键数据对比 - 接口 （社区、广告门、点位）
            getCityKeyDataResMediaAds() {
                let tStart = this.cityKeyDataDate[0]
                let tEnd = this.cityKeyDataDate[1]
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    istart: tStart,
                    iend: tEnd
                }
                api.getApi(this.apiVar.Count + '/GetRM', params).then(res => {
                    console.log('城市关键数据对比 - 接口 （社区、广告门、点位）', res)
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        this.cityResKeyData = []
                        this.cityAdsKeyData = []
                        this.cityMediaKeyData = []
                        if (res.data.length > 0) {
                            for (let key of dataArr) {
                                let cityName = this.returnAsName(key.asrID)
                                let RESData = {name: cityName, value: key.countRES}
                                let MediaData = {name: cityName, value: key.countMedia}
                                let ADsData = {name: cityName, value: key.countAds}
                                this.cityResKeyData.push(RESData)               // 饼状图- 社区
                                this.cityAdsKeyData.push(ADsData)               // 饼状图- 媒体
                                this.cityMediaKeyData.push(MediaData)           // 饼状图- 点位
                            }
                            this.cityKeyData.res = JSON.parse(JSON.stringify(this.cityResKeyData))
                            this.cityKeyData.ads = JSON.parse(JSON.stringify(this.cityAdsKeyData))
                            this.cityKeyData.media = JSON.parse(JSON.stringify(this.cityMediaKeyData))
                            console.log('城市关键数据对比', this.cityResKeyData, this.cityAdsKeyData, this.cityMediaKeyData)
                            console.log('selectCompareCityData', this.selectCompareCityData)
                            this.keyDataPie()
                        } else {
                            sessFun.messageFun('warning', '城市关键数据对比（社区、广告门、点位）,在该时段暂无数据!')
                        }
                    }
                })
            },
            forCityKeyData() {
                this.cityBattlePieStep = 0
                for (let key of this.cityList) {
                    if(key.value === '0'){
                        continue
                    }
                    this.getCityBattleData(key.value)
                }
            },
            //城市关键数据对比  - 接口 (订单、广告主、订单总额)
            getCityBattleData(asrID) {
                this.CityBattleData = []
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: asrID,
                    istart: this.cityKeyDataDate[0],
                    iend: this.cityKeyDataDate[1]
                }
                api.getApi(this.apiVar.Count + '/GetCOrder', params).then(res => {
                    console.log(asrID,'城市数据展示res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    }else{
                        let COrderData = res.data
                        let tempObj = {asrID: params.asrIDs, totalSum: 0, apCount: 0, adOwners: COrderData.length,}
                        for (let key of COrderData) {
                            tempObj.totalSum += Number((key.totalSum / 100).toFixed(0))
                            tempObj.apCount += key.apCount
                        }
                        console.log('tempObj',tempObj)
                        this.cityBattlePieStep++
                        this.CityBattleData.push(tempObj)
                        if (this.cityBattlePieStep >= 7) {
                            console.log(this.cityBattlePieStep,'++++++++城市关键数据对比  - 接口',this.CityBattleData)
                            this.setCityBattle()
                        }
                    }
                })
            },
            // 设置城市数据展示 - 广告主数据
            setCityBattle() {
                let cityData = this.CityBattleData
                console.log('设置城市数据展示', cityData)
                this.RMPieOrderData = []
                this.RMPieTotalPriceData = []
                this.RMPieAdOwnersData = []
                for (let RMData of cityData){
                    this.RMPieOrderData.push({
                        name: this.returnAsName(RMData.asrID),
                        value: RMData.apCount
                    })
                    this.RMPieTotalPriceData.push({
                        name: this.returnAsName(RMData.asrID),
                        value: RMData.totalSum
                    })
                    this.RMPieAdOwnersData.push({
                        name: this.returnAsName(RMData.asrID),
                        value: RMData.adOwners})
                }
                this.cityKeyData.order = JSON.parse(JSON.stringify(this.RMPieOrderData))
                this.cityKeyData.totalPrice = JSON.parse(JSON.stringify(this.RMPieTotalPriceData))
                this.cityKeyData.adOwner = JSON.parse(JSON.stringify(this.RMPieAdOwnersData))
                console.log('城市数据展示:', '订单', this.RMPieOrderData, '总额', this.RMPieTotalPriceData, '广告主数', this.RMPieAdOwnersData)
                this.keyDataPie()
            },
            // 城市关键数据对比 - 饼图
            keyDataPie() {
                this.keyDataPieEcharts = this.$echarts.init(this.$refs.keyDataPie);
                this.keyDataPieEcharts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.name + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.seriesName + '</span>' + params.value + '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC "></i>' +
                                '占比' + '</span>' + params.percent + '%' +
                                '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'left',
                        data: this.selectCompareCityData,
                        left: "center",
                        top: "0",
                        itemWidth: 8,
                        itemHeight: 8,
                        itemGap: 24
                    },
                    series: [
                        {
                            name: '社区',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['20%', '25%'],
                            color: this.colorArr,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                            },
                            data: this.cityResKeyData,
                        },
                        {
                            name: '广告门',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['50%', '25%'],
                            color: this.colorArr,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                            },
                            data: this.cityMediaKeyData,
                        },
                        {
                            name: '点位',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['80%', '25%'],
                            color: this.colorArr,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                            },
                            data: this.cityAdsKeyData,
                        },
                        {
                            name: '订单',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['20%', '80%'],
                            color: this.colorArr,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                            },
                            data: this.RMPieOrderData,
                        },
                        {
                            name: '订单总额',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['50%', '80%'],
                            color: this.colorArr,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                            },
                            data: this.RMPieTotalPriceData,
                        },
                        {
                            name: '广告主',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['80%', '80%'],
                            color: this.colorArr,
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                            },
                            data: this.RMPieAdOwnersData,
                        }
                    ]
                });
            },
            //表格排序
            sortUpPercent(a, b) {
                return b.upPercent - a.upPercent
            },
            sortMedia(a, b){
                return b.countMedia - a.countMedia
            },
            sortAds(a, b){
                return b.countAds - a.countAds
            },
            // 根据权限公司返回 asrIDs
            returnAsrID() {
                if (this.selectCity === '0') {
                    let asrIDs = this.cityList.map((item) => {
                        return item.value
                    })
                    return asrIDs.join(',')
                } else {
                    return this.selectCity
                }
            },
            // 根据asrrID返回城市名
            returnAsName(asrIDs) {
                for (let key of this.citys) {
                    if (key.value == asrIDs) {
                        return key.label
                    }
                }
            },
            // 数据大到小排序
            compareSort(property) {
                console.log('数据大到小排序',property)
                return function (a, b) {
                    let value1 = a[property];
                    let value2 = b[property];
                    return value2 - value1;
                }
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            // 判断是否为当前月份并返回 年-月-日
            returnDate(time,kind){
                let dateList = time.split('-')
                if (kind === 'start') {
                    return time + '-01'
                } else {
                    if (this.nowMonth == time) {
                        return timeFormat.returnMonthCount(0, '-')
                    } else {
                        // let dateList = time.split('-')
                        let dayNum = new Date(Number(dateList[0]), Number(dateList[1]), 0);
                        console.log('判断是否为当前月份并返回', dayNum.getDate());
                        return time + '-' + dayNum.getDate()
                    }
                }
            },
            // 判断时间跨度
            isMonthLength(dataTime){
                let compareYear1 = dataTime[0].substr(0, 4)
                let compareYear2 = dataTime[1].substr(0, 4)
                let compareMonth1 = dataTime[0].substr(5, 2)
                let compareMonth2 = dataTime[1].substr(5, 2)
                let compareLen = (compareYear2 - compareYear1) * 12 + (compareMonth2 - compareMonth1)
                return compareLen
            },
            // 保留两位小数
            keepTwoDecimal(num) {
                if (!num && num !== 0) {
                    return 0;
                }
                let result = parseFloat(num);
                result = Math.round(num * 100) / 100;
                return result;
            },
        },
    }
</script>

<style scoped>
    .citys_contrast_box{
        margin-bottom: 16px;
    }

    .box_card_title{
        font-size:16px;
        font-weight:600;
        color:rgba(44,49,60,1);
    }

    .all_data_table /deep/ .el-table td{
        padding: 9px 0;
    }

    .date_picker_box{
        display: inline-block;
        vertical-align: middle;
    }

    .data-tab {
        font-size: 12px;
        color: #808080;
        margin-bottom: 10px;
        height: 30px;
    }

    .citys_contrast /deep/ .el-date-editor.el-input, .citys_contrast /deep/ .el-date-editor.el-input__inner{
        width: 156px;
    }

    /*城市下拉选择*/
    .citySelect /deep/ .el-input--mini .el-input__inner {
        width: 505px;
    }

    .all_data_table /deep/ .el-table__body-wrapper{
        min-height: auto;
        overflow-y: auto;
    }

    /*城市上刊率对比*/
    .rate_date_picker /deep/ .el-range-editor--mini.el-input__inner {
        width: 331px;
    }

    /*城市关键数据对比*/
    .city_key_data_charts {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .pie_wrap{
        position: relative;
    }

    .pie_wrap p {
        font-weight: bold;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 16px;
        color: #333333;
    }

    .pie_wrap p:nth-of-type(1) {
        left: 20%;
        top: 25%;
    }

    .pie_wrap p:nth-of-type(2) {
        left: 50%;
        top: 25%;
    }

    .pie_wrap p:nth-of-type(3) {
        left: 80%;
        top: 25%;
    }

    .pie_wrap p:nth-of-type(4) {
        left: 20%;
        top: 80%;
    }

    .pie_wrap p:nth-of-type(5) {
        left: 50%;
        top: 80%;
    }

    .pie_wrap p:nth-of-type(6) {
        left: 80%;
        top: 80%;
    }

    /*强制兼容safari表头错位bug*/
    /deep/ .el-table__fixed-header-wrapper thead tr th.el-table_5_column_31{
        width: 140px;
    }
    /deep/ .el-table__fixed-header-wrapper thead tr th.el-table_5_column_32{
        width: 90px;
    }
    /deep/ .el-table__fixed-header-wrapper thead tr th.el-table_5_column_33{
        width: 120px;
    }
    /deep/.el-table__fixed-header-wrapper thead tr th.el-table_5_column_34{
        width: 90px;
    }

    /deep/ .el-table .el-table__header-wrapper thead.has-gutter tr th.el-table_5_column_31 .cell{
        width: 140px;
    }

    /deep/ .el-table .el-table__body-wrapper .el-table__body tbody tr.el-table__row td.el-table_5_column_31 .cell{
        width: 140px;
        margin: 0;
    }
</style>
